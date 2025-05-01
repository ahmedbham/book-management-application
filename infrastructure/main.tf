// main.tf - Terraform equivalent of main.bicep for Azure

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location
}

module "acr" {
  source              = "./modules/acr"
  acr_name            = var.acr_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  acr_sku             = var.acr_sku
  acr_admin_enabled   = var.acr_admin_enabled
  tags                = local.tags
}

module "log_analytics" {
  source              = "./modules/logAnalyticsWorkspace"
  workspace_name      = var.log_analytics_workspace_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  tags                = local.tags
}

module "postgres" {
  source                        = "./modules/postgres"
  server_name                   = var.postgres_server_name
  resource_group_name           = azurerm_resource_group.main.name
  location                      = azurerm_resource_group.main.location
  administrator_login           = var.postgres_admin_username
  administrator_login_password  = var.postgres_admin_password
  sku_name                      = var.postgres_sku_name
  postgres_version              = var.postgres_version
  storage_size_gb               = var.postgres_storage_gb
  firewall_rules                = var.postgres_firewall_rules
  tags                          = local.tags
}

module "aks" {
  source                    = "./modules/aks"
  cluster_name              = var.aks_cluster_name
  resource_group_name       = azurerm_resource_group.main.name
  location                  = azurerm_resource_group.main.location
  dns_prefix                = var.aks_dns_prefix
  kubernetes_version        = var.kubernetes_version
  agent_count               = var.aks_agent_count
  agent_vm_size             = var.aks_agent_vm_size
  acr_id                    = module.acr.acr_id
  tags                      = local.tags
  log_analytics_workspace_id = module.log_analytics.workspace_id
}

locals {
  tags = {
    environment = var.environment
    project     = "BookManagementSystem"
  }
}
