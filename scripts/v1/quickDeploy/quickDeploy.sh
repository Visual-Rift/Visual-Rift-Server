#!/bin/bash

#### This script deploys your project

# Check if arguments are provided
if [ $# -ne 1 ]; then
  echo "ERROR: Insufficient arguments. Usage: $0 GITHUB_URL"
  exit 1
fi

GITHUB_URL=$1

# Check if the public IP file exists
if [ ! -f "public_ip.txt" ]; then
  echo "ERROR: public_ip.txt file not found."
  exit 1
fi

# Read the public IP from the file
PUBLIC_IP=$(<public_ip.txt)

# Copy deploy.sh to the remote server
scp -o StrictHostKeyChecking=no -i key deploy.sh ubuntu@"$PUBLIC_IP":~/

# Copy the Dockerfile to the remote server
scp -o StrictHostKeyChecking=no -i key dockerfile ubuntu@"$PUBLIC_IP":~/

# SSH into the EC2 instance using the fetched public IP address
ssh -o StrictHostKeyChecking=no -i key ubuntu@"$PUBLIC_IP" "bash -s" < deploy.sh "$GITHUB_URL" "$PUBLIC_IP"
