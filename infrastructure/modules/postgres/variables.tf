variable "server_name" { type = string }
variable "resource_group_name" { type = string }
variable "location" { type = string }
variable "administrator_login" { type = string }
variable "administrator_login_password" { type = string }
variable "sku_name" { type = string }
variable "postgres_version" { type = string }
variable "storage_size_gb" { type = number }
variable "firewall_rules" {
  type = list(object({
    name             = string
    start_ip_address = string
    end_ip_address   = string
  }))
}
variable "tags" { type = map(string) }
