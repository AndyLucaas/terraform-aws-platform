data "aws_eks_cluster" "this" {
  name = var.cluster_name
}
data "aws_caller_identity" "current" {}