# Seed Data Documentation

This directory contains YAML files for seeding programs, stages, and tasks into the database. This approach enables customer success teams to pre-populate onboarding programs for multiple teams efficiently.

## Directory Structure

```
seed-data/
├── README.md                          # This file
├── CHANGELOG.md                       # History of seed data changes
├── CONVERSION-CHECKLIST.md            # Step-by-step conversion guide
├── RESOURCES-FORMAT.md                # Resource format documentation
├── GFI-AI-Assistant-Resources.md      # AI context requirements
├── seed-from-yaml.ts                  # Main seed script
├── teams-and-users.yml                # Team and user definitions
├── programs/                          # Program YAML files
│   ├── gfi-new-agent-school-program.yml
│   ├── super-life-group-program.yml
│   ├── maverick-realty-program.yml
│   └── continental-insurance-program.yml
├── tasks/                             # Task YAML files
│   ├── gfi-new-agent-school-tasks.yml
│   ├── super-life-group-tasks.yml
│   ├── maverick-realty-tasks.yml
│   └── continental-insurance-tasks.yml
└── templates/                         # Templates for new programs
    ├── program-template.yml
    └── task-template.yml
```

## Overview

The seed data system allows you to:
1. Define programs with multiple stages
2. Create detailed tasks with instructions and resources
3. Assign programs to specific teams
4. Maintain consistency across multiple team deployments

## Program YAML Format

Programs define the high-level structure of an onboarding journey.

### Basic Structure

```yaml
programs:
  - name: 'Program Name'
    subtitle: 'Brief subtitle describing the program'
    description: 'Detailed description of what the program accomplishes'
    status: 'ACTIVE'  # Options: DRAFT, ACTIVE, ARCHIVED
    stages:
      - name: 'Stage 1 Name'
        order: 1
        status: 'ACTIVE'
        expectedDuration: 7  # in days
        desiredOutcomes:
          - 'Outcome 1'
          - 'Outcome 2'
          - 'Outcome 3'
      - name: 'Stage 2 Name'
        order: 2
        status: 'ACTIVE'
        expectedDuration: 7
        desiredOutcomes:
          - 'Outcome 1'
          - 'Outcome 2'
```

### Program Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Program name (must match exactly in task files) |
| `subtitle` | string | Yes | Brief subtitle for the program |
| `description` | string | Yes | Detailed description of the program |
| `status` | enum | Yes | `DRAFT`, `ACTIVE`, or `ARCHIVED` |
| `stages` | array | Yes | List of stages in the program |

### Stage Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Stage name (must match exactly in task files) |
| `order` | number | Yes | Sequential order (1, 2, 3, ...) |
| `status` | enum | Yes | `DRAFT`, `ACTIVE`, or `ARCHIVED` |
| `expectedDuration` | number | Yes | Expected duration in days |
| `desiredOutcomes` | array | Yes | List of outcomes for this stage |

## Task YAML Format

Tasks define the specific activities within each stage.

### Basic Structure

```yaml
tasks:
  - program: 'Program Name'  # Must match program name exactly
    stage: 'Stage Name'      # Must match stage name exactly
    order: 1
    name: 'Task Name'
    type: 'ASSIGNMENT'
    estimatedDuration: 30    # in minutes
    description: 'Short description'
    instructions: |
      **What this means:**
      Context and background information.
      
      **What you'll do:**
      High-level goals for this task.
      
      **How to do it:**
      1. Step one
      2. Step two
      3. Step three
      
      **What you'll achieve:**
      Expected outcomes after completion.
    resources:
      actions:
        - name: 'Action Name'
          url: 'https://example.com'
    autoComplete: false
```

### Task Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `program` | string | Yes | Program name (must match program YAML) |
| `stage` | string | Yes | Stage name (must match program YAML) |
| `order` | number | Yes | Sequential order within stage (1, 2, 3, ...) |
| `name` | string | Yes | Task name |
| `type` | enum | Yes | Task type (see TaskType values below) |
| `estimatedDuration` | number | Yes | Estimated duration in minutes |
| `description` | string | Yes | Short description (1-2 sentences) |
| `instructions` | string | Yes | Detailed instructions (supports markdown) |
| `resources` | object | Yes | Resources object with actions array |
| `autoComplete` | boolean | Yes | Whether task auto-completes |

## TaskType Values

Use these values for the `type` field in tasks:

| Type | When to Use | Example |
|------|-------------|---------|
| `READING` | Reading articles, books, or documentation | "Read company handbook" |
| `VIDEO` | Watching videos or recorded content | "Watch orientation video" |
| `QUIZ` | Taking quizzes or assessments | "Complete compliance quiz" |
| `ASSIGNMENT` | Completing assignments or projects | "Submit first draft" |
| `MEETING` | Attending meetings or calls | "Attend team standup" |
| `SHADOWING` | Observing others work | "Shadow senior agent" |
| `PRACTICE` | Practicing skills or techniques | "Practice sales pitch" |
| `CERTIFICATION` | Obtaining certifications | "Pass state licensing exam" |
| `COACHING` | One-on-one coaching sessions | "Meet with mentor" |
| `TRAINING` | Formal training sessions | "Complete CRM training" |
| `NETWORKING` | Networking activities | "Connect with team members" |
| `RESEARCH` | Research tasks | "Research competitor products" |
| `OTHER` | Any other task type | Use when none above fit |

## Resources Structure

Tasks can include resources with actions. We support two formats for backward compatibility:

### New Format (Recommended)

Use this format when you have URLs to provide:

```yaml
resources:
  actions:
    - name: 'Complete Your Profile'
      url: 'https://example.com/profile'
    - name: 'Watch Tutorial'
      url: 'https://example.com/video'
    - name: 'Download Guide'
      url: 'https://example.com/guide.pdf'
```

### Legacy Format (Still Supported)

Simple string format without URLs:

```yaml
resources:
  actions:
    - 'Complete Your Profile'
    - 'Watch Tutorial'
    - 'Download Guide'
```

### Mixed Format

You can mix both formats in the same task:

```yaml
resources:
  actions:
    - 'Simple Action'
    - name: 'Action with URL'
      url: 'https://example.com'
```

## Multi-line Instructions

Use the `|` (pipe) character for multi-line strings that preserve formatting:

```yaml
instructions: |
  **What this means:**
  This is a long instruction that spans
  multiple lines and preserves formatting.
  
  Blank lines are preserved.
  
  **What you'll do:**
  1. Step one
  2. Step two
  
  **How to do it:**
  Detailed steps here.
  
  **What you'll achieve:**
  Expected outcomes.
```

### Instruction Best Practices

1. **Use the 4-section format:**
   - What this means (context)
   - What you'll do (goals)
   - How to do it (steps)
   - What you'll achieve (outcomes)

2. **Keep instructions clear and actionable**
3. **Use markdown formatting** (bold, lists, links)
4. **Include specific steps** numbered or bulleted
5. **Length:** Typically 1200-2000 characters

## YAML Formatting Tips

### Escaping Special Characters

If your text contains special characters, wrap it in quotes:

```yaml
description: "This description has a colon: and needs quotes"
description: 'This has an apostrophe in it\'s text'
```

### Long Strings

For very long strings, use the literal block style (`|`):

```yaml
instructions: |
  This is a very long instruction
  that spans multiple lines.
  
  It preserves line breaks and formatting.
```

### Lists

Use consistent indentation for lists:

```yaml
desiredOutcomes:
  - 'First outcome'
  - 'Second outcome'
  - 'Third outcome'
```

## Running the Seed Script

### Prerequisites

1. Database connection configured
2. Node.js and npm installed
3. Dependencies installed (`npm install`)

### Execute Seeding

```bash
# From project root
npm run seed

# Or directly with ts-node
ts-node config/seed-data/seed-from-yaml.ts
```

### What Gets Seeded

The script processes files in this order:
1. Teams and users from `teams-and-users.yml`
2. Programs from `programs/*.yml`
3. Tasks from `tasks/*.yml`

### Validation

The script will:
- ✅ Skip existing teams, programs, stages, and tasks
- ✅ Report what was created vs already existed
- ✅ Continue processing even if one file fails
- ✅ Display summary statistics at the end

## Example: GFI New Agent School

The GFI (Global Financial Impact) program is a complete example:

**Program:** `programs/gfi-new-agent-school-program.yml`
- 4 stages (Week 1, Week 2, Week 3, Field Training)
- 35 days total duration
- Clear desired outcomes for each stage

**Tasks:** `tasks/gfi-new-agent-school-tasks.yml`
- 26 tasks across all stages
- Detailed instructions with 4-section format
- Resources with names and URLs
- Various task types (VIDEO, ASSIGNMENT, PRACTICE, etc.)

## Troubleshooting

### YAML Syntax Errors

**Problem:** `yaml.parser.ParserError`

**Solution:**
- Check for unescaped quotes or apostrophes
- Ensure consistent indentation (use spaces, not tabs)
- Validate YAML syntax with: `python3 -c "import yaml; yaml.safe_load(open('file.yml'))"`

### Program/Stage Not Found

**Problem:** `❌ Program X not found for team Y`

**Solution:**
- Ensure program name in task file matches exactly (case-sensitive)
- Ensure stage name in task file matches exactly
- Check that program file is listed in `seed-from-yaml.ts`

### Duplicate Entries

**Problem:** Tasks or programs being created multiple times

**Solution:**
- The script checks for existing entries by name
- If you see duplicates, check for slight name variations
- Clear database and re-seed if needed

## Best Practices

1. **Naming Consistency:** Use exact same names in program and task files
2. **Order Numbers:** Use sequential integers (1, 2, 3, ...) for order fields
3. **Validation:** Always validate YAML syntax before committing
4. **Testing:** Test seed script in development before production
5. **Documentation:** Update CHANGELOG.md when adding new programs
6. **Resources:** Prefer new format with URLs for better user experience
7. **Instructions:** Follow 4-section format for consistency
8. **Task Types:** Choose the most specific TaskType that fits

## Additional Resources

- **Conversion Checklist:** See `CONVERSION-CHECKLIST.md` for step-by-step guide
- **Resource Format:** See `RESOURCES-FORMAT.md` for detailed resource documentation
- **Templates:** Use files in `templates/` as starting points
- **Customer Success:** See `docs/customer-success/program-seeding-playbook.md`

## Support

For questions or issues:
1. Check this README and related documentation
2. Review example files (GFI program)
3. Validate YAML syntax
4. Check seed script output for specific errors
5. Contact development team if issues persist