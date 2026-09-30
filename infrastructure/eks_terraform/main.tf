locals {
  common_tags = {
    Project     = "itdesk"
    Environment = "dev"
    ManagedBy   = "Terraform"
  }
}

module "vpc" {
  source = "./modules/aws-vpc"

}
module "eks" {
  source = "./modules/aws-eks"

}
module "rds" {
  source = "./modules/aws-rds"

}