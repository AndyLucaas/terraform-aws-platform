variable "private_subnets" {
  description = "List of private subnets"
  type        = list(string)
}

variable "cidr" {
  description = "CIDR block for the VPC"
  type        = string
}