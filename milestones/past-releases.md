# Past Releases

> **Note:** This file archives completed releases. Use the template at `templates/past-releases.template.md` to create your own.

## How to Populate This File

### Step-By-Step Instructions:

1. **Complete current release** - Finish all issues in `current-release.md`
2. **Version & tag** - Run `/complete-release <version>` to create git tag and update CHANGELOG
3. **Advance release** - Run `/advance-release` to automatically:
   - Archive current release to this file
   - Pull next phase from `future-releases.md` into `current-release.md`

---

## Instructions

This file should contain:
- All completed releases in reverse chronological order (newest first)
- Version number, date, and status
- Key achievements and success metrics
- Lessons learned
- Link to release tag/code

The `/advance-release` command automatically appends completed releases here.
