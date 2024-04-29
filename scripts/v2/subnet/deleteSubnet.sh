#!/bin/bash

# Check if the subnet ID and region are provided as arguments
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <subnet_id> <region>"
    exit 1
fi

subnet_id="$1"
region="$2"

# Delete the subnet
echo "Deleting subnet $subnet_id in region $region..."
aws ec2 delete-subnet --subnet-id "$subnet_id" --region "$region"
echo "Subnet $subnet_id deleted successfully in region $region."
