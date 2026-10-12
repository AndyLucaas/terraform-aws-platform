variable "cluster_name" {
  type = string
}

variable "node_group_name" {
  type = string
}

variable "node_role_arn" {
  type        = string
}

variable "instance_type" {
  type = string
}

variable "eks_role_arn" {
  description = "ARN du rôle IAM pour le cluster EKS"
  type        = string
}

variable "eks_subnet1_id" {
  description = "ID du premier subnet pour EKS"
  type        = string
}

variable "eks_subnet2_id" {
  description = "ID du deuxième subnet pour EKS"
  type        = string
}

variable "sg_eks_id" {
  description = "ID du security group pour EKS"
  type        = string
}