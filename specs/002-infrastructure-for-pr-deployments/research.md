# Research: PR-Based Preview Deployments

**Feature**: 002-infrastructure-for-pr-deployments
**Date**: 2025-10-04
**Status**: Complete

## Research Questions

### 1. Azure Container Apps Multi-Revision Mode
**Question**: How to enable and manage multiple concurrent revisions on Azure Container Apps?

**Decision**: Use `activeRevisionsMode: 'Multiple'` in container app configuration

**Rationale**:
- Azure Container Apps supports two revision modes: Single (default) and Multiple
- Multiple mode allows concurrent revisions to coexist, each with unique URLs
- Each PR deployment creates a new revision with a unique suffix (e.g., PR number)
- Traffic can be split between revisions or each accessed via specific URLs
- Revisions can be individually managed and deleted

**Implementation Details**:
```bicep
resource containerApp 'Microsoft.App/containerApps@2024-03-01' = {
  properties: {
    configuration: {
      activeRevisionsMode: 'Multiple'  // Enable multi-revision
      ingress: {
        external: true
        targetPort: 80
      }
    }
    template: {
      revisionSuffix: 'pr-${prNumber}'  // Unique suffix per PR
      containers: [...]
    }
  }
}
```

**Alternatives Considered**:
- Single revision mode with dynamic container app names: Would create too many container apps, harder to manage
- Separate container app environments per PR: Too expensive, unnecessary isolation
- Azure App Service slots: Not applicable to containerized deployments

**References**:
- Azure Container Apps revisions documentation
- Multi-revision mode enables A/B testing and blue-green deployments
- Maximum 100 revisions per container app (well above our 20 PR limit)

---

### 2. PR Number Extraction in GitHub Actions
**Question**: How to reliably extract PR number in GitHub Actions workflows?

**Decision**: Use `github.event.pull_request.number` for PR events, `github.event.number` as fallback

**Rationale**:
- GitHub Actions provides PR context in `github.event.pull_request` for PR-triggered workflows
- `github.event.pull_request.number` is the canonical PR identifier
- Works for: `pull_request`, `pull_request_target` events
- For merged PRs in `push` events, extract from commit message or use GitHub API

**Implementation Details**:
```yaml
env:
  PR_NUMBER: ${{ github.event.pull_request.number }}

jobs:
  deploy-preview:
    if: github.event_name == 'pull_request'
    steps:
      - name: Set PR suffix
        run: echo "REVISION_SUFFIX=pr-${{ github.event.pull_request.number }}" >> $GITHUB_ENV
```

**Alternatives Considered**:
- Parsing from branch name: Fragile, assumes naming convention
- Using commit SHA: Not human-readable, harder to track
- GitHub API query: Adds unnecessary API calls and complexity

---

### 3. PR Comment Automation
**Question**: How to automatically comment the preview URL on the PR?

**Decision**: Use GitHub CLI (`gh`) in GitHub Actions to create PR comments

**Rationale**:
- GitHub CLI is pre-installed on GitHub-hosted runners
- Provides simple, authenticated API access without token management
- Command: `gh pr comment <pr-number> --body "Preview URL: <url>"`
- Automatically uses `GITHUB_TOKEN` from workflow context
- Creates new comment for each update (per FR-011 requirement)

**Implementation Details**:
```yaml
- name: Comment Preview URL on PR
  env:
    GH_TOKEN: ${{ github.token }}
  run: |
    FRONTEND_URL=$(az deployment group show \
      --resource-group BookingSystem-PR \
      --name pr-${{ github.event.pull_request.number }} \
      --query properties.outputs.frontendUrl.value -o tsv)

    gh pr comment ${{ github.event.pull_request.number }} \
      --body "🚀 Preview deployment ready: $FRONTEND_URL"
```

**Alternatives Considered**:
- Direct GitHub API calls with curl: More verbose, manual token handling
- Third-party actions: Unnecessary dependency
- Updating existing comment: Violates FR-011 (create new comment each time)

---

### 4. PR Cleanup Trigger
**Question**: How to trigger cleanup workflow when PR is closed or merged?

**Decision**: Use `pull_request` event with `types: [closed]` trigger

**Rationale**:
- GitHub Actions `pull_request` event supports multiple activity types
- `closed` type triggers for both merged and closed-without-merge scenarios
- Can differentiate using `github.event.pull_request.merged` boolean
- Cleanup should happen in both cases (per FR-012, FR-013)
- Runs automatically without manual intervention

**Implementation Details**:
```yaml
name: Cleanup PR Preview

on:
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Delete PR revision
        run: |
          az containerapp revision deactivate \
            --resource-group BookingSystem-PR \
            --name pbooking-frontend \
            --revision pbooking-frontend--pr-${{ github.event.pull_request.number }}
```

**Alternatives Considered**:
- Manual cleanup: Error-prone, doesn't meet FR-012/FR-013
- Scheduled cleanup job: Delays resource deletion, wasted costs
- Webhook-based cleanup: Overengineered for this use case

---

### 5. Deployment Failure Blocking
**Question**: How to block PR merge when preview deployment fails?

**Decision**: Use GitHub branch protection rules with required status checks

**Rationale**:
- GitHub allows marking specific workflow jobs as required for merge
- Branch protection rule: Require "deploy-preview" job to pass
- Failed deployment = failed job = blocked PR merge
- Native GitHub feature, no custom enforcement needed
- Per FR-017a requirement

**Implementation Details**:
1. GitHub Actions workflow job named consistently: `deploy-preview`
2. Repository settings → Branches → Branch protection rule for `main`
3. Enable "Require status checks to pass before merging"
4. Select "deploy-preview" as required check
5. Failed deployment automatically blocks PR

**Alternatives Considered**:
- GitHub Apps/Bots: Overengineered, requires separate service
- Manual approval: Doesn't scale, human error prone
- Commit status API: More complex than branch protection

---

### 6. Infrastructure Template Strategy
**Question**: Should we create separate Bicep templates for production and preview, or reuse the same template?

**Decision**: Single Bicep template (`azure-setup.bicep`) with parameters for environment type

**Rationale**:
- **Eliminates infrastructure code duplication**: Same infrastructure, different configuration
- **Parameterized differences**: `environmentType`, `enableMultiRevision`, `prNumber`, `databaseName`
- **Conditional logic**: Use Bicep conditionals for environment-specific settings
- **Easier maintenance**: Update infrastructure once, affects both prod and preview
- **Single source of truth**: Prevents drift between production and preview infrastructure

**Implementation Details**:
```bicep
@allowed(['production', 'preview'])
param environmentType string = 'production'

param prNumber string = ''  // Required for preview, empty for production
param enableMultiRevision bool = (environmentType == 'preview')

resource backendApp 'Microsoft.App/containerApps@2024-03-01' = {
  properties: {
    configuration: {
      activeRevisionsMode: enableMultiRevision ? 'Multiple' : 'Single'
    }
    template: {
      revisionSuffix: environmentType == 'preview' ? 'pr-${prNumber}' : deploymentHash
      // ... backend config with conditional database name
    }
  }
}
```

**Key Parameters**:
- Production: `environmentType=production`, `prNumber=''`, `databaseName=portfolio_booking`
- Preview: `environmentType=preview`, `prNumber=123`, `databaseName=portfolio_booking_pr_123`

**Alternatives Considered**:
- Separate templates (pr-preview.bicep): Code duplication, maintenance burden, drift risk
- Bicep modules: Overkill for parameter-based differences
- Template per resource group: Violates DRY principle

---

### 7. Resource Group Strategy
**Question**: Should we use a single shared resource group or separate resource groups per PR?

**Decision**: Single shared resource group (BookingSystem-PR) with multi-revision container apps

**Rationale**:
- Simplified management: All preview resources in one place
- Cost tracking: Single resource group for all PR environments
- Azure limits: 980 resource groups per subscription, but 100 revisions per container app
- Easier cleanup: Delete specific revisions, not entire resource groups
- Matches existing architecture: Production uses single resource group (BookingSystem)

**Implementation Details**:
- Resource Group: `BookingSystem-PR` (pre-created or created on first PR)
- Container Apps: Shared across PRs, unique revisions per PR
- Naming convention: `pbooking-frontend--pr-123`, `pbooking-backend--pr-123`
- Each revision gets unique URL: `pbooking-frontend--pr-123.azurecontainerapps.io`

**Alternatives Considered**:
- Resource group per PR: Harder to manage, more expensive, unnecessary isolation
- Production resource group: Violates FR-005, risks production contamination

---

### 8. Database Isolation Strategy
**Question**: How should preview environments handle database isolation?

**Decision**: Shared PostgreSQL container app with PR-specific databases

**Rationale**:
- Each PR revision creates a new database within the shared PostgreSQL instance
- Database naming: `portfolio_booking_pr_123`
- API performs migration and seeding on startup (per FR-021)
- Connection string includes PR-specific database name
- Cleanup deletes the database when PR is closed
- Cost-effective: Single PostgreSQL instance, multiple databases

**Implementation Details**:
```bicep
// Backend environment variable
env: [
  {
    name: 'ConnectionStrings__DefaultConnection'
    value: 'Host=${dbHost};Database=portfolio_booking_pr_${prNumber};Username=booking_user;Password=${dbPassword}'
  }
]
```

**Alternatives Considered**:
- Separate PostgreSQL instance per PR: Too expensive, unnecessary
- Shared database with table prefixes: Complex, error-prone, data leakage risk
- In-memory database: Doesn't test real production scenario

---

### 9. Workflow Trigger Optimization
**Question**: Should we separate build and deploy workflows or combine them?

**Decision**: Reusable workflow template pattern with separate caller workflows

**Rationale**:
- **Eliminates code duplication**: ~80% of deployment logic is shared between prod and preview
- **Reusable workflow template** (`deploy-template.yml`): Contains all shared logic (build, push, login, deploy)
- **Caller workflows**: `prod-deploy.yml` (production), `pr-deploy.yml` (preview), `pr-cleanup.yml` (cleanup)
- Each caller workflow passes environment-specific inputs to the template
- Clear separation of concerns with maximum code reuse
- Easier to maintain and test shared deployment logic in one place
- Meets FR-001, FR-002, FR-003, FR-003a requirements

**Implementation Details**:
```yaml
# deploy-template.yml (reusable workflow)
on:
  workflow_call:
    inputs:
      environment_type:
        required: true
        type: string  # 'production' or 'preview'
      resource_group:
        required: true
        type: string
      deployment_suffix:
        required: false
        type: string  # Empty for prod, 'pr-123' for preview
      image_tag:
        required: true
        type: string  # 'latest' or 'pr-123'

jobs:
  build-and-deploy:
    # Shared build, push, login, deploy steps
    # Uses inputs to customize behavior

# prod-deploy.yml (caller)
on:
  push:
    branches: [main]

jobs:
  deploy:
    uses: ./.github/workflows/deploy-template.yml
    with:
      environment_type: 'production'
      resource_group: 'BookingSystem'
      deployment_suffix: ''
      image_tag: 'latest'

# pr-deploy.yml (caller)
on:
  pull_request:
    types: [opened, synchronize, reopened]
    branches: [main]

jobs:
  deploy:
    uses: ./.github/workflows/deploy-template.yml
    with:
      environment_type: 'preview'
      resource_group: 'BookingSystem-PR'
      deployment_suffix: 'pr-${{ github.event.pull_request.number }}'
      image_tag: 'pr-${{ github.event.pull_request.number }}'
```

**Alternatives Considered**:
- Single monolithic workflow file: Too complex, duplicates logic, harder to maintain
- Separate workflows without reusable template: Code duplication, maintenance burden
- Composite actions: Less powerful than reusable workflows for multi-job orchestration

---

### 10. Concurrency Control
**Question**: How to handle rapid successive commits to the same PR?

**Decision**: Use GitHub Actions concurrency groups to cancel in-progress deployments

**Rationale**:
- Per FR-001a: Cancel in-progress deployment, start new one for latest commit
- GitHub Actions `concurrency` keyword with `cancel-in-progress: true`
- Concurrency group: Unique per PR (e.g., `deploy-preview-pr-123`)
- Prevents wasted resources on stale deployments
- Ensures only latest commit is deployed

**Implementation Details**:
```yaml
jobs:
  deploy-preview:
    concurrency:
      group: deploy-preview-pr-${{ github.event.pull_request.number }}
      cancel-in-progress: true
```

**Alternatives Considered**:
- Queue all deployments: Wastes time and resources
- Manual cancellation: Not automated, violates FR-001a
- Deployment locks: Complex, requires external state management

---

### 11. Missing Clarifications Resolution
**Question**: How to handle the remaining [NEEDS CLARIFICATION] items from spec?

**Resolved Clarifications**:

1. **Production resource group name** (FR-006):
   - **Decision**: `BookingSystem` (inferred from existing deployment workflow)
   - **Evidence**: Current `deploy.yml` uses `${{ vars.AZURE_RESOURCE_GROUP }}` which maps to `BookingSystem`

2. **Cleanup blocking vs async** (FR-015):
   - **Decision**: Asynchronous cleanup
   - **Rationale**: GitHub Actions `pull_request.closed` event runs after PR state change, cleanup doesn't block PR close
   - **Risk mitigation**: Add retry logic and manual cleanup documentation

3. **Deployment record location** (FR-018):
   - **Decision**: Azure Container Apps revision list (native Azure state)
   - **Rationale**: `az containerapp revision list` shows all active revisions, no external tracking needed
   - **Query**: Filter by revision suffix (e.g., `--filter "contains(name, 'pr-')"`)

4. **PR retention policy** (Edge Cases):
   - **Decision**: No automatic expiration for long-running PRs
   - **Rationale**: Developers may need preview environments for extended periods during complex work
   - **Manual intervention**: Document cleanup process for stale PRs (>30 days inactive)

5. **Revision limit and pruning** (Edge Cases):
   - **Decision**: Azure Container Apps supports 100 revisions, well above 20 concurrent PR limit
   - **Pruning strategy**: Automatic cleanup on PR close handles most cases
   - **Manual pruning**: If limit approached, use `az containerapp revision list` + `deactivate` for oldest closed PRs

---

## Summary

All research questions resolved. Key technical decisions:

1. **Multi-revision mode**: Azure Container Apps with `activeRevisionsMode: 'Multiple'`
2. **PR identification**: Use `github.event.pull_request.number` for unique revision suffixes
3. **Comment automation**: GitHub CLI (`gh pr comment`)
4. **Cleanup trigger**: `pull_request` event with `types: [closed]`
5. **Merge blocking**: Branch protection rules with required status checks
6. **Infrastructure template**: Single `azure-setup.bicep` with parameters for environment type (no duplicate Bicep code)
7. **Resource strategy**: Single `BookingSystem-PR` resource group with multi-revision apps
8. **Database isolation**: Shared PostgreSQL with PR-specific databases
9. **Workflow structure**: Reusable workflow template pattern with `deploy-template.yml` (shared logic), `prod-deploy.yml`, `pr-deploy.yml`, and `pr-cleanup.yml`
10. **Concurrency control**: GitHub Actions concurrency groups with cancellation
11. **Clarifications**: All spec unknowns resolved with concrete decisions

**DRY Principles Applied**:
- **Workflows**: ~80% code reuse via reusable template
- **Infrastructure**: 100% Bicep code reuse via parameterization

**Next Phase**: Design contracts, data model, and quickstart validation.
