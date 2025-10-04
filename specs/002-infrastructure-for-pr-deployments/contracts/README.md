# Contracts: PR-Based Preview Deployments

This directory contains contract definitions for the PR preview deployment feature. Since this is an infrastructure feature, contracts define the interfaces and behaviors of workflows and infrastructure templates rather than API endpoints.

## Contract Files

### 1. workflow-deploy-template.yml
**Type**: GitHub Actions Reusable Workflow Contract
**Purpose**: Defines shared deployment logic for both production and preview environments

**Key Contracts**:
- **Inputs**: `environment_type`, `resource_group`, `deployment_suffix`, `image_tag`, `pr_number`
- **Outputs**: `frontend_url`, `backend_url`
- **Jobs**: `build-and-push`, `deploy`
- **Reusability**: Called by `prod-deploy.yml` and `pr-deploy.yml`

**Requirements Satisfied**:
- FR-003a: Reusable workflow template eliminates code duplication

---

### 2. workflow-prod-deploy.yml
**Type**: GitHub Actions Workflow Contract
**Purpose**: Production deployment caller workflow

**Key Contracts**:
- **Trigger**: `push` to `main`
- **Calls**: `deploy-template.yml` with production inputs
- **Outputs**: Deployed production infrastructure

**Requirements Satisfied**:
- FR-002: Production deployment on merge to main
- FR-003: No production deployment on PR events

---

### 3. workflow-pr-deploy.yml
**Type**: GitHub Actions Workflow Contract
**Purpose**: PR preview deployment caller workflow

**Key Contracts**:
- **Trigger**: `pull_request` (opened, synchronize, reopened) to `main`
- **Calls**: `deploy-template.yml` with PR inputs
- **Jobs**: `deploy-preview`, `comment-preview-url`
- **Concurrency**: Cancels in-progress deployments for same PR

**Requirements Satisfied**:
- FR-001, FR-001a: PR deployment triggering and cancellation
- FR-009, FR-010, FR-011: Preview URL management
- FR-017, FR-017a: Deployment tracking and blocking

---

### 4. workflow-cleanup.yml (formerly workflow-pr-cleanup.yml)
**Type**: GitHub Actions Workflow Contract
**Purpose**: Defines the cleanup workflow interface and behavior

**Key Contracts**:
- **Trigger**: `pull_request` with `types: [closed]` (both merged and not merged)
- **Jobs**: `cleanup-preview`
- **Actions**: Deactivate container app revisions, drop PR database
- **Idempotency**: Safe to run multiple times, handles missing resources

**Requirements Satisfied**:
- FR-012, FR-013: Automatic cleanup on PR close/merge
- FR-014: Cleanup for all container apps
- FR-015: Asynchronous cleanup

---

### 5. azure-setup.bicep (Enhanced)
**Type**: Bicep Infrastructure Template Contract
**Purpose**: Unified infrastructure template for both production and preview environments

**Key Contracts**:
- **Inputs**: `environmentType` ('production'|'preview'), `prNumber`, `backendImage`, `frontendImage`, `databasePassword`
- **Outputs**: `frontendUrl`, `backendUrl`
- **Conditional Logic**: Multi-revision mode based on `environmentType`
- **Reusability**: Single template for both production and preview (100% code reuse)

**Requirements Satisfied**:
- FR-004, FR-005, FR-006: Preview environment isolation
- FR-007, FR-008: Container apps with multi-revision mode
- FR-009, FR-019: Unique, publicly accessible URLs
- FR-021: API handles migrations (no infrastructure changes)
- FR-003a: Eliminates infrastructure code duplication

---

## Testing Strategy

### Contract Tests

Since these are infrastructure contracts (not API endpoints), contract tests validate:

1. **Workflow Syntax Validation**
   - Validate YAML syntax
   - Validate GitHub Actions workflow schema
   - Ensure all required secrets/variables are documented

2. **Bicep Template Validation**
   - `az bicep build --file infrastructure/azure-setup.bicep` to validate syntax
   - `az deployment group validate` for both production and preview parameter sets
   - Parameter validation (required, types, constraints)
   - Test conditional logic for both `environmentType=production` and `environmentType=preview`

3. **Integration Tests**
   - Deploy to test resource group
   - Verify outputs match expected format
   - Verify resources created with correct configuration
   - Clean up test resources

4. **E2E Tests**
   - Create test PR → verify preview deployment → verify URL accessibility
   - Update test PR → verify new comment added → verify URL updated
   - Close test PR → verify cleanup completed → verify resources deleted

### Test Files

Contract tests will be created in the implementation phase:

```
tests/
├── infrastructure/
│   ├── bicep-validation.sh       # Bicep syntax and validation tests
│   ├── workflow-validation.sh    # GitHub Actions workflow syntax tests
│   └── deployment-test.sh        # Integration test for end-to-end deployment
```

---

## Contract Enforcement

### Build-Time Validation
- Bicep files validated with `az bicep build`
- Workflow files validated with GitHub Actions schema

### Deployment-Time Validation
- Azure validates parameters and resource configurations
- GitHub Actions validates workflow syntax and permissions

### Runtime Validation
- Branch protection rules enforce `deploy-preview` job must pass
- Failed deployments prevent PR merge (FR-017a)

---

## Contract Versioning

Contracts use semantic versioning based on breaking changes:

- **Major**: Breaking changes to inputs/outputs (e.g., rename parameter, change output format)
- **Minor**: Additive changes (e.g., new optional parameter, new output)
- **Patch**: Implementation changes with no interface changes (e.g., improve error handling)

**Current Version**: 1.0.0 (initial release)

---

## Dependencies

### Workflow Contracts
**Depends on**:
- GitHub Actions runtime
- Azure CLI
- Docker
- GitHub CLI (`gh`)

**Required Secrets**:
- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`
- `DB_PASSWORD`
- `GITHUB_TOKEN` (automatic)
- `USER_PRINCIPAL_ID`

**Required Variables**:
- `AZURE_RESOURCE_GROUP` (production resource group name)

### Bicep Contracts
**Depends on**:
- Azure Container Apps API version `2024-03-01`
- Azure Managed Identity API version `2023-01-31`
- Azure Key Vault API version `2023-07-01`

**Pre-conditions**:
- `BookingSystem-PR` resource group exists
- Container Apps Environment (`pbooking-pr-env`) exists
- Shared database container app (`pbooking-database`) running
- Key Vault and managed identity configured

---

## Migration Guide

### From Current State (No PR Previews) to PR Previews

1. **Create BookingSystem-PR Resource Group**
   ```bash
   az group create --name BookingSystem-PR --location swedencentral
   ```

2. **Deploy Shared Infrastructure**
   ```bash
   # Initial deployment to BookingSystem-PR uses same template with preview parameters
   az deployment group create \
     --resource-group BookingSystem-PR \
     --template-file infrastructure/azure-setup.bicep \
     --parameters environmentType=preview \
     --parameters prNumber=0 \
     --parameters databasePassword="${DB_PASSWORD}"
   ```

3. **Create Reusable Workflow Template**
   - Create `.github/workflows/deploy-template.yml`
   - Implement shared build, push, and deploy logic

4. **Update Deployment Workflows**
   - Rename `deploy.yml` to `prod-deploy.yml` (calls template)
   - Create `pr-deploy.yml` (calls template with PR inputs)
   - Add concurrency control to PR workflow
   - Add PR commenting to PR workflow

5. **Add Cleanup Workflow**
   - Create `pr-cleanup.yml` (formerly `cleanup-pr.yml`)
   - Configure triggers and permissions

6. **Configure Branch Protection**
   - Enable "Require status checks to pass before merging"
   - Add `deploy-preview` as required check

---

## Troubleshooting

### Preview Deployment Fails
**Symptom**: `deploy-preview` job fails, PR blocked
**Causes**:
- Invalid Bicep template
- Missing secrets/variables
- Azure quota exceeded
- Container image not found

**Resolution**:
1. Check workflow logs for specific error
2. Validate Bicep template locally: `az bicep build --file infrastructure/azure-setup.bicep`
3. Test with both parameter sets:
   - Production: `environmentType=production prNumber='' deploymentHash=test123`
   - Preview: `environmentType=preview prNumber=999 deploymentHash=''`
4. Verify secrets are configured in repository settings
5. Check Azure quota: `az vm list-usage --location swedencentral`

### Cleanup Fails
**Symptom**: Resources not deleted after PR close
**Causes**:
- Cleanup workflow permissions insufficient
- Resources already deleted (idempotent, not an error)
- Azure API throttling

**Resolution**:
1. Check `cleanup-pr.yml` workflow logs
2. Manually verify resources deleted: `az containerapp revision list --resource-group BookingSystem-PR --name pbooking-frontend`
3. If resources persist, manually deactivate: `az containerapp revision deactivate ...`

### Database Cleanup Manual Process
**Symptom**: Database not dropped after PR close
**Reason**: PostgreSQL container doesn't expose public endpoint for automated cleanup

**Manual Cleanup**:
```bash
# Connect to database container via Azure Portal or Container Apps Console
# Run psql command to drop database
DROP DATABASE portfolio_booking_pr_123;
```

**Future Enhancement**: Implement Azure Container Job for automated database cleanup

---

## See Also

- [research.md](../research.md): Technical decisions and rationale
- [data-model.md](../data-model.md): Infrastructure resource relationships
- [quickstart.md](../quickstart.md): Manual testing and validation guide
