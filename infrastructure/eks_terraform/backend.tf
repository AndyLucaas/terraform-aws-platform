terraform {
  backend "s3" {
    bucket = "terraform-bckp-state2"
    key    = "terraform.tfstate"
    region = "eu-north-1"
  }
}