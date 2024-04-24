variable "db_username" {
  type = string
  description = "database username"
  default     = "foo"
}
variable "db_password" {
  type = string
  description = "database password"
  default     = "foobarbaz"
}
variable "db_instance_name" {
  type = string
  default     = "default"
  description = "database instance name"
}
variable "parameter_group_name" {
  type = string
  default     = "default.mysql5.7"
  description = "database parameter group name"
}
variable "allocated_storage" {
  type = string
  default     = "10"
  description = "database allocated storage"
}
resource "aws_db_instance" "default" {
  allocated_storage    = var.allocated_storage
  db_name              = "mydb"
  engine               = "mysql"
  engine_version       = "5.7"
  instance_class       = "db.t3.micro"
  username             = var.db_username
  password             = var.db_password
  parameter_group_name = var.parameter_group_name
  skip_final_snapshot  = true
  identifier           = var.db_instance_name
}