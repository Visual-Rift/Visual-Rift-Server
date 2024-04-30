#!/bin/bash

# Check if the Internet Gateway ID and region are provided as arguments
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <gateway_id> <region>"
    exit 1
fi

gateway_id="$1"
region="$2"

# Get non-default VPCs
non_default_vpcs=$(aws ec2 describe-internet-gateways --internet-gateway-id "$gateway_id" --query 'InternetGateways[].Attachments[?VpcId!=`null`].VpcId' --output text --region "$region" | grep -v "^vpc-0")

# Detach the Internet Gateway from non-default VPCs
for vpc in $non_default_vpcs; do
    echo "Detaching internet gateway $gateway_id from VPC $vpc in region $region..."
    aws ec2 detach-internet-gateway --internet-gateway-id "$gateway_id" --vpc-id "$vpc" --region "$region" >/dev/null
    echo "Internet gateway $gateway_id detached from VPC $vpc."
done

# Delete the Internet Gateway if no dependencies left
echo "Deleting internet gateway $gateway_id in region $region..."
aws ec2 delete-internet-gateway --internet-gateway-id "$gateway_id" --region "$region" >/dev/null

echo "Internet gateway $gateway_id deleted successfully in region $region."
