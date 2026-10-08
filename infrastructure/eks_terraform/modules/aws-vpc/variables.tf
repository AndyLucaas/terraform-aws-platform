variable "vpc_cidr_block" {
  description = "The CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "vpc_name" {
  description = "The name tag for the VPC"
  type        = string
  default     = "web-srv-vpc"
}

variable "igw_name" {
  description = "The name tag for the Internet Gateway"
  type        = string
  default     = "igw"
}

variable "alb_subnet_cidr" {
  description = "The CIDR block for the Application Load Balancer subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "az1" {
  description = "The first availability zone"
  type        = string
  default     = "eu-north-1a"
}

variable "alb_subnet_name" {
  description = "The name tag for the ALB subnet"
  type        = string
  default     = "alb-subnet"
}

variable "ngw_subnet_cidr" {
  description = "The CIDR block for the NAT Gateway subnet"
  type        = string
  default     = "10.0.2.0/24"
}

variable "az2" {
  description = "The second availability zone"
  type        = string
  default     = "eu-north-1b"
}

variable "ngw_subnet_name" {
  description = "The name tag for the NAT Gateway subnet"
  type        = string
  default     = "ngw-subnet"
}

variable "private_subnet1_cidr" {
  description = "The CIDR block for private subnet 1"
  type        = string
  default     = "10.0.3.0/24"
}

variable "private_subnet1_name" {
  description = "The name tag for private subnet 1"
  type        = string
  default     = "private-subnet-1"
}

variable "private_subnet2_cidr" {
  description = "The CIDR block for private subnet 2"
  type        = string
  default     = "10.0.4.0/24"
}

variable "private_subnet2_name" {
  description = "The name tag for private subnet 2"
  type        = string
  default     = "private-subnet-2"
}

variable "private_subnet3_cidr" {
  description = "The CIDR block for private subnet 3"
  type        = string
  default     = "10.0.5.0/24"
}

variable "private_subnet3_name" {
  description = "The name tag for private subnet 3"
  type        = string
  default     = "private-subnet-3"
}

variable "private_subnet4_cidr" {
  description = "The CIDR block for private subnet 4"
  type        = string
  default     = "10.0.6.0/24"
}

variable "private_subnet4_name" {
  description = "The name tag for private subnet 4"
  type        = string
  default     = "private-subnet-4"
}

variable "nat_eip_name" {
  description = "The name tag for the NAT Gateway Elastic IP"
  type        = string
  default     = "nat-eip"
}

variable "nat_gw_name" {
  description = "The name tag for the NAT Gateway"
  type        = string
  default     = "nat-gw"
}

variable "route_cidr" {
  description = "The destination CIDR block for the route table entries"
  type        = string
  default     = "0.0.0.0/0"
}

variable "private_rt_name" {
  description = "The name tag for the route tables"
  type        = string
  default     = "private-rt"
}
