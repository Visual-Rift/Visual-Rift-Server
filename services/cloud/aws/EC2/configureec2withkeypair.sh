#!/bin/bash
source keypair.sh "$1"
terraform init
terraform apply \
  -var "key_name=$1" \
  -var "instance_count=$2" \
  -var "instance_type=$3" \
  -var "ami=$4" \
  -var "Name=$5" \
  --auto-approve
