// === PARAMETERS ===
// Parameters needed by the modules, potentially passed from CI/CD or a parameters file

@description('The base name for resources to ensure uniqueness.')
param baseName string = 'bookapp${uniqueString(resourceGroup().id)}' // Example unique name generation

@description('The Azure region for deployment.')
param location string = resourceGroup().location

@description('Admin username for PostgreSQL.')
param postgresAdminUsername string

@description('Admin password for PostgreSQL. Should be passed securely.')
@secure()
param postgresAdminPassword string

@description('Number of nodes for the AKS system node pool.')
param aksAgentCount int = 2

@description('VM Size for the AKS nodes.')
param aksAgentVMSize string = 'Standard_B2s'

@description('Kubernetes version for AKS.')
param kubernetesVersion string = '1.28.5' // Ensure this version is available in your region

@description('Environment tag (e.g., dev, staging, prod).')
param environment string = 'dev'

@description('The name of the Log Analytics Workspace.')
param logAnalyticsWorkspaceName string = '${baseName}law'

// === VARIABLES ===
// Optional: Define variables for consistency
var tags = {
  environment: environment
  project: 'BookManagementSystem'
}
var acrName = '${baseName}acr001' // Ensure minimum length of 5
var postgresServerName = '${baseName}psql'
var aksClusterName = '${baseName}aks'
var aksDnsPrefix = '${baseName}aks' // DNS prefix often same as cluster name or derived

// === MODULES ===
// Reference the module files

@description('Deploys the Azure Container Registry module.')
module acrModule 'modules/acr.bicep' = {
  name: 'acrDeployment' // Deployment name for this module
  params: {
    acrName: acrName
    location: location
    acrSku: 'Standard' // Or parameterize this
    tags: tags
  }
}

@description('Deploys the Azure Database for PostgreSQL module.')
module postgresModule 'modules/postgres.bicep' = {
  name: 'postgresDeployment'
  params: {
    serverName: postgresServerName
    location: location
    administratorLogin: postgresAdminUsername
    administratorLoginPassword: postgresAdminPassword // Pass the secure param
    skuName: 'Standard_B1ms' // Parameterize if needed
    firewallRules: [ // Example: Allow Azure IPs (Adjust for production!)
      {
        name: 'AllowAllWindowsAzureIps'
        startIpAddress: '0.0.0.0'
        endIpAddress: '0.0.0.0'
      }
    ]
    tags: tags
  }
}

@description('Deploys the Log Analytics Workspace module.')
module logAnalyticsWorkspaceModule 'modules/logAnalyticsWorkspace.bicep' = {
  name: 'logAnalyticsWorkspaceDeployment'
  params: {
    workspaceName: logAnalyticsWorkspaceName
    location: location
    tags: tags
  }
}

@description('Deploys the Azure Kubernetes Service module.')
module aksModule 'modules/aks.bicep' = {
  name: 'aksDeployment'
  params: {
    clusterName: aksClusterName
    location: location
    dnsPrefix: aksDnsPrefix
    kubernetesVersion: kubernetesVersion
    agentCount: aksAgentCount
    agentVMSize: aksAgentVMSize
    acrId: acrModule.outputs.acrId
    tags: tags
    logAnalyticsWorkspaceId: logAnalyticsWorkspaceModule.outputs.workspaceId // Correctly referenced
  }
}

// === OUTPUTS ===
// Expose outputs from modules if needed at the main deployment level

@description('ACR Login Server from the module.')
output acrLoginServer string = acrModule.outputs.acrLoginServer

@description('PostgreSQL FQDN from the module.')
output postgresFqdn string = postgresModule.outputs.postgresFqdn

@description('AKS Cluster Name from the module.')
output aksClusterName string = aksModule.outputs.aksClusterName

@description('AKS Control Plane FQDN from the module.')
output aksControlPlaneFqdn string = aksModule.outputs.aksControlPlaneFqdn
