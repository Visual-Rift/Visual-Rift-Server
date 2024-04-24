variable "cidr_block" {
  type        = string
  description = "cidr block"
  default     = "10.0.0.0/16"
}
variable "Name" {
  type        = string
  description = "VPC name"
  default     = "main"
}
resource "aws_vpc" "main" {
  cidr_block       = var.cidr_block
  instance_tenancy = "default"

  tags = {
    Name = var.Name
  }
}