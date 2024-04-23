#!/bin/bash

# CHECKING IF REQUIRED ARGUMENTS ARE PROVIDED
if [ $# -ne 4 ]; then
    echo "Mandatory arguments are missing. Usage: $0 <USER_ID> <GITHUB_REPO_URL> <PORT> <INSTANCE_NAME> <INSTANCE_TYPE> <AMI>"
    exit 1
fi

# ASSIGNING COMMAND-LINE ARGUMENTS TO VARIABLES
USER_ID=$1
INSTANCE_NAME=$2
EC2_INSTANCE_TYPE=$3
AMI=$4
# GITHUB_REPO_URL=$5
# PORT=$6

# MOVE TO USER'S TERRAFORM DIRECTORY
cd ../../terraform/$USER_ID

# DESTROY TERRAFORM CONFIGURATION
terraform destroy -var="instance_type=${EC2_INSTANCE_TYPE}" -var="ami=${AMI}" -var="ec2_name=${INSTANCE_NAME}" -auto-approve

# CHECK IF TERRAFORM DESTROY COMMAND WAS SUCCESSFUL
if [ $? -eq 0 ]; then
    # REMOVE KEY FILES
    rm -rf key*
    echo "Ec2 destroyed successfully"
else
    echo "Terraform destroy command failed. Skipping key files removal."
fi