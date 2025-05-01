// variables.tf - Input variables for Azure resources

variable "resource_group_name" {
  description = "Name of the resource group."
  type        = string
}

variable "location" {
  description = "Azure region for deployment."
  type        = string
}

variable "environment" {
  description = "Environment tag (e.g., dev, staging, prod)."
  type        = string
  default     = "dev"
}

# ACR
variable "acr_name" {
  description = "Globally unique name for the Azure Container Registry."
  type        = string
}
variable "acr_sku" {
  description = "SKU (tier) for the ACR instance."
  type        = string
  default     = "Standard"
}
variable "acr_admin_enabled" {
  description = "Enable admin user for ACR."
  type        = bool
  default     = true
}

# Log Analytics
variable "log_analytics_workspace_name" {
  description = "Name of the Log Analytics Workspace."
  type        = string
}

# PostgreSQL
variable "postgres_server_name" {
  description = "Name for the PostgreSQL Flexible Server."
  type        = string
}
variable "postgres_admin_username" {
  description = "Admin username for PostgreSQL."
  type        = string
}
variable "postgres_admin_password" {
  description = "Admin password for PostgreSQL."
  type        = string
  sensitive   = true
}
variable "postgres_sku_name" {
  description = "SKU for PostgreSQL server."
  type        = string
  default     = "Standard_B1ms"
}
variable "postgres_version" {
  description = "PostgreSQL version."
  type        = string
  default     = "15"
}
variable "postgres_storage_gb" {
  description = "Storage size in GB for PostgreSQL."
  type        = number
  default     = 32
}
variable "postgres_firewall_rules" {
  description = "List of firewall rules for PostgreSQL."
  type = list(object({
    name              = string
    start_ip_address  = string
    end_ip_address    = string
  }))
  default = [
    {
      name             = "AllowAllWindowsAzureIps"
      start_ip_address = "0.0.0.0"
      end_ip_address   = "0.0.0.0"
    }
  ]
}

# AKS
variable "aks_cluster_name" {
  description = "Name for the AKS cluster."
  type        = string
}
variable "aks_dns_prefix" {
  description = "DNS prefix for the AKS cluster."
  type        = string
}
variable "kubernetes_version" {
  description = "Kubernetes version for AKS."
  type        = string
  default     = "1.28.5"
}
variable "aks_agent_count" {
  description = "Number of nodes in the AKS system node pool."
  type        = number
  default     = 2
}
variable "aks_agent_vm_size" {
  description = "VM size for AKS nodes."
  type        = string
  default     = "Standard_B2s"
}
