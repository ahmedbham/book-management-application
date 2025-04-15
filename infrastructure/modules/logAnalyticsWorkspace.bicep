// Defines a Log Analytics Workspace resource

// === PARAMETERS ===
@description('The name of the Log Analytics Workspace.')
param workspaceName string

@description('The Azure region for the Log Analytics Workspace.')
param location string = resourceGroup().location

@description('Tags to apply to the resource.')
param tags object = {}

// === RESOURCES ===
@description('Log Analytics Workspace instance.')
resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: workspaceName
  location: location
  tags: tags
  properties: {
    sku: {
      name: 'PerGB2018' // Example SKU, adjust as needed
    }
    retentionInDays: 30 // Example retention period, adjust as needed
  }
}

// === OUTPUTS ===
@description('The resource ID of the Log Analytics Workspace.')
output workspaceId string = logAnalyticsWorkspace.id

@description('The name of the Log Analytics Workspace.')
output workspaceName string = logAnalyticsWorkspace.name
