variable "instance_type" {
  description = "AWS instance type"
  type        = string
}

variable "ami" {
  description = "AMI ID"
  type        = string
}

variable "port" {
    description = "PORT number"
    type = number
  
}


variable "ec2-name" {
    description = "EC2 instance name"
    type = string
}
