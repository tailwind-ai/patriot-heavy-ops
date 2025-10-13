---
name: Bug Report
about: Report a bug or issue with existing functionality
title: "Bug: {{BUG_TITLE}}"
labels: ["bug", "{{ISSUE_SIZE}}", "{{RISK_LEVEL}}", "{{HUMAN_OR_AI}}"]
assignees: {{ASSIGNEES}}
---

# Bug: {{BUG_TITLE}}

## Overview & Impact

{{OVERVIEW}}

**Current Behavior:** {{CURRENT_BEHAVIOR}}  
**Expected Behavior:** {{EXPECTED_BEHAVIOR}}  
**Impact:** {{IMPACT}} (Critical/High/Medium/Low)

## Steps to Reproduce

1. {{STEP_1}}
2. {{STEP_2}}
3. {{STEP_3}}
4. **Observe:** {{OBSERVED_RESULT}}

## Acceptance Criteria

- [ ] Root cause identified and documented
- [ ] Bug fix implemented
- [ ] Regression tests added
- [ ] All existing tests still pass
- [ ] Verified in staging environment

## Technical Implementation

{{TECHNICAL_IMPLEMENTATION}}

**Files to modify:** {{FILES_TO_MODIFY}}  
**Root cause:** {{ROOT_CAUSE}}

## Dependencies

- **Depends on:** #{{DEPENDENCY_ISSUES}}
- **Blocks:** #{{BLOCKED_ISSUES}}
- **Related bugs:** #{{RELATED_BUGS}}

## Definition of Done

- [ ] Root cause identified and documented
- [ ] Fix implemented and follows style guide
- [ ] All acceptance criteria met
- [ ] Unit tests added to prevent regression (>35% coverage)
- [ ] All existing tests pass
- [ ] Code reviewed and approved
- [ ] Verified in staging environment
- [ ] Deployed to production
- [ ] Monitoring confirms fix is effective

## Estimated Effort

**Size:** {{ISSUE_SIZE}} (Small/Medium/Large)  
**Complexity:** {{COMPLEXITY}} (Low/Medium/High)

---

**Related Epic:** #{{EPIC_NUMBER}}  
**Related Release:** [Point Release](../milestones/point-release.md)  
**Reported By:** {{REPORTER}}  
**Reported Date:** {{REPORT_DATE}}