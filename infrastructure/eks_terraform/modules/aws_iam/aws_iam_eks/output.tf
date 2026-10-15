output "role_arn" {
  value       = aws_iam_role.role.arn
  sensitive   = true
  description = "arn role for eks"
}
