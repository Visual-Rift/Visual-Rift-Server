#!/bin/bash
key_exists=$(aws ec2 describe-key-pairs --key-name "$1" 2>&1 | grep -c 'InvalidKeyPair.NotFound')

if [ "$key_exists" -eq "0" ]; then
  # Key pair exists, delete it
  echo "Key pair already exists, removing it..."
  aws ec2 delete-key-pair --key-name "$1"
fi

# Generate key pair if it doesn't exist
if [ "$key_exists" -eq "0" ]; then
  # Generate key pair
  aws ec2 create-key-pair --key-name "$1" --query 'KeyMaterial' --output text > "$1.pem"
  echo "Key pair $1.pem created successfully!"
else
  echo "Key pair $1 already exists, skipping creation."
fi