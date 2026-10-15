#eks cluster role ================================================
resource "aws_iam_role" "role_pods" {
  name = var.role_name

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = var.oidc_arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "${var.oidc_id}:sub" = "system:serviceaccount:${var.namespace}:${var.service_account_name}"
            "${var.oidc_id}:aud" = "sts.amazonaws.com"
          }
        }
      }
    ]
  })

  tags = {
    Name = var.role_name
  }
}

resource "aws_iam_policy" "sm_read_policy" {
  name        = var.policy_name
  description = "allow eks to read from secret manager"
  policy = data.aws_iam_policy_document.read_policy.json
}

resource "aws_iam_role_policy_attachment" "attach_sm_policy" {
  role       = aws_iam_role.role_pods.name
  policy_arn = aws_iam_policy.sm_read_policy.arn
}



