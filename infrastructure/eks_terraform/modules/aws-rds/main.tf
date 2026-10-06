resource "aws_db_instance_role_association" "example" {
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
  username             = var.db_username
  password             = "foobarbaz"
  port                 = var.db_port
  skip_final_snapshot  = true
}