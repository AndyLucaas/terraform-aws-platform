output "role_arn" {
  value       = aws_iam_role.role_pods.arn
  sensitive   = true
  description = "role arn for the eks cluster to read from secret manager"
}
