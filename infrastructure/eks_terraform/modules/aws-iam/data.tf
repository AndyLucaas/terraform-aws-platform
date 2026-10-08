data "aws_iam_policy_document" "read_policy" {
  statement {
    effect = "Allow"
    actions = [
      "secretsmanager:GetSecretValue",
    ]
    resources = [
      "arn:aws:secretsmanager:eu-north-1:401811812804:secret:prod/secret/database-8rSFgB",
    ]
  }
}