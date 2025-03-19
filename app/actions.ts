"use server"

import { cache } from "react"

export interface Repository {
  id: number
  name: string
  full_name: string
  html_url: string
  language: string
  stargazers_count: number
  updated_at: string
}

export interface Issue {
  id: number
  number: number
  title: string
  body: string
  html_url: string
  repository_url: string
  labels: {
    name: string
    color: string
  }[]
  repository?: Repository | null
  created_at: string
  updated_at: string
}

// Cache the repository data to avoid hitting GitHub API rate limits
const repositoryCache = new Map<string, Repository>()

// Fetch repository details
export async function fetchRepository(repoUrl: string): Promise<Repository | null> {
  if (repositoryCache.has(repoUrl)) {
    return repositoryCache.get(repoUrl)!
  }

  try {
    const response = await fetch(repoUrl, {
      headers: {
        Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      console.error(`Error fetching repository: ${response.status}`)
      return null
    }

    const repository = await response.json()
    repositoryCache.set(repoUrl, repository)
    return repository
  } catch (error) {
    console.error("Error fetching repository:", error)
    return null
  }
}

// Fetch issues with "good first issue" label
export const fetchIssues = cache(
  async (
    language?: string,
    minStars?: number,
    maxStars?: number,
    page = 1,
  ): Promise<{ issues: Issue[]; totalCount: number }> => {
    try {
      // Build the query
      let query = 'label:"good first issue" is:issue is:open'

      if (language) {
        query += ` language:${language}`
      }

      // Change the perPage value from 20 to 5
      const perPage = 5
      const apiUrl = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      })

      if (!response.ok) {
        console.error(`Error fetching issues: ${response.status}`)
        return { issues: [], totalCount: 0 }
      }

      const data = await response.json()
      const issues: Issue[] = data.items || []

      // Fetch repository details for each issue
      const issuesWithRepos = await Promise.all(
        issues.map(async (issue) => {
          const repository = await fetchRepository(issue.repository_url)
          return { ...issue, repository }
        }),
      )

      // Filter by stars if specified
      let filteredIssues = issuesWithRepos
      if (minStars !== undefined || maxStars !== undefined) {
        filteredIssues = issuesWithRepos.filter((issue) => {
          if (!issue.repository) return false

          const stars = issue.repository.stargazers_count
          const passesMinStars = minStars === undefined || stars >= minStars
          const passesMaxStars = maxStars === undefined || stars <= maxStars

          return passesMinStars && passesMaxStars
        })
      }

      return {
        issues: filteredIssues,
        totalCount: data.total_count || 0,
      }
    } catch (error) {
      console.error("Error fetching issues:", error)
      return { issues: [], totalCount: 0 }
    }
  },
)