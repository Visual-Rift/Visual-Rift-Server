#!/bin/bash

# Check if five arguments are provided
if [ $# -ne 5 ]; then
    echo "Usage: $0 <PORT> <GITHUB_URL> <INSTANCE_TYPE> <AMI> <INSTANCE_NAME>"
    exit 1
fi

# Assign command-line arguments to variables
PORT=$1
GITHUB_URL=$2
INSTANCE_TYPE=$3
AMI=$4
INSTANCE_NAME=$5

echo "Provisioning EC2 instance..."

echo "PORT: $PORT"
echo "GITHUB_URL: $GITHUB_URL"
echo "INSTANCE_TYPE: $INSTANCE_TYPE"
echo "AMI: $AMI"
echo "INSTANCE_NAME: $INSTANCE_NAME"


# Create a security key
ssh-keygen -t rsa -b 2048 -f key -N "" 
chmod 600 key

# provision resources
terraform init
terraform validate
terraform apply -var="instance_type=${INSTANCE_TYPE}" -var="ami=${AMI}" -var="port=${PORT}" -var="ec2-name=${INSTANCE_NAME}" -auto-approve

# Fetch public IP address using Terraform output command
public_ip=$(terraform output -raw instance_public_ip)


# Infinite SSH retry attempts
ssh_successful=false

while [ "$ssh_successful" = false ]; do
    echo "Attempting SSH connection..."

    # SCP the Dockerfile to the remote server
    scp -o StrictHostKeyChecking=no -i key dockerfile ubuntu@$public_ip:~/

    # SSH into the EC2 instance using the fetched public IP address and execute the configuration script
    scp -o StrictHostKeyChecking=no -i key configureRemote.sh ubuntu@$public_ip:~/configureRemote.sh
    ssh -o StrictHostKeyChecking=no -i key ubuntu@$public_ip "bash configureRemote.sh $PORT $GITHUB_URL" && ssh_successful=true

    if [ "$ssh_successful" = false ]; then
        echo "SSH connection failed. Retrying..."
        sleep 5  # Sleep for a short duration before retrying
    fi
done


# Output the public IP address
echo "$public_ip"
