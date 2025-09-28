# Create GitHub Actions Azure Credentials

This guide shows how to create the Azure App Registration and federated identity credentials needed for GitHub Actions to authenticate with Azure using OpenID Connect (OIDC).

## Prerequisites

- Azure CLI installed and logged in (`az login`)
- Contributor access to your Azure subscription
- Admin access to your GitHub repository

## Step 1: Create App Registration

```bash
# Create the App Registration
az ad app create --display-name "pbooking-github-actions"
```

This will output JSON containing the `appId`. Save this value - you'll need it for the next steps.

## Step 2: Create Service Principal

```bash
# Replace <APP_ID> with the appId from step 1
az ad sp create --id 2ddb4d62-8ec9-4d40-aee0-6fa2e359c293
```

## Step 3: Create Federated Identity Credentials

### For any branch deployments:

**PowerShell:**
```powershell
az ad app federated-credential create --id 2ddb4d62-8ec9-4d40-aee0-6fa2e359c293 --parameters '{\"name\": \"github-actions-any-branch\", \"issuer\": \"https://token.actions.githubusercontent.com\", \"subject\": \"repo:ericvdberge/Portfolio-Booking:ref:refs/heads/*\", \"audiences\": [\"api://AzureADTokenExchange\"]}'
```

**Bash/Linux:**
```bash
az ad app federated-credential create --id 2ddb4d62-8ec9-4d40-aee0-6fa2e359c293 --parameters '{
  "name": "github-actions-any-branch",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:ericvdberge/Portfolio-Booking:ref:refs/heads/*",
  "audiences": ["api://AzureADTokenExchange"]
}'
```

### For pull request deployments:

**PowerShell:**
```powershell
az ad app federated-credential create --id 2ddb4d62-8ec9-4d40-aee0-6fa2e359c293 --parameters '{\"name\": \"github-actions-pull-requests\", \"issuer\": \"https://token.actions.githubusercontent.com\", \"subject\": \"repo:ericvdberge/Portfolio-Booking:pull_request\", \"audiences\": [\"api://AzureADTokenExchange\"]}'
```

**Bash/Linux:**
```bash
az ad app federated-credential create --id 2ddb4d62-8ec9-4d40-aee0-6fa2e359c293 --parameters '{
  "name": "github-actions-pull-requests",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:ericvdberge/Portfolio-Booking:pull_request",
  "audiences": ["api://AzureADTokenExchange"]
}'
```

## Step 4: Assign Azure Permissions

```bash
# Get your subscription ID
az account show --query id -o tsv

# Assign Contributor role to the service principal
# Replace <APP_ID> with your App ID and <SUBSCRIPTION_ID> with your subscription ID
az role assignment create \
  --assignee <APP_ID> \
  --role Contributor \
  --scope /subscriptions/<SUBSCRIPTION_ID>
```

## Step 5: Configure GitHub Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

1. **AZURE_CLIENT_ID**: The `appId` from step 1
2. **AZURE_TENANT_ID**: Get your tenant ID with: `az account show --query tenantId -o tsv`
3. **AZURE_SUBSCRIPTION_ID**: Get your subscription ID with: `az account show --query id -o tsv`

## Complete Example Script

Here's a complete script that does everything:

```bash
#!/bin/bash

# Set variables
APP_NAME="pbooking-github-actions"
GITHUB_ORG="ericvdberge"
GITHUB_REPO="Portfolio-Booking"

echo "Creating App Registration..."
APP_ID=$(az ad app create --display-name "$APP_NAME" --query appId -o tsv)
echo "✅ App Registration created with ID: $APP_ID"

echo "Creating Service Principal..."
az ad sp create --id $APP_ID
echo "✅ Service Principal created"

echo "Creating federated credential for any branch..."
az ad app federated-credential create --id $APP_ID --parameters "{
  \"name\": \"github-actions-any-branch\",
  \"issuer\": \"https://token.actions.githubusercontent.com\",
  \"subject\": \"repo:$GITHUB_ORG/$GITHUB_REPO:ref:refs/heads/*\",
  \"audiences\": [\"api://AzureADTokenExchange\"]
}"
echo "✅ Federated credential for branches created"

echo "Creating federated credential for pull requests..."
az ad app federated-credential create --id $APP_ID --parameters "{
  \"name\": \"github-actions-pull-requests\",
  \"issuer\": \"https://token.actions.githubusercontent.com\",
  \"subject\": \"repo:$GITHUB_ORG/$GITHUB_REPO:pull_request\",
  \"audiences\": [\"api://AzureADTokenExchange\"]
}"
echo "✅ Federated credential for pull requests created"

echo "Assigning Contributor role..."
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
az role assignment create --assignee $APP_ID --role Contributor --scope /subscriptions/$SUBSCRIPTION_ID
echo "✅ Contributor role assigned"

echo ""
echo "🎉 Setup complete! Add these secrets to your GitHub repository:"
echo ""
echo "AZURE_CLIENT_ID: $APP_ID"
echo "AZURE_TENANT_ID: $(az account show --query tenantId -o tsv)"
echo "AZURE_SUBSCRIPTION_ID: $SUBSCRIPTION_ID"
echo ""
echo "GitHub Repository Settings → Secrets and variables → Actions"
```

## Verification

To verify the setup works, you can test the federated credential:

```bash
# This should return the app registration details
az ad app show --id <APP_ID>

# This should list the federated credentials
az ad app federated-credential list --id <APP_ID>
```

## Troubleshooting

- **Permission denied**: Make sure you have sufficient privileges in Azure AD
- **Invalid subject**: Double-check the repository owner/name in the subject field
- **GitHub Actions still failing**: Verify the secrets are correctly set in GitHub and match the output values exactly