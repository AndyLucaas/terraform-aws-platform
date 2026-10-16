resource "helm_release" "eso" {
  name       = "external-secrets"
  namespace  = var.namespace
  repository = "https://charts.external-secrets.io"
  chart      = "external-secrets"
  version    = "2.12.0"
  create_namespace = true
  wait       = true
  atomic     = false

  set = [
    {
      name  = "clusterName"
      value = var.cluster_name
    },
    {
      name  = "region"
      value = "eu-north-1"
    },
    {
    name  = "vpcId"
    value = var.vpc_id
    },
    {
      name  = "serviceAccount.create"
      value = "true"
    },
    {
      name  = "serviceAccount.name"
      value = var.srv_acc_name
    },

    {
      name  = "serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn"
      value = var.role_arn
    }
  ]
}