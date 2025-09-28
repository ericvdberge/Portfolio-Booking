# Azure Container Apps Deployment Guide

This guide explains how to deploy the Portfolio Booking application to Azure Container Apps with automated CI/CD.

## Overview

The deployment consists of:
- **Frontend**: Next.js app running in a container
- **Backend**: ASP.NET Core API running in a container
- **Database**: PostgreSQL with persistent storage using Azure File Share
- **CI/CD**: GitHub Actions workflow for automated deployment

## Prerequisites

1. **Azure Account** with an active subscription
2. **Azure CLI** installed locally
3. **GitHub repository** with the code
4. **Docker** (for local testing)

## Initial Setup

### 1. Azure Service Principal

Create a service principal for GitHub Actions:

```bash
az ad sp create-for-rbac --name "portfolio-booking-deploy" --role contributor --scopes /subscriptions{subscription-id} --sdk-auth
```

Copy the output JSON for the next step.

### 2. GitHub Secrets and Variables

In your GitHub repository, go to Settings > Secrets and variables > Actions:

**Required Secrets:**
- `AZURE_CREDENTIALS`: The JSON output from step 1
- `DATABASE_CONNECTION_STRING`: PostgreSQL connection string for production
- `DB_PASSWORD`: Secure password for PostgreSQL

**Required Variables:**
- `AZURE_RESOURCE_GROUP`: Name of your Azure resource group
- `BACKEND_URL`: Will be set automatically after first deployment

### 3. Deploy Infrastructure

Run the deployment script to create Azure resources:

```bash
cd infrastructure
./deploy.sh
```

Or deploy manually with Azure CLI:

```bash
# Create resource group
az group create --name portfolio-booking-rg --location eastus

# Deploy Bicep template
az deployment group create --resource-group BookingSystem --template-file infrastructure/azure-setup.bicep --parameters infrastructure/parameters.json
```

## GitHub Actions Workflow

The workflow (`.github/workflows/deploy.yml`) automatically:

1. **Builds** Docker images for frontend and backend
2. **Pushes** images to GitHub Container Registry
3. **Deploys** to Azure Container Apps on main branch merges

### Workflow Triggers

- **Push to main**: Full build and deployment
- **Pull requests**: Build only (no deployment)

## Container Configuration

### Frontend Container
- **Image**: `ghcr.io/{owner}/{repo}/frontend:latest`
- **Port**: 3000
- **Environment**: `NEXT_PUBLIC_API_URL` points to backend

### Backend Container
- **Image**: `ghcr.io/{owner}/{repo}/backend:latest`
- **Port**: 8080
- **Environment**: Connection string and ASP.NET settings

### Database Container
- **Image**: `postgres:15-alpine`
- **Port**: 5432 (internal only)
- **Storage**: Azure File Share mounted to `/var/lib/postgresql/data`

## Environment Variables

### Production Environment

```bash
# Backend
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=Host=portfolio-booking-database;Database=portfolio_booking;Username=booking_user;Password={secure_password}

# Frontend
NEXT_PUBLIC_API_URL=https://{backend-fqdn}

# Database
POSTGRES_DB=portfolio_booking
POSTGRES_USER=booking_user
POSTGRES_PASSWORD={secure_password}
PGDATA=/var/lib/postgresql/data/pgdata
```

## Monitoring and Logs

- **Log Analytics**: All container logs are sent to Azure Log Analytics
- **Application Insights**: Can be added for detailed application monitoring
- **Azure Portal**: Monitor resource usage and scaling

## Scaling Configuration

- **Frontend/Backend**: Auto-scale 1-10 instances based on CPU/memory
- **Database**: Fixed 1 instance (stateful)

## Security Considerations

1. **Update default passwords** in Bicep template and GitHub secrets
2. **Enable HTTPS only** (configured by default)
3. **Database** is internal-only (no external access)
4. **Use Azure Key Vault** for production secrets (recommended upgrade)

## Troubleshooting

### Common Issues

1. **Container won't start**: Check logs in Azure Portal
2. **Database connection failed**: Verify connection string and database readiness
3. **Frontend can't reach backend**: Check `NEXT_PUBLIC_API_URL` configuration

### Useful Commands

```bash
# View container app logs
az containerapp logs show --name portfolio-booking-backend --resource-group portfolio-booking-rg

# Update container app
az containerapp update --name portfolio-booking-backend --resource-group portfolio-booking-rg --image ghcr.io/{owner}/{repo}/backend:latest

# Check deployment status
az deployment group list --resource-group portfolio-booking-rg --output table
```

## Costs

Container Apps pricing is based on:
- **vCPU and memory usage** (pay per second)
- **Storage** for database persistence
- **Ingress requests** for external traffic

Estimated monthly cost for small workload: $20-50 USD

## Next Steps

1. Configure custom domain
2. Set up SSL certificates
3. Implement backup strategy for database
4. Add monitoring and alerting
5. Consider Azure Key Vault for secrets management