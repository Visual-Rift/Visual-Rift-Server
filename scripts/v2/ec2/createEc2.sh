#!/bin/bash

# Function to display usage information
usage() {
    echo "Usage: $0 --key-name <key-name> --instance-name <instance-name> --ami-id <ami-id> --instance-type <instance-type> --storage-size <storage-size> --count <count> --region <region>"
    exit 1
}

# Default values
key_name=""
instance_name=""
ami_id=""
instance_type=""
storage_size=""
count=""
region=""

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        --key-name)
            key_name="$2"
            shift
            shift
            ;;
        --instance-name)
            instance_name="$2"
            shift
            shift
            ;;
        --ami-id)
            ami_id="$2"
            shift
            shift
            ;;
        --instance-type)
            instance_type="$2"
            shift
            shift
            ;;
        --storage-size)
            storage_size="$2"
            shift
            shift
            ;;
        --count)
            count="$2"
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
if [[ -z "$key_name" || -z "$instance_name" || -z "$ami_id" || -z "$instance_type" || -z "$storage_size" || -z "$count" || -z "$region" ]]; then
    usage
fi

# Check if key pair exists
key_exists=$(aws ec2 describe-key-pairs --key-names "$key_name" --region "$region" 2>&1 | grep -c 'InvalidKeyPair.NotFound')

# If key pair exists, delete it
if [ "$key_exists" -eq "0" ]; then
  echo "Key pair $key_name exists, deleting it..."
  aws ec2 delete-key-pair --key-name "$key_name" --region "$region"
fi

# Generate key pair
aws ec2 create-key-pair --key-name "$key_name" --query 'KeyMaterial' --output text --region "$region" > "$key_name.pem"
chmod 400 "$key_name.pem"
echo "Key pair $key_name created successfully!"

# Create EC2 instances
echo "Creating $count EC2 instance(s)..."
aws ec2 run-instances --image-id "$ami_id" --count "$count" --instance-type "$instance_type" --key-name "$key_name" --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$instance_name}]" --block-device-mappings "[{\"DeviceName\":\"/dev/xvda\",\"Ebs\":{\"VolumeSize\":$storage_size}}]" --region "$region"

echo "EC2 instance(s) $instance_name created with key pair $key_name"