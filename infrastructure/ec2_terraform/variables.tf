variable "instance_type" {
  description = "ec2 type"
  type        = string
  default     = "t3.medium"
}
variable "vpc_cidr" {
  description = "cidr of vpc"
  type        = string
}

variable "public_subnets" {
  description = "cidr"
  type        = list(string)
}

variable "vpc_name" {
  description = "vpc name"
  type        = string
}
variable "my_ip" {
  description = "my ip address"
  type        = string
}