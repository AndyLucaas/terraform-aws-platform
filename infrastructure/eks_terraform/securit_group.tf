module "sg" {
  source = "terraform-aws-modules/security-group/aws"

  name        = "db-sg"
  description = "Security group for database"
  vpc_id      = module.vpc.vpc_id

  ingress_rules = {
    http = {
      from_port   = 8080
      ip_protocol = "tcp"
      cidr_ipv4   = var.private_subnets[0]
    }
  }
}

module "sg" {
  source = "terraform-aws-modules/security-group/aws"

  name        = "eks-sg"
  description = "Security group for EKS cluster"
  vpc_id      = module.vpc.vpc_id

  ingress_rules = {
    http = {
      from_port   = 80
      ip_protocol = "tcp"
      cidr_ipv4   = "0.0.0.0/0"
      description = "Web App from internal"
    }
    https = {
      from_port   = 443
      ip_protocol = "tcp"
      cidr_ipv4   = "0.0.0.0/0"
      description = "Web App HTTPS from internal"
    }
  }

  egress_rules = {
    all = {
      ip_protocol = "-1"
      cidr_ipv4   = "0.0.0.0/0"
    }
  }

  tags = {
    Name = "eks-sg"
  }
}