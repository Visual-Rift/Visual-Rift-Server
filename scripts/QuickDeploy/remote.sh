#!/bin/bash

# Check if the file 'key' already exists
if [ ! -f "key" ]; then
    # Generate SSH key pair without overwriting
    ssh-keygen -t rsa -b 2048 -f key -N ""
    chmod 600 key
else
    echo "SSH key file 'key' already exists. Skipping generation."
fi

# provision resources
terraform init
terraform validate
terraform apply -auto-approve

# Fetch public IP address using Terraform output command
public_ip=$(terraform output -raw instance_public_ip)

# Store the public IP address in a text file
echo "$public_ip" > public_ip.txt

# Infinite SSH retry attempts
ssh_successful=false

while [ "$ssh_successful" = false ]; do
    echo "Attempting SSH connection..."

    # SCP the Dockerfile to the remote server
    scp -o StrictHostKeyChecking=no -i key container-setup ubuntu@$public_ip:~/

    # SSH into the EC2 instance using the fetched public IP address and execute the configuration script
    scp -o StrictHostKeyChecking=no -i key configureServer.sh ubuntu@$public_ip:~/configureServer.sh
    ssh -o StrictHostKeyChecking=no -i key ubuntu@$public_ip "bash configureServer.sh" && ssh_successful=true

    if [ "$ssh_successful" = false ]; then
        echo "SSH connection failed. Retrying..."
        sleep 5  # Sleep for a short duration before retrying
    fi
done

# Output the public IP address
echo "Public IP address stored in public_ip.txt: $public_ip"
