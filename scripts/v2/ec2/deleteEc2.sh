#!/bin/bash

# Check if required arguments are provided
if [ $# -ne 1 ]; then
    echo "Usage: $0 <instance-ids-json>"
    exit 1
fi

# Parse JSON array of instance IDs
instance_ids=$(echo "$1" | jq -r '.[]')

# Loop through each instance ID
for instance_id in $instance_ids; do
    # Terminate instance
    if [ -n "$instance_id" ]; then
        echo "Terminating EC2 instance $instance_id..."
        aws ec2 terminate-instances --instance-ids $instance_id > /dev/null
    fi
done

echo "Instances terminated successfully"
