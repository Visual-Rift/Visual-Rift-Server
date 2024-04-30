//  creating security group
resource "aws_security_group" "instance_sg" {
  name        = "vidhant-ec2-sg"
  description = "Security group for the vidhant-ec2 instance"

  // Allow inbound SSH traffic
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  // Allow inbound HTTP traffic
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  // Allow inbound HTTPS traffic
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

 // Allow all inbound traffic from all ports
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  // Allow outbound traffic to all destinations
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


//creating aws-key-pair
resource "aws_key_pair" "vidhat-ec2-key-pair" {
  key_name   = "vidhant-ec2-key-pair"
  public_key = file("./key.pub")
}


resource "aws_instance" "vidhant-ec2" {
  instance_type   = "t2.micro"
  ami             = "ami-0c7217cdde317cfec"
  count           = 1
  security_groups = [aws_security_group.instance_sg.name]
  key_name        = aws_key_pair.vidhat-ec2-key-pair.key_name
  tags = {
    Name = "vidhant-ec2"
  }
}


// get public ip of the instance
output "instance_public_ip" {
  value = aws_instance.vidhant-ec2[0].public_ip
}