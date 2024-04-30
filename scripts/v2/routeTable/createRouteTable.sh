#!/bin/bash

# Function to display usage
usage() {
    echo "Usage: $0 --route-table-name <route_table_name> --vpc-id <vpc_id> --region <region> --internet-gateway-id <internet_gateway_id> --subnet-id <subnet_id> --is-public <is_public>"
    exit 1
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        --route-table-name)
            route_table_name="$2"
            shift
            shift
            ;;
        --vpc-id)
            vpc_id="$2"
            shift
            shift
            ;;
        --region)
            region="$2"
            shift
            shift
            ;;
        --internet-gateway-id)
            internet_gateway_id="$2"
            shift
            shift
            ;;
        --subnet-id)
            subnet_id="$2"
            shift
            shift
            ;;
        --is-public)
            is_public="$2"
            shift
            shift
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Check if all required arguments are provided
if [ -z "$route_table_name" ] || [ -z "$vpc_id" ] || [ -z "$region" ] || [ -z "$internet_gateway_id" ] || [ -z "$subnet_id" ] || [ -z "$is_public" ]; then
    usage
fi

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