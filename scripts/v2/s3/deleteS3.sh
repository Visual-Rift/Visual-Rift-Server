#!/bin/bash

# Default values
bucket_name=""

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        --bucket-name)
            bucket_name="$2"
            shift
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Check if the bucket name is provided
if [ -z "$bucket_name" ]; then
    echo "Usage: $0 --bucket-name <bucket_name>"
    exit 1
fi

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


# ./deleteS3Bucket.sh --bucket my-bucket-name

