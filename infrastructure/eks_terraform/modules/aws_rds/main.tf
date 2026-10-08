data "aws_secretsmanager_secret" "db_password" {
  name = var.db_password_secret_name
}

data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = data.aws_secretsmanager_secret.db_password.id
}

local {
  rds_secret = jsondecode(
    data.aws_secretsmanager_secret_version.db_password.secret_string
  )
}

resource "aws_db_instance" "postgres" {
  allocated_storage    = 10
  db_name              = var.db_name
  engine               = "postgres"
  engine_version       = "13.4"
  instance_class       = "db.t3.micro"

  vpc_security_group_ids = [aws_security_group.sg_rds.id]
  db_subnet_group_name = aws_db_subnet_group.db_subnet_group.name

  username             = local.rds_secret.DB_USERNAME
  password             = local.rds_secret.DB_PASSWORD
  port                 = var.db_port

  skip_final_snapshot  = true
}