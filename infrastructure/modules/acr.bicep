// Defines an Azure Container Registry instance

// === PARAMETERS ===
// These are inputs to the Bicep file, making it reusable.

// Name for the ACR instance (must be globally unique)
@description('The globally unique name for the Azure Container Registry.')
@minLength(5)
@maxLength(50)
param acrName string

// Azure region where the ACR will be deployed
@description('The Azure region for the ACR instance.')
param location string = resourceGroup().location // Default to resource group's location

// SKU (tier) for the ACR instance
@description('The SKU (tier) for the ACR instance.')
@allowed([
  'Basic'
  'Standard'
  'Premium'
])
param acrSku string = 'Standard'

// Enable admin user (useful for simple auth scenarios, consider alternatives for production)
@description('Specifies whether the admin user is enabled. Default is true.')
param adminUserEnabled bool = true

// Tags to apply to the resource
@description('Tags to apply to the ACR instance.')
param tags object = {}

// === RESOURCES ===
// This section defines the actual Azure resources to be created.

@description('Azure Container Registry instance.')
resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: acrName
  location: location
  sku: {
    name: acrSku
  }
  properties: {
    adminUserEnabled: adminUserEnabled
    // Add other properties like network rulesets if needed
  }
  tags: tags
}

// === OUTPUTS ===
// These are values returned after the deployment, often used by other templates or scripts.

@description('The login server hostname for the deployed ACR instance.')
output acrLoginServer string = acr.properties.loginServer

@description('The resource ID of the deployed ACR instance.')
output acrId string = acr.id

@description('The name of the deployed ACR instance.')
output acrResourceName string = acr.name