import { Octokit } from "@octokit/rest"
import { FileChange } from "./automated-fixer"

type CommitResult = {
  success: boolean
  commitSha?: string
  error?: string
}

export class GitOperations {
  private octokit: Octokit
  private owner: string
  private repo: string
  private prNumber: number

  constructor(octokit: Octokit, owner: string, repo: string, prNumber: number) {
    this.octokit = octokit
    this.owner = owner
    this.repo = repo
    this.prNumber = prNumber
  }

  async commitAndPushChanges(changes: FileChange[], issueType: string): Promise<CommitResult> {
    try {
      console.log(`Committing ${changes.length} changes for ${issueType}`)

      // Get PR details to find the head branch
      const pr = await this.octokit.rest.pulls.get({
        owner: this.owner,
        repo: this.repo,
        pull_number: this.prNumber,
      })

      const headBranch = pr.data.head.ref
      if (!headBranch) {
        throw new Error("PR head branch not found")
      }
      const headSha = pr.data.head.sha

      // Get the current tree
      const currentTree = await this.octokit.rest.git.getTree({
        owner: this.owner,
        repo: this.repo,
        tree_sha: headSha,
        recursive: "true",
      })

      // Create new tree with changes
      const newTreeItems = await this.createTreeItems(changes, currentTree.data.tree)
      
      // Create new tree
      const newTree = await this.octokit.rest.git.createTree({
        owner: this.owner,
        repo: this.repo,
        tree: newTreeItems,
        base_tree: headSha,
      })

      // Create commit
      const commitMessage = this.generateCommitMessage(issueType, changes)
      const commit = await this.octokit.rest.git.createCommit({
        owner: this.owner,
        repo: this.repo,
        message: commitMessage,
        tree: newTree.data.sha,
        parents: [headSha],
        author: {
          name: "Background Agent",
          email: "agent@patriot-heavy-ops.com",
        },
      })

      // Update branch reference
      await this.octokit.rest.git.updateRef({
        owner: this.owner,
        repo: this.repo,
        ref: `heads/${headBranch}`,
        sha: commit.data.sha,
      })

      console.log(`Successfully committed changes: ${commit.data.sha}`)
      
      return {
        success: true,
        commitSha: commit.data.sha,
      }

    } catch (error) {
      console.error("Error committing changes:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }
    }
  }

  private async createTreeItems(
    changes: FileChange[], 
    existingTree: any[]
  ): Promise<any[]> {
    const treeItems: any[] = []

    // Add all existing files except the ones being changed
    const changedPaths = new Set(changes.map(c => c.path))
    
    for (const item of existingTree) {
      if (item.type === "blob" && !changedPaths.has(item.path)) {
        treeItems.push({
          path: item.path,
          mode: item.mode,
          type: item.type,
          sha: item.sha,
        })
      }
    }

    // Add changed files
    for (const change of changes) {
      try {
        const blob = await this.octokit.rest.git.createBlob({
          owner: this.owner,
          repo: this.repo,
          content: change.content,
          encoding: "utf-8",
        })

        treeItems.push({
          path: change.path,
          mode: "100644",
          type: "blob",
          sha: blob.data.sha,
        })
      } catch (error) {
        console.error(`Error creating blob for ${change.path}:`, error)
      }
    }

    return treeItems
  }

  private generateCommitMessage(issueType: string, changes: FileChange[]): string {
    const fileCount = changes.length
    const fileList = changes.map(c => c.path).join(", ")
    
    // Map issue types to source descriptions
    const sourceMap = {
      copilot_comment: "GitHub Copilot",
      ci_failure: "GitHub Actions CI",
      vercel_failure: "Vercel Deployment",
      lint_error: "ESLint",
      test_failure: "Test Suite"
    }

    const source = sourceMap[issueType as keyof typeof sourceMap] || issueType
    const baseMessage = `Auto-fix: Applied suggestions from ${source}`
    
    return `${baseMessage}

Files changed: ${fileList}
Issue type: ${issueType}

🤖 Automated fix applied by PR Auto-Fix Agent`
  }

  async createFixBranch(): Promise<string | null> {
    try {
      const branchName = `fix/automated-${this.prNumber}-${Date.now()}`
      
      // Get PR head SHA
      const pr = await this.octokit.rest.pulls.get({
        owner: this.owner,
        repo: this.repo,
        pull_number: this.prNumber,
      })

      // Create new branch
      await this.octokit.rest.git.createRef({
        owner: this.owner,
        repo: this.repo,
        ref: `refs/heads/${branchName}`,
        sha: pr.data.head.sha,
      })

      console.log(`Created fix branch: ${branchName}`)
      return branchName

    } catch (error) {
      console.error("Error creating fix branch:", error)
      return null
    }
  }

  async updatePRWithFix(commitSha: string, issueType: string): Promise<boolean> {
    try {
      // Add a comment to the PR about the fix
      const comment = `✅ Fixes applied automatically by PR Auto-Fix Agent.

**Issue Type:** ${issueType}
**Commit:** ${commitSha}
**Status:** Changes committed and pushed

The background agent has automatically applied fixes for the detected issues. Please review the changes.`

      await this.octokit.rest.issues.createComment({
        owner: this.owner,
        repo: this.repo,
        issue_number: this.prNumber,
        body: comment,
      })

      console.log(`Updated PR #${this.prNumber} with fix details`)
      return true

    } catch (error) {
      console.error("Error updating PR:", error)
      return false
    }
  }

  async validateChanges(changes: FileChange[]): Promise<boolean> {
    try {
      // Basic validation - check if files exist and are valid
      for (const change of changes) {
        // Check if file path is valid
        if (!change.path || change.path.includes("..")) {
          console.error(`Invalid file path: ${change.path}`)
          return false
        }

        // Check if content is valid
        if (typeof change.content !== "string") {
          console.error(`Invalid content for file: ${change.path}`)
          return false
        }

        // Check file size (GitHub has limits)
        if (change.content.length > 100 * 1024 * 1024) { // 100MB limit
          console.error(`File too large: ${change.path}`)
          return false
        }
      }

      return true

    } catch (error) {
      console.error("Error validating changes:", error)
      return false
    }
  }
}
