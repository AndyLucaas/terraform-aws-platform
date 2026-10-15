variable "cluster_name" {
  type = string
}

variable "node_group_name" {
  type = string
}

variable "node_role_arn" {
  type = string
}

variable "instance_type" {
  type = string
}

variable "eks_role_arn" {
  type = string
}

variable "eks_subnet1_id" {
  type = string
}

variable "eks_subnet2_id" {
  type = string
}

variable "sg_eks_id" {
  type = string
}