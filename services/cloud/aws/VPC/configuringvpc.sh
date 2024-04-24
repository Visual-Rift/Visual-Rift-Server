#!/bin/bash
terraform init
terraform apply -var "cidr_block=$1" -var "Name=$2" --auto-approve