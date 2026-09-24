variable "private_subnets" {
  description = "List of private subnets"
  type        = list(string)
}

variable "cidr" {
  description = "CIDR block for the VPC"
  type        = string
}

variable "db_subnet_ids" {
  description = "List of subnet IDs for the database"
  type        = list(string)
}

variable "db_name" {
  description = "Name of the database"
  type        = string
}

variable "db_username" {
  description = "Username for the database"
  type        = string
}

variable "db_port" {
  description = "Port for the database"
  type        = string
}