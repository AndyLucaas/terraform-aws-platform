variable "sg_eks_name" {
  description = "The name of the EKS security group"
  type        = string
  default     = "eks-cluster-sg"
}

variable "sg_eks_description" {
  description = "The description of the EKS security group"
  type        = string
  default     = "Security group for EKS cluster"
}

variable "vpc_id" {
  description = "The VPC ID where the security groups will be created"
  type        = string
}

variable "tags" {
  description = "Additional tags to merge into the EKS security group"
  type        = map(string)
  default     = {}
}

variable "http_ingress_from_port" {
  description = "The starting port for HTTP ingress traffic"
  type        = number
  default     = 80
}

variable "http_ingress_to_port" {
  description = "The ending port for HTTP ingress traffic"
  type        = number
  default     = 80
}

variable "http_ingress_protocol" {
  description = "The protocol for HTTP ingress traffic"
  type        = string
  default     = "tcp"
}

variable "http_ingress_cidr_block" {
  description = "The IPv4 CIDR block allowed for HTTP ingress"
  type        = string
  default     = "0.0.0.0/0"
}

variable "https_ingress_from_port" {
  description = "The starting port for HTTPS ingress traffic"
  type        = number
  default     = 443
}

variable "https_ingress_to_port" {
  description = "The ending port for HTTPS ingress traffic"
  type        = number
  default     = 443
}

variable "https_ingress_protocol" {
  description = "The protocol for HTTPS ingress traffic"
  type        = string
  default     = "tcp"
}

variable "https_ingress_cidr_block" {
  description = "The IPv4 CIDR block allowed for HTTPS ingress"
  type        = string
  default     = "0.0.0.0/0"
}

variable "sg_rds_name" {
  description = "The name of the RDS security group"
  type        = string
  default     = "rds-sg"
}

variable "sg_rds_description" {
  description = "The description of the RDS security group"
  type        = string
  default     = "Security group for RDS instance"
}

variable "rds_ingress_from_port" {
  description = "The starting port for RDS ingress traffic"
  type        = number
  default     = 5432
}

variable "rds_ingress_to_port" {
  description = "The ending port for RDS ingress traffic"
  type        = number
  default     = 5432
}

variable "rds_ingress_protocol" {
  description = "The protocol for RDS ingress traffic"
  type        = string
  default     = "tcp"
}
