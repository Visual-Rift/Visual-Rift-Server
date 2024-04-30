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

# Create ECR repository
ecr_uri=$(aws ecr create-repository --repository-name "$repository_name" --query 'repository.repositoryUri' --output text --region "$region")

# Get AWS account ID
aws_account_id=$(aws sts get-caller-identity --query 'Account' --output text)

# Docker login to ECR
aws ecr get-login-password --region "$region" | docker login --username AWS --password-stdin "$aws_account_id.dkr.ecr.$region.amazonaws.com"

# Set repository policy
aws ecr set-repository-policy --repository-name "$repository_name" --policy-text '{"Version": "2008-10-17", "Statement": [{"Sid": "AllowPublicAccess", "Effect": "Allow", "Principal": "*", "Action": ["ecr:GetDownloadUrlForLayer", "ecr:BatchGetImage"], "Condition": {"StringEquals": {"aws:PrincipalOrgID": "*"}}}]}' --region "$region" >/dev/null 2>&1

# Output ECR URI
echo "ECR URI: $ecr_uri"

##How to Run ??
# ./createECR.sh --repository-name ecr1 --region us-east-1
