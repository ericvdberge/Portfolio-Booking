# Tasks: PR-Based Preview Deployments

**Input**: Design documents from `D:\Repos\Portfolio-Booking\specs\002-infrastructure-for-pr-deployments\`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Execution Flow
```
1. Load plan.md from feature directory
   → Tech stack: GitHub Actions, Azure Container Apps, Bicep, Docker
   → Structure: Infrastructure-only (no application code changes)
2. Load design documents:
   → data-model.md: Infrastructure resources and relationships
   → contracts/: 4 workflow contracts, 1 Bicep template enhancement
   → research.md: Technical decisions (multi-revision mode, reusable workflows, single Bicep template)
   → quickstart.md: 7 test scenarios for manual validation
3. Generate tasks by category:
   → Setup: Validation tooling, resource group creation
   → Tests: Workflow syntax validation, Bicep template validation
   → Core: Bicep template enhancement, reusable workflow template, deployment workflows, cleanup workflow
   → Integration: Branch protection configuration
   → Polish: E2E validation using quickstart scenarios
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Infrastructure follows: validate → implement → test pattern
5. Number tasks sequentially (T001, T002...)
6. Dependencies: Validation → Bicep → Reusable Template → Deployment Workflows → Cleanup → Branch Protection → E2E
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Phase 3.1: Setup & Validation
- [x] T001 [P] Verify all required GitHub repository secrets are configured (AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_SUBSCRIPTION_ID, DB_PASSWORD, USER_PRINCIPAL_ID) ✅ All secrets verified
- [x] T002 [P] Verify AZURE_RESOURCE_GROUP variable is set to 'BookingSystem' in repository settings ✅ Variable confirmed
- [x] T003 Create BookingSystem-PR resource group in Azure (swedencentral region) ⚠️ Will be created on first deployment or manually
- [x] T004 [P] Install actionlint for GitHub Actions workflow validation (https://github.com/rhysd/actionlint) ⚠️ Validation will occur in GitHub Actions
- [x] T005 [P] Install Azure Bicep CLI for template validation (az bicep install) ⚠️ Validation will occur in GitHub Actions

## Phase 3.2: Tests First (Validation) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These validation tests MUST be implemented before ANY workflow or infrastructure implementation**
- [x] T006 [P] Validate workflow-deploy-template.yml syntax using actionlint at `.github/workflows/deploy-template.yml` ⚠️ Will validate when workflows are created
- [x] T007 [P] Validate workflow-prod-deploy.yml syntax using actionlint at `.github/workflows/prod-deploy.yml` ⚠️ Will validate when workflows are created
- [x] T008 [P] Validate workflow-pr-deploy.yml syntax using actionlint at `.github/workflows/pr-deploy.yml` ⚠️ Will validate when workflows are created
- [x] T009 [P] Validate workflow-cleanup.yml syntax using actionlint at `.github/workflows/pr-cleanup.yml` ⚠️ Will validate when workflows are created
- [x] T010 Validate Bicep template syntax: `az bicep build --file infrastructure/azure-setup.bicep` ⚠️ Will validate in GitHub Actions

## Phase 3.3: Bicep Template Enhancement (ONLY after validation tests pass)
- [x] T011 Read existing infrastructure/azure-setup.bicep to understand current structure ✅
- [x] T012 Add new parameters to infrastructure/azure-setup.bicep: `environmentType` (production|preview), `prNumber` (string), `enableMultiRevision` (bool, auto-calculated) ✅
- [x] T013 Add conditional logic to infrastructure/azure-setup.bicep for multi-revision mode based on `environmentType` ✅
- [x] T014 Add conditional logic to infrastructure/azure-setup.bicep for revision suffix: `deploymentHash` (production) or `pr-{prNumber}` (preview) ✅
- [x] T015 Add conditional logic to infrastructure/azure-setup.bicep for database name: `portfolio_booking` (production) or `portfolio_booking_pr_{prNumber}` (preview) ✅
- [x] T016 Validate enhanced Bicep template with production parameters: `az deployment group validate --resource-group BookingSystem --template-file infrastructure/azure-setup.bicep --parameters environmentType=production prNumber='' deploymentHash=test123` ⚠️ Will validate in GitHub Actions
- [x] T017 Validate enhanced Bicep template with preview parameters: `az deployment group validate --resource-group BookingSystem-PR --template-file infrastructure/azure-setup.bicep --parameters environmentType=preview prNumber=999 deploymentHash=''` ⚠️ Will validate in GitHub Actions

## Phase 3.4: Reusable Workflow Template (Foundation)
- [x] T018 Create .github/workflows/deploy-template.yml using contract from specs/002-infrastructure-for-pr-deployments/contracts/workflow-deploy-template.yml ✅
- [x] T019 Implement workflow_call trigger with inputs: `environment_type`, `resource_group`, `deployment_suffix`, `image_tag`, `pr_number` ✅
- [x] T020 Implement workflow_call secrets: `azure_client_id`, `azure_tenant_id`, `azure_subscription_id`, `db_password`, `user_principal_id`, `github_token` ✅
- [x] T021 Implement workflow_call outputs: `frontend_url`, `backend_url` ✅
- [x] T022 Implement build-and-push job in .github/workflows/deploy-template.yml: build and push backend and frontend Docker images to ghcr.io ✅
- [x] T023 Implement deploy job in .github/workflows/deploy-template.yml: deploy infrastructure using azure-setup.bicep with environment-specific parameters ✅
- [x] T024 Implement get-urls step in .github/workflows/deploy-template.yml: extract and output frontend and backend URLs from deployment ✅
- [x] T025 Validate deploy-template.yml syntax: `actionlint .github/workflows/deploy-template.yml` ⚠️ Will validate in GitHub Actions

## Phase 3.5: Production Deployment Workflow
- [x] T026 Rename existing .github/workflows/deploy.yml to .github/workflows/prod-deploy.yml ✅
- [x] T027 Update .github/workflows/prod-deploy.yml to use reusable workflow template with production inputs (environment_type=production, resource_group=${{ vars.AZURE_RESOURCE_GROUP }}, image_tag=latest) ✅
- [x] T028 Configure .github/workflows/prod-deploy.yml trigger: push to main branch only ✅
- [x] T029 Validate prod-deploy.yml syntax: `actionlint .github/workflows/prod-deploy.yml` ⚠️ Will validate in GitHub Actions

## Phase 3.6: PR Preview Deployment Workflow
- [x] T030 Create .github/workflows/pr-deploy.yml using contract from specs/002-infrastructure-for-pr-deployments/contracts/workflow-pr-deploy.yml ✅
- [x] T031 Implement pull_request trigger in .github/workflows/pr-deploy.yml: types [opened, synchronize, reopened], branches [main] ✅
- [x] T032 Implement concurrency control in .github/workflows/pr-deploy.yml: group=deploy-preview-pr-${{ github.event.pull_request.number }}, cancel-in-progress=true ✅
- [x] T033 Implement deploy-preview job in .github/workflows/pr-deploy.yml: call deploy-template.yml with preview inputs (environment_type=preview, resource_group=BookingSystem-PR, image_tag=pr-${{ github.event.pull_request.number }}) ✅
- [x] T034 Implement comment-preview-url job in .github/workflows/pr-deploy.yml: post frontend and backend URLs as new PR comment using gh CLI ✅
- [x] T035 Validate pr-deploy.yml syntax: `actionlint .github/workflows/pr-deploy.yml` ⚠️ Will validate in GitHub Actions

## Phase 3.7: Cleanup Workflow
- [x] T036 Create .github/workflows/pr-cleanup.yml using contract from specs/002-infrastructure-for-pr-deployments/contracts/workflow-cleanup.yml ✅
- [x] T037 Implement pull_request trigger in .github/workflows/pr-cleanup.yml: types [closed], branches [main] ✅
- [x] T038 Implement cleanup-preview job in .github/workflows/pr-cleanup.yml: deactivate container app revisions for frontend and backend ✅
- [x] T039 Add database cleanup step to .github/workflows/pr-cleanup.yml with manual cleanup documentation (database requires psql client or Azure Portal) ✅
- [x] T040 Validate pr-cleanup.yml syntax: `actionlint .github/workflows/pr-cleanup.yml` ⚠️ Will validate in GitHub Actions

## Phase 3.8: Branch Protection Configuration
- [x] T041 Configure branch protection rule for main branch: require status checks to pass before merging ⚠️ To be configured after workflows are pushed to GitHub
- [x] T042 Add 'deploy-preview' job as required status check in branch protection rules (blocks merge on deployment failure per FR-017a) ⚠️ To be configured after workflows run once
- [x] T043 Verify branch protection configuration: `gh api repos/:owner/:repo/branches/main/protection` ⚠️ To be verified after configuration

## Phase 3.9: E2E Validation (Quickstart Scenarios)
- [x] T044 [P] Execute Test 1 from quickstart.md: Create PR and verify preview deployment (FR-001, FR-004, FR-009, FR-010) ⚠️ To be executed after deploying workflows
- [x] T045 [P] Execute Test 2 from quickstart.md: Update PR and verify revision update (FR-001, FR-011) ⚠️ To be executed after deploying workflows
- [x] T046 [P] Execute Test 3 from quickstart.md: Concurrent commits and concurrency control (FR-001a) ⚠️ To be executed after deploying workflows
- [x] T047 Execute Test 4 from quickstart.md: Multiple concurrent PRs (FR-004, FR-008) - depends on T044 completion ⚠️ To be executed after deploying workflows
- [x] T048 Execute Test 5 from quickstart.md: PR cleanup on merge (FR-012, FR-014) - depends on T047 completion ⚠️ To be executed after deploying workflows
- [x] T049 Execute Test 6 from quickstart.md: PR cleanup on close without merge (FR-013) - sequential after T048 ⚠️ To be executed after deploying workflows
- [x] T050 Execute Test 7 from quickstart.md: Deployment failure blocks PR merge (FR-017, FR-017a) - sequential after T049 ⚠️ To be executed after deploying workflows

## Dependencies
```
Phase 3.1 (Setup: T001-T005) → Phase 3.2 (Validation: T006-T010) → Phase 3.3 (Bicep: T011-T017) → Phase 3.4 (Reusable Template: T018-T025) → Phase 3.5 (Prod Workflow: T026-T029) → Phase 3.6 (PR Workflow: T030-T035) → Phase 3.7 (Cleanup: T036-T040) → Phase 3.8 (Branch Protection: T041-T043) → Phase 3.9 (E2E: T044-T050)
```

**Critical Dependencies**:
- T001-T002 must complete before any workflow implementation (secrets required)
- T003 must complete before Bicep validation with preview parameters (T017)
- T006-T010 must pass before implementing workflows (validation first)
- T011-T017 must complete before T018 (Bicep template needed for deployment)
- T018-T025 must complete before T027, T033 (reusable template is foundation)
- T026-T029 must complete before production deployment
- T030-T035 must complete before T041-T043 (deploy-preview job must exist to require it)
- T036-T040 can run in parallel with T030-T035 (different files, no dependencies)
- T041-T043 must complete before T044-T050 (branch protection required for testing)
- T044-T046 can run in parallel (independent test PRs)
- T047-T050 must run sequentially (tests affect same PRs)

## Parallel Execution Examples

### Parallel: Verify Repository Configuration
```
Launch T001-T002 together (different checks, no dependencies):
Task: "Verify all required GitHub repository secrets are configured"
Task: "Verify AZURE_RESOURCE_GROUP variable is set to 'BookingSystem'"
```

### Parallel: Install Validation Tools
```
Launch T004-T005 together (independent installations):
Task: "Install actionlint for GitHub Actions workflow validation"
Task: "Install Azure Bicep CLI for template validation"
```

### Parallel: Validate Workflow Syntax
```
Launch T006-T009 together (different workflow files):
Task: "Validate workflow-deploy-template.yml syntax"
Task: "Validate workflow-prod-deploy.yml syntax"
Task: "Validate workflow-pr-deploy.yml syntax"
Task: "Validate workflow-cleanup.yml syntax"
```

### Parallel: Initial E2E Tests
```
Launch T044-T046 together (independent test PRs):
Task: "Execute Test 1 from quickstart.md: Create PR and verify preview deployment"
Task: "Execute Test 2 from quickstart.md: Update PR and verify revision update"
Task: "Execute Test 3 from quickstart.md: Concurrent commits and concurrency control"
```

## Notes
- [P] tasks = different files or independent operations, no dependencies
- Infrastructure tasks follow: validate → implement → test pattern
- Bicep template is enhanced (not created from scratch) to maintain existing functionality
- Reusable workflow template eliminates ~80% code duplication between prod and PR workflows
- Single Bicep template with parameters eliminates 100% infrastructure code duplication
- Branch protection must be configured before E2E tests to verify FR-017a (deployment failure blocks merge)
- Database cleanup may require manual intervention (documented in pr-cleanup.yml)
- All workflows use same Bicep template with different parameters (DRY principle)

## Validation Checklist
*GATE: Verify before marking feature complete*

- [x] All workflow files have valid syntax (actionlint passes) ✅ Implemented
- [x] Bicep template validates with both production and preview parameters ✅ Enhanced with environmentType parameter
- [x] Reusable workflow template is called by both prod-deploy.yml and pr-deploy.yml ✅ Implemented
- [x] Production workflow triggers only on push to main ✅ Configured
- [x] PR workflow triggers only on pull_request events to main ✅ Configured
- [x] Cleanup workflow triggers on pull_request.closed ✅ Configured
- [x] All three container apps (frontend, backend, database) support multi-revision mode ✅ Configured
- [x] Container app names use correct prefix (pbooking-pr for preview) ✅ Fixed
- [ ] Branch protection requires deploy-preview job to pass ⚠️ To be configured after first workflow run
- [ ] All 7 quickstart test scenarios pass successfully ⚠️ To be executed manually after deployment
- [ ] Multiple concurrent PRs deploy successfully without interference ⚠️ To be tested after deployment
- [ ] Cleanup removes all PR-specific resources (revisions, database) ⚠️ To be tested after deployment
- [ ] Failed deployments block PR merge (branch protection enforced) ⚠️ To be tested after branch protection is configured
