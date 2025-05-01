output "postgres_fqdn" {
  value = azurerm_postgresql_flexible_server.psql.fqdn
}
output "postgres_server_id" {
  value = azurerm_postgresql_flexible_server.psql.id
}
output "postgres_server_name" {
  value = azurerm_postgresql_flexible_server.psql.name
}
