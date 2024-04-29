#!/bin/bash

# Check if required arguments are provided
if [ $# -ne 5 ]; then
    echo "Usage: $0 <key-name> <instance-name> <ami-id> <instance-type> <storage-size>"
    exit 1
fi

# Assign arguments to variables
key_name=$1
instance_name=$2
ami_id=$3
instance_type=$4
storage_size=$5
count=$6

# Check if key pair exists
key_exists=$(aws ec2 describe-key-pairs --key-names "$key_name" 2>&1 | grep -c 'InvalidKeyPair.NotFound')

# If key pair exists, delete it
if [ "$key_exists" -eq "1" ]; then
  echo "Key pair $key_name exists, deleting it..."
  aws ec2 delete-key-pair --key-name "$key_name"
fi

# Generate key pair
aws ec2 create-key-pair --key-name "$key_name" --query 'KeyMaterial' --output text > "$key_name.pem"
chmod 755 "$key_name.pem"
echo "Key pair $key_name created successfully!"
# Create EC2 instance
aws ec2 run-instances --image-id "$ami_id" --count "$count" --instance-type "$instance_type" --key-name "$key_name" --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$instance_name}]" --block-device-mappings "[{\"DeviceName\":\"/dev/xvda\",\"Ebs\":{\"VolumeSize\":$storage_size}}]"

echo "EC2 instance $instance_name created with key pair $key_name"