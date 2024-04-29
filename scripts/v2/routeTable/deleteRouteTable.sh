#!/bin/bash

# Check if the route table ID and region are provided as arguments
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <route_table_id> <region>"
    exit 1
fi

route_table_id="$1"
region="$2"

# Delete the route table
echo "Deleting route table $route_table_id in region $region..."
aws ec2 delete-route-table --route-table-id "$route_table_id" --region "$region"
echo "Route table $route_table_id deleted successfully in region $region."
