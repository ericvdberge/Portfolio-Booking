# Quickstart: PR-Based Preview Deployments

**Feature**: 002-infrastructure-for-pr-deployments
**Purpose**: Manual validation and testing guide for PR preview deployments
**Estimated Time**: 30-45 minutes

## Prerequisites

Before testing this feature, ensure:

- [x] Azure subscription with permissions to create resources
- [x] GitHub repository with Actions enabled
- [x] Azure CLI installed and authenticated (`az login`)
- [x] GitHub CLI installed and authenticated (`gh auth login`)
- [x] Docker installed (for local testing)
- [x] Repository secrets configured (see Setup section)

---

## Setup

### 1. Configure Repository Secrets

Navigate to GitHub repository → Settings → Secrets and variables → Actions

**Required Secrets**:
```bash
AZURE_CLIENT_ID=<your-service-principal-client-id>
AZURE_TENANT_ID=<your-tenant-id>
AZURE_SUBSCRIPTION_ID=<your-subscription-id>
DB_PASSWORD=<secure-database-password>
USER_PRINCIPAL_ID=<your-user-principal-id>
```

**Required Variables**:
```bash
AZURE_RESOURCE_GROUP=BookingSystem
```

**Validation**:
```bash
# Verify secrets are set (values will be hidden)
gh secret list

# Expected output:
# AZURE_CLIENT_ID
# AZURE_TENANT_ID
# AZURE_SUBSCRIPTION_ID
# DB_PASSWORD
# USER_PRINCIPAL_ID
```

---

### 2. Create Preview Resource Group

Create the `BookingSystem-PR` resource group for preview deployments:

```bash
# Create resource group
az group create \
  --name BookingSystem-PR \
  --location swedencentral

# Verify creation
az group show --name BookingSystem-PR
```

**Expected Output**:
```json
{
  "id": "/subscriptions/.../resourceGroups/BookingSystem-PR",
  "location": "swedencentral",
  "name": "BookingSystem-PR",
  "properties": {
    "provisioningState": "Succeeded"
  }
}
```

---

### 3. Deploy Shared Infrastructure

Deploy the shared infrastructure for all PR previews:

```bash
# Deploy Container Apps Environment and shared resources
az deployment group create \
  --resource-group BookingSystem-PR \
  --template-file infrastructure/pr-preview-bootstrap.bicep \
  --parameters databasePassword="$DB_PASSWORD"

# Verify deployment
az containerapp env list --resource-group BookingSystem-PR
```

**Expected Resources**:
- Container Apps Environment: `pbooking-pr-env`
- Log Analytics Workspace: `pbooking-pr-logs`
- Storage Account: `pbookingpr<unique>`
- Key Vault: `pbookingprkv<unique>`
- Managed Identity: `pbooking-pr-identity`

---

### 4. Configure Branch Protection

Enable branch protection to block PR merge on deployment failure:

```bash
# Configure branch protection (GitHub CLI)
gh api repos/:owner/:repo/branches/main/protection \
  -X PUT \
  -F required_status_checks[strict]=true \
  -F required_status_checks[contexts][]=deploy-preview
```

**Manual Configuration** (GitHub UI):
1. Navigate to repository → Settings → Branches
2. Click "Add rule" for `main` branch
3. Enable "Require status checks to pass before merging"
4. Search for and select `deploy-preview` check
5. Save changes

**Validation**:
```bash
gh api repos/:owner/:repo/branches/main/protection
```

---

## Testing Scenarios

### Test 1: Create PR and Verify Preview Deployment

**Objective**: Verify preview environment is created when PR is opened (FR-001, FR-004, FR-009, FR-010)

**Steps**:

1. **Create test branch and commit**:
   ```bash
   git checkout -b test-pr-preview-001
   echo "Test change for PR preview" >> README.md
   git add README.md
   git commit -m "Test: PR preview deployment"
   git push origin test-pr-preview-001
   ```

2. **Create pull request**:
   ```bash
   gh pr create \
     --title "Test: PR Preview Deployment" \
     --body "Testing automated preview deployment" \
     --base main \
     --head test-pr-preview-001
   ```

3. **Monitor workflow execution**:
   ```bash
   # Get PR number
   PR_NUMBER=$(gh pr view --json number --jq .number)

   # Watch workflow run
   gh run watch

   # Expected jobs:
   # - build-and-push: ✓ (builds Docker images)
   # - deploy-preview: ✓ (deploys to Azure)
   ```

4. **Verify PR comment added**:
   ```bash
   gh pr view $PR_NUMBER --comments

   # Expected comment:
   # 🚀 Preview Deployment Ready
   # Frontend: https://pbooking-frontend--pr-1.azurecontainerapps.io
   # Backend: https://pbooking-backend--pr-1.azurecontainerapps.io
   ```

5. **Verify Azure resources created**:
   ```bash
   # List container app revisions
   az containerapp revision list \
     --resource-group BookingSystem-PR \
     --name pbooking-frontend \
     --query "[?contains(name, 'pr-${PR_NUMBER}')]"

   # Expected: One active revision with name containing pr-1
   ```

6. **Test preview URL accessibility**:
   ```bash
   # Extract frontend URL from PR comment
   FRONTEND_URL=$(gh pr view $PR_NUMBER --comments | grep -oP 'https://pbooking-frontend--pr-\d+\..*')

   # Test URL responds
   curl -I $FRONTEND_URL

   # Expected: HTTP 200 OK
   ```

**Expected Results**:
- ✅ Workflow completes successfully
- ✅ PR comment added with preview URLs
- ✅ Container app revisions created with `pr-{number}` suffix
- ✅ Preview URLs accessible and return 200 OK
- ✅ Frontend can connect to backend (check browser console)

---

### Test 2: Update PR and Verify Revision Update

**Objective**: Verify preview environment is updated when PR is updated (FR-001, FR-011)

**Steps**:

1. **Make additional commit to PR branch**:
   ```bash
   git checkout test-pr-preview-001
   echo "Second test change" >> README.md
   git add README.md
   git commit -m "Test: Update PR preview"
   git push origin test-pr-preview-001
   ```

2. **Monitor workflow execution**:
   ```bash
   gh run watch
   ```

3. **Verify new PR comment added** (not updated):
   ```bash
   gh pr view $PR_NUMBER --comments | grep "Preview Deployment Ready" | wc -l

   # Expected: 2 (original + new comment)
   ```

4. **Verify revision updated**:
   ```bash
   az containerapp revision list \
     --resource-group BookingSystem-PR \
     --name pbooking-frontend \
     --query "[?contains(name, 'pr-${PR_NUMBER}')]"

   # Expected: Still one active revision (updated in place)
   ```

**Expected Results**:
- ✅ Workflow completes successfully
- ✅ New comment added to PR (original comment preserved)
- ✅ Revision updated (same revision name, new image)
- ✅ Preview URL remains accessible

---

### Test 3: Concurrent Commits (Concurrency Control)

**Objective**: Verify in-progress deployment is cancelled when new commit pushed (FR-001a)

**Steps**:

1. **Make first commit**:
   ```bash
   echo "Commit 1" >> README.md
   git add README.md
   git commit -m "Test: Concurrent deployment 1"
   git push origin test-pr-preview-001
   ```

2. **Immediately make second commit** (before first deployment completes):
   ```bash
   echo "Commit 2" >> README.md
   git add README.md
   git commit -m "Test: Concurrent deployment 2"
   git push origin test-pr-preview-001
   ```

3. **Verify first workflow cancelled**:
   ```bash
   gh run list --workflow deploy.yml --limit 5

   # Expected:
   # - First run: Cancelled (in_progress → cancelled)
   # - Second run: Completed (success)
   ```

**Expected Results**:
- ✅ First workflow run cancelled
- ✅ Second workflow run completes successfully
- ✅ Only latest commit deployed

---

### Test 4: Multiple Concurrent PRs

**Objective**: Verify multiple PRs can have simultaneous preview deployments (FR-004, FR-008)

**Steps**:

1. **Create second PR**:
   ```bash
   git checkout main
   git pull
   git checkout -b test-pr-preview-002
   echo "Second PR test" >> README.md
   git add README.md
   git commit -m "Test: Second PR preview"
   git push origin test-pr-preview-002

   gh pr create \
     --title "Test: Second PR Preview" \
     --body "Testing multiple concurrent previews" \
     --base main \
     --head test-pr-preview-002
   ```

2. **Get second PR number**:
   ```bash
   PR_NUMBER_2=$(gh pr view --json number --jq .number)
   ```

3. **Verify both PRs have active revisions**:
   ```bash
   # List all PR revisions
   az containerapp revision list \
     --resource-group BookingSystem-PR \
     --name pbooking-frontend \
     --query "[?contains(name, 'pr-')]"

   # Expected: Two active revisions (pr-1 and pr-2)
   ```

4. **Verify unique URLs**:
   ```bash
   # Get URLs from both PRs
   gh pr view 1 --comments | grep -oP 'https://pbooking-frontend--pr-\d+\..*'
   gh pr view 2 --comments | grep -oP 'https://pbooking-frontend--pr-\d+\..*'

   # Expected: Different URLs with different PR numbers
   ```

**Expected Results**:
- ✅ Both PRs have separate preview deployments
- ✅ Each PR has unique URL with its PR number
- ✅ Both URLs accessible simultaneously
- ✅ Deployments isolated (no interference)

---

### Test 5: PR Cleanup on Merge

**Objective**: Verify preview environment cleaned up when PR merged (FR-012, FR-014)

**Steps**:

1. **Merge first PR**:
   ```bash
   gh pr merge 1 --merge

   # Note: If branch protection enabled, may need to use --admin flag
   ```

2. **Verify cleanup workflow triggered**:
   ```bash
   gh run list --workflow cleanup-pr.yml --limit 1

   # Expected: One run triggered by PR close event
   ```

3. **Monitor cleanup workflow**:
   ```bash
   gh run watch
   ```

4. **Verify revision deactivated**:
   ```bash
   az containerapp revision list \
     --resource-group BookingSystem-PR \
     --name pbooking-frontend \
     --query "[?contains(name, 'pr-1')]"

   # Expected: Empty array or revision with trafficWeight: 0
   ```

5. **Verify second PR still active**:
   ```bash
   az containerapp revision list \
     --resource-group BookingSystem-PR \
     --name pbooking-frontend \
     --query "[?contains(name, 'pr-2')]"

   # Expected: One active revision for PR 2
   ```

**Expected Results**:
- ✅ Cleanup workflow triggered automatically
- ✅ PR 1 revisions deactivated (frontend and backend)
- ✅ PR 2 remains active and accessible
- ✅ No interference between PR cleanups

---

### Test 6: PR Cleanup on Close (Without Merge)

**Objective**: Verify preview environment cleaned up when PR closed without merging (FR-013)

**Steps**:

1. **Close second PR without merging**:
   ```bash
   gh pr close 2
   ```

2. **Verify cleanup workflow triggered**:
   ```bash
   gh run list --workflow cleanup-pr.yml --limit 1
   ```

3. **Verify revision deactivated**:
   ```bash
   az containerapp revision list \
     --resource-group BookingSystem-PR \
     --name pbooking-frontend \
     --query "[?contains(name, 'pr-2')]"

   # Expected: Empty array
   ```

**Expected Results**:
- ✅ Cleanup workflow triggered on close (not just merge)
- ✅ All PR 2 revisions deactivated

---

### Test 7: Deployment Failure Blocks PR Merge

**Objective**: Verify failed deployment prevents PR merge (FR-017, FR-017a)

**Steps**:

1. **Create PR with invalid configuration** (simulate deployment failure):
   ```bash
   git checkout main
   git pull
   git checkout -b test-pr-preview-fail

   # Intentionally break Bicep template (or use invalid image)
   echo "invalid: bicep" >> infrastructure/pr-preview.bicep

   git add infrastructure/pr-preview.bicep
   git commit -m "Test: Deployment failure"
   git push origin test-pr-preview-fail

   gh pr create \
     --title "Test: Deployment Failure" \
     --body "Testing failed deployment blocking" \
     --base main \
     --head test-pr-preview-fail
   ```

2. **Verify workflow fails**:
   ```bash
   gh run watch

   # Expected: deploy-preview job fails
   ```

3. **Attempt to merge PR**:
   ```bash
   gh pr merge --merge

   # Expected: Error - required status checks failed
   ```

4. **Verify PR blocked in GitHub UI**:
   - Navigate to PR page
   - Check status: "Some checks were not successful"
   - Merge button disabled or shows warning

5. **Fix the issue and verify PR unblocked**:
   ```bash
   git checkout test-pr-preview-fail
   git revert HEAD
   git push origin test-pr-preview-fail

   # Wait for workflow to complete
   gh run watch

   # Try merge again
   gh pr merge --merge

   # Expected: Success (if branch protection configured)
   ```

**Expected Results**:
- ✅ Failed deployment prevents PR merge
- ✅ GitHub UI shows failed status check
- ✅ Merge button disabled until deployment succeeds
- ✅ After fix, PR can be merged

---

## Validation Checklist

After completing all tests, verify:

### Functional Requirements
- [x] **FR-001**: Preview deployments triggered only on PR open/update to main
- [x] **FR-001a**: In-progress deployments cancelled when new commits pushed
- [x] **FR-002**: Production deployments triggered only on merge to main
- [x] **FR-003**: Production deployments NOT triggered by PR events
- [x] **FR-004**: Separate preview environment per PR
- [x] **FR-005**: Previews deployed to BookingSystem-PR resource group
- [x] **FR-007**: All container apps deployed (frontend, backend, database)
- [x] **FR-008**: Multiple concurrent revisions supported
- [x] **FR-009**: Unique, publicly accessible URLs generated
- [x] **FR-010**: PR comment added with preview URL
- [x] **FR-011**: New comment created for each update (not edited)
- [x] **FR-012**: Cleanup on PR merge
- [x] **FR-013**: Cleanup on PR close without merge
- [x] **FR-014**: Cleanup for all container apps
- [x] **FR-017**: Deployment status visible in PR
- [x] **FR-017a**: Failed deployment blocks PR merge
- [x] **FR-019**: Preview environments publicly accessible

### Performance
- [x] Deployment completes within 10 minutes
- [x] Preview URL accessible within 30 seconds of deployment success
- [x] Multiple concurrent PRs supported (tested with 2+)

### Security
- [x] Preview environments use same authentication as production
- [x] Database migrations run successfully on API startup
- [x] Secrets properly configured and not exposed in logs

---

## Cleanup

After testing, clean up resources:

```bash
# Delete test branches
git checkout main
git branch -D test-pr-preview-001 test-pr-preview-002 test-pr-preview-fail
git push origin --delete test-pr-preview-001 test-pr-preview-002 test-pr-preview-fail

# Verify all PR revisions cleaned up
az containerapp revision list \
  --resource-group BookingSystem-PR \
  --name pbooking-frontend

# If any stale revisions remain, manually deactivate
az containerapp revision deactivate \
  --resource-group BookingSystem-PR \
  --name pbooking-frontend \
  --revision <revision-name>

# Optional: Delete preview resource group (if no longer needed)
# WARNING: This deletes ALL preview deployments
# az group delete --name BookingSystem-PR --yes
```

---

## Troubleshooting

### Issue: Workflow fails with "Resource group not found"
**Solution**: Ensure `BookingSystem-PR` resource group created (see Setup step 2)

### Issue: Workflow fails with "Secret not found"
**Solution**: Verify all required secrets configured in repository settings

### Issue: Preview URL returns 404
**Possible Causes**:
1. Deployment hasn't completed yet (wait 30-60 seconds)
2. Container app scaling to zero (first request may be slow)
3. Image failed to pull (check container logs)

**Resolution**:
```bash
# Check container app logs
az containerapp logs show \
  --resource-group BookingSystem-PR \
  --name pbooking-frontend \
  --revision pbooking-frontend--pr-1
```

### Issue: Cleanup doesn't delete database
**Expected**: Database cleanup may require manual intervention (see contracts/README.md)

**Manual Cleanup**:
```bash
# Connect via Azure Portal → Container Apps → pbooking-database → Console
# Run: psql -U booking_user -d postgres
# Then: DROP DATABASE portfolio_booking_pr_1;
```

---

## Next Steps

After successful validation:

1. **Deploy to production**: Merge implementation PR to main
2. **Monitor first real PR**: Verify feature works in production use
3. **Document for team**: Share quickstart guide with developers
4. **Set up monitoring**: Configure alerts for deployment failures

---

## Success Criteria

All tests pass ✅ when:

- Preview deployments created automatically on PR open
- Preview URLs accessible and functional
- Multiple PRs can coexist with isolated environments
- Cleanup happens automatically on PR close/merge
- Failed deployments block PR merge
- Production deployments unaffected by PR feature

**Estimated Total Time**: 30-45 minutes for complete validation
