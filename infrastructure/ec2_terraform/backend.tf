#pour le bucket s3
terraform {
  backend "s3" {
    bucket = "terraform-bckp-state"
    key    = "sonar_server/terraform.tfstate"
    region = "eu-north-1"
  }
}