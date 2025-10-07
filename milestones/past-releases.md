# Past Releases

> **Note:** This file archives completed releases. Use the template at `templates/past-releases.template.md` to create your own.

## How to Populate This File

### Sequential Workflow:

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

---

## Example Structure

```markdown
# Past Releases

## v1.1.0 - Phase 1 Foundation (2025-10-07)

**Status**: ✅ Complete  
**Duration**: 4 weeks  
**Code**: [v1.1.0](../../releases/v1.1.0)

### Key Achievements

- Feature 1 implemented
- Feature 2 implemented
- 95% test coverage achieved

### Success Metrics

- Performance: 2.3s average response time
- Adoption: 100 active users
- Quality: 0 critical bugs

### Lessons Learned

- [What went well]
- [What to improve]

---

## v1.0.0 - Initial Release (2025-09-01)

[Similar structure...]
```
