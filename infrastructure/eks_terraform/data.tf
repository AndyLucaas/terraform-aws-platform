data "aws_availability_zones" "available" {
  state = "available"
}
data "aws_eks_cluster" "this" {
  name       = var.EKS_CLUSTER_NAME
  depends_on = [module.eks]
}