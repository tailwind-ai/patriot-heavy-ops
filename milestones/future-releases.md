# Future Releases

> **Note:** This file tracks upcoming phases from your product vision. Use the template at `templates/future-releases.template.md` to create your own.

## How to Populate This File

### Step-By-Step Instructions:

1. **Start with vision** - Create `context/vision.md` with all your product phases (Phase 1, 2, 3, etc.)
2. **Sync roadmap** - Run `/sync-roadmap` to auto-populate this file from `context/vision.md`
3. **Review & refine** - Edit timeframes, prerequisites, and use cases as needed
4. **Advance release** - When ready to start next phase, run `/advance-release` to move Phase 1 → `current-release.md`

---

## Instructions

This file should contain:
- All future phases from your vision
- Timeframes and prerequisites for each phase
- Use cases and success criteria
- Dependencies between phases

The `/sync-roadmap` command will:
- Read phases from `context/vision.md`
- Remove completed phases (from `past-releases.md`)
- Remove active phase (from `current-release.md`)
- Populate this file with remaining phases
