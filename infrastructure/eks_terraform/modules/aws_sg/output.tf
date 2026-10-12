output "sg_eks_id" {
  value       = aws_security_group.sg_eks.id
  description = "security group id for the eks cluster"
}

output "sg_rds_id" {
  value       = aws_security_group.sg_rds.id
  description = "security group id for the rds instance"
}