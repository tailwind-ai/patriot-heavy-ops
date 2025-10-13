# Sync Roadmap

Sync `future-releases.md` with `vision.md` and remove completed features.

## What This Command Does

1. Reads `context/vision.md` and `context/specs/*.md`
2. Analyzes what's implemented vs planned
3. Updates `milestones/future-releases.md`
4. Removes completed features, adds new phases

## Usage

Run this command when:
- After completing a release
- When vision.md changes
- Before planning next release
- Quarterly roadmap review

## Process

### 1. Read Vision Document

Parse `context/vision.md` to extract:
- All release phases (Phase 1, 2, 3, 4)
- Use cases for each phase
- Prerequisites and dependencies
- Success metrics

### 2. Read Current State

Check what's already implemented:
- Read `milestones/past-releases.md` for completed phases
- Read `milestones/current-release.md` for active phase
- Identify which use cases are done

### 3. Identify Gaps

Compare vision vs reality:
- Which phases from vision.md are NOT in future-releases.md?
- Which use cases in future-releases.md are now complete?
- Are there new phases in vision.md?

### 4. Update Future Releases

Regenerate `milestones/future-releases.md`:

**Remove:**
- Use cases that are now in past-releases.md
- Phases that are currently active

**Add:**
- New phases from vision.md
- New use cases within existing phases
- Updated prerequisites based on completed work

**Update:**
- Timeframes based on current progress
- Prerequisites (remove completed dependencies)
- Success metrics if they've changed

### 5. Use Template

Use `templates/future-releases.template.md` to generate updated content:

```javascript
const Handlebars = require('handlebars');
const template = fs.readFileSync('templates/future-releases.template.md', 'utf8');
const compiled = Handlebars.compile(template);

const data = {
  PHASE_NUMBER: 2,
  PHASE_NAME: 'Draft Generation & Response',
  TIMEFRAME: 'Months 2-6',
  PHASE_OBJECTIVE: 'Enable AI-powered draft responses...',
  PHASE_PREREQUISITES: '- 1000+ classified threads\n- Classification accuracy >95%',
  // ... more data
};

const output = compiled(data);
fs.writeFileSync('milestones/future-releases.md', output);
```

### 6. Show Changes

Display diff:
```
Changes to future-releases.md:

Removed (completed):
  - Phase 1: UC1 - Inbox Reset (moved to past-releases)
  - Phase 1: UC2 - Classification Router (moved to past-releases)

Added (from vision):
  - Phase 3: UC11 - Team Inbox Support
  - Phase 4: UC12 - Advanced Context

Updated:
  - Phase 2 timeframe: "Months 2-6" → "Months 1-4" (adjusted for progress)
  - Phase 2 prerequisites: Removed "Phase 1 complete" (now done)
```

### 7. Confirm Update

Ask: **"Update future-releases.md with these changes? (yes/no)"**

If approved, write the file and display: **"✅ future-releases.md synced with vision.md"**

## Logic for Determining Completion

A use case is considered complete if:
1. It appears in `past-releases.md` with status ✅ Complete
2. Its parent phase is marked as complete
3. All its acceptance criteria are met (check current-release.md)

A phase is considered active if:
1. It appears in `current-release.md`
2. It has open GitHub issues

## Error Handling

- If vision.md doesn't exist, show error and exit
- If future-releases.md doesn't exist, create it from scratch
- If parsing fails, show which file has issues

## Notes

- This command is idempotent - safe to run multiple times
- Always preserves manual edits to timeframes and descriptions
- Only removes content that's provably complete
- Adds new content from vision.md automatically
