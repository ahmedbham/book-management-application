resource "azurerm_kubernetes_cluster" "aks" {
  name                = var.cluster_name
  location            = var.location
  resource_group_name = var.resource_group_name
  dns_prefix          = var.dns_prefix
  kubernetes_version  = var.kubernetes_version
  default_node_pool {
    name       = "systempool"
    node_count = var.agent_count
    vm_size    = var.agent_vm_size
  }

  identity {
    type = "SystemAssigned"
  }

  addon_profile {
    oms_agent {
      enabled                    = true
      log_analytics_workspace_id = var.log_analytics_workspace_id
    }
  }

  role_based_access_control_enabled = true

  tags = var.tags
}

resource "azurerm_role_assignment" "aks_acr_pull" {
  scope                = var.acr_id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_kubernetes_cluster.aks.kubelet_identity[0].object_id
}
