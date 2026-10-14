resource "helm_release" "aws_load_balancer_controller" {
  name       = "aws-load-balancer-controller"
  namespace  = var.namespace
  repository = "https://aws.github.io/eks-charts"
  chart      = "aws-load-balancer-controller"
  version    = "3.6.0"
  wait       = true
  atomic     = false

  set = [
    {
      name  = "clusterName"
      value = data.aws_eks_cluster.this.name
    },
    {
      name  = "region"
      value = "eu-north-1"
    },
    {
    name  = "vpcId"
    value = var.vpc_id
    },
    # Le chart crée le ServiceAccount...
    {
      name  = "serviceAccount.create"
      value = "true"
    },
    {
      name  = "serviceAccount.name"
      value = "aws-load-balancer-controller"
    },
    # ... et y injecte l'ARN du rôle IAM
    {
      name  = "serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn"
      value = var.role_arn
    },
    # Enregistre les IPs des pods comme cibles (VPC CNI)
    {
      name  = "defaultTargetType"
      value = "ip"
    }
  ]
}