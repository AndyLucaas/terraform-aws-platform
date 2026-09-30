# sg for eks cluster .....................

resource "aws_security_group" "sg_eks" {
  name        = var.sg_name
  description = var.sg_description
  vpc_id      = var.vpc_id

  tags = merge(
    {
      Name = var.sg_name
      managed_by = "Terraform"
    },
    var.tags,
  )
}

resource "aws_vpc_security_group_ingress_rule" "sg_http_ingress" {
  description       = "allow HTTP trafics"
  from_port         = var.ingress_from_port
  to_port           = var.ingress_to_port
  ip_protocol       = var.ingress_protocol
  cidr_ipv4         = var.ingress_cidr_blocks
  security_group_id = aws_security_group.sg_eks.id

  tags = {
    Name = "${var.sg_name}-ingress"
    managed_by = "Terraform"
  }
}

resource "aws_vpc_security_group_ingress_rule" "sg_https_ingress" {
  description       = "allow HTTPS trafics"
  from_port         = var.ingress_from_port
  to_port           = var.ingress_to_port
  ip_protocol       = var.ingress_protocol
  cidr_ipv4         = var.ingress_cidr_blocks
  security_group_id = aws_security_group.sg_eks.id

  tags = {
    Name = "${var.sg_name}-ingress"
    managed_by = "Terraform"
  }
}

#sg for rds ...............................
resource "aws_security_group" "sg_rds" {
  name        = var.sg_name
  description = var.sg_description
  vpc_id      = var.vpc_id

  tags = 
    {
      Name = var.sg_name
      managed_by = "Terraform"
    }

}
resource "aws_vpc_security_group_ingress_rule" "sg_rds_ingress" {
  description       = "allow RDS from eks only"
  from_port         = var.ingress_from_port
  to_port           = var.ingress_to_port
  ip_protocol       = var.ingress_protocol
  security_group_id = aws_security_group.sg_rds.id
  referenced_security_group_id = aws_security_group.sg_eks.id
  tags = {
    Name = "${var.sg_name}-ingress"
    managed_by = "Terraform"
  }
}