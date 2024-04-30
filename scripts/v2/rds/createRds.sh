#!/bin/bash

# Default values
DB_INSTANCE_IDENTIFIER=""
DB_INSTANCE_CLASS=""
ENGINE=""
ENGINE_VERSION=""
USERNAME=""
PASSWORD=""
REGION=""
ALLOCATED_STORAGE=""

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        --identifier)
            DB_INSTANCE_IDENTIFIER="$2"
            shift
            shift
            ;;
        --class)
            DB_INSTANCE_CLASS="$2"
            shift
            shift
            ;;
        --engine)
            ENGINE="$2"
            shift
            shift
            ;;
        --version)
            ENGINE_VERSION="$2"
            shift
            shift
            ;;
        --username)
            USERNAME="$2"
            shift
            shift
            ;;
        --password)
            PASSWORD="$2"
            shift
            shift
            ;;
        --region)
            REGION="$2"
            shift
            shift
            ;;
        --allocated-storage)
            ALLOCATED_STORAGE="$2"
            shift
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Check required parameters
if [[ -z "$DB_INSTANCE_IDENTIFIER" || -z "$ENGINE" || -z "$ENGINE_VERSION" || -z "$USERNAME" || -z "$PASSWORD" || -z "$ALLOCATED_STORAGE" || -z "$REGION" ]]; then
    echo "Missing required parameters. Usage: $0 --identifier <instance_identifier> --engine <engine> --version <version> --username <username> --password <password> --allocated-storage <storage_size> --region <region>"
    exit 1
fi

# Create RDS instance
create_instance=$(aws rds create-db-instance \
    --db-instance-identifier "$DB_INSTANCE_IDENTIFIER" \
    --db-instance-class "$DB_INSTANCE_CLASS" \
    --engine "$ENGINE" \
    --engine-version "$ENGINE_VERSION" \
    --master-username "$USERNAME" \
    --master-user-password "$PASSWORD" \
    --allocated-storage "$ALLOCATED_STORAGE" \
    --region "$REGION" \
    2>&1)  # Redirect stderr to stdout for capturing errors

# Check if the create-db-instance command was successful
create_instance_exit_code=$?
if [ $create_instance_exit_code -ne 0 ]; then
    echo "Error creating RDS instance: $create_instance"
    exit $create_instance_exit_code
fi

# Wait for the RDS instance to be available
echo "Waiting for RDS instance to be available..."
aws rds wait db-instance-available --db-instance-identifier "$DB_INSTANCE_IDENTIFIER" --region "$REGION"

# Retrieve RDS instance details
echo "Retrieving RDS instance details..."
instance_details=$(aws rds describe-db-instances --db-instance-identifier "$DB_INSTANCE_IDENTIFIER" --region "$REGION")
endpoint=$(echo "$instance_details" | jq -r '.DBInstances[0].Endpoint.Address')

echo "RDS instance created successfully."
echo "Endpoint: $endpoint"
