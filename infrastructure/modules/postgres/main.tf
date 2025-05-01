resource "azurerm_postgresql_flexible_server" "psql" {
  name                   = var.server_name
  resource_group_name    = var.resource_group_name
  location               = var.location
  administrator_login    = var.administrator_login
  administrator_password = var.administrator_login_password
  sku_name               = var.sku_name
  version                = var.postgres_version
  storage_mb             = var.storage_size_gb * 1024
  tags                   = var.tags
}

resource "azurerm_postgresql_flexible_server_firewall_rule" "psql_fw" {
  for_each = { for rule in var.firewall_rules : rule.name => rule }
  name                = each.value.name
  server_id           = azurerm_postgresql_flexible_server.psql.id
  start_ip_address    = each.value.start_ip_address
  end_ip_address      = each.value.end_ip_address
}
