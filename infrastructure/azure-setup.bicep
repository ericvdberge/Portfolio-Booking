@description('Location for all resources')
param location string = resourceGroup().location

@description('Name prefix for all resources')
param namePrefix string = 'booking'

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

@description('User principal ID for Key Vault access (optional)')
param userPrincipalId string = ''

@description('Deployment timestamp to force new revisions')
param deploymentTime string = utcNow()

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
    value: 'Host=${databaseApp.name};Database=portfolio_booking;Username=booking_user;Password=${databasePassword}'
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
    accessTier: 'Hot'
  }
}

// File Share for PostgreSQL data
resource fileShare 'Microsoft.Storage/storageAccounts/fileServices/shares@2023-01-01' = {
  name: '${storageAccount.name}/default/${fileShareName}'
  properties: {
    shareQuota: 5120 // 5GB
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

// Managed Identity for Container Apps to access Key Vault
resource containerAppIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: '${namePrefix}-identity'
  location: location
}

// Role assignment for Key Vault Secrets User (Container App Identity)
resource keyVaultRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, containerAppIdentity.id, 'Key Vault Secrets User')
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6') // Key Vault Secrets User
    principalId: containerAppIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

// Role assignment for user access (Key Vault Administrator)
resource userKeyVaultRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = if (!empty(userPrincipalId)) {
  name: guid(keyVault.id, userPrincipalId, 'Key Vault Administrator')
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '00482a5a-887f-4fb3-b363-3b7fe8e74483') // Key Vault Administrator
    principalId: userPrincipalId
    principalType: 'User'
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
  dependsOn: [keyVaultRoleAssignment]
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${containerAppIdentity.id}': {}
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
          identity: containerAppIdentity.id
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
              value: 'portfolio_booking'
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
            cpu: json('0.5')
            memory: '1Gi'
          }
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 1
      }
    }
  }
}

// Backend Container App
resource backendApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: '${namePrefix}-backend'
  location: location
  dependsOn: [keyVaultRoleAssignment]
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${containerAppIdentity.id}': {}
    }
  }
  properties: {
    managedEnvironmentId: containerAppEnvironment.id
    configuration: {
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
          identity: containerAppIdentity.id
        }
        {
          name: 'connection-string'
          keyVaultUrl: connectionStringSecret.properties.secretUri
          identity: containerAppIdentity.id
        }
      ]
    }
    template: {
      revisionSuffix: substring(replace(deploymentTime, ':', ''), 0, 10)
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
            cpu: json('0.5')
            memory: '1Gi'
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
      ingress: {
        external: true
        targetPort: 80
        transport: 'http'
        allowInsecure: false
      }
    }
    template: {
      revisionSuffix: substring(replace(deploymentTime, ':', ''), 0, 10)
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
