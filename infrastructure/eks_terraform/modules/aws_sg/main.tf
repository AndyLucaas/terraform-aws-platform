#sg for alb ==================================================
resource "aws_security_group" "sg_alb" {
  name        = var.sg_alb_name
  description = "security group for alb"
  vpc_id      = aws_vpc.vpc.id

  tags =
    {
      Name = var.sg_alb_name
      managed_by = "Terraform"
    }
}
resource "aws_vpc_security_group_ingress_rule" "sg_alb_egress" {
  description       = "allow all outbound traffic"
  from_port         = var.alb_ingress_from_port
  to_port           = var.alb_ingress_to_port
  ip_protocol       = var.alb_ingress_protocol
  cidr_ipv4         = var.alb_ingress_cidr_block
  security_group_id = aws_security_group.sg_alb.id

  tags = {
    Name = "${var.sg_alb_name}-ingress"
    managed_by = "Terraform"
  }
}

resource "aws_vpc_security_group_egress_rule" "sg_alb_egress" {
  description       = "allow all outbound traffic"
  from_port         = var.alb_egress_from_port
  to_port           = var.alb_egress_to_port
  ip_protocol       = var.alb_egress_protocol
  cidr_ipv4         = var.alb_egress_cidr_block
  security_group_id = aws_security_group.sg_alb.id

  tags = {
    Name = "${var.sg_alb_name}-egress"
    managed_by = "Terraform"
  }
}

resource "aws_vpc_security_group_ingress_rule" "sg_alb_ingress" {
  description       = "allow http and https trafics"
  from_port         = var.alb_ingress_from_port
  to_port           = var.alb_ingress_to_port
  ip_protocol       = var.alb_ingress_protocol
  cidr_ipv4         = var.alb_ingress_cidr_block
  security_group_id = aws_security_group.sg_alb.id

  tags = {
    Name = "${var.sg_alb_name}-ingress"
    managed_by = "Terraform"
  }
}
# sg for eks cluster ============================================
resource "aws_security_group" "sg_eks" {
  name        = var.sg_eks_name
  description = "security group for eks"
  vpc_id      = aws_vpc.vpc.id

  tags =
    {
      Name = var.sg_eks_name
      managed_by = "Terraform"
    }
}

resource "aws_vpc_security_group_ingress_rule" "sg_http_ingress" {
  description       = "allow http trafics"
  from_port         = var.http_ingress_from_port
  to_port           = var.http_ingress_to_port
  ip_protocol       = var.http_ingress_protocol
  cidr_ipv4         = var.http_ingress_cidr_block
  security_group_id = aws_security_group.sg_eks.id

  tags = {
    Name = "${var.sg_eks_name}-http-ingress"
    managed_by = "Terraform"
  }
}

resource "aws_vpc_security_group_ingress_rule" "sg_https_ingress" {
  description       = "allow https trafics"
  from_port         = var.https_ingress_from_port
  to_port           = var.https_ingress_to_port
  ip_protocol       = var.https_ingress_protocol
  cidr_ipv4         = var.https_ingress_cidr_block
  security_group_id = aws_security_group.sg_eks.id

  tags = {
    Name = "${var.sg_eks_name}-https-ingress"
    managed_by = "Terraform"
  }
}

#sg for rds ===========================================
resource "aws_security_group" "sg_rds" {
  name        = var.sg_rds_name
  description = "security group for rds"
  vpc_id      = aws_vpc.vpc.id

  tags = 
    {
      Name = var.sg_rds_name
      managed_by = "Terraform"
    }

}
resource "aws_vpc_security_group_ingress_rule" "sg_rds_ingress" {
  description       = "allow connexion to rds from eks only"
  from_port         = var.rds_ingress_from_port
  to_port           = var.rds_ingress_to_port
  ip_protocol       = var.rds_ingress_protocol
  security_group_id = aws_security_group.sg_rds.id
  referenced_security_group_id = aws_security_group.sg_eks.id
  tags = {
    Name = "${var.sg_rds_name}-ingress"
    managed_by = "Terraform"
  }
}