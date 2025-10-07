# Point Release

> **Note:** This file tracks bug fixes and improvements for the current release. Use the template at `templates/point-release.template.md` to create your own.

## How to Populate This File

### Sequential Workflow:

1. **Collect feedback** - Track bugs and improvements in `context/point-release-feedback.md`
2. **Create point release spec** - Use `templates/point-release.template.md` to create this file
3. **Populate with issues** - List all bugs and improvements to be fixed
4. **Create issues** - Run `/create-point-issues` to generate GitHub issues
5. **Implement** - Use `/implement-issue <number>` to work on each issue
6. **Complete** - Run `/complete-release <patch-version>` when done (e.g., v1.1.1)

---

## Instructions

This file should contain:
- Patch version number (e.g., v1.1.1)
- Parent release version (e.g., v1.1.0)
- List of bugs to fix
- List of improvements to make
- Each issue with description and acceptance criteria

Point releases are for:
- **Bugs** - Fixing issues in the current release
- **Improvements** - Small enhancements to existing features
- **Performance** - Optimizations and speed improvements

Point releases are NOT for:
- **New features** - Those go in the next major/minor release
- **Breaking changes** - Those require a new phase

---

## Example Structure

```markdown
# Point Release: v1.1.1

**Parent Release:** v1.1.0  
**Target Date:** 2025-10-14

## Bugs

### Bug 1: [Bug Title]

**Description:** [What's broken]

**Current Behavior:** [What happens now]

**Expected Behavior:** [What should happen]

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2

---

## Improvements

### Improvement 1: [Improvement Title]

**Description:** [What to improve]

**Current State:** [How it works now]

**Proposed Change:** [How it should work]

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2
```
