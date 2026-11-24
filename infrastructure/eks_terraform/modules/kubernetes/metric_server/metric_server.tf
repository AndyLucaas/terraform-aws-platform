resource "aws_eks_addon" "metrics_server" {
  cluster_name = var.cluster_name
  addon_name   = "metrics-server"
}