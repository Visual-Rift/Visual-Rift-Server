#!/bin/bash

# Default values
BUCKET_NAME=""
REGION=""

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        --bucket-name)
            BUCKET_NAME="$2"
            shift
            shift
            ;;
        --region)
            REGION="$2"
            shift
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Check if the bucket name and region are provided
if [[ -z "$BUCKET_NAME" || -z "$REGION" ]]; then
    echo "Usage: $0 --bucket-name <bucket_name> --region <region>"
    exit 1
fi

# Check if the bucket already exists
bucket_exists=$(aws s3api head-bucket --bucket "$BUCKET_NAME" 2>&1 || true)

# If the bucket doesn't exist, create it
if [[ -n "$bucket_exists" ]]; then
    echo "Creating S3 bucket $BUCKET_NAME in region $REGION..."
    aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$REGION"
    echo "S3 bucket $BUCKET_NAME created successfully in region $REGION."
    echo "S3 bucket created: $BUCKET_NAME" >> ../resourcedata.txt
else
    echo "S3 bucket $BUCKET_NAME already exists."
fi


# ./createS3.sh --name my-test-bucket --region us-east-1
