locals {
  oidc_issuer = data.aws_eks_cluster.this.identity[0].oidc[0].issuer
  oidc_id = replace(local.oidc_issuer, "https://", "")
}

resource "aws_iam_openid_connect_provider" "eks" {
  url             = local.oidc_issuer
  client_id_list  = ["sts.amazonaws.com"]
}

#eks alb role ================================================
resource "aws_iam_role" "role_alb" {
  name = var.role_alb_name

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.eks.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "${local.oidc_id}:sub" = "system:serviceaccount:kube-system:aws-load-balancer-controller"
            "${local.oidc_id}:aud" = "sts.amazonaws.com"
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

