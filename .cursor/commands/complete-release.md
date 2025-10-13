# Complete Release

Version and tag the release after all work is complete.

## Usage

```
/complete-release <version>
```

**Examples:**
- `/complete-release 1.2.0`
- `/complete-release 2.0.0`

## What This Command Does

1. Updates version in relevant files (package.json, etc.)
2. Creates git tag
3. Updates `config/releases/CHANGELOG.md`
4. Creates release notes

## Steps

### 1. Parse Version Argument

- Extract version from user input (format: `X.Y.Z`)
- Strip leading `v` if present (accept both `1.2.0` and `v1.2.0`)
- Validate format matches semantic versioning (X.Y.Z where X, Y, Z are numbers)
- If validation fails, show error: "Invalid version format. Use: /complete-release X.Y.Z"

### 2. Check for Existing Release

- Check if git tag `vX.Y.Z` already exists
- If exists, ask: "Release vX.Y.Z already exists. Overwrite? (yes/no)"
- If user says no, abort

### 3. Prompt for Release Notes

Ask:
- "Brief release description (e.g., 'Auto-Classification Workflow'):"
- "Key changes (one per line, press Enter twice to finish):"
- Collect all changes until user presses Enter on empty line

### 4. Update Version Files

Update version in:
- `package.json` → `"version": "X.Y.Z"`
- Any other version files detected in the project

### 5. Update CHANGELOG

Read `config/releases/CHANGELOG.md` and prepend:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Description
[Brief release description from user]

### Changes
- [Change 1]
- [Change 2]
- [Change 3]

### Related
- Epic: #[epic-number]
- Issues: #[issue-1], #[issue-2], #[issue-3]

---

[Existing changelog content...]
```

### 6. Create Git Tag

```bash
git tag -a vX.Y.Z -m "Release vX.Y.Z: [Brief description]"
```

### 7. Display Summary

Show:
```
✅ Release vX.Y.Z completed

📝 Version: X.Y.Z
📅 Date: YYYY-MM-DD
📋 Changes: N items

Files updated:
- package.json
- config/releases/CHANGELOG.md

Git tag created: vX.Y.Z

Next steps:
1. Review the changes: git diff
2. Commit: git add . && git commit -m "chore: release vX.Y.Z"
3. Push tag: git push origin vX.Y.Z
4. Push code: git push origin main
5. Create GitHub release (optional)
```

### 8. Optional: Create GitHub Release

Ask: "Create GitHub release? (yes/no)"

If yes:
```bash
gh release create vX.Y.Z \
  --title "Release vX.Y.Z: [Brief description]" \
  --notes "[Changes from CHANGELOG]" \
  --latest
```

## Example Usage

```
User: /complete-release 1.2.0

AI: Brief release description:
User: Phase 2 Draft Generation

AI: Key changes (one per line, press Enter twice to finish):
User: Implemented persona-matched draft responses
User: Added relationship-aware communication patterns
User: Created automated response system for routine emails
User: Built strategic relationship progression tracking
User: [presses Enter twice]

AI: ✅ Release v1.2.0 completed

   📝 Version: 1.2.0
   📅 Date: 2025-10-06
   📋 Changes: 4 items

   Files updated:
   - package.json (version: 1.2.0)
   - config/releases/CHANGELOG.md (new entry added)

   Git tag created: v1.2.0

   Next steps:
   1. Review the changes: git diff
   2. Commit: git add . && git commit -m "chore: release v1.2.0"
   3. Push tag: git push origin v1.2.0
   4. Push code: git push origin main

   Create GitHub release? (yes/no)
```

## Error Handling

- If version format invalid, show error and exit
- If git tag exists and user declines overwrite, abort
- If CHANGELOG.md doesn't exist, create it
- If package.json doesn't exist, skip version update
- If git operations fail, show error but keep file changes

## Notes

- Always uses semantic versioning (X.Y.Z)
- Creates annotated git tags (not lightweight)
- Updates CHANGELOG in chronological order (newest first)
- Preserves all existing changelog entries
- Can create GitHub releases via `gh` CLI
- Safe to run multiple times (with confirmation prompts)
