#!/bin/bash

# Default values
NODE_TYPE="t2.micro"
NODES_MIN="2"
NODES_MAX="4"
REGION="us-east-1"
NODEGROUP_NAME="my-nodes"
NODE_VOLUME_SIZE="8"

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        --name)
            NAME="$2"
            shift
            shift
            ;;
        --node-type)
            NODE_TYPE="$2"
            shift
            shift
            ;;
        --nodes)
            NODES_MIN="$2"
            shift
            shift
            ;;
        --nodes-min)
            NODES_MIN="$2"
            shift
            shift
            ;;
        --nodes-max)
            NODES_MAX="$2"
            shift
            shift
            ;;
        --region)
            REGION="$2"
            shift
            shift
            ;;
        --nodegroup-name)
            NODEGROUP_NAME="$2"
            shift
            shift
            ;;
        --node-volume-size)
            NODE_VOLUME_SIZE="$2"
            shift
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done


eksctl create cluster \
  --name "$NAME" \
  --node-type "$NODE_TYPE" \
  --nodes "$NODES_MIN" \
  --nodes-min "$NODES_MIN" \
  --nodes-max "$NODES_MAX" \
  --region "$REGION" \
  --nodegroup-name "$NODEGROUP_NAME" \
  --node-volume-size "$NODE_VOLUME_SIZE"


# how to run script 
#./eks.sh --name eks2 --node-type t3.medium --nodes 3 --nodes-min 2 --nodes-max 4 --region us-east-1 --nodegroup-name my-nodes --node-volume-size 8
