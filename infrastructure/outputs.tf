// outputs.tf - Key outputs for Azure resources

output "acr_login_server" {
  description = "The login server hostname for the deployed ACR instance."
  value       = azurerm_container_registry.acr.login_server
}

output "acr_id" {
  description = "The resource ID of the deployed ACR instance."
  value       = azurerm_container_registry.acr.id
}

output "postgres_fqdn" {
  description = "The fully qualified domain name (FQDN) of the PostgreSQL server."
  value       = azurerm_postgresql_flexible_server.psql.fqdn
}

output "postgres_server_id" {
  description = "The resource ID of the PostgreSQL server."
  value       = azurerm_postgresql_flexible_server.psql.id
}

output "aks_cluster_name" {
  description = "The name of the AKS cluster."
  value       = azurerm_kubernetes_cluster.aks.name
}

output "aks_control_plane_fqdn" {
  description = "The FQDN of the AKS cluster control plane."
  value       = azurerm_kubernetes_cluster.aks.fqdn
}
