#!/bin/bash

# Check if the route table name, VPC ID, region, Internet Gateway ID, subnet ID, and subnet type are provided as arguments
if [ "$#" -ne 6 ]; then
    echo "Usage: $0 <route_table_name> <vpc_id> <region> <internet_gateway_id> <subnet_id> <is_public>"
    exit 1
fi

route_table_name="$1"
vpc_id="$2"
region="$3"
internet_gateway_id="$4"
subnet_id="$5"
is_public="$6"

# Create the route table
echo "Creating route table $route_table_name in region $region..."
route_table_id=$(aws ec2 create-route-table --vpc-id "$vpc_id" --region "$region" --output text --query 'RouteTable.RouteTableId')

# Add a name tag to the route table
aws ec2 create-tags --resources "$route_table_id" --tags "Key=Name,Value=$route_table_name" --region "$region"

# Determine the route based on whether the subnet is public or private
if [ "$is_public" = true ]; then
    # For public subnet, add a route to the Internet Gateway
    echo "Associating route table $route_table_id with a route to the Internet Gateway $internet_gateway_id..."
    aws ec2 create-route --route-table-id "$route_table_id" --destination-cidr-block 0.0.0.0/0 --gateway-id "$internet_gateway_id" --region "$region"
    echo "Route table $route_table_id associated with a route to the Internet Gateway."
fi

# Associate the route table with the subnet
echo "Associating route table $route_table_id with subnet $subnet_id..."
aws ec2 associate-route-table --route-table-id "$route_table_id" --subnet-id "$subnet_id" --region "$region" --output text --query 'AssociationId'

echo "Route table $route_table_name created successfully with ID $route_table_id and associated with subnet $subnet_id in region $region."
echo "Route table created: $route_table_id" >> ../resourcedata.txt
