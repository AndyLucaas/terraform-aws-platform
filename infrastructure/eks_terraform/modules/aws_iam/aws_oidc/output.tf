output "oidc_arn" {
  value       = aws_iam_openid_connect_provider.eks.arn
  sensitive   = true
}

output "oidc_id" {
  value       = aws_iam_openid_connect_provider.eks.id
  sensitive   = true
}

output "oidc_issuer_url" {
  value       = aws_iam_openid_connect_provider.eks.url
}