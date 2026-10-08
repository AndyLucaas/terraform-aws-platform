resource "aws_iam_role" "role" {
  name = var.role_name

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "pods.eks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
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

  tags = {
    Name = var.policy_name
  }
}

resource "aws_iam_role_policy_attachment" "attach_sm_policy" {
  role       = aws_iam_role.role.name
  policy_arn = aws_iam_policy.sm_read_policy.arn
}
