variable "source" {
  type = string
  description = "source"
  default     = "hashicorp/aws"
}

variable "version" {
  type = string
  description = "version"
  default     = "5.32.1"
}

variable "region" {
  type = string
  description = "region"
  default     = "us-east-1"
}

variable "access_key" {
  type = string
  description = "access key"
}

variable "secret_key" {
  type = string
  description = "secret key"
}

terraform {
      required_providers {
      aws = {
        source = var.source
        version = var.version
      }
    }
  }

 provider "aws" {
  region = var.region
  access_key = var.access_key
  secret_key = var.secret_key
}
