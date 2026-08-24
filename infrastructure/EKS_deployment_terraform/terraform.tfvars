aws_region = "eu-north-1"
vpc_name   = "eks-vpc"
vpc_cidr   = "10.0.0.0/16"
public_subnets = [
  "10.0.1.0/24",
  "10.0.2.0/24"
]
private_subnets = [
  "10.0.10.0/24",
  "10.0.20.0/24",
]
s3_bucket_name = "bucket-terraform-9386"
instance_type  = "t2.small"
availability_zones = [
  "eu-north-1a",
  "eu-north-1b"
]