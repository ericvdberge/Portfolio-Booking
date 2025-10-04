# Data Model: PR-Based Preview Deployments

**Feature**: 002-infrastructure-for-pr-deployments
**Date**: 2025-10-04
**Type**: Infrastructure Resources

## Overview

This feature doesn't involve traditional application data models (entities, tables). Instead, it defines infrastructure resources and their relationships in Azure and GitHub Actions.

## Infrastructure Resources

### 1. Azure Resource Groups

#### Production Resource Group
**Name**: `BookingSystem`
**Purpose**: Hosts production deployment (main branch)
**Lifecycle**: Persistent, never deleted
**Resources**:
- Container Apps Environment (pbooking-env)
- Container Apps: frontend, backend, database
- Supporting resources: Log Analytics, Storage, Key Vault

#### Preview Resource Group
**Name**: `BookingSystem-PR`
**Purpose**: Hosts all PR preview deployments
**Lifecycle**: Persistent (created once, contains multiple PR revisions)
**Resources**:
- Container Apps Environment (pbooking-pr-env)
- Container Apps: frontend, backend, database (with multiple revisions)
- Supporting resources: Log Analytics, Storage, Key Vault

**Relationships**:
- Independent resource groups (no shared resources)
- Same infrastructure template with different parameters
- Preview environment is lower-cost (smaller resources, scale to zero enabled)

---

### 2. Container App Environment

#### Production Environment
**Name**: `pbooking-env`
**Resource Group**: `BookingSystem`
**Configuration**:
- Log Analytics workspace: `pbooking-logs`
- Revision mode: Single (only latest production version active)

#### Preview Environment
**Name**: `pbooking-pr-env`
**Resource Group**: `BookingSystem-PR`
**Configuration**:
- Log Analytics workspace: `pbooking-pr-logs`
- Revision mode: N/A (set on individual container apps)
- Shared by all PR deployments

**Relationships**:
- Environment → Container Apps (1:N)
- Environment → Log Analytics Workspace (1:1)

---

### 3. Container Apps

#### Frontend Container App

**Production**:
- Name: `pbooking-frontend`
- Resource Group: `BookingSystem`
- Revision Mode: `Single`
- Active Revisions: 1 (latest production)

**Preview**:
- Name: `pbooking-frontend`
- Resource Group: `BookingSystem-PR`
- Revision Mode: `Multiple`
- Active Revisions: Up to 20 (one per active PR)
- Revision Naming: `pbooking-frontend--pr-{number}` (e.g., `pbooking-frontend--pr-123`)

**Properties**:
- External ingress: `true`
- Target port: `80`
- Transport: `http`
- Environment variables:
  - `NEXT_PUBLIC_API_URL`: Backend URL (set at build time)

**URLs**:
- Production: `https://pbooking-frontend.azurecontainerapps.io`
- Preview: `https://pbooking-frontend--pr-123.azurecontainerapps.io`

---

#### Backend Container App

**Production**:
- Name: `pbooking-backend`
- Resource Group: `BookingSystem`
- Revision Mode: `Single`

**Preview**:
- Name: `pbooking-backend`
- Resource Group: `BookingSystem-PR`
- Revision Mode: `Multiple`
- Revision Naming: `pbooking-backend--pr-{number}`

**Properties**:
- External ingress: `true`
- Target port: `80`
- Environment variables:
  - `ASPNETCORE_ENVIRONMENT`: `Production`
  - `ConnectionStrings__DefaultConnection`: Database connection (from Key Vault)

**Secrets**:
- `connection-string`: From Key Vault (PR-specific database)

---

#### Database Container App

**Production**:
- Name: `pbooking-database`
- Resource Group: `BookingSystem`
- Revision Mode: `Single`
- Database: `portfolio_booking`

**Preview**:
- Name: `pbooking-database`
- Resource Group: `BookingSystem-PR`
- Revision Mode: `Single` (shared PostgreSQL instance)
- Databases: `portfolio_booking_pr_{number}` (one per PR)

**Properties**:
- External ingress: `false` (internal only)
- Target port: `5432`
- Transport: `tcp`
- Image: `postgres:15`
- Persistent storage: Azure File Share

**Database Isolation**:
- Shared PostgreSQL container
- PR-specific databases created on deployment
- Migrations run by API on startup (per FR-021)

---

### 4. GitHub Actions Resources

#### Workflow Files

**deploy-template.yml** (New - Reusable Workflow)
**Location**: `.github/workflows/deploy-template.yml`
**Type**: Reusable workflow (called by other workflows)
**Purpose**: Shared deployment logic to eliminate code duplication

**Inputs**:
- `environment_type`: `production` or `preview`
- `resource_group`: Target Azure resource group
- `deployment_suffix`: Revision suffix (empty for prod, `pr-123` for preview)
- `image_tag`: Docker image tag (`latest` or `pr-123`)
- `pr_number`: PR number (for preview deployments only)

**Outputs**:
- `frontend_url`: Deployed frontend URL
- `backend_url`: Deployed backend URL

**Jobs**:
1. `build-and-push`: Build and push Docker images to GHCR
2. `deploy`: Deploy infrastructure using appropriate Bicep template

**Environment Variables**:
- `REGISTRY`: `ghcr.io`
- `BACKEND_IMAGE_NAME`: `ericvdberge/portfolio-booking/backend`
- `FRONTEND_IMAGE_NAME`: `ericvdberge/portfolio-booking/frontend`

---

**prod-deploy.yml** (New)
**Location**: `.github/workflows/prod-deploy.yml`
**Triggers**: `push` to `main` (merged PR)
**Purpose**: Production deployment caller workflow

**Jobs**:
1. `deploy-production`: Calls `deploy-template.yml` with production inputs
   - `environment_type`: `production`
   - `resource_group`: `BookingSystem`
   - `image_tag`: `latest`

---

**pr-deploy.yml** (New)
**Location**: `.github/workflows/pr-deploy.yml`
**Triggers**: `pull_request` (opened, synchronize, reopened) to `main`
**Purpose**: PR preview deployment caller workflow

**Concurrency**:
```yaml
group: deploy-preview-pr-${{ github.event.pull_request.number }}
cancel-in-progress: true
```

**Jobs**:
1. `deploy-preview`: Calls `deploy-template.yml` with PR inputs
   - `environment_type`: `preview`
   - `resource_group`: `BookingSystem-PR`
   - `image_tag`: `pr-${{ github.event.pull_request.number }}`
2. `comment-preview-url`: Posts preview URLs to PR comment

---

**pr-cleanup.yml** (New)
**Location**: `.github/workflows/pr-cleanup.yml`
**Triggers**: `pull_request` with `types: [closed]` to `main`

**Jobs**:
1. `cleanup-preview`: Delete container app revisions and database for closed PR

**Steps**:
- Deactivate frontend revision: `pbooking-frontend--pr-{number}`
- Deactivate backend revision: `pbooking-backend--pr-{number}`
- Drop database: `portfolio_booking_pr_{number}`

---

#### Concurrency Groups

**Purpose**: Prevent concurrent deployments to the same PR

**Configuration**:
```yaml
concurrency:
  group: deploy-preview-pr-${{ github.event.pull_request.number }}
  cancel-in-progress: true
```

**Behavior**:
- When new commit pushed to PR, cancel in-progress deployment
- Start new deployment for latest commit
- Unique group per PR (prevents cross-PR interference)

---

### 5. Bicep Template

#### azure-setup.bicep (Enhanced - Single Template)
**Location**: `infrastructure/azure-setup.bicep`
**Purpose**: Unified infrastructure template for both production and preview environments
**Changes**: Add parameters and conditional logic for environment type

**New Parameters**:
- `environmentType`: `'production'` or `'preview'` (default: `'production'`)
- `prNumber`: Pull request number (required for preview, empty for production)
- `enableMultiRevision`: Auto-calculated from `environmentType` (preview = true, production = false)
- `databaseName`: Auto-calculated based on environment (`portfolio_booking` or `portfolio_booking_pr_{prNumber}`)

**Existing Parameters** (unchanged):
- `namePrefix`: Resource name prefix (default: `pbooking`)
- `location`: Azure region (default: `swedencentral`)
- `backendImage`: Backend container image URL
- `frontendImage`: Frontend container image URL
- `databasePassword`: PostgreSQL password (from secrets)
- `deploymentHash`: Unique deployment identifier (timestamp hash)
- `userPrincipalId`: User principal ID for Key Vault access (optional)

**Conditional Logic**:
```bicep
// Auto-calculate multi-revision mode from environment type
param enableMultiRevision bool = (environmentType == 'preview')

// Auto-calculate database name
var databaseName = environmentType == 'preview' ? 'portfolio_booking_pr_${prNumber}' : 'portfolio_booking'

// Conditionally set revision mode
resource backendApp 'Microsoft.App/containerApps@2024-03-01' = {
  properties: {
    configuration: {
      activeRevisionsMode: enableMultiRevision ? 'Multiple' : 'Single'
    }
    template: {
      revisionSuffix: environmentType == 'preview' ? 'pr-${prNumber}' : deploymentHash
    }
  }
}
```

**Usage Examples**:
- **Production**: `environmentType=production`, `prNumber=''`, `deploymentHash=abc12`
- **Preview**: `environmentType=preview`, `prNumber=123`, `deploymentHash=''`

**Outputs** (same for both):
- `frontendUrl`: `https://pbooking-frontend--{revision}.azurecontainerapps.io`
- `backendUrl`: `https://pbooking-backend--{revision}.azurecontainerapps.io`

---

## Resource Lifecycle

### PR Opened
1. GitHub Actions triggered (`pull_request` event)
2. Build Docker images (tagged with PR number)
3. Deploy `azure-setup.bicep` to `BookingSystem-PR` resource group with:
   - `environmentType=preview`
   - `prNumber={PR number}`
   - `enableMultiRevision=true` (auto-calculated)
4. Create new container app revisions with suffix `pr-{number}`
5. Create new database `portfolio_booking_pr_{number}` (auto-calculated)
6. API runs migrations and seeding on startup
7. Frontend URL commented on PR

### PR Updated (New Commits)
1. Cancel in-progress deployment (concurrency group)
2. Build new Docker images (same PR number tag)
3. Update existing revisions (Azure handles revision transition)
4. New comment added to PR with updated URL

### PR Closed/Merged
1. Cleanup workflow triggered (`pull_request.closed` event)
2. Deactivate container app revisions (`az containerapp revision deactivate`)
3. Drop PR-specific database (SQL command via Azure CLI)
4. Resources automatically cleaned up by Azure

---

## State Management

### Deployment State
**Stored In**: Azure Container Apps (native Azure state)
**Query**:
```bash
az containerapp revision list \
  --resource-group BookingSystem-PR \
  --name pbooking-frontend \
  --query "[?contains(name, 'pr-')]"
```

**Purpose**: Track active PR deployments (FR-018)

### PR Metadata
**Stored In**: GitHub pull request (via PR comments)
**Content**: Preview URL, deployment status, timestamps
**Access**: GitHub API or `gh` CLI

---

## Validation Rules

### Container App Revisions
- **Naming convention**: Must follow `{app-name}--pr-{number}` pattern
- **Uniqueness**: PR number must be unique (enforced by GitHub)
- **Limit**: Maximum 100 revisions per container app (Azure limit)
- **Active limit**: Target maximum 20 concurrent PR deployments (project constraint)

### Databases
- **Naming convention**: `portfolio_booking_pr_{number}`
- **Isolation**: Each PR has its own database (no shared data)
- **Migration**: Must run successfully before API starts (enforced by Entity Framework)

### Workflow Triggers
- **Production**: Only `push` to `main` (FR-002)
- **Preview**: Only `pull_request` to `main` (FR-001)
- **Cleanup**: Only `pull_request.closed` to `main` (FR-012, FR-013)

---

## Relationship Diagram

```
GitHub PR
  ├─ triggers ──> pr-deploy.yml (pull_request event)
  │                 ├─ calls ──> deploy-template.yml (reusable workflow)
  │                 │             ├─ builds ──> Docker Images (ghcr.io)
  │                 │             │              ├─ backend:pr-123
  │                 │             │              └─ frontend:pr-123
  │                 │             └─ deploys ──> Azure (BookingSystem-PR)
  │                 │                              ├─ Container App Environment (pbooking-pr-env)
  │                 │                              ├─ Frontend App
  │                 │                              │   └─ Revision: pr-123
  │                 │                              │       └─ URL: pbooking-frontend--pr-123.azurecontainerapps.io
  │                 │                              ├─ Backend App
  │                 │                              │   └─ Revision: pr-123
  │                 │                              │       └─ URL: pbooking-backend--pr-123.azurecontainerapps.io
  │                 │                              └─ Database App
  │                 │                                  └─ Database: portfolio_booking_pr_123
  │                 └─ outputs ──> URLs posted to PR comment
  └─ on close ──> pr-cleanup.yml
                    └─ deletes ──> All pr-123 resources

Main Branch Merge
  └─ triggers ──> prod-deploy.yml (push to main)
                    ├─ calls ──> deploy-template.yml (reusable workflow)
                    │             ├─ builds ──> Docker Images (ghcr.io)
                    │             │              ├─ backend:latest
                    │             │              └─ frontend:latest
                    │             └─ deploys ──> Azure (BookingSystem)
                    │                              └─ Production Container Apps
                    └─ outputs ──> Production deployment complete
```

---

## Summary

This infrastructure feature manages the lifecycle of preview deployment resources:

- **Resource Groups**: Production (`BookingSystem`) and Preview (`BookingSystem-PR`)
- **Container Apps**: Multi-revision mode enables concurrent PR deployments
- **Databases**: PR-specific databases in shared PostgreSQL instance
- **Workflows**: Automated deployment and cleanup via GitHub Actions
  - **Reusable template pattern**: Eliminates ~80% code duplication between prod and PR workflows
  - **Caller workflows**: `prod-deploy.yml`, `pr-deploy.yml`, `pr-cleanup.yml`
- **Infrastructure**: Single Bicep template (`azure-setup.bicep`) for both environments
  - **Parameterized approach**: Eliminates 100% Bicep code duplication
  - **Conditional logic**: Environment-specific behavior via `environmentType` parameter
- **State**: Tracked in Azure Container Apps revisions (native Azure state)

**Key Principles**:
- Isolation per PR
- Cleanup on close
- Automatic lifecycle management
- DRY (Don't Repeat Yourself) through:
  - Reusable workflow templates (~80% workflow code reuse)
  - Parameterized Bicep template (100% infrastructure code reuse)
