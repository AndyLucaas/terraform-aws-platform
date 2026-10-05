data "aws_iam_policy_document" "read_policy" {
  statement {
    effect = "Allow"
    actions = [
      "secretsmanager:GetSecretValue",
    ]
    resources = [
      "arn:aws:secretsmanager:us-west-2:123456789012:secret:my-secret",

    ]
  }
}