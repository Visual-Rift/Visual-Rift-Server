#!/bin/bash

<<<<<<< HEAD
# Function to display usage information
usage() {
    echo "Usage: $0 <key-name> <region>"
=======
# Check if required arguments are provided
if [ $# -ne 1 ]; then
    echo "Usage: $0 <instance-ids-json>"
>>>>>>> 2cea74b1bfc66554af753d0abc3fbc90c6d3eded
    exit 1
}

# Check if required arguments are provided
if [ $# -ne 2 ]; then
    usage
fi

<<<<<<< HEAD
# Assign key name and region arguments
key_name=$1
region=$2

# Get instance ID by key name
instance_id=$(aws ec2 describe-instances --filters "Name=key-name,Values=$key_name" --query "Reservations[*].Instances[*].InstanceId" --output text --region "$region")

# Terminate instance
if [ -n "$instance_id" ]; then
    echo "Terminating EC2 instance $instance_id..."
    aws ec2 terminate-instances --instance-ids $instance_id --region "$region"
fi

# Delete key pair
echo "Deleting key pair $key_name..."
aws ec2 delete-key-pair --key-name $key_name --region "$region"

# Remove key pair file
if [ -f "$key_name.pem" ]; then
    echo "Removing key pair file $key_name.pem..."
    rm "$key_name.pem"
fi

echo "Resources deleted successfully"
=======
# Parse JSON array of instance IDs
instance_ids=$(echo "$1" | jq -r '.[]')

# Loop through each instance ID
for instance_id in $instance_ids; do
    # Terminate instance
    if [ -n "$instance_id" ]; then
        echo "Terminating EC2 instance $instance_id..."
        aws ec2 terminate-instances --instance-ids $instance_id > /dev/null
    fi
done

echo "Instances terminated successfully"
>>>>>>> 2cea74b1bfc66554af753d0abc3fbc90c6d3eded
