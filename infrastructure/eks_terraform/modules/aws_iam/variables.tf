variable "role_name" {
  description = "The name of the IAM role"
  type        = string
  default     = "eks-rds-role"
}

variable "policy_name" {
  description = "The name of the Secrets Manager read policy"
  type        = string
  default     = "secrets-manager-read-policy"
}

variable "instance_profile_name" {
  description = "The name of the IAM instance profile"
  type        = string
  default     = "lab03-profile"
}
