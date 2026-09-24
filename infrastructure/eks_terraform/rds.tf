module "db" {
  source = "terraform-aws-modules/rds/aws"

  identifier = "demodb"

  engine            = "postgres"
  engine_version    = "17.0"
  instance_class    = "db.t3.micro"
  allocated_storage = 5
  
  subnet_ids             = var.db_subnet_ids
  vpc_security_group_ids = [module.sg.db_sg_id]

  db_name  = var.db_name
  username = var.db_username
  port     = var.db_port

  iam_database_authentication_enabled = true

  tags = {
    Owner       = "user"
    Environment = "dev"
  }
}