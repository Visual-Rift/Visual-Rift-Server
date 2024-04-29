#!/bin/bash

# Default values
repository_name="vr-ec2"
region="us-east-1"

# Function to show script usage
usage() {
  echo "Usage: $0 [--repository-name <name>] [--region <region>]"
  echo "Options:"
  echo "  --repository-name <name>: Specify the name of the ECR repository (default: vr-ec2)"
  echo "  --region <region>: Specify the AWS region (default: us-east-1)"
  exit 1
}

# Parse command-line options
while [[ $# -gt 0 ]]; do
  case "$1" in
    --repository-name )
      repository_name="$2"
      shift 2
      ;;
    --region )
      region="$2"
      shift 2
      ;;
    * )
      echo "Invalid option: $1" 1>&2
      usage
      ;;
  esac
done

# Delete ECR repository
aws ecr delete-repository --repository-name "$repository_name" --force --region "$region"

# Output message
echo "ECR repository '$repository_name' deleted."

# Delete repository policy
aws ecr delete-repository-policy --repository-name "$repository_name" --region "$region"

# Output message
echo "Repository policy for '$repository_name' deleted."


#How to run ??
#./deleteECR.sh --repository-name my-repo --region us-west-2
