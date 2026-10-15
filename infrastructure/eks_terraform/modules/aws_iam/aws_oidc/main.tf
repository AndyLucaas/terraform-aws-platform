locals {
  oidc_issuer = data.aws_eks_cluster.this.identity[0].oidc[0].issuer
  oidc_id = replace(local.oidc_issuer, "https://", "")
}

resource "aws_iam_openid_connect_provider" "eks" {
  url             = local.oidc_issuer
  client_id_list  = ["sts.amazonaws.com"]
}
