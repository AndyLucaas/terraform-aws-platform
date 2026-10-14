output "role_arn" {
  value       = aws_iam_role.role.arn
  sensitive   = true
  description = "role arn for the eks cluster to read from secret manager"
}

output "node_role_arn" {
  value       = aws_iam_role.node_role.arn
  sensitive   = true
  description = "role for node eks"
}
