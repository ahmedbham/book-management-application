// Defines an Azure Kubernetes Service (AKS) cluster

// === PARAMETERS ===
@description('The name for the AKS cluster.')
param clusterName string

@description('The Azure region for the AKS cluster.')
param location string = resourceGroup().location

@description('The DNS prefix for the AKS cluster FQDN.')
param dnsPrefix string

@description('The Kubernetes version for the AKS cluster.')
// Check available versions in your region: az aks get-versions --location <location> -o table
param kubernetesVersion string = '1.28.5' // Example: Use a recent, supported version

@description('The number of nodes (VMs) in the system node pool.')
@minValue(1)
@maxValue(100) // Adjust max as needed
param agentCount int = 2 // Default node count

@description('The size of the Virtual Machines to use for the nodes.')
// Example sizes: Standard_B2s, Standard_D2s_v3, Standard_D4s_v3 etc.
param agentVMSize string = 'Standard_B2s' // Choose appropriate size

@description('The resource ID of the Azure Container Registry to integrate with.')
param acrId string

@description('Tags to apply to the resource.')
param tags object = {}

@description('The resource ID of the Log Analytics Workspace.')
param logAnalyticsWorkspaceId string

// === VARIABLES ===
// Correct usage of subscriptionResourceId for role definition
var acrPullRoleDefinitionId = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d')

// === RESOURCES ===

// Get a reference to the existing Azure Container Registry
resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' existing = {
  name: last(split(acrId, '/')) // Extract ACR name from the resource ID
  // Assuming the ACR is in the same subscription and resource group by default.
  // If the ACR is in a different scope, you'll need to specify its scope property.
  // scope: resourceGroup(subscriptionId, resourceGroupName) // Example if in a different RG
}

@description('Azure Kubernetes Service (AKS) cluster instance.')
resource aksCluster 'Microsoft.ContainerService/managedClusters@2024-02-01' = {
  name: clusterName
  location: location
  tags: tags
  // Use System Assigned Managed Identity for the cluster control plane
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    kubernetesVersion: kubernetesVersion
    dnsPrefix: dnsPrefix
    // Define the default (system) node pool
    agentPoolProfiles: [
      {
        name: 'systempool' // Default system node pool name
        count: agentCount
        vmSize: agentVMSize
        osType: 'Linux'
        mode: 'System' // System node pools are required
        // Add other properties like availability zones, osDiskSizeGB if needed
      }
    ]
    // Network profile (Kubenet is simpler, Azure CNI recommended for production)
    networkProfile: {
      networkPlugin: 'azure' // Use 'azure' for Azure CNI
      networkPluginMode: 'overlay' // Specify overlay mode for Azure CNI Overlay
      podCidr: '192.168.0.0/16'
    }
    // Enable RBAC
    enableRBAC: true
    // Optional: Add monitoring, addons (e.g., http_application_routing, azurepolicy)
    addonProfiles: {
      omsagent: { // Azure Monitor for containers
        enabled: true
        config: {
          logAnalyticsWorkspaceResourceID: logAnalyticsWorkspaceId // Reference the Log Analytics Workspace
        }
      }
      
    }
  }
}

// Assign the AcrPull role to the AKS cluster's managed identity to allow pulling images from the specified ACR
@description('Assigns AcrPull role to AKS Managed Identity for the specified ACR.')
resource acrPullRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(aksCluster.id, acrId, acrPullRoleDefinitionId) // Generate a unique GUID for the role assignment name
  scope: acr // Now references the 'acr' resource defined above
  properties: {
    roleDefinitionId: acrPullRoleDefinitionId
    principalId: aksCluster.identity.principalId // The principal ID of the AKS cluster's system-assigned managed identity
    principalType: 'ServicePrincipal'
  }
}

// === OUTPUTS ===
@description('The resource ID of the AKS cluster.')
output aksClusterId string = aksCluster.id

@description('The name of the AKS cluster.')
output aksClusterName string = aksCluster.name

@description('The FQDN of the AKS cluster control plane.')
output aksControlPlaneFqdn string = aksCluster.properties.fqdn

@description('The Principal ID of the AKS cluster managed identity.')
output aksPrincipalId string = aksCluster.identity.principalId
