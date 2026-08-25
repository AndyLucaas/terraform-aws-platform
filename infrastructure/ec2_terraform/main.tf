module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = var.vpc_name
  cidr = var.vpc_cidr

  azs            = data.aws_availability_zones.azs.names
  public_subnets = var.public_subnets
  map_public_ip_on_launch = true

  enable_dns_hostnames = true

  tags = {
    Name        = var.vpc_name
    Terraform   = "true"
    Environment = "dev"
  }

  public_subnet_tags = {
    Name = "sonar-subnet"
  }
}
module "sg" {
  source = "terraform-aws-modules/security-group/aws"

  name        = "sonar-sg"
  description = "Security Group for SonarQube Server"
  vpc_id      = module.vpc.vpc_id

  ingress_rules = {
    sonar = {
      from_port   = 9000
      ip_protocol = "tcp"
      cidr_ipv4   = "0.0.0.0/0"
      description = "SonarQube from internal"
    }
    ssh = {
      from_port   = 22
      ip_protocol = "tcp"
      cidr_ipv4   = var.my_ip
      description = "ssh from my IP"
    }
  }

  egress_rules = {
    all = {
      ip_protocol = "-1"
      cidr_ipv4   = "0.0.0.0/0"
    }
  }

  tags = {
    Name = "sonar-sg"
  }
}

module "ec2_instance" {
  source = "terraform-aws-modules/ec2-instance/aws"

  name = "sonar-server"

  instance_type               = var.instance_type
  ami                         = "ami-05bfa4a7765f38076"
  key_name                    = "sonar_srv_key"
  monitoring                  = true
  vpc_security_group_ids      = [module.sg.id]
  subnet_id                   = module.vpc.public_subnets[0]
  associate_public_ip_address = true
  availability_zone           = data.aws_availability_zones.azs.names[0]

  tags = {
    Name        = "sonar-server"
    Terraform   = "true"
    Environment = "dev"
  }
}