#!/bin/bash

# Remove unnecessary packages
sudo apt-get remove -y docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc

# Add Docker's official GPG key
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the Docker repository to Apt sources
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

# Install Docker packages
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Check if arguments are provided
if [ $# -ne 2 ]; then
    echo "Usage: $0 <PORT> <GITHUB_URL>"
    exit 1
fi

# Build the Docker image using provided arguments
sudo docker build --build-arg PORT=$1 --build-arg GITHUB_URL=$2 -t my-app .

# Check for errors
if [ $? -eq 0 ]; then
    echo "Docker image built successfully"
else
    echo "Error occurred during Docker image build"
    exit 1
fi


# Run the Docker container
sudo docker run -d -p $1:$1 my-app

# Check for errors
if [ $? -eq 0 ]; then
    echo "Script executed successfully"
else
    echo "Error occurred during script execution"
fi
