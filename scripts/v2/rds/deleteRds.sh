#!/bin/bash

# Default values
DB_INSTANCE_IDENTIFIER=""
REGION=""

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        --identifier)
            DB_INSTANCE_IDENTIFIER="$2"
            shift
            shift
            ;;
        --region)
            REGION="$2"
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
if [[ -z "$DB_INSTANCE_IDENTIFIER" || -z "$REGION" ]]; then
    echo "Missing required parameters. Usage: revert.sh --identifier <instance_identifier> --region <region>"
    exit 1
fi

# Delete RDS instance
aws rds delete-db-instance \
    --db-instance-identifier "$DB_INSTANCE_IDENTIFIER" \
    --skip-final-snapshot \
    --region "$REGION"


echo "RDS instance deletion initiated. Check AWS Console for status." 

# ./deleteRds.sh --identifier my-rds-instance --region ap-south-1 > /dev/null