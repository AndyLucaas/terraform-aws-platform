terraform {
  backend "s3" {
    bucket = "s3-terraform-state-735856058652"
    key    = "terraform.tfstate"
    region = "eu-north-1"
  }
}