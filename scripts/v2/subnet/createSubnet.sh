#!/bin/bash

# Default values
vpc_id=""
subnet_name=""
cidr_block=""
region=""

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        --vpc-id)
            vpc_id="$2"
            shift
            shift
            ;;
        --subnet-name)
            subnet_name="$2"
            shift
            shift
            ;;
        --cidr-block)
            cidr_block="$2"
            shift
            shift
            ;;
        --region)
            region="$2"
            shift
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Check if the VPC ID, subnet name, CIDR block, and region are provided as arguments

# if [ "$#" -ne 4 ]; then
#     echo "Usage: $0 --vpc-id <vpc_id> --subnet-name <subnet_name> --cidr-block <cidr_block> --region <region>"
#     exit 1
# fi

# Create the subnet
echo "Creating subnet $subnet_name with CIDR block $cidr_block in VPC $vpc_id in region $region..."
subnet_id=$(aws ec2 create-subnet --vpc-id "$vpc_id" --cidr-block "$cidr_block" --region "$region" --output text --query 'Subnet.SubnetId')

# Add a name tag to the subnet
aws ec2 create-tags --resources "$subnet_id" --tags "Key=Name,Value=$subnet_name" --region "$region"

echo "Subnet $subnet_name created successfully with ID $subnet_id in region $region."
echo "Subnet created: $subnet_id" >> ../resourcedata.txt