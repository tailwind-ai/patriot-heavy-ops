# Program Seeding Playbook for Customer Success

This playbook guides customer success teams through the process of creating and deploying onboarding programs using YAML seed data.

## Table of Contents

1. [When to Use Seed Data](#when-to-use-seed-data)
2. [Before You Start](#before-you-start)
3. [The Conversion Process](#the-conversion-process)
4. [Working with Client Specifications](#working-with-client-specifications)
5. [Quality Assurance](#quality-assurance)
6. [Common Pitfalls](#common-pitfalls)
7. [Troubleshooting Guide](#troubleshooting-guide)
8. [Best Practices](#best-practices)
9. [Case Study: GFI New Agent School](#case-study-gfi-new-agent-school)

## When to Use Seed Data

### Use Seed Data When:

✅ **Deploying to Multiple Teams**
- Same program structure for multiple independent teams
- Example: Parent agency with multiple sub-agencies

✅ **Complex Programs**
- 20+ tasks
- Multiple stages
- Detailed instructions
- Many resources

✅ **Standardized Content**
- Client has detailed specification document
- Content is finalized and approved
- Minimal customization per team

✅ **Version Control Needed**
- Need to track changes over time
- Multiple stakeholders reviewing content
- Rollback capability required

### Use Manual Creation When:

❌ **Simple Programs**
- Less than 10 tasks
- Single stage
- Quick setup needed

❌ **Highly Customized**
- Each team needs different content
- Frequent per-team modifications
- Dynamic content

❌ **Rapid Prototyping**
- Still defining program structure
- Content in draft form
- Frequent changes expected

## Before You Start

### Prerequisites Checklist

- [ ] Client specification document received and reviewed
- [ ] Program structure approved by client
- [ ] All resource URLs collected and verified
- [ ] Client team information available
- [ ] Development environment access
- [ ] Git repository access
- [ ] Database access for verification

### Required Skills

- YAML syntax basics
- Markdown formatting
- Command line basics
- Git version control
- Text editor proficiency

### Time Allocation

| Program Size | Estimated Time |
|--------------|----------------|
| Small (10-15 tasks) | 2-3 hours |
| Medium (20-30 tasks) | 4-6 hours |
| Large (40+ tasks) | 8-12 hours |

*Add 1-2 hours for first-time conversions*

## The Conversion Process

### Phase 1: Discovery (30-60 minutes)

**Goal:** Understand the complete program structure

**Activities:**
1. Review client specification document thoroughly
2. Identify program name and description
3. Count stages and tasks
4. Note special requirements
5. Verify all resources have URLs
6. Clarify any ambiguities with client

**Deliverable:** Program overview summary

**Questions to Answer:**
- What is the program called?
- How many stages? What are they called?
- How many tasks per stage?
- What task types are used?
- Are all resources accessible?
- Any compliance or regulatory requirements?

### Phase 2: Setup (15 minutes)

**Goal:** Prepare files and environment

**Activities:**
1. Create branch in Git: `git checkout -b client-[name]-program`
2. Copy template files:
   ```bash
   cp config/seed-data/templates/program-template.yml config/seed-data/programs/[client-name]-program.yml
   cp config/seed-data/templates/task-template.yml config/seed-data/tasks/[client-name]-tasks.yml
   ```
3. Open both files in editor
4. Create AI context file if needed

**Deliverable:** Template files ready for editing

### Phase 3: Program Structure (30 minutes)

**Goal:** Define program and stages

**Activities:**
1. Fill in program metadata (name, subtitle, description)
2. Define each stage with:
   - Descriptive name
   - Sequential order
   - Realistic duration
   - 3-5 specific outcomes
3. Validate YAML syntax
4. Review with team

**Deliverable:** Complete program YAML file

**Tips:**
- Use descriptive stage names ("Week 1: Foundation" not "Week 1")
- Make outcomes specific and measurable
- Align durations with task complexity
- Keep status as `ACTIVE` for production

### Phase 4: Task Conversion (2-4 hours)

**Goal:** Convert all tasks with full instructions

**Activities:**
1. For each task in specification:
   - Set program and stage names (exact match)
   - Choose appropriate TaskType
   - Write short description
   - Convert instructions to 4-section format
   - Map resources with URLs
   - Set realistic duration
2. Validate YAML syntax frequently
3. Spot check formatting

**Deliverable:** Complete tasks YAML file

**Instruction Format:**
```markdown
**What this means:**
[Context - why this matters]

**What you'll do:**
[Goals - what to accomplish]

**How to do it:**
1. [Specific step]
2. [Specific step]
3. [Specific step]

**What you'll achieve:**
[Outcomes - what you'll have learned/done]
```

**TaskType Selection:**
- **READING:** Articles, books, documentation
- **VIDEO:** Videos, webinars, recordings
- **QUIZ:** Assessments, tests, quizzes
- **ASSIGNMENT:** Projects, submissions, deliverables
- **MEETING:** Meetings, calls, standups
- **SHADOWING:** Observing others
- **PRACTICE:** Skills practice, role-play
- **CERTIFICATION:** Exams, certifications
- **COACHING:** 1-on-1 coaching
- **TRAINING:** Formal training sessions
- **NETWORKING:** Networking events
- **RESEARCH:** Research tasks
- **OTHER:** Anything else

### Phase 5: Resources (30-60 minutes)

**Goal:** Add actionable resources to all tasks

**Activities:**
1. For each task, identify resources
2. Extract action names and URLs
3. Use new format with name and URL:
   ```yaml
   resources:
     actions:
       - name: 'Watch Orientation Video'
         url: 'https://example.com/video'
       - name: 'Download Manual'
         url: 'https://example.com/manual.pdf'
   ```
4. Verify all URLs are accessible
5. Test URLs in browser

**Deliverable:** All tasks have working resources

**Tips:**
- Use descriptive action names
- Test every URL
- Use full URLs (include https://)
- Order resources by usage sequence
- Avoid "Click Here" or generic names

### Phase 6: Validation (15 minutes)

**Goal:** Ensure files are error-free

**Activities:**
1. Validate program YAML syntax
2. Validate tasks YAML syntax
3. Count tasks and verify against spec
4. Spot check instructions formatting
5. Verify name matching (program/stage)

**Commands:**
```bash
# Validate program
python3 -c "import yaml; yaml.safe_load(open('./config/seed-data/programs/[client-name]-program.yml')); print('✅ Valid')"

# Validate tasks
python3 -c "import yaml; yaml.safe_load(open('./config/seed-data/tasks/[client-name]-tasks.yml')); print('✅ Valid')"

# Count tasks
python3 -c "import yaml; data = yaml.safe_load(open('./config/seed-data/tasks/[client-name]-tasks.yml')); print(f'Found {len(data[\"tasks\"])} tasks')"
```

**Deliverable:** Validated YAML files

### Phase 7: Integration (15 minutes)

**Goal:** Add to seed script

**Activities:**
1. Add client team to `teams-and-users.yml`
2. Add program to `seed-from-yaml.ts` programFiles array
3. Add tasks to `seed-from-yaml.ts` taskFiles array
4. Run seed script
5. Check for errors

**Deliverable:** Program integrated into seed script

### Phase 8: Testing (15 minutes)

**Goal:** Verify in database

**Activities:**
1. Run seed script: `npm run seed`
2. Check console output for errors
3. Query database to verify:
   - Program created
   - All stages created
   - All tasks created
   - Instructions not truncated
   - Resources JSON correct
4. Spot check 3-5 tasks in UI

**Deliverable:** Verified program in database

### Phase 9: Documentation (15 minutes)

**Goal:** Document the work

**Activities:**
1. Update `config/seed-data/CHANGELOG.md`
2. Document any special considerations
3. Note any deviations from spec
4. Create handoff notes for client

**Deliverable:** Complete documentation

### Phase 10: Deployment (30 minutes)

**Goal:** Deploy to production

**Activities:**
1. Create pull request
2. Request review from team
3. Address feedback
4. Merge to main
5. Deploy to production
6. Verify in production environment
7. Notify client

**Deliverable:** Program live in production

## Working with Client Specifications

### Specification Quality Assessment

**High Quality Spec:**
✅ Clear program structure
✅ Detailed task descriptions
✅ Step-by-step instructions
✅ All resources with URLs
✅ Consistent formatting
✅ Realistic durations

**Low Quality Spec:**
❌ Vague descriptions
❌ Missing instructions
❌ No URLs for resources
❌ Inconsistent formatting
❌ Unrealistic expectations

### Handling Incomplete Specifications

**If Missing Instructions:**
1. Request clarification from client
2. Use similar tasks as templates
3. Draft instructions and get approval
4. Document assumptions

**If Missing URLs:**
1. Request from client
2. Use legacy resource format (strings only)
3. Plan to update later
4. Document missing URLs

**If Unclear Structure:**
1. Propose structure to client
2. Use industry best practices
3. Reference similar programs
4. Get approval before proceeding

### Client Communication Tips

**Do:**
- ✅ Ask clarifying questions early
- ✅ Provide examples of good instructions
- ✅ Set realistic timelines
- ✅ Give regular progress updates
- ✅ Document all decisions

**Don't:**
- ❌ Assume what client wants
- ❌ Make major changes without approval
- ❌ Rush through complex programs
- ❌ Skip validation steps
- ❌ Forget to document changes

## Quality Assurance

### Pre-Deployment Checklist

**Program Structure:**
- [ ] Program name is descriptive and clear
- [ ] Subtitle accurately describes program
- [ ] Description is comprehensive
- [ ] All stages have clear names
- [ ] Stage order is sequential (1, 2, 3, ...)
- [ ] Durations are realistic
- [ ] Outcomes are specific and measurable

**Task Quality:**
- [ ] All tasks have appropriate TaskType
- [ ] Descriptions are clear and concise
- [ ] Instructions follow 4-section format
- [ ] Instructions are actionable
- [ ] Steps are numbered and specific
- [ ] Durations are realistic
- [ ] No spelling or grammar errors

**Resources:**
- [ ] All resources have descriptive names
- [ ] All URLs are complete and working
- [ ] URLs point to correct content
- [ ] Resources are ordered logically
- [ ] No placeholder URLs

**Technical:**
- [ ] YAML syntax is valid
- [ ] Program/stage names match exactly
- [ ] Order numbers are sequential
- [ ] No duplicate tasks
- [ ] Task count matches specification
- [ ] Seed script runs without errors
- [ ] Database verification complete

### Review Process

**Self-Review:**
1. Read through all instructions as if you're the user
2. Click all resource URLs
3. Check for typos and grammar
4. Verify task order makes sense
5. Ensure durations are realistic

**Peer Review:**
1. Have colleague review 3-5 random tasks
2. Get feedback on instruction clarity
3. Verify technical accuracy
4. Check for consistency

**Client Review:**
1. Share preview in staging environment
2. Walk through 1-2 tasks together
3. Get approval on content
4. Document any requested changes

## Common Pitfalls

### 1. Name Mismatches

**Problem:** Program or stage names don't match exactly between files

**Symptoms:**
- `❌ Program X not found`
- `❌ Stage Y not found`

**Solution:**
- Copy/paste names instead of retyping
- Use exact same capitalization
- Check for extra spaces
- Validate before seeding

### 2. YAML Syntax Errors

**Problem:** Invalid YAML formatting

**Symptoms:**
- `yaml.parser.ParserError`
- `expected <block end>`
- `mapping values not allowed`

**Solution:**
- Validate frequently during editing
- Use YAML-aware editor
- Escape special characters
- Use consistent indentation (spaces, not tabs)

### 3. Truncated Instructions

**Problem:** Instructions appear cut off in database

**Symptoms:**
- Instructions end mid-sentence
- Missing sections

**Solution:**
- Use `|` for multi-line strings
- Check character limits
- Verify in database after seeding

### 4. Broken URLs

**Problem:** Resource URLs don't work

**Symptoms:**
- 404 errors
- Access denied
- Wrong content

**Solution:**
- Test every URL before committing
- Use full URLs (include https://)
- Verify access permissions
- Keep URL list for future reference

### 5. Wrong Task Types

**Problem:** Tasks have inappropriate types

**Symptoms:**
- Video task marked as READING
- Assignment marked as VIDEO

**Solution:**
- Review TaskType options
- Choose most specific type
- Be consistent across similar tasks

### 6. Unrealistic Durations

**Problem:** Estimated durations are too short or too long

**Symptoms:**
- User complaints about time
- Poor completion rates

**Solution:**
- Test tasks yourself
- Add buffer time
- Consider user experience level
- Review industry standards

### 7. Vague Instructions

**Problem:** Instructions lack specific steps

**Symptoms:**
- Users confused about what to do
- High support requests

**Solution:**
- Follow 4-section format
- Number specific steps
- Include examples
- Test with someone unfamiliar

## Troubleshooting Guide

### Seed Script Errors

**Error:** `Cannot find module 'js-yaml'`

**Solution:**
```bash
npm install
```

**Error:** `❌ Team X not found in created teams`

**Solution:**
- Add team to `teams-and-users.yml`
- Verify team name matches exactly

**Error:** `❌ Program X not found for team Y`

**Solution:**
- Check program name matches exactly
- Verify program file is in programFiles array
- Ensure program seeded before tasks

**Error:** `yaml.parser.ParserError: expected <block end>`

**Solution:**
- Check for unescaped quotes/apostrophes
- Wrap string in quotes
- Validate YAML syntax

### Database Issues

**Issue:** Tasks not appearing in UI

**Solution:**
1. Check task status (should be ACTIVE)
2. Verify stage is ACTIVE
3. Verify program is ACTIVE
4. Check database queries

**Issue:** Instructions truncated

**Solution:**
1. Check field length limits
2. Use `|` for multi-line strings
3. Verify in database directly

**Issue:** Resources not displaying

**Solution:**
1. Check JSON structure in database
2. Verify resources field is not null
3. Check frontend resource rendering

### Validation Errors

**Issue:** Task count doesn't match spec

**Solution:**
1. Recount tasks in spec
2. Check for duplicate tasks
3. Verify all stages included

**Issue:** YAML won't validate

**Solution:**
1. Check indentation (use spaces)
2. Look for special characters
3. Validate section by section
4. Use online YAML validator

## Best Practices

### Content Best Practices

1. **Be User-Centric**
   - Write for the end user
   - Use clear, simple language
   - Avoid jargon
   - Provide context

2. **Be Specific**
   - Number steps clearly
   - Include examples
   - Define terms
   - Set expectations

3. **Be Consistent**
   - Use same format throughout
   - Maintain consistent tone
   - Follow naming conventions
   - Use standard terminology

4. **Be Actionable**
   - Start with verbs
   - Make steps concrete
   - Provide resources
   - Enable success

### Technical Best Practices

1. **Version Control**
   - Use descriptive branch names
   - Commit frequently
   - Write clear commit messages
   - Tag releases

2. **Validation**
   - Validate YAML frequently
   - Test URLs regularly
   - Verify in database
   - Spot check in UI

3. **Documentation**
   - Update CHANGELOG
   - Document decisions
   - Note special cases
   - Keep handoff notes

4. **Testing**
   - Test in development first
   - Verify in staging
   - Spot check in production
   - Get user feedback

### Process Best Practices

1. **Planning**
   - Review spec thoroughly
   - Estimate time realistically
   - Identify risks early
   - Communicate timeline

2. **Execution**
   - Follow checklist
   - Validate frequently
   - Take breaks
   - Ask for help

3. **Quality**
   - Self-review first
   - Get peer review
   - Test thoroughly
   - Get client approval

4. **Deployment**
   - Deploy to staging first
   - Verify thoroughly
   - Have rollback plan
   - Monitor after deployment

## Case Study: GFI New Agent School

### Overview

**Client:** Global Financial Impact (GFI)
**Program:** New Agent School
**Complexity:** Medium-High
**Duration:** 35 days across 4 stages
**Tasks:** 26 tasks with detailed instructions

### Challenges

1. **Long Instructions:** Tasks had 1200-2000 character instructions
2. **Multiple Resources:** Each task had 2-5 resources with URLs
3. **AI Context:** Separate AI assistant context needed extraction
4. **Multiple Stages:** 4 distinct stages with different focuses

### Approach

1. **Extracted AI Context First**
   - Created `GFI-AI-Assistant-Resources.md`
   - Separated AI requirements from user instructions
   - Kept AI context for future reference

2. **Defined Clear Stage Structure**
   - Week 1: Foundation and licensing prep
   - Week 2: Business building basics
   - Week 3: Lead qualification and scripts
   - Field Training: Hands-on experience

3. **Used Enhanced Resource Format**
   - All resources with name and URL
   - Descriptive action names
   - Verified all URLs working

4. **Followed 4-Section Format**
   - Consistent instruction structure
   - Clear steps for each task
   - Specific outcomes defined

### Results

✅ 26 tasks successfully converted
✅ All YAML validated correctly
✅ Seed script ran without errors
✅ Database verification passed
✅ Client approved content
✅ Deployed to production

### Lessons Learned

1. **Extract AI Context Early:** Separating AI context made instructions cleaner
2. **Validate Frequently:** Caught YAML errors early
3. **Test URLs:** Found several broken links before deployment
4. **Follow Format:** 4-section format improved clarity
5. **Get Feedback:** Peer review caught several issues

### Files to Reference

- Program: `config/seed-data/programs/gfi-new-agent-school-program.yml`
- Tasks: `config/seed-data/tasks/gfi-new-agent-school-tasks.yml`
- AI Context: `config/seed-data/GFI-AI-Assistant-Resources.md`

## Additional Resources

### Internal Documentation

- **README:** `config/seed-data/README.md`
- **Conversion Checklist:** `config/seed-data/CONVERSION-CHECKLIST.md`
- **Resource Format:** `config/seed-data/RESOURCES-FORMAT.md`
- **Templates:** `config/seed-data/templates/`

### External Resources

- YAML Syntax: https://yaml.org/
- Markdown Guide: https://www.markdownguide.org/
- Git Basics: https://git-scm.com/book/en/v2

### Support

For questions or issues:
1. Check this playbook
2. Review example files (GFI program)
3. Consult with team lead
4. Contact development team

## Appendix: Quick Reference

### Common Commands

```bash
# Validate YAML
python3 -c "import yaml; yaml.safe_load(open('file.yml')); print('✅ Valid')"

# Count tasks
python3 -c "import yaml; data = yaml.safe_load(open('tasks.yml')); print(f'{len(data[\"tasks\"])} tasks')"

# Run seed script
npm run seed

# Create branch
git checkout -b client-name-program

# Commit changes
git add .
git commit -m "feat: Add [client] program"

# Create PR
git push origin branch-name
gh pr create
```

### TaskType Quick Reference

| Type | Use For |
|------|---------|
| READING | Articles, docs |
| VIDEO | Videos, recordings |
| QUIZ | Tests, assessments |
| ASSIGNMENT | Projects, submissions |
| MEETING | Meetings, calls |
| SHADOWING | Observing others |
| PRACTICE | Skills practice |
| CERTIFICATION | Exams, certs |
| COACHING | 1-on-1 coaching |
| TRAINING | Formal training |
| NETWORKING | Networking |
| RESEARCH | Research tasks |
| OTHER | Everything else |

### Instruction Template

```markdown
**What this means:**
[Context]

**What you'll do:**
[Goals]

**How to do it:**
1. [Step]
2. [Step]
3. [Step]

**What you'll achieve:**
[Outcomes]
```

### Resource Template

```yaml
resources:
  actions:
    - name: 'Descriptive Action Name'
      url: 'https://example.com/resource'
```
