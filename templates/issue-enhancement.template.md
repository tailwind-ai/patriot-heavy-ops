---
name: Enhancement
about: New feature or feature improvement
title: "[{{ISSUE_NUMBER}} of {{TOTAL_ISSUES}}] {{ENHANCEMENT_TITLE}}"
labels: ["enhancement", "{{ISSUE_SIZE}}", "{{RISK_LEVEL}}", "{{HUMAN_OR_AI}}"]
assignees: {{ASSIGNEES}}
---

# [{{ISSUE_NUMBER}} of {{TOTAL_ISSUES}}] {{ENHANCEMENT_TITLE}}

## Overview & User Story

{{OVERVIEW}}

**As a** {{USER_ROLE}}  
**I want** {{USER_WANT}}  
**So that** {{USER_BENEFIT}}

## Acceptance Criteria

- [ ] {{ACCEPTANCE_CRITERION_1}}
- [ ] {{ACCEPTANCE_CRITERION_2}}
- [ ] {{ACCEPTANCE_CRITERION_3}}
- [ ] {{ACCEPTANCE_CRITERION_4}}

## Technical Implementation

{{TECHNICAL_IMPLEMENTATION}}

## Dependencies

- **Depends on:** #{{DEPENDENCY_ISSUES}}
- **Blocks:** #{{BLOCKED_ISSUES}}

## Definition of Done

- [ ] Code implemented and follows style guide
- [ ] All acceptance criteria met
- [ ] Unit tests written and passing (>35% coverage)
- [ ] Integration tests written and passing
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] Merged to dev branch
- [ ] Deployed to staging and validated

## Estimated Effort

**Size:** {{ISSUE_SIZE}} (Small/Medium/Large)  
**Complexity:** {{COMPLEXITY}} (Low/Medium/High)

---

**Related Epic:** #{{EPIC_NUMBER}}  
**Related Release:** [Current Release](../milestones/current-release.md)  
**Related Spec:** [{{SPEC_NAME}}](../context/specs/{{SPEC_FILE}})