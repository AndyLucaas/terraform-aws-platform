module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "webapp-vpc"
  cidr = var.cidr

  azs             = data.aws_availability_zones.azs.names
  private_subnets = var.private_subnets

  enable_nat_gateway = true
  enable_vpn_gateway = false

  tags = {
    Terraform = "true"
    Environment = "dev"
  }
}
