vpc_name = "jenkins-vpc"
vpc_cidr = "10.0.0.0/16"
private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
public_subnets = ["10.0.10.0/24", "10.0.20.0/24"]
jenkins_security_group = "jenkins-sg"
instance_type = "m7i-flex.large"
jenkins_instance_name = "jenkins-server"
s3_bucket_name = "bucket-terraform-9386"