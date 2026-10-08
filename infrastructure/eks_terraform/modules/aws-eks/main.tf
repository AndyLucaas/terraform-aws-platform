resource "aws_eks_cluster" "eks_cluster" {
  name     = var.cluster_name
  role_arn = aws_iam_role.eks_role.arn

  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = [aws_security_group.sg_eks.id]
  }

  tags ={
    Name = var.cluster_name
    managed_by = "Terraform"
  }
}

resource "aws_eks_node_group" "node_group" {
  cluster_name    = aws_eks_cluster.eks_cluster.name
  node_group_name = var.node_group_name
  node_role_arn   = var.node_role_arn
  subnet_ids      = var.subnet_ids
  instance_types = [var.instance_type]
  scaling_config {
    desired_size = 2
    max_size     = 4
    min_size     = 2
  }

  update_config {
    max_unavailable = 1
  }

    tags = {
        Name = var.node_group_name
    }
}