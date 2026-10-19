resource "kubernetes_service_v1" "externalService" {
  metadata {
    name = "itticket-postgresql-svc"
    namespace = var.namespace
  }
  spec {
    type = "ExternalName"
    external_name = var.rds_domain
  }
}