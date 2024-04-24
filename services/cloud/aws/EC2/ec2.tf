variable "instance_count" {
  type        = string
  description = "instance count"
  default     = "1"
}
variable "instance_type" {
  type = string
  description = "instance type"
  default     = "t2.micro"
}
variable "ami" {
  type = string
  description = "ami id"
  default     = "ami-03f4878755434977f"
}
variable "Name" {
  type = string
  description = "instance name"
  default     = "testing instance"
}
variable "key_name" {
  type = string
  description = "key pair name"
  default     = "deploy-key"
}
resource "aws_key_pair" "deployer" {
  count      = local.key_pair_exists ? 0 : 1
  key_name   = var.key_name
  public_key = file("${var.key_name}.pem")
}

data "aws_key_pair" "deployer" {
  key_name = var.key_name
}

resource "aws_instance" "My-instance" {
  instance_type = var.instance_type
  ami           = var.ami
  count         = var.instance_count

  key_name = length(data.aws_key_pair.deployer) > 0 ? element(data.aws_key_pair.deployer.*.key_name, 0) : ""

  tags = {
    Name = var.Name
  }
}

locals {
  key_pair_exists = length(data.aws_key_pair.deployer) > 0
}