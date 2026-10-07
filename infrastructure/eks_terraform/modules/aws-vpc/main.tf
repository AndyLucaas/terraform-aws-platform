resource "aws_vpc" "web_srv_vpc" {
    cidr_block = var.vpc_cidr_block
    enable_dns_support   = true
    enable_dns_hostnames = true

    tags = {
        Name = var.vpc_name
        managed_by = "Terraform"
    }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.web_srv_vpc.id

  tags = {
    Name = var.igw_name
  }

}

# subnet for load balancer ======================================
resource "aws_subnet" "public_subnet1" {
  vpc_id     = aws_vpc.web_srv_vpc.id
  cidr_block = var.public_subnet1_cidr
  availability_zone = var.az1

  tags = {
    Name = var.public_subnet1_name
    "kubernetes.io/role/elb" = "1"
  }

}
# subnet for gateway ======================================
resource "aws_subnet" "public_subnet2" {
  vpc_id     = aws_vpc.web_srv_vpc.id
  cidr_block = var.public_subnet2_cidr
  availability_zone = var.az2

  tags = {
    Name = var.public_subnet2_name
    "kubernetes.io/role/elb" = "1"
  }

}

# subnets for eks ======================================
resource "aws_subnet" "private_subnet1" {
  vpc_id     = aws_vpc.web_srv_vpc.id
  cidr_block = var.private_subnet1_cidr
  availability_zone = var.az1

  tags = {
    Name = var.private_subnet1_name
    "kubernetes.io/role/internal-elb"             = "1"  
  }

}

resource "aws_subnet" "private_subnet2" {
  vpc_id     = aws_vpc.web_srv_vpc.id
  cidr_block = var.private_subnet2_cidr
  availability_zone = var.az2

  tags = {
    Name = var.private_subnet2_name
    "kubernetes.io/role/internal-elb"             = "1"  
  }

}

#subnets for rds ======================================
resource "aws_subnet" "private_subnet3" {
  vpc_id     = aws_vpc.web_srv_vpc.id
  cidr_block = var.private_subnet3_cidr
  availability_zone = var.az1

  tags = {
    Name = var.private_subnet3_name
  }

}

resource "aws_subnet" "private_subnet4" {
  vpc_id     = aws_vpc.web_srv_vpc.id
  cidr_block = var.private_subnet4_cidr
  availability_zone = var.az2

  tags = {
    Name = var.private_subnet4_name
  }

}

#nat gateway ======================================
resource "aws_eip" "nat_eip" {
  domain = "vpc"

  tags = {
    Name = var.nat_eip_name
  }
}

resource "aws_nat_gateway" "nat_gw" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.public_subnet1.id

  tags = {
    Name = var.nat_gw_name
  }
}
# route table to get to internet gateway =========================================
resource "aws_route_table" "route1" {
  vpc_id = aws_vpc.web_srv_vpc.id

  route {
    cidr_block = var.route_cidr
    gateway_id = aws_internet_gateway.igw.id
  }
  tags = {
    Name = var.private_rt_name
  }
}

#route private subnet to nat gateway =========================================
resource "aws_route_table" "route2" {
  vpc_id = aws_vpc.web_srv_vpc.id

  route {
    cidr_block = var.route_cidr
    nat_gateway_id = aws_nat_gateway.nat_gw.id
  }
  tags = {
    Name = var.private_rt_name
  }
}
#route table from public subnet1 to internet gateway =========================================
resource "aws_route_table_association" "route_association1" {
  subnet_id = aws_subnet.public_subnet1.id
  route_table_id = aws_route_table.route1.id

  tags = {
    Name = var.pb_rt_ass1_name
  }
}

#route table association for nat gateway to internet gateway =========================================
resource "aws_route_table_association" "route_association2" {
  subnet_id = aws_subnet.public_subnet2.id
  route_table_id = aws_route_table.route1.id

  tags = {
    Name = var.pb_rt_ass1_name
  }
}

# route for private subnets to access internet via ngw =========================================
resource "aws_route_table_association" "route_assocition3" {
  subnet_id      = aws_subnet.private_subnet1.id
  route_table_id = aws_route_table.route2.id

  tags = {
    Name = var.public_rt_assoc1_name
  }
}   

resource "aws_route_table_association" "route_association4" {
  subnet_id      = aws_subnet.private_subnet2.id
  route_table_id = aws_route_table.route2.id

  tags = {
    Name = var.private_rt_assoc2_name
  }
}

