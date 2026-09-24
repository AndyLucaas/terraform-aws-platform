

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 21.0"

  name               = "eks-cluster"
  kubernetes_version = "1.33"

  compute_config = {
    enabled    = true
    node_pools = ["node_group"]
  }

  vpc_id     = module.vpc.vpc_id
  subnet_ids = var.private_subnets

  eks_managed_node_groups = {
    node_group = {
      # Starting on 1.30, AL2023 is the default AMI type for EKS managed node groups
      ami_type       = "AL2023_x86_64_STANDARD"
      instance_types = ["t3.micro"]

      min_size     = 2
      max_size     = 4
      desired_size = 2
    }

  }
  tags = {
    Environment = "dev"
    Terraform   = "true"
  }
}

