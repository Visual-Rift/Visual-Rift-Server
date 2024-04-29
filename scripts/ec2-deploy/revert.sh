#!/bin/bash

if [ $# -ne 4 ]; then
    echo "Usage: $0 <PORT> <INSTANCE_TYPE> <AMI> <INSTANCE_NAME> "
    exit 1
fi

PORT=$1
INSTANCE_TYPE=$2
AMI=$3
INSTANCE_NAME=$4

# Explicitly cast PORT to a number
PORT_NUMBER=$(($PORT))

# Run terraform destroy command
terraform destroy -var="instance_type=${INSTANCE_TYPE}" -var="ami=${AMI}" -var="port=${PORT_NUMBER}" -var="ec2-name=${INSTANCE_NAME}" -auto-approve

# Check if the terraform destroy command was successful
if [ $? -eq 0 ]; then
    # If successful, remove key files
    rm -rf key*
    echo "Ec2 destroyed successfully"

else
    # If the terraform destroy command failed, display a message
    echo "Terraform destroy command failed. Skipping key files removal."
fi


