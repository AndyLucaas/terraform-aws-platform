output "node_role_arn" {
  value       = aws_iam_role.node_role.arn
  sensitive   = true
  description = "role for node eks"
}
