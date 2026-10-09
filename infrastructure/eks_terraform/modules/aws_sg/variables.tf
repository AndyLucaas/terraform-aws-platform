variable "sg_alb_name" {
  type = string
}

variable "alb_ingress_from_port" {
  type = number
}

variable "alb_ingress_to_port" {
  type = number
}

variable "alb_ingress_protocol" {
  type = string
}

variable "alb_ingress_cidr_block" {
  type = string
}

variable "alb_egress_from_port" {
  type = number
}

variable "alb_egress_to_port" {
  type = number
}

variable "alb_egress_protocol" {
  type = string
}

variable "alb_egress_cidr_block" {
  type = string
}

variable "sg_eks_name" {
  type = string
}

variable "http_ingress_from_port" {
  type = number
}

variable "http_ingress_to_port" {
  type = number
}

variable "http_ingress_protocol" {
  type = string
}

variable "http_ingress_cidr_block" {
  type = string
}

variable "https_ingress_from_port" {
  type = number
}

variable "https_ingress_to_port" {
  type = number
}

variable "https_ingress_protocol" {
  type = string
}

variable "https_ingress_cidr_block" {
  type = string
}

variable "sg_rds_name" {
  type = string
}

variable "rds_ingress_from_port" {
  type = number
}

variable "rds_ingress_to_port" {
  type = number
}

variable "rds_ingress_protocol" {
  type = string
}