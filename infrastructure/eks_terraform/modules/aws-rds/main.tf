data "aws_secretsmanager_secret" "db_password" {
  name = var.db_password_secret_name
}

data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = data.aws_secretsmanager_secret.db_password.id
}

locals {
  rds_secret = jsondecode(
    data.aws_secretsmanager_secret_version.rds.secret_string
  )
}

resource "aws_db_instance_role_association" "pg_role" {
  db_instance_identifier = aws_db_instance.postgres.id
  feature_name           = "DMS_ACCESS"
  role_arn               = aws_iam_role.role.arn
}

resource "aws_db_instance" "postgres" {
  allocated_storage    = 10
  db_name              = var.db_name
  engine               = "postgres"
  engine_version       = "13.4"
  instance_class       = "db.t3.micro"

  vpc_security_group_ids = [aws_security_group.sg_rds.id]
  db_subnet_group_name = aws_db_subnet_group.db_subnet_group.name

  username             = locals.rds_secret.username
  password             = locals.rds_secret.password
  port                 = var.db_port

  skip_final_snapshot  = true
}