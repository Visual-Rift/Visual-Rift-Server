#!/bin/bash

# Check if the VPC name, CIDR block, and region are provided as arguments
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <vpc_name> <cidr_block> <region>"
    exit 1
fi

vpc_name="$1"
cidr_block="$2"
region="$3"

# Check if the VPC already exists
vpc_exists=$(aws ec2 describe-vpcs --filters "Name=tag:Name,Values=$vpc_name" --region "$region" 2>&1 || true)

# If the VPC doesn't exist, create it
if [[ -n "$vpc_exists" ]]; then
    echo "Creating VPC $vpc_name with CIDR block $cidr_block in region $region..."
    vpc_id=$(aws ec2 create-vpc --cidr-block "$cidr_block" --region "$region" --output text --query 'Vpc.VpcId')
    aws ec2 create-tags --resources "$vpc_id" --tags "Key=Name,Value=$vpc_name" --region "$region"
    echo "VPC $vpc_name created successfully with VPC ID $vpc_id in region $region."
    echo "VPC created: $vpc_id" >> ../resourcedata.txt
else
    echo "VPC $vpc_name already exists."
fi
