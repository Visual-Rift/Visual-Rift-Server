#!/bin/bash

# Check if the VPC name and region are provided as arguments
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <vpc_name> <region>"
    exit 1
fi

vpc_name="$1"
region="$2"

# Get the VPC ID by name
vpc_id=$(aws ec2 describe-vpcs --filters "Name=tag:Name,Values=$vpc_name" --region "$region" --output text --query 'Vpcs[*].VpcId')

# Check if the VPC exists
if [[ -z "$vpc_id" ]]; then
    echo "VPC $vpc_name does not exist in region $region."
    exit 1
fi

# Function to delete all associated resources
delete_associated_resources() {
    # Delete non-default EC2 instances in the VPC
    instance_ids=$(aws ec2 describe-instances --filters "Name=vpc-id,Values=$vpc_id" --query "Reservations[].Instances[?State.Name=='running'].InstanceId" --output text --region "$region")
    if [[ -n "$instance_ids" ]]; then
        echo "Deleting EC2 instances associated with VPC $vpc_name..."
        aws ec2 terminate-instances --instance-ids $instance_ids --region "$region"
        aws ec2 wait instance-terminated --instance-ids $instance_ids --region "$region"
        echo "EC2 instances associated with VPC $vpc_name deleted successfully."
    fi

    # Delete non-default subnets in the VPC
    subnet_ids=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$vpc_id" "Name=tag:Name,Values='Default'" --query "Subnets[].SubnetId" --output text --region "$region")
    if [[ -n "$subnet_ids" ]]; then
        echo "Deleting subnets associated with VPC $vpc_name..."
        for subnet_id in $subnet_ids; do
            aws ec2 delete-subnet --subnet-id $subnet_id --region "$region"
        done
        echo "Subnets associated with VPC $vpc_name deleted successfully."
    fi

    # Detach and delete Internet Gateways if not default
    igw_id=$(aws ec2 describe-internet-gateways --filters "Name=attachment.vpc-id,Values=$vpc_id" --query "InternetGateways[].InternetGatewayId" --output text --region "$region")
    if [[ -n "$igw_id" ]]; then
        echo "Detaching and deleting Internet Gateway associated with VPC $vpc_name..."
        aws ec2 detach-internet-gateway --internet-gateway-id "$igw_id" --vpc-id "$vpc_id" --region "$region"
        aws ec2 delete-internet-gateway --internet-gateway-id "$igw_id" --region "$region"
        echo "Internet Gateway associated with VPC $vpc_name deleted successfully."
    fi
    
    # Delete non-main route tables associated with the VPC
    route_table_ids=$(aws ec2 describe-route-tables --filters "Name=vpc-id,Values=$vpc_id" "Name=association.main,Values=false" --query "RouteTables[].RouteTableId" --output text --region "$region")
    if [[ -n "$route_table_ids" ]]; then
        echo "Deleting route tables associated with VPC $vpc_name..."
        for route_table_id in $route_table_ids; do
            # Check if there are dependencies before attempting to delete
            dependencies=$(aws ec2 describe-route-tables --route-table-ids $route_table_id --query "RouteTables[].Associations[].RouteTableAssociationId" --output text --region "$region")
            if [[ -z "$dependencies" ]]; then
                aws ec2 delete-route-table --route-table-id $route_table_id --region "$region"
                echo "Route table $route_table_id associated with VPC $vpc_name deleted successfully."
            else
                echo "Route table $route_table_id associated with VPC $vpc_name has dependencies and cannot be deleted."
            fi
        done
    fi


    # Delete non-default security groups associated with the VPC
    security_group_ids=$(aws ec2 describe-security-groups --filters "Name=vpc-id,Values=$vpc_id" --query "SecurityGroups[?GroupName!='default'].GroupId" --output text --region "$region")
    if [[ -n "$security_group_ids" ]]; then
        echo "Deleting security groups associated with VPC $vpc_name..."
        for security_group_id in $security_group_ids; do
            aws ec2 delete-security-group --group-id $security_group_id --region "$region"
        done
        echo "Security groups associated with VPC $vpc_name deleted successfully."
    fi
}

# Delete associated resources
delete_associated_resources

# Finally, delete the VPC
echo "Deleting VPC $vpc_name in region $region..."
aws ec2 delete-vpc --vpc-id "$vpc_id" --region "$region"
echo "VPC $vpc_name deleted successfully in region $region."
