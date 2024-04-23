#!/bin/bash

# Initialize variables with default values
REGION="us-east-1"

# Assign command-line arguments to variables
REPO_URL="$1"
NODES_MIN="$2"
NODES_MAX="$3"
NODE_TYPE="$4"
NAME="$5"

# Check if all required arguments are provided
if [ -z "$REPO_URL" ] || [ -z "$NODES_MIN" ] || [ -z "$NODES_MAX" ]; then
    echo "Usage: $0 <REPO_URL> <NODES_MIN> <NODES_MAX>"
    exit 1
fi

# Optional: If you want to allow default values for some arguments, you can check and set them here
if [ -z "$NAME" ]; then
    NAME="my-eks-cluster"
fi

if [ -z "$REGION" ]; then
    REGION="us-east-1"
fi

if [ -z "$NODE_TYPE" ]; then
    NODE_TYPE="t2.micro"
fi

ecr_uri=$(aws ecr create-repository --repository-name vr-ec2 --query 'repository.repositoryUri' --output text)
aws_account_id=$(aws sts get-caller-identity --query 'Account' --output text)
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $aws_account_id.dkr.ecr.us-east-1.amazonaws.com
aws ecr set-repository-policy --repository-name vr-ec2 --policy-text '{"Version": "2008-10-17", "Statement": [{"Sid": "AllowPublicAccess", "Effect": "Allow", "Principal": "*", "Action": ["ecr:GetDownloadUrlForLayer", "ecr:BatchGetImage"], "Condition": {"StringEquals": {"aws:PrincipalOrgID": "*"}}}]}' --region us-east-1 >/dev/null 2>&1

# Build the Docker image
sudo docker build --build-arg GITHUB_REPO_URL="$REPO_URL" -t app .

# Tag the Docker image
sudo docker tag app $ecr_uri:latest

# Push the Docker image to Docker Hub
sudo docker push $ecr_uri:latest

# Create the EKS cluster
eksctl create cluster \
  --name "$NAME" \
  --node-type "$NODE_TYPE" \
  --nodes "$NODES_MIN" \
  --nodes-min "$NODES_MIN" \
  --nodes-max "$NODES_MAX" \
  --region "$REGION"

# Applying helm chart
helm install app-release-1 eks-deploy/ --set replicaCount=$NODES_MIN,image.repository=$ecr_uri,image.tag=latest


sleep 30 # wait 30 secs for services to start running

# Get the hostname of the LoadBalancer
kubectl get services

loadBalancerHostname=$(kubectl get services app-service -o=jsonpath='{.status.loadBalancer.ingress[0].hostname}')

# Return the output as response from the API
echo "$loadBalancerHostname"