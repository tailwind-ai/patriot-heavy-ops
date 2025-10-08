# Program Conversion Checklist

Use this checklist when converting a client specification document into YAML seed data.

## Prerequisites

- [ ] Client specification document received
- [ ] Access to seed-data directory
- [ ] Text editor with YAML syntax support
- [ ] Python or Node.js for YAML validation

## Step 1: Gather Source Specification

**Goal:** Understand the complete program structure

### Tasks

- [ ] Review entire specification document
- [ ] Identify program name and description
- [ ] Count number of stages/phases/weeks
- [ ] Count total number of tasks
- [ ] Note any special requirements or constraints
- [ ] Identify client team name and details

### Questions to Answer

- What is the program called?
- How many stages does it have?
- What is the duration of each stage?
- How many tasks are in each stage?
- What task types are used (video, reading, assignment, etc.)?
- Are there URLs for resources?

### Deliverable

- [ ] Program overview summary document

## Step 2: Extract AI Assistant Context

**Goal:** Separate AI-specific content from core task instructions

### Tasks

- [ ] Search specification for "AI Assistant Context" sections
- [ ] Create `[CLIENT]-AI-Assistant-Resources.md` file
- [ ] Copy all AI context sections to the new file
- [ ] Organize by task or topic
- [ ] Remove AI context from source spec (keep for reference)

### Example

```markdown
# [Client Name] AI Assistant Resources

## Task 1.1: [Task Name]

**AI Assistant Context:**
- Context item 1
- Context item 2

## Task 2.3: [Task Name]

**AI Assistant Context:**
- Context item 1
```

### Deliverable

- [ ] `[CLIENT]-AI-Assistant-Resources.md` file created
- [ ] All AI context extracted and organized

## Step 3: Define Program Structure and Stages

**Goal:** Create the program YAML file

### Tasks

- [ ] Create `programs/[client-name]-program.yml`
- [ ] Copy from `templates/program-template.yml`
- [ ] Fill in program name (exact match for task files)
- [ ] Fill in subtitle and description
- [ ] Set status to `ACTIVE`
- [ ] Define each stage:
  - [ ] Stage name (exact match for task files)
  - [ ] Sequential order (1, 2, 3, ...)
  - [ ] Status (`ACTIVE`)
  - [ ] Expected duration in days
  - [ ] List desired outcomes (3-5 per stage)

### Validation

- [ ] All stage names are unique
- [ ] Order numbers are sequential
- [ ] Expected durations are realistic
- [ ] Desired outcomes are specific and measurable

### Example

```yaml
programs:
  - name: 'Client Onboarding Program'
    subtitle: 'Comprehensive onboarding for new team members'
    description: 'A 4-week program that prepares new members...'
    status: 'ACTIVE'
    stages:
      - name: 'Week 1: Foundation'
        order: 1
        status: 'ACTIVE'
        expectedDuration: 7
        desiredOutcomes:
          - 'Complete profile setup'
          - 'Understand company values'
          - 'Meet team members'
```

### Deliverable

- [ ] `programs/[client-name]-program.yml` file created
- [ ] All stages defined with outcomes

## Step 4: Convert Tasks with Full Instructions

**Goal:** Create the tasks YAML file with detailed instructions

### Tasks

- [ ] Create `tasks/[client-name]-tasks.yml`
- [ ] Copy from `templates/task-template.yml`
- [ ] For each task in specification:
  - [ ] Set program name (must match program YAML exactly)
  - [ ] Set stage name (must match program YAML exactly)
  - [ ] Set sequential order within stage
  - [ ] Set task name
  - [ ] Choose appropriate TaskType
  - [ ] Set estimated duration in minutes
  - [ ] Write short description (1-2 sentences)
  - [ ] Convert instructions to 4-section format:
    - [ ] **What this means:** (context)
    - [ ] **What you'll do:** (goals)
    - [ ] **How to do it:** (steps)
    - [ ] **What you'll achieve:** (outcomes)
  - [ ] Set autoComplete (usually `false`)

### TaskType Selection Guide

| If task involves... | Use type... |
|---------------------|-------------|
| Reading documents | `READING` |
| Watching videos | `VIDEO` |
| Taking tests | `QUIZ` |
| Submitting work | `ASSIGNMENT` |
| Attending meetings | `MEETING` |
| Observing others | `SHADOWING` |
| Practicing skills | `PRACTICE` |
| Getting certified | `CERTIFICATION` |
| 1-on-1 coaching | `COACHING` |
| Formal training | `TRAINING` |
| Networking | `NETWORKING` |
| Research | `RESEARCH` |
| None of above | `OTHER` |

### Instruction Format

```yaml
instructions: |
  **What this means:**
  [Provide context and background. Why is this task important?]
  
  **What you'll do:**
  [List high-level goals for this task]
  
  **How to do it:**
  1. [Specific step one]
  2. [Specific step two]
  3. [Specific step three]
  
  **What you'll achieve:**
  [Describe the expected outcome after completion]
```

### Deliverable

- [ ] `tasks/[client-name]-tasks.yml` file created
- [ ] All tasks converted with full instructions
- [ ] Instructions follow 4-section format

## Step 5: Map Resources with URLs

**Goal:** Add actionable resources to each task

### Tasks

- [ ] For each task, identify resources from specification
- [ ] For each resource:
  - [ ] Extract resource name (action text)
  - [ ] Extract or verify URL
  - [ ] Add to resources.actions array
- [ ] Use new format with name and URL:
  ```yaml
  resources:
    actions:
      - name: 'Action Name'
        url: 'https://example.com'
  ```
- [ ] If no URL available, use legacy format:
  ```yaml
  resources:
    actions:
      - 'Action Name'
  ```

### URL Validation

- [ ] All URLs are complete (include https://)
- [ ] All URLs are accessible
- [ ] URLs point to correct resources
- [ ] No placeholder URLs (example.com)

### Deliverable

- [ ] All tasks have resources defined
- [ ] All URLs validated and working

## Step 6: Validate YAML Syntax

**Goal:** Ensure YAML files are syntactically correct

### Tasks

- [ ] Validate program YAML:
  ```bash
  python3 -c "import yaml; yaml.safe_load(open('./programs/[client-name]-program.yml')); print('✅ Valid')"
  ```

- [ ] Validate tasks YAML:
  ```bash
  python3 -c "import yaml; yaml.safe_load(open('./tasks/[client-name]-tasks.yml')); print('✅ Valid')"
  ```

- [ ] Count tasks:
  ```bash
  python3 -c "import yaml; data = yaml.safe_load(open('./tasks/[client-name]-tasks.yml')); print(f'Found {len(data[\"tasks\"])} tasks')"
  ```

### Common YAML Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `expected <block end>` | Unescaped quote or apostrophe | Wrap string in quotes |
| `could not find expected ':'` | Missing colon after key | Add `:` after key name |
| `mapping values not allowed` | Indentation error | Fix indentation (use spaces) |

### Deliverable

- [ ] Program YAML validates successfully
- [ ] Tasks YAML validates successfully
- [ ] Task count matches specification

## Step 7: Test Seed Script

**Goal:** Verify files can be seeded into database

### Tasks

- [ ] Add client team to `teams-and-users.yml`:
  ```yaml
  - name: 'Client Name'
    slug: 'client-name'
    domain: 'clientname.com'
    defaultRole: 'MEMBER'
    users:
      - name: 'Test User'
        email: 'test@clientname.com'
        password: 'test123'
        emailVerified: '2024-01-01T00:00:00Z'
        role: 'OWNER'
  ```

- [ ] Add program to `seed-from-yaml.ts` programFiles array:
  ```typescript
  {
    file: './seed-data/programs/[client-name]-program.yml',
    team: 'Client Name',
  },
  ```

- [ ] Add tasks to `seed-from-yaml.ts` taskFiles array:
  ```typescript
  {
    file: './seed-data/tasks/[client-name]-tasks.yml',
    team: 'Client Name',
  },
  ```

- [ ] Run seed script:
  ```bash
  npm run seed
  ```

- [ ] Check for errors in output
- [ ] Verify success messages

### Deliverable

- [ ] Seed script runs without errors
- [ ] Program created successfully
- [ ] All stages created successfully
- [ ] All tasks created successfully

## Step 8: Verify in Database

**Goal:** Confirm data is correctly stored

### Tasks

- [ ] Query program:
  ```sql
  SELECT * FROM "Program" WHERE name = 'Client Program Name';
  ```

- [ ] Query stages:
  ```sql
  SELECT * FROM "Stage" WHERE "programId" = '[program-id]';
  ```

- [ ] Query tasks:
  ```sql
  SELECT COUNT(*) FROM "Task" 
  WHERE "stageId" IN (
    SELECT id FROM "Stage" 
    WHERE "programId" = '[program-id]'
  );
  ```

- [ ] Spot check task instructions:
  ```sql
  SELECT name, instructions FROM "Task" 
  WHERE "stageId" IN (
    SELECT id FROM "Stage" 
    WHERE "programId" = '[program-id]'
  )
  LIMIT 3;
  ```

- [ ] Verify resources JSON structure:
  ```sql
  SELECT name, resources FROM "Task" 
  WHERE "stageId" IN (
    SELECT id FROM "Stage" 
    WHERE "programId" = '[program-id]'
  )
  LIMIT 3;
  ```

### Validation Checklist

- [ ] Program exists with correct name
- [ ] Correct number of stages created
- [ ] Stages have correct order
- [ ] Correct number of tasks created
- [ ] Task instructions are complete (not truncated)
- [ ] Resources JSON has correct structure
- [ ] URLs are preserved in resources

### Deliverable

- [ ] Database verification complete
- [ ] All data correctly stored
- [ ] No data truncation or corruption

## Final Checklist

- [ ] Program YAML file created and validated
- [ ] Tasks YAML file created and validated
- [ ] AI Assistant Context extracted (if applicable)
- [ ] Team added to teams-and-users.yml
- [ ] Program added to seed script
- [ ] Tasks added to seed script
- [ ] Seed script runs successfully
- [ ] Database verification complete
- [ ] CHANGELOG.md updated with new program
- [ ] Documentation reviewed
- [ ] Client notified of completion

## Quality Assurance

Before marking complete, verify:

- [ ] All task instructions are clear and actionable
- [ ] All URLs work and point to correct resources
- [ ] TaskTypes are appropriate for each task
- [ ] Estimated durations are realistic
- [ ] Stage outcomes are specific and measurable
- [ ] No spelling or grammar errors
- [ ] Consistent formatting throughout
- [ ] Program name matches exactly in all files

## Common Pitfalls to Avoid

1. **Name Mismatches:** Program/stage names must match exactly (case-sensitive)
2. **Missing URLs:** Prefer new resource format with URLs when available
3. **Truncated Instructions:** Use `|` for multi-line strings
4. **Wrong Task Types:** Choose the most specific type that fits
5. **Unrealistic Durations:** Estimate durations realistically
6. **Vague Outcomes:** Make desired outcomes specific and measurable
7. **Inconsistent Order:** Use sequential integers for order fields
8. **YAML Syntax Errors:** Validate before committing

## Time Estimates

| Step | Estimated Time |
|------|----------------|
| Step 1: Gather Specification | 30 minutes |
| Step 2: Extract AI Context | 15 minutes |
| Step 3: Define Program | 30 minutes |
| Step 4: Convert Tasks | 2-4 hours |
| Step 5: Map Resources | 30-60 minutes |
| Step 6: Validate YAML | 15 minutes |
| Step 7: Test Seed Script | 15 minutes |
| Step 8: Verify Database | 15 minutes |
| **Total** | **4-6 hours** |

*Note: Time varies based on program complexity and number of tasks*

## Support

If you encounter issues:
1. Review this checklist
2. Check `README.md` for detailed field documentation
3. Review example files (GFI program)
4. Validate YAML syntax
5. Check seed script error messages
6. Contact development team
