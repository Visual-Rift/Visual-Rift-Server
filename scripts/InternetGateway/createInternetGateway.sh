#!/bin/bash

# Check if the VPC ID, gateway name, and region are provided as arguments
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <vpc_id> <gateway_name> <region>"
    exit 1
fi

vpc_id="$1"
gateway_name="$2"
region="$3"

# Create the internet gateway
echo "Creating internet gateway $gateway_name in region $region..."
gateway_id=$(aws ec2 create-internet-gateway --region "$region" --output text --query 'InternetGateway.InternetGatewayId')

# Add a name tag to the internet gateway
aws ec2 create-tags --resources "$gateway_id" --tags "Key=Name,Value=$gateway_name" --region "$region"

# Attach the internet gateway to the VPC
aws ec2 attach-internet-gateway --internet-gateway-id "$gateway_id" --vpc-id "$vpc_id" --region "$region"

echo "Internet gateway $gateway_name created successfully with ID $gateway_id and attached to VPC $vpc_id in region $region."
echo "Internet Gateway created: $gateway_id" >> ../resourcedata.txt
