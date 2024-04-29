#!/bin/bash

# Define the GitHub URL and IP address
GITHUB_URL="https://github.com/Vidhant007/test-repo-vanilla"
IP_ADDRESS="52.87.243.170"

# Infinite loop to execute quickDeploy.sh
while true; do
    # Execute quickDeploy.sh with GitHub URL and IP address
    ./quickDeploy.sh "$GITHUB_URL" "$IP_ADDRESS"
done
