#!/bin/bash

# CHECKING IF REQUIRED ARGUMENTS ARE PROVIDED
if [ $# -ne 4 ]; then
    echo "Mandatory arguments are missing. Usage: $0 <USER_ID> <REGION> <ACCESS_KEY> <SECRET_KEY>"
    exit 1
fi

# ASSIGNING COMMAND-LINE ARGUMENTS TO VARIABLES
USER_ID=$1
REGION=$2
ACCESS_KEY=$3
SECRET_KEY=$4

# CREATING A DIRECTORY WITH THE USER_ID
mkdir -p ../../terraform/$USER_ID

# CHANGING THE WORKING DIRECTORY
cd ../../terraform/$USER_ID

# CREATING MAIN.TF FILE
echo 'terraform {
    required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "5.32.1"
    }
  }
}

provider "aws" {
  region = var.region
  access_key = var.access_key
  secret_key = var.secret_key
}' >> ./main.tf

# -------------- STORE THE AWS CREDENTIALS IN DATABASE ---------------
# CREATING VARIABLES.TF FILE
echo "variable \"region\" {
  description = \"The AWS region\"
  type        = string
  default     = \"$REGION\"
}

variable \"access_key\" {
  description = \"The AWS access key\"
  type        = string
  default     = \"$ACCESS_KEY\"
}

variable \"secret_key\" {
  description = \"The AWS secret key\"
  type        = string
  default     = \"$SECRET_KEY\"
}
" >> ./variables.tf

# INITIALIZING TERRAFORM
terraform init