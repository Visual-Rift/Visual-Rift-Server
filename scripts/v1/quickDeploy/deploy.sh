#!/bin/bash

# Assign the value of the first argument to REPO_URL
REPO_URL=$1
PUBLIC_IP=$2

# Check if argument REPO_URL is provided
if [ -z "$REPO_URL" ]; then
  echo "ERROR: REPO_URL argument is not provided."
  exit 1
fi

# Find the next available port
next_port=5000
while sudo netstat -tuln | grep ":$next_port" >/dev/null 2>&1; do
    ((next_port++))
done

# Generate a dynamic container name based on the current timestamp
container_name="container-$(date +%s)"

# Build docker image
echo "Building Docker image..."
sudo docker build -f dockerfile --build-arg REPO_URL="$REPO_URL" -t $container_name .

# Check if the build was successful
if [ $? -ne 0 ]; then
  echo "ERROR: Docker build failed."
  exit 1
fi

# Run docker container with the next available port and dynamic name
echo "Running Docker container $container_name on port $next_port..."
sudo docker run -d -p $next_port:8000 --name $container_name $container_name

# Check if the container is running
if [ $? -ne 0 ]; then
  echo "ERROR: Failed to run Docker container."
  exit 1
fi

echo  "$PUBLIC_IP:$next_port"
exit 0
