import { graphql } from '@octokit/graphql'

// Constants for pagination
const ISSUES_PER_PAGE = 30;
const REPOS_PER_PAGE = 10;
const ISSUES_PER_REPO = 5;

// Helper function to get the GitHub token from environment variables
const getGitHubToken = () => {
    const token = import.meta.env.VITE_GITHUB_API_KEY
    if (!token) {
        throw new Error('GITHUB_API_KEY is not set in env')
    }
    return token
}

// Helper function to create an authenticated GraphQL client
const createGraphqlClient = () => {
    const githubToken = getGitHubToken()
    return graphql.defaults({
        headers: {
            authorization: `token ${githubToken}`
        }
    })
}

// Function to fetch GitHub issues with filters
const fetchGitHubIssues = async (params) => {
    const graphqlWithAuth = createGraphqlClient()

    const query = `
    query($queryString: String!, $cursor: String) {
      search(query: $queryString, type: ISSUE, first: ${ISSUES_PER_PAGE}, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ... on Issue {
            title
            url
            createdAt
            repository {
              nameWithOwner
              url
              stargazerCount
              primaryLanguage {
                name
              }
            }
            assignees(first: 1) {
              totalCount
            }
            labels(first: 10) {
              nodes {
                name
              }
            }
            comments {
              totalCount
            }
            timelineItems(first: 1, itemTypes: [CROSS_REFERENCED_EVENT]) {
              totalCount
            }
          }
            }
        }
        }
    `
    //Build query string based on parameters
    let queryString = 'is:open is:issue label:"good first issue"'
    if (params.language) queryString += ` language:${params.language}`
    if (params.isAssigned) {
        queryString += " assigned:*"
    } else {
        queryString += " no:assignee"
    }
    if (params.hasPullRequests) {
        queryString += " linked:pr"
    } else {
        queryString += " -linked:pr"
    }
    queryString += " sort:created-desc"

    const variables = {
        queryString,
        cursor: params.cursor,
    }

    try {
        const response = await graphqlWithAuth(query, variables);

        // Filter and map response to match the desired format
        const issues = response.search.nodes
            .filter((issue) => {
                const stars = issue.repository.stargazerCount;
                return stars >= params.minStars && stars <= params.maxStars;
            })
            .map((issue) => ({
                id: issue.url,
                title: issue.title,
                html_url: issue.url,
                created_at: issue.createdAt,
                repository_url: issue.repository.url,
                repository_name: issue.repository.nameWithOwner,
                stars_count: issue.repository.stargazerCount,
                language: issue.repository.primaryLanguage?.name || null,
                is_assigned: issue.assignees.totalCount > 0,
                labels: issue.labels.nodes.map((label) => label.name),
                comments_count: issue.comments.totalCount,
                has_pull_requests: issue.timelineItems.totalCount > 0,
            }));

        // Sort issues by creation date
        const sortedIssues = issues.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        return {
            issues: sortedIssues,
            hasNextPage: response.search.pageInfo.hasNextPage,
            endCursor: response.search.pageInfo.endCursor,
        };
    } catch (error) {
        console.error("Error fetching GitHub issues:", error);
        throw new Error("Failed to fetch GitHub issues");
    }
}

export default fetchGitHubIssues

