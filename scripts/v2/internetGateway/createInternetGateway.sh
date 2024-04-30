#!/bin/bash

# Function to display usage information
usage() {
    echo "Usage: $0 --vpc-id <vpc-id> --gateway-name <gateway-name> --region <region>"
    exit 1
}

# Default values
vpc_id=""
gateway_name=""
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
        --gateway-name)
            gateway_name="$2"
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
if [[ -z "$vpc_id" || -z "$gateway_name" || -z "$region" ]]; then
    usage
fi

# Create the internet gateway
echo "Creating internet gateway $gateway_name in region $region..."
gateway_id=$(aws ec2 create-internet-gateway --region "$region" --output text --query 'InternetGateway.InternetGatewayId')

# Add a name tag to the internet gateway
aws ec2 create-tags --resources "$gateway_id" --tags "Key=Name,Value=$gateway_name" --region "$region"

# Attach the internet gateway to the VPC
aws ec2 attach-internet-gateway --internet-gateway-id "$gateway_id" --vpc-id "$vpc_id" --region "$region"

echo "Internet gateway $gateway_name created successfully with ID $gateway_id and attached to VPC $vpc_id in region $region."
echo "Internet Gateway created: $gateway_id" >> ../resourcedata.txt