variable "db_password_secret_name" {
  description = "The Secrets Manager secret name for the database credentials"
  type        = string
}

variable "db_name" {
  description = "The database name"
  type        = string
  default     = "postgres"
}

variable "db_port" {
  description = "The port on which the DB instance accepts connections"
  type        = number
  default     = 5432
}
