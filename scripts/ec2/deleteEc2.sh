#!/bin/bash

# Check if required arguments are provided
if [ $# -ne 1 ]; then
    echo "Usage: $0 <key-name>"
    exit 1
fi

# Assign key name argument
key_name=$1

# Get instance ID by key name
instance_id=$(aws ec2 describe-instances --filters "Name=key-name,Values=$key_name" --query "Reservations[*].Instances[*].InstanceId" --output text)

# Terminate instance
if [ -n "$instance_id" ]; then
    echo "Terminating EC2 instance $instance_id..."
    aws ec2 terminate-instances --instance-ids $instance_id
fi

# Delete key pair
echo "Deleting key pair $key_name..."
aws ec2 delete-key-pair --key-name $key_name

# Remove key pair file
if [ -f "$key_name.pem" ]; then
    echo "Removing key pair file $key_name.pem..."
    rm "$key_name.pem"
fi

echo "Resources deleted successfully"