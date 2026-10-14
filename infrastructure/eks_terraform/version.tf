terraform {
  required_version = ">= 1.16.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 6.0, < 7.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = ">= 2.12.0, < 3.0.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

}