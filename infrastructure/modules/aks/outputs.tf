output "aks_cluster_id" {
  value = azurerm_kubernetes_cluster.aks.id
}
output "aks_cluster_name" {
  value = azurerm_kubernetes_cluster.aks.name
}
output "aks_control_plane_fqdn" {
  value = azurerm_kubernetes_cluster.aks.fqdn
}
output "aks_principal_id" {
  value = azurerm_kubernetes_cluster.aks.kubelet_identity[0].object_id
}
