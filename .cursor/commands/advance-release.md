# Advance Release

Archive current release and pull next phase from future-releases.md.

## What This Command Does

1. Archives `milestones/current-release.md` to `milestones/past-releases.md`
2. Pulls next phase from `milestones/future-releases.md`
3. Populates `milestones/current-release.md` with new phase
4. Auto-increments version number

## Usage

Run this command when:

- Current release is complete and deployed
- All issues closed and merged
- Ready to start next phase

## Process

### 1. Validate Prerequisites

Check that current release is ready to archive:

- [ ] All epics marked as complete
- [ ] All GitHub issues closed
- [ ] Release deployed to production
- [ ] Success criteria met

If not ready, show warning: **"⚠️ Current release has open issues. Complete before advancing."**

### 2. Archive Current Release

Read `milestones/current-release.md` and extract:

- Version number (e.g., v1.1.0)
- Release name
- Key achievements
- Success metrics
- Completion date (today)

Append to `milestones/past-releases.md`:

```markdown
## v1.1.0 - Phase 1 Full Auto-Classification (2025-10-06)

**Status**: ✅ Complete  
**Duration**: 2 weeks  
**Code**: [v1.1.0](../../releases/v1.1.0)

### Key Achievements

- Zero-touch classification (no manual approval)
- > 95% classification accuracy over 500 threads
- Gemini fallback <10%
- Automatic Contact/Sheet sync

### Success Metrics

- Classification accuracy: 96.2%
- Manual intervention: 0%
- Processing time: 2.3s/thread

### Lessons Learned

- Threshold=3 optimal for accuracy vs fallback rate
- Contact API sync can be synchronous without performance issues
- DRY_RUN mode essential for validation

---
```

### 3. Pull Next Phase from Future Releases

Read `milestones/future-releases.md` and extract the first phase:

- Phase number and name
- Objective
- Prerequisites
- Use cases
- Success metrics

### 4. Increment Version

Determine next version:

- If major phase change: increment minor version (1.1.0 → 1.2.0)
- If point release: increment patch version (1.1.0 → 1.1.1)

### 5. Generate New Current Release

Use `templates/current-release.template.md` to create new file:

```javascript
const Handlebars = require("handlebars")
const template = fs.readFileSync(
  "templates/current-release.template.md",
  "utf8"
)
const compiled = Handlebars.compile(template)

const data = {
  VERSION: "v1.2.0",
  RELEASE_NAME: "Phase 2 - Draft Generation",
  RELEASE_DESCRIPTION: "Enable AI-powered draft responses...",
  PREVIOUS_VERSION: "v1.1.0",
  CURRENT_STATE: "- ✅ Classification working\n- ✅ Relationship data synced",
  TARGET_STATE: "- ✅ Draft generation active\n- ✅ Persona-matched responses",
  // ... more data from future-releases.md
}

const output = compiled(data)
fs.writeFileSync("milestones/current-release.md", output)
```

### 6. Update Future Releases

Remove the phase that was just moved to current-release.md from future-releases.md.

### 7. Show Summary

Display:

```
Release Advanced:

Archived:
  v1.1.0 - Phase 1 Full Auto-Classification
  → Moved to past-releases.md

New Current Release:
  v1.2.0 - Phase 2 Draft Generation
  ← Pulled from future-releases.md

Next Steps:
  1. Review milestones/current-release.md
  2. Run /create-release-issues to generate GitHub issues
  3. Start implementation
```

### 8. Confirm Changes

Ask: **"Commit these changes? (yes/no)"**

If approved:

```bash
git add milestones/
git commit -m "chore: advance to v1.2.0 - Phase 2 Draft Generation"
```

Display: **"✅ Release advanced to v1.2.0. Run `/create-release-issues` to generate issues."**

## Error Handling

- If current-release.md doesn't exist, show error
- If future-releases.md is empty, prompt to update vision.md first
- If version parsing fails, prompt for manual version input
- If git commit fails, show error but keep file changes

## Notes

- This is a major workflow transition - requires PM approval
- Always review generated current-release.md before committing
- Can be reverted with `git revert` if needed
- Updates CHANGELOG.md automatically with new version
