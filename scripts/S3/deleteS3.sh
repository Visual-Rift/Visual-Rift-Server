#!/bin/bash

# Check if the bucket name is provided as an argument
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <bucket_name>"
    exit 1
fi

bucket_name="$1"

# Check if the bucket exists
bucket_exists=$(aws s3 ls "s3://$bucket_name" 2>&1 || true)

# If the bucket exists, delete it
if [[ -z "$bucket_exists" ]]; then
    echo "Deleting S3 bucket $bucket_name..."
    aws s3 rb "s3://$bucket_name" --force
    echo "S3 bucket $bucket_name deleted successfully."
else
    echo "S3 bucket $bucket_name does not exist."
fi
