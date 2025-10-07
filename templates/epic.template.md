---
name: Epic
about: Create an epic to organize multiple related issues
title: "[Epic] {{EPIC_TITLE}}"
labels: ["epic", "{{PHASE}}"]
assignees: {{ASSIGNEES}}
---

# [Epic] {{EPIC_TITLE}}

{{EPIC_DESCRIPTION}}

{{EPIC_GOALS}}

## Child Issues

1. #{{CHILD_ISSUE_1}}
2. #{{CHILD_ISSUE_2}}
3. #{{CHILD_ISSUE_3}}

## Current State

{{CURRENT_STATE}}

## Dependencies
- **Depends on:** #{{DEPENDENCY_EPICS}}
- **Blocks:** #{{BLOCKED_EPICS}}

## Success Criteria

1. {{SUCCESS_CRITERION_1}}
2. {{SUCCESS_CRITERION_2}}
3. {{SUCCESS_CRITERION_3}}

## Acceptance Criteria

- [ ] All feature issues completed and merged
- [ ] Unit tests pass with >35% coverage
- [ ] Integration tests pass
- [ ] Documentation updated
- [ ] Code reviewed and approved
- [ ] Deployed to staging and validated
- [ ] Ready for production deployment

---

**Related Release:** [Current Release](../milestones/current-release.md)  
**Related Spec:** [{{SPEC_NAME}}](../context/specs/{{SPEC_FILE}})  
