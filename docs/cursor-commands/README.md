# Cursor Commands

This directory contains custom Cursor commands for the Patriot Heavy Ops project.

## Available Commands

### 1. `/implement-issue`

**Purpose:** Implement a GitHub issue following Platform Mode TDD workflow

**Usage:**

```
/implement-issue 226
```

**What it does:**

- Fetches issue details from GitHub CLI
- Creates comprehensive TODO list
- Enforces TDD sequence (test first, minimal code)
- Works through TODOs until CI is green
- Creates PR from dev branch

### 2. `/pr-triage`

**Purpose:** Analyze failing CI tests and Cursor Bugbot comments on a PR

**Usage:**

```
/pr-triage 320
/pr-triage 320 227
```

**What it does:**

- Fetches PR metadata and CI run status
- Analyzes failure logs and Bugbot comments
- Identifies root causes with surgical fixes
- Creates strict-scope TODO list for fixes
- Requires approval before making changes

## Setup

The `.cursor/commands` directory is a **symlink** to this `docs/cursor-commands/` directory. This means:

✅ Cursor finds commands in `.cursor/commands/` (where it expects them)  
✅ Files are actually stored in tracked `docs/cursor-commands/` directory  
✅ Any commands you create/edit through Cursor UI are automatically tracked in git  
✅ No manual copying needed!

### First-Time Setup (Already Done)

The symlink is already created:

```bash
.cursor/commands -> ../docs/cursor-commands
```

If you need to recreate it:

```bash
mkdir -p .cursor
ln -s ../docs/cursor-commands .cursor/commands
```

### Usage

Just use the commands with `/` prefix in Cursor chat:

- `/implement-issue 226`
- `/pr-triage 320`

Any new commands you create through Cursor's UI will be saved to `docs/cursor-commands/` and automatically tracked in git.
