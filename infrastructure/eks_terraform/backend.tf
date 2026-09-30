terraform {
  backend "s3" {
    bucket = "terraform-bckp-state"
    key    = "terraform_state/terraform.tfstate"
    region = "eu-north-1"
  }
}