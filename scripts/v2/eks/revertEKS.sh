#!/bin/bash

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        --name)
            CLUSTER_NAME="$2"
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

# Check if required parameters are provided
if [ -z "$CLUSTER_NAME" ] || [ -z "$REGION" ]; then
    echo "Usage: $0 --name <cluster-name> --region <region>"
    exit 1
fi

# Delete EKS cluster
eksctl delete cluster --name "$CLUSTER_NAME" --region "$REGION"

# Exit with the status of the delete command
exit $?


## How to run this script ::
# ./revertEKS.sh --name eks2 --region us-east-1
