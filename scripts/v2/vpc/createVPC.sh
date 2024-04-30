#!/bin/bash

# Function to display usage information
usage() {
    echo "Usage: $0 --vpc-name <vpc-name> --cidr-block <cidr-block> --region <region>"
    exit 1
}

# Default values
vpc_name=""
cidr_block=""
region=""

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        --vpc-name)
            vpc_name="$2"
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
            usage
            ;;
    esac
done

# Check if required arguments are provided
if [[ -z "$vpc_name" || -z "$cidr_block" || -z "$region" ]]; then
    usage
fi

# Check if the VPC already exists
vpc_exists=$(aws ec2 describe-vpcs --filters "Name=tag:Name,Values=$vpc_name" --region "$region" 2>&1 || true)

# If the VPC doesn't exist, create it
if [[ -n "$vpc_exists" ]]; then
    echo "Creating VPC $vpc_name with CIDR block $cidr_block in region $region..."
    vpc_id=$(aws ec2 create-vpc --cidr-block "$cidr_block" --region "$region" --output text --query 'Vpc.VpcId')
    aws ec2 create-tags --resources "$vpc_id" --tags "Key=Name,Value=$vpc_name" --region "$region"
    echo "VPC $vpc_name created successfully with VPC ID $vpc_id in region $region."
    echo "$vpc_id"
else
    echo "VPC $vpc_name already exists."
fi
