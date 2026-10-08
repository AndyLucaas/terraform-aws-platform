# VPC ===========================================================================
variable "vpc_cidr_block" {
  type = string
}

variable "vpc_name" {
  type = string
}

variable "igw_name" {
  type = string
}

variable "alb_subnet_cidr" {
  type = string
}

variable "az1" {
  type = string
}

variable "alb_subnet_name" {
  type = string
}

variable "ngw_subnet_cidr" {
  type = string
}

variable "az2" {
  type = string
}

variable "ngw_subnet_name" {
  type = string
}

variable "private_subnet1_cidr" {
  type = string
}

variable "private_subnet1_name" {
  type = string
}

variable "private_subnet2_cidr" {
  type = string
}

variable "private_subnet2_name" {
  type = string
}

variable "private_subnet3_cidr" {
  type = string
}

variable "private_subnet3_name" {
  type = string
}

variable "private_subnet4_cidr" {
  type = string
}

variable "private_subnet4_name" {
  type = string
}

variable "nat_eip_name" {
  type = string
}

variable "nat_gw_name" {
  type = string
}

variable "route_cidr" {
  type = string
}

variable "route_to_igw_name" {
  type = string
}

variable "route_to_ngw_name" {
  type = string
}

variable "tags" {
  type = map(string)
}

