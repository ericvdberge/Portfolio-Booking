# Feature Specification: PR-Based Preview Deployments

**Feature Branch**: `002-we-have-a`
**Created**: 2025-10-04
**Status**: Draft
**Input**: User description: "we have a deploy workflow for github. i only want to perform this on merge to main, because this is the \"production\" saas. I want to create a new deployments for all prs that have its own PR-id and i want it to deploy to the BookingSystem-PR resource group. I want to make a container app environment with container apps like we already have in the bicep, but allow multiple container revisions on the container app, so we can create multiple versions for every PR. When creating a PR, we want to create that version, deploy it and get its own url. i want the frontend url to be commented in the PR. and we should remove the revision on all container apps when the PR is merged."

## Execution Flow (main)
```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements
- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation
When creating this spec from a user prompt:
1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question] for any assumption you'd need to make
2. **Don't guess**: If the prompt doesn't specify something (e.g., "login system" without auth method), mark it
3. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
4. **Common underspecified areas**:
   - User types and permissions
   - Data retention/deletion policies
   - Performance targets and scale
   - Error handling behaviors
   - Integration requirements
   - Security/compliance needs

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As a developer working on the booking system, I want to create a pull request and automatically receive a unique, isolated preview deployment so that I can test my changes in a production-like environment and share the preview URL with reviewers before merging to production.

### Acceptance Scenarios
1. **Given** a developer creates a new pull request against the main branch, **When** the pull request is opened, **Then** an isolated preview environment is automatically deployed with a unique URL for the frontend
2. **Given** a pull request has been deployed to a preview environment, **When** the preview deployment completes successfully, **Then** a comment is automatically added to the pull request containing the frontend preview URL
3. **Given** a pull request with an active preview deployment, **When** new commits are pushed to the pull request branch, **Then** the preview deployment is updated with the new changes
4. **Given** multiple pull requests are open simultaneously, **When** each pull request is deployed, **Then** each receives its own isolated preview environment with a unique URL
5. **Given** a pull request with an active preview deployment, **When** the pull request is merged or closed, **Then** the associated preview environment and all its resources are automatically cleaned up
6. **Given** a commit is pushed directly to the main branch or a pull request is merged, **When** the deployment workflow runs, **Then** the production environment is updated (not a preview environment)

## Clarifications

### Session 2025-10-04
- Q: When a PR preview deployment fails, how should the system respond? → A: Block PR until fixed - prevent any PR actions until deployment succeeds
- Q: Who should have access to preview environments? → A: Public - anyone with the URL can access
- Q: How should preview environment databases be initialized? → A: API migrates and seeds on startup
- Q: When updating a PR comment with a new preview URL, should the system create a new comment or update the existing one? → A: Create new - add a new comment for each update
- Q: When multiple commits are pushed rapidly to the same PR, how should deployments be handled? → A: Cancel in-progress - stop current deployment and start new one

### Edge Cases
- What happens when a pull request is reopened after being closed? Should the preview deployment be recreated?
- What happens if the deployment to the preview environment fails? The PR must be blocked until the deployment succeeds
- What happens when a pull request has been open for an extended period? Should preview deployments have an automatic expiration or cleanup policy? [NEEDS CLARIFICATION: retention policy for long-running PRs]
- What happens if multiple commits are pushed rapidly to the same pull request? The in-progress deployment must be cancelled and a new deployment started for the latest commit
- What happens if the cleanup process fails when a PR is closed/merged? Should there be a manual cleanup mechanism or automatic retry?
- What happens when the maximum number of container revisions is reached? How should old revisions be pruned? [NEEDS CLARIFICATION: revision limit and pruning strategy]

## Requirements *(mandatory)*

### Functional Requirements

**Deployment Triggering**
- **FR-001**: System MUST trigger preview deployments only when a pull request is opened or updated against the main branch
- **FR-001a**: System MUST cancel any in-progress preview deployment and start a new deployment when new commits are pushed to an active pull request
- **FR-002**: System MUST trigger production deployments only when changes are merged to the main branch
- **FR-003**: System MUST NOT trigger production deployments when pull requests are opened or updated
- **FR-003a**: System MUST use a reusable workflow template to share common deployment logic between production and preview deployments, minimizing code duplication

**Preview Environment Isolation**
- **FR-004**: System MUST create a separate preview environment for each pull request with a unique identifier based on the PR number
- **FR-005**: System MUST deploy all preview environments to a dedicated resource group (BookingSystem-PR)
- **FR-006**: System MUST deploy the production environment to a separate resource group from preview environments [NEEDS CLARIFICATION: production resource group name]
- **FR-007**: System MUST ensure each preview environment includes all necessary container apps (frontend, backend, database) as defined in the infrastructure configuration
- **FR-008**: System MUST enable multiple concurrent revisions on container apps to support multiple active pull requests simultaneously

**Preview URL Management**
- **FR-009**: System MUST generate a unique, publicly accessible URL for each preview environment's frontend
- **FR-010**: System MUST automatically post a comment to the pull request containing the frontend preview URL upon successful deployment
- **FR-011**: System MUST create a new comment with the updated preview URL each time the preview deployment is updated (do not edit existing comments)

**Resource Cleanup**
- **FR-012**: System MUST automatically remove all container app revisions associated with a pull request when the pull request is merged
- **FR-013**: System MUST automatically remove all container app revisions associated with a pull request when the pull request is closed without merging
- **FR-014**: System MUST ensure cleanup occurs for all container apps in the preview environment (frontend, backend, database)
- **FR-015**: System MUST complete cleanup before the pull request merge/close operation is finalized [NEEDS CLARIFICATION: should cleanup be blocking or asynchronous?]

**Deployment Tracking**
- **FR-016**: System MUST provide deployment status visibility within the pull request (in-progress, success, failure)
- **FR-017**: System MUST provide logs and error details when preview deployments fail
- **FR-017a**: System MUST block pull request merge and review actions when preview deployment fails until the deployment succeeds
- **FR-018**: System MUST maintain a record of which preview deployments are currently active [NEEDS CLARIFICATION: where should this record be maintained?]

**Security and Access Control**
- **FR-019**: System MUST make preview environments publicly accessible to anyone with the preview URL (no authentication required for access)
- **FR-020**: System MUST use the same authentication and authorization mechanisms in preview environments as production
- **FR-021**: System MUST allow the API to handle database schema migration and data seeding automatically on startup for each preview environment

### Key Entities

- **Preview Environment**: Represents an isolated deployment associated with a specific pull request, containing all necessary application components (frontend, backend, database) with a unique identifier derived from the PR number
- **Container Revision**: Represents a specific version of a container app deployment within a preview environment, allowing multiple versions to coexist for different pull requests
- **Preview URL**: The unique, publicly accessible web address for accessing a specific preview environment's frontend application
- **Resource Group**: The organizational container for all preview environment resources, separate from production resources
- **Deployment Workflow**: The automated process that orchestrates building, deploying, and managing preview environments in response to pull request events

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [ ] No [NEEDS CLARIFICATION] markers remain
- [ ] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [ ] Dependencies and assumptions identified

---

## Execution Status
*Updated by main() during processing*

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [ ] Review checklist passed

---
