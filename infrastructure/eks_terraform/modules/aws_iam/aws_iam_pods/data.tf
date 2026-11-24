data "aws_iam_policy_document" "read_policy" {
  statement {
    effect = "Allow"
    actions = [
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret"
    ]
    resources = [
      "arn:aws:secretsmanager:eu-north-1:735856058652:secret:prod/secret/database-blvog5",
    ]
  }
}
