output "vpc_id" {
  value       = aws_vpc.web_srv_vpc.id
}

output "eks_subnet1_id" {
  value       = aws_subnet.eks_subnet1.id
}

output "eks_subnet2_id" {
  value       = aws_subnet.eks_subnet2.id
}

output "private_subnet3_id" {
  value       = aws_subnet.private_subnet3.id
}

output "private_subnet4_id" {
  value       = aws_subnet.private_subnet4.id
}

