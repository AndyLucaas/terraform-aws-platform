module "vpc" {
  source         = "./modules/aws_vpc"
  vpc_cidr_block = var.VPC_CIDR
  vpc_name       = var.VPC_NAME

  #about internet gateway ===========================
  igw_name = var.IGW_NAME

  #subnet for alb ==========================
  alb_subnet_cidr = var.ALB_SUBNET_CIDR
  az1             = var.AZ1
  alb_subnet_name = var.ALB_SUBNET_NAME

  #subnet for ngw ==========================
  ngw_subnet_cidr = var.NGW_SUBNET_CIDR
  az2             = var.AZ2
  ngw_subnet_name = var.NGW_SUBNET_NAME

  # subnets for eks ======================================
  eks_subnet1_cidr = var.EKS_SUBNET1_CIDR
  eks_subnet1_name = var.EKS_SUBNET1_NAME
  eks_subnet2_cidr = var.EKS_SUBNET2_CIDR
  eks_subnet2_name = var.EKS_SUBNET2_NAME

  #subnets for rds ======================================
  private_subnet3_cidr = var.PRIVATE_SUBNET3_CIDR
  private_subnet3_name = var.PRIVATE_SUBNET3_NAME
  private_subnet4_cidr = var.PRIVATE_SUBNET4_CIDR
  private_subnet4_name = var.PRIVATE_SUBNET4_NAME

  #nat gateway ================================================
  nat_eip_name = var.NAT_EIP_NAME
  nat_gw_name  = var.NAT_GW_NAME

  # route table to get to internet gateway =========================================
  route_cidr        = var.ROUTE_CIDR
  route_to_igw_name = var.ROUTE_TO_IGW_NAME
  route_to_ngw_name = var.ROUTE_TO_NGW_NAME

}
module "iam" {
  source = "./modules/aws_iam"

  role_name   = var.IAM_ROLE_NAME
  policy_name = var.IAM_POLICY_NAME

}
module "sg" {
  source = "./modules/aws_sg"

  #sg for alb ===========================================
  sg_alb_name              = var.SG_ALB_NAME
  http_ingress_from_port   = var.HTTP_INGRESS_FROM_PORT
  http_ingress_to_port     = var.HTTP_INGRESS_TO_PORT
  http_ingress_protocol    = var.HTTP_INGRESS_PROTOCOL
  http_ingress_cidr_block  = var.HTTP_INGRESS_CIDR_BLOCK
  https_ingress_from_port  = var.HTTPS_INGRESS_FROM_PORT
  https_ingress_to_port    = var.HTTPS_INGRESS_TO_PORT
  https_ingress_protocol   = var.HTTPS_INGRESS_PROTOCOL
  https_ingress_cidr_block = var.HTTPS_INGRESS_CIDR_BLOCK

  alb_egress_from_port = var.ALB_EGRESS_FROM_PORT
  alb_egress_to_port   = var.ALB_EGRESS_TO_PORT
  alb_egress_protocol  = var.ALB_EGRESS_PROTOCOL

  #sg for eks ==========================================
  sg_eks_name           = var.SG_EKS_NAME
  eks_ingress_from_port = var.EKS_INGRESS_FROM_PORT
  eks_ingress_to_port   = var.EKS_INGRESS_TO_PORT
  eks_ingress_protocol  = var.EKS_INGRESS_PROTOCOL

  eks_egress_from_port = var.EKS_EGRESS_FROM_PORT
  eks_egress_to_port   = var.EKS_EGRESS_TO_PORT
  eks_egress_protocol  = var.EKS_EGRESS_PROTOCOL

  #sg for rds ===========================================
  sg_rds_name           = var.SG_RDS_NAME
  rds_ingress_from_port = var.RDS_INGRESS_FROM_PORT
  rds_ingress_to_port   = var.RDS_INGRESS_TO_PORT
  rds_ingress_protocol  = var.RDS_INGRESS_PROTOCOL

}

module "eks" {
  source = "./modules/aws_eks"

  cluster_name    = var.EKS_CLUSTER_NAME
  node_group_name = var.EKS_NODE_GROUP_NAME
  instance_type   = var.EKS_INSTANCE_TYPE

}
module "rds" {
  source = "./modules/aws_rds"

  db_name                 = var.DB_NAME
  db_port                 = var.DB_PORT
  subnet_ids              = module.vpc.private_subnet_ids
  db_password_secret_name = var.DB_PASSWORD_SECRET_NAME
}