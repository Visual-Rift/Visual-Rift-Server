#!/bin/bash

# Check if the bucket name and region are provided as arguments
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <bucket_name> <region>"
    exit 1
fi

bucket_name="$1"
region="$2"

# Check if the bucket already exists
bucket_exists=$(aws s3api head-bucket --bucket "$bucket_name" 2>&1 || true)

# If the bucket doesn't exist, create it
if [[ -n "$bucket_exists" ]]; then
    echo "Creating S3 bucket $bucket_name in region $region..."
    aws s3api create-bucket --bucket "$bucket_name" --region "$region"
    echo "S3 bucket $bucket_name created successfully in region $region."
    echo "S3 bucket created: $bucket_name" >> ../resourcedata.txt
else
    echo "S3 bucket $bucket_name already exists."
fi
