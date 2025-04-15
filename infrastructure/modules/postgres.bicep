// Defines an Azure Database for PostgreSQL - Flexible Server instance

// === PARAMETERS ===
@description('The name for the PostgreSQL Flexible Server (must be globally unique).')
@minLength(3)
param serverName string

@description('The Azure region for the PostgreSQL server.')
param location string = resourceGroup().location // Default to resource group's location

@description('The administrator login username for the PostgreSQL server.')
param administratorLogin string

@description('The administrator login password for the PostgreSQL server. MUST be secure!')
@secure() // Marks this parameter as secure, hiding it in logs/outputs
param administratorLoginPassword string

@description('The version of PostgreSQL server to deploy.')
@allowed([
  '16'
  '15'
  '14'
  '13'
  '12'
  '11'
])
param postgresVersion string = '15' // Choose a recent, supported version

@description('The SKU (pricing tier) for the PostgreSQL server.')
param skuName string = 'GP_Gen5_2' // Example for GeneralPurpose tier

@description('The storage size in GB.')
@minValue(32) // Minimum storage for Flexible Server
param storageSizeGB int = 32


// Define allowed firewall rules (example: allow Azure services)
// For production, restrict this to specific IPs (e.g., your AKS outbound IPs)
@description('Array of firewall rules. Example: [{ name: \'AllowAllWindowsAzureIps\', startIpAddress: \'0.0.0.0\', endIpAddress: \'0.0.0.0\' }]')
param firewallRules array = []

@description('Tags to apply to the resource.')
param tags object = {}


// === RESOURCES ===
@description('Azure Database for PostgreSQL - Flexible Server instance.')
resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-03-01-preview' = {
  name: serverName
  location: location
  sku: {
    name: skuName
    tier: 'Burstable' // Explicitly set the tier
  }
  properties: {
    version: postgresVersion
    administratorLogin: administratorLogin
    administratorLoginPassword: administratorLoginPassword
    storage: {
      storageSizeGB: storageSizeGB
    }
    
  }
}

// Define firewall rules based on the parameter array
@description('Configures firewall rules for the PostgreSQL server.')
resource firewallRule 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2023-03-01-preview' = [for rule in firewallRules: {
  name: rule.name
  parent: postgresServer // Associate with the server defined above
  properties: {
    startIpAddress: rule.startIpAddress
    endIpAddress: rule.endIpAddress
  }
}]


// === OUTPUTS ===
@description('The fully qualified domain name (FQDN) of the PostgreSQL server.')
output postgresFqdn string = postgresServer.properties.fullyQualifiedDomainName

@description('The resource ID of the PostgreSQL server.')
output postgresServerId string = postgresServer.id

@description('The name of the PostgreSQL server.')
output postgresServerName string = postgresServer.name
