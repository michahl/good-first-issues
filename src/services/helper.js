const fetchIssueDetails = async (owner, repo, issueNumber) => {
    const token = import.meta.env.VITE_GITHUB_API_KEY;
    const issueUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`;
  
    try {
        // Fetch issue details
        const issueResponse = await fetch(issueUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!issueResponse.ok) {
            throw new Error(`HTTP error! Status: ${issueResponse.status}`);
        }

        const issue = await issueResponse.json()
        
        const repoUrl = issue.repository_url

        const repoResponse = await fetch(repoUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!repoResponse.ok) {
            throw new Error(`HTTP error! Status: ${repoResponse.status}`);
        }

        const repo = await repoResponse.json()

        const data = {
            comments_count: issue.comments,
            created_at: issue.created_at,
            has_pull_requests: false,
            html_url: issue.html_url,
            id: issue.html_url,
            is_assigned: issue.assignees.length > 0,
            labels: issue.labels.map(label => label.name),
            language: repo.language,
            repository_name: repo.full_name,
            repository_url: repo.html_url,
            stars_count: repo.stargazers_count,
            title: issue.title
        }
        return data
    } catch (error) {
        console.error('Error fetching details:', error);
    }
};


const extractIssueDetails = (url) => {
    // Regular expression to extract owner, repo, and issue number from GitHub issue URL
    const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/issues\/(\d+)/;
    const match = url.match(regex);
  
    if (match) {
      const owner = match[1];
      const repo = match[2];
      const issueNumber = parseInt(match[3], 10);
  
      return { owner, repo, issueNumber };
    } else {
      throw new Error('Invalid GitHub issue URL');
    }
}

const formatDate = (dateString) => {
    const date = new Date(dateString)

    const dateOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }

    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }

    const formattedDate = date.toLocaleDateString('en-GB', dateOptions)
    const formattedTime = date.toLocaleTimeString('en-GB', timeOptions)

    return `${formattedDate}, ${formattedTime}`
}

export default {
    fetchIssueDetails,
    extractIssueDetails,
    formatDate
}