# Current Release

> **Note:** This file tracks the active release you're currently working on. Use the template at `templates/current-release.template.md` to create your own.

## How to Populate This File

### Step-By-Step Instructions:

1. **Start with vision** - Create `context/vision.md` with your product phases
2. **Sync roadmap** - Run `/sync-roadmap` to populate `future-releases.md` from vision
3. **Advance release** - Run `/advance-release` to pull first phase from `future-releases.md` into this file
4. **Create issues** - Run `/create-release-issues` to generate GitHub issues from this release
5. **Implement** - Use `/implement-issue <number>` to work on each issue
6. **Complete release** - Run `/complete-release <version>` when all issues are done

---

## Instructions

This file should contain:
- Version number and release name
- Release description and objectives
- Current state vs target state
- List of epics with their child issues
- Success criteria
- Timeline

After running `/advance-release`, this file will be auto-populated from the next phase in `future-releases.md`.
