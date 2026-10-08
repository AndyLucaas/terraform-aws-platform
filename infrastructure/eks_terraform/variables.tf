# VPC ===========================================================================
variable "aws_region" {
  type = string
}

variable "VPC_CIDR" {
  type = string
}

variable "VPC_NAME" {
  type = string
}

variable "IGW_NAME" {
  type = string
}

variable "ALB_SUBNET_CIDR" {
  type = string
}

variable "AZ1" {
  type = string
}

variable "ALB_SUBNET_NAME" {
  type = string
}

variable "NGW_SUBNET_CIDR" {
  type = string
}

variable "AZ2" {
  type = string
}

variable "NGW_SUBNET_NAME" {
  type = string
}

variable "EKS_SUBNET1_CIDR" {
  type = string
}

variable "EKS_SUBNET1_NAME" {
  type = string
}

variable "EKS_SUBNET2_CIDR" {
  type = string
}

variable "EKS_SUBNET2_NAME" {
  type = string
}

variable "PRIVATE_SUBNET3_CIDR" {
  type = string
}

variable "PRIVATE_SUBNET3_NAME" {
  type = string
}

variable "PRIVATE_SUBNET4_CIDR" {
  type = string
}

variable "PRIVATE_SUBNET4_NAME" {
  type = string
}

variable "NAT_EIP_NAME" {
  type = string
}

variable "NAT_GW_NAME" {
  type = string
}

variable "ROUTE_CIDR" {
  type = string
}

variable "ROUTE_TO_IGW_NAME" {
  type = string
}

variable "ROUTE_TO_NGW_NAME" {
  type = string
}

variable "IAM_ROLE_NAME" {
  type = string
}

variable "IAM_POLICY_NAME" {
  type = string
}

variable "SG_EKS_NAME" {
  type = string
}

variable "HTTP_INGRESS_FROM_PORT" {
  type = number
}

variable "HTTP_INGRESS_TO_PORT" {
  type = number
}

variable "HTTP_INGRESS_PROTOCOL" {
  type = string
}

variable "HTTP_INGRESS_CIDR_BLOCK" {
  type = string
}

variable "HTTPS_INGRESS_FROM_PORT" {
  type = number
}

variable "HTTPS_INGRESS_TO_PORT" {
  type = number
}

variable "HTTPS_INGRESS_PROTOCOL" {
  type = string
}

variable "HTTPS_INGRESS_CIDR_BLOCK" {
  type = string
}

variable "SG_RDS_NAME" {
  type = string
}

variable "RDS_INGRESS_FROM_PORT" {
  type = number
}

variable "RDS_INGRESS_TO_PORT" {
  type = number
}

variable "RDS_INGRESS_PROTOCOL" {
  type = string
}

variable "EKS_CLUSTER_NAME" {
  type = string
}

variable "EKS_NODE_GROUP_NAME" {
  type = string
}

variable "EKS_INSTANCE_TYPE" {
  type = string
}

variable "DB_NAME" {
  type = string
}

variable "DB_PORT" {
  type = number
}

variable "DB_PASSWORD_SECRET_NAME" {
  type = string
}