@description('Location for all resources')
param location string = resourceGroup().location

@description('Name prefix for all resources')
param namePrefix string = 'booking'

@description('Environment type: production or preview')
@allowed([
  'production'
  'preview'
])
param environmentType string = 'production'

@description('Pull request number (required for preview environments)')
param prNumber string = ''

@description('Container Apps Environment name')
param environmentName string = '${namePrefix}-env'

@description('Log Analytics Workspace name')
param logAnalyticsName string = '${namePrefix}-logs'

@description('Storage Account name for database persistence')
param storageAccountName string = '${namePrefix}${uniqueString(resourceGroup().id)}'

@description('File Share name for database data')
param fileShareName string = 'postgres-data'

@description('Database password')
@secure()
param databasePassword string

@description('Backend container image')
param backendImage string = 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'

@description('Frontend container image')
param frontendImage string = 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'


@description('Key Vault name')
param keyVaultName string = '${namePrefix}kv${uniqueString(resourceGroup().id)}'

@description('Deployment hash to force new revisions')
param deploymentHash string

@description('Managed Identity resource ID for Container Apps (created manually)')
param managedIdentityId string

// Calculated parameters
var enableMultiRevision = (environmentType == 'preview')
var databaseName = environmentType == 'preview' ? 'portfolio_booking_pr_${prNumber}' : 'portfolio_booking'
var revisionMode = enableMultiRevision ? 'Multiple' : 'Single'
var revisionSuffix = environmentType == 'preview' ? 'pr-${prNumber}' : deploymentHash

// Key Vault
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  properties: {
    tenantId: subscription().tenantId
    sku: {
      family: 'A'
      name: 'standard'
    }
    accessPolicies: []
    enabledForDeployment: true
    enabledForTemplateDeployment: true
    enabledForDiskEncryption: false
    enableRbacAuthorization: true
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      defaultAction: 'Allow'
      bypass: 'AzureServices'
    }
  }
}

// Key Vault Secret for Database Password
resource dbPasswordSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  name: 'database-password'
  parent: keyVault
  properties: {
    value: databasePassword
    contentType: 'text/plain'
  }
}

// Key Vault Secret for Connection String
resource connectionStringSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  name: 'connection-string'
  parent: keyVault
  properties: {
    value: 'Host=${databaseApp.name};Database=${databaseName};Username=booking_user;Password=${databasePassword}'
    contentType: 'text/plain'
  }
}

// Log Analytics Workspace
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logAnalyticsName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

// Storage Account for database persistence
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
  properties: {
    accessTier: 'Cool'
  }
}

// File Share for PostgreSQL data
resource fileShare 'Microsoft.Storage/storageAccounts/fileServices/shares@2023-01-01' = {
  name: '${storageAccount.name}/default/${fileShareName}'
  properties: {
    shareQuota: 1024 // 1GB minimum
  }
}

// Container Apps Environment
resource containerAppEnvironment 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: environmentName
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}

// Storage for Container Apps Environment
resource storage 'Microsoft.App/managedEnvironments/storages@2024-03-01' = {
  name: 'postgres-storage'
  parent: containerAppEnvironment
  properties: {
    azureFile: {
      accountName: storageAccount.name
      accountKey: storageAccount.listKeys().keys[0].value
      shareName: fileShareName
      accessMode: 'ReadWrite'
    }
  }
}

// Database Container App
resource databaseApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: '${namePrefix}-database'
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentityId}': {}
    }
  }
  properties: {
    managedEnvironmentId: containerAppEnvironment.id
    configuration: {
      ingress: {
        external: false
        targetPort: 5432
        transport: 'tcp'
      }
      secrets: [
        {
          name: 'db-password'
          keyVaultUrl: dbPasswordSecret.properties.secretUri
          identity: managedIdentityId
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'postgres'
          image: 'postgres:15'
          env: [
            {
              name: 'POSTGRES_DB'
              value: databaseName
            }
            {
              name: 'POSTGRES_USER'
              value: 'booking_user'
            }
            {
              name: 'POSTGRES_PASSWORD'
              secretRef: 'db-password'
            }
            {
              name: 'PGDATA'
              value: '/var/lib/postgresql/data'
            }
            {
              name: 'POSTGRES_INITDB_ARGS'
              value: '--auth-host=scram-sha-256'
            }
          ]
          resources: {
            cpu: json('0.25')
            memory: '0.5Gi'
          }
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 1
      }
    }
  }
}

// Backend Container App
resource backendApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: '${namePrefix}-backend'
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentityId}': {}
    }
  }
  properties: {
    managedEnvironmentId: containerAppEnvironment.id
    configuration: {
      activeRevisionsMode: revisionMode
      ingress: {
        external: true
        targetPort: 80
        transport: 'http'
        allowInsecure: false
      }
      secrets: [
        {
          name: 'db-password'
          keyVaultUrl: dbPasswordSecret.properties.secretUri
          identity: managedIdentityId
        }
        {
          name: 'connection-string'
          keyVaultUrl: connectionStringSecret.properties.secretUri
          identity: managedIdentityId
        }
      ]
    }
    template: {
      revisionSuffix: revisionSuffix
      containers: [
        {
          name: 'backend'
          image: backendImage
          env: [
            {
              name: 'ASPNETCORE_ENVIRONMENT'
              value: 'Production'
            }
            {
              name: 'ConnectionStrings__DefaultConnection'
              secretRef: 'connection-string'
            }
          ]
          resources: {
            cpu: json('0.25')
            memory: '0.5Gi'
          }
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 1
      }
    }
  }
}

// Frontend Container App
resource frontendApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: '${namePrefix}-frontend'
  location: location
  properties: {
    managedEnvironmentId: containerAppEnvironment.id
    configuration: {
      activeRevisionsMode: revisionMode
      ingress: {
        external: true
        targetPort: 80
        transport: 'http'
        allowInsecure: false
      }
    }
    template: {
      revisionSuffix: revisionSuffix
      containers: [
        {
          name: 'frontend'
          image: frontendImage
          env: [
            {
              name: 'NEXT_PUBLIC_API_URL'
              value: 'https://${backendApp.properties.configuration.ingress.fqdn}'
            }
          ]
          resources: {
            cpu: json('0.25')
            memory: '0.5Gi'
          }
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 1
      }
    }
  }
}

// Outputs
output frontendUrl string = 'https://${frontendApp.properties.configuration.ingress.fqdn}'
output backendUrl string = 'https://${backendApp.properties.configuration.ingress.fqdn}'
output storageAccountName string = storageAccount.name
