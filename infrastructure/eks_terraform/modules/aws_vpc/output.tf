output "vpc_id" {
  description = "id of the vpc"
  value       = aws_vpc.web_srv_vpc.id
}

output "eks_subnet1_id" {
  description = "id of the subnet EKS 1"
  value       = aws_subnet.eks_subnet1.id
}

output "eks_subnet2_id" {
  description = "id of the subnet EKS 2"
  value       = aws_subnet.eks_subnet2.id
}

output "private_subnet3_id" {
  description = "id of the private subnet 3"
  value       = aws_subnet.private_subnet3.id
}

output "private_subnet4_id" {
  description = "id of the private subnet 4"
  value       = aws_subnet.private_subnet4.id
}

