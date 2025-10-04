
# Implementation Plan: PR-Based Preview Deployments

**Branch**: `002-infrastructure-for-pr-deployments` | **Date**: 2025-10-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `D:\Repos\Portfolio-Booking\specs\002-infrastructure-for-pr-deployments\spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Implement automated PR-based preview deployments for the booking system. When a PR is opened against main, deploy an isolated preview environment to Azure Container Apps in the BookingSystem-PR resource group with a unique URL. When the PR is updated, update the preview. When merged/closed, clean up the preview resources. Production deployments to the BookingSystem resource group only occur on merge to main.

## Technical Context
**Language/Version**: ASP.NET Core (C# .NET 8+), Next.js 15 (TypeScript), Bicep (infrastructure)
**Primary Dependencies**: GitHub Actions, Azure Container Apps, Azure CLI, Docker, PostgreSQL 15
**Storage**: Azure File Share (database persistence), Azure Key Vault (secrets), PostgreSQL (application data)
**Testing**: GitHub Actions workflow validation, deployment smoke tests
**Target Platform**: Azure Container Apps (Linux containers), GitHub-hosted runners (ubuntu-latest)
**Project Type**: web (frontend + backend + database + infrastructure)
**Performance Goals**: Deployment completion within 10 minutes, URL availability within 30 seconds of deployment success
**Constraints**: Multiple concurrent PRs supported (multi-revision container apps), public access to preview URLs, automatic cleanup required, must block PR merge on deployment failure
**Scale/Scope**: Support up to 20 concurrent PR deployments, 3 container apps per environment (frontend, backend, database)

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle 1: Clean Architecture Separation ✅
**Status**: PASS
**Analysis**: This feature is purely infrastructure/DevOps. No changes to domain, application, or API layers. Changes limited to:
- GitHub Actions workflows (CI/CD orchestration)
- Bicep templates (infrastructure as code)
- No violation of architectural boundaries

### Principle 2: Domain-Centric Design ✅
**Status**: PASS
**Analysis**: No business logic changes. Feature manages deployment infrastructure, not domain models or business rules. Domain layer remains untouched.

### Principle 3: Vertical Slice Architecture ✅
**Status**: PASS
**Analysis**: No application layer changes. Existing vertical slices remain independent. Feature only affects deployment infrastructure.

### Principle 4: Frontend Component Architecture ✅
**Status**: PASS
**Analysis**: No frontend code changes required. Preview environments receive the same frontend build as production, just deployed to different URLs. Frontend continues to use `NEXT_PUBLIC_API_URL` configured at build time.

### Principle 5: Testability First ⚠️
**Status**: CONDITIONAL PASS
**Analysis**: Infrastructure changes require different testing approach:
- Unit tests: N/A (infrastructure code)
- Integration tests: Deployment workflow validation, smoke tests for deployed environments
- E2E tests: Verify preview URL accessibility, verify cleanup on PR close
**Requirement**: Must add GitHub Actions workflow validation and deployment verification steps

### Principle 6: API Contract Clarity ✅
**Status**: PASS
**Analysis**: No API contract changes. Preview environments deploy the same API as production with the same contracts.

### Summary
**Overall**: PASS (with testing requirements)
**Violations**: None
**Notes**: Feature is infrastructure-only. Constitutional principles designed for application code remain honored. Testing strategy must be adapted for infrastructure validation (workflow tests, deployment smoke tests).

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
.github/
└── workflows/
    ├── deploy-template.yml  # New: Reusable workflow template (shared deployment logic)
    ├── prod-deploy.yml      # New: Production deployment (merge to main)
    ├── pr-deploy.yml        # New: PR preview deployment (PR events)
    └── pr-cleanup.yml       # New: PR cleanup workflow

infrastructure/
└── azure-setup.bicep        # Modified: Add parameters for multi-revision mode and environment type

backend/
├── Booking.Api/
│   ├── Dockerfile          # No changes (existing)
│   └── Booking.Api.csproj  # No changes
├── Booking.Application/    # No changes
├── Booking.Domain/         # No changes
└── Booking.Infrastructure/ # No changes

frontend/
├── Dockerfile              # No changes (existing)
├── src/                    # No changes
└── package.json            # No changes
```

**Structure Decision**: Web application (Option 2). This feature adds/modifies infrastructure and CI/CD files only:
- **GitHub Actions workflows**: Orchestrate PR preview deployments and cleanup using reusable workflow pattern
- **Reusable workflow template**: Eliminates ~80% code duplication between prod and PR workflows
- **Single Bicep template**: Reused for both prod and PR with different parameters (no duplicate infrastructure code)
- **No application code changes**: Backend and frontend remain unchanged

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType claude`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Infrastructure tasks follow: validate → implement → test pattern
- Each contract → validation task (syntax check) → implementation task → integration test
- Workflow contracts → YAML validation → workflow file creation → E2E test
- Bicep contracts → template validation → template creation → deployment test
- Cleanup workflow → validation → implementation → test

**Ordering Strategy**:
- **Phase 1: Validation** (can run in parallel [P])
  - Bicep syntax validation setup
  - Workflow YAML validation setup
- **Phase 2: Bicep Template Enhancement** (sequential)
  - Add parameters to azure-setup.bicep for environment type and multi-revision mode
  - Add conditional logic for production vs preview environments
  - Validate enhanced template syntax
  - Test template with both production and preview parameters
- **Phase 4: Reusable Workflow Template** (sequential - foundation)
  - Create deploy-template.yml (reusable workflow with shared logic)
  - Implement build, push, login, and deploy steps
  - Add inputs for environment-specific configuration
  - Validate template syntax
- **Phase 5: Production Deployment Workflow** (sequential - depends on template)
  - Rename deploy.yml to prod-deploy.yml
  - Configure to call deploy-template.yml with production inputs
  - Add trigger: push to main only
  - Test prod-deploy.yml deployment
- **Phase 6: PR Preview Deployment Workflow** (sequential - depends on template)
  - Create pr-deploy.yml calling deploy-template.yml with PR inputs
  - Add trigger: pull_request events (opened, synchronize, reopened)
  - Add concurrency control (cancel-in-progress)
  - Add PR commenting logic
  - Test pr-deploy.yml with test PR
- **Phase 7: Cleanup Workflow** (sequential)
  - Implement pr-cleanup.yml
  - Test pr-cleanup.yml with test PR
- **Phase 8: Branch Protection** (final step)
  - Configure branch protection rules
  - Verify deploy-preview blocks merge
- **Phase 9: E2E Validation** (final validation)
  - Run quickstart validation scenarios
  - Verify all functional requirements

**Task Dependencies**:
```
Phase 1 (Validation) → Phase 2 (Bicep Enhancement) → Phase 4 (Reusable Template) → Phase 5 (Prod Workflow) → Phase 6 (PR Workflow) → Phase 7 (Cleanup) → Phase 8 (Branch Protection) → Phase 9 (E2E)
```

**Estimated Output**: 22-25 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (N/A - no violations)

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*
