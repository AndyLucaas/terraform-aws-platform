module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "webapp-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["eu-west-1a", "eu-west-1b", "eu-west-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  enable_vpn_gateway = false

  tags = {
    Terraform = "true"
    Environment = "dev"
  }
}

module "sg" {
  source = "terraform-aws-modules/security-group/aws"

  name        = "webapp-sg"
  description = "Security Group for Web App"
  vpc_id      = module.vpc.vpc_id

  ingress_rules = {
    http = {
      from_port   = 8080
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
    Name = "webapp-sg"
  }
}

module "alb" {
  
}