resource "helm_release" "aws_load_balancer_controller" {
  name       = "aws-load-balancer-controller"
  namespace  = var.namespace
  repository = "https://aws.github.io/eks-charts"
  chart      = "aws-load-balancer-controller"
  version    = "3.6.0"
  wait       = true
  atomic     = true

  set {
    name  = "clusterName"
    value = data.aws_eks_cluster.this.name
  }

  set {
    name  = "region"
    value = "eu-north-1"
  }

  # Le chart va créer le ServiceAccount...
  set {
    name  = "serviceAccount.create"
    value = "true"
  }
  set {
    name  = "serviceAccount.name"
    value = "aws-load-balancer-controller"
  }
  # ... et y injecter l'ARN du rôle IAM que vous avez créé
  set {
    name  = "serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn"
    value = var.role_arn
  }

  # Recommandé avec le VPC CNI pour enregistrer les IPs des pods comme cibles
  set {
    name  = "defaultTargetType"
    value = "ip"
  }
}