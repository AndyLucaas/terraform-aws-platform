#alb role ================================================
resource "aws_iam_role" "role_alb" {
  name = var.role_alb_name

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
            "${var.oidc_id}:sub" = "system:serviceaccount:kube-system:aws-load-balancer-controller"
            "${var.oidc_id}:aud" = "sts.amazonaws.com"
          }
        }
      }
    ]
  })

  tags = {
    Name = var.role_alb_name
  }
}

resource "aws_iam_policy" "alb_policy" {
  name   = var.alb_policy
  policy = file("${path.module}/iam_policy.json")
}

resource "aws_iam_role_policy_attachment" "alb_attachement" {
  role       = aws_iam_role.role_alb.name
  policy_arn = aws_iam_policy.alb_policy.arn
}

