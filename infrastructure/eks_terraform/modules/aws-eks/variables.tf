variable "cluster_name" {
  description = "The name of the EKS cluster"
  type        = string
  default     = "eks-cluster"
}

variable "subnet_ids" {
  description = "Subnet ID used for EKS cluster VPC config (wrapped in a list in main.tf: [var.subnet_ids])"
  type        = string
}

variable "node_group_name" {
  description = "The name of the EKS node group"
  type        = string
  default     = "eks-node-group"
}

variable "instance_type" {
  description = "The EC2 instance type for the EKS node group"
  type        = string
  default     = "t3.medium"
}
