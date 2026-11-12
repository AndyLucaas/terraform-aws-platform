resource "kubernetes_namespace_v1" "ns" {
  metadata {
    name = var.namespace
  }
}

resource "kubernetes_service_v1" "externalService" {
  metadata {
    name      = "itticket-postgresql-svc"
    namespace = kubernetes_namespace_v1.ns.metadata[0].name
  }

  spec {
    type          = "ExternalName"
    external_name = var.rds_domain
  }
}
# resource "kubernetes_service_v1" "externalService" {
#   metadata {
#     name = "itticket-postgresql-svc"
#     namespace = var.namespace
#   }
#   spec {
#     type = "ExternalName"
#     external_name = var.rds_domain
#   }
# }