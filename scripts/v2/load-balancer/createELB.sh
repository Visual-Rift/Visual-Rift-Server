#!/bin/bash

# Step 1: Create EC2 Instances
instance_ids=$(aws ec2 run-instances \
  --image-id ami-080e1f13689e07408 \
  --instance-type t2.micro \
  --count 2 \
  --query 'Instances[*].InstanceId' \
  --output text)

# Step 2: Print Instance IDs
echo "Instance IDs: $instance_ids"

# Step 3: Create a Target Group
target_group_response=$(aws elbv2 create-target-group \
  --name my-target-group \
  --protocol HTTP \
  --port 80 \
  --vpc-id "$(aws ec2 describe-vpcs --filters Name=isDefault,Values=true --query 'Vpcs[0].VpcId' --output text)")

# Extract the Target Group ARN from the response
target_group_arn=$(echo "$target_group_response" | grep -oP '(?<="TargetGroupArn": ")[^"]+')

# Step 4: Create Load Balancer
load_balancer_response=$(aws elbv2 create-load-balancer \
  --name my-load-balancer \
  --subnets $(aws ec2 describe-subnets --filters Name=default-for-az,Values=true --query 'Subnets[*].SubnetId' --output text) \
  --security-groups sg-0a3209d7d8589d570 sg-000d45b6ae6f35907 sg-03846643743dde277)

# Extract the Load Balancer ARN from the response
load_balancer_arn=$(echo "$load_balancer_response" | grep -oP '(?<="LoadBalancerArn": ")[^"]+')

# Step 5: Create Listener
aws elbv2 create-listener \
  --load-balancer-arn "$load_balancer_arn" \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn="$target_group_arn"

# Step 6: Register Targets
for instance_id in $instance_ids; do
    # Check if instance is running
    instance_state=$(aws ec2 describe-instances --instance-ids "$instance_id" --query 'Reservations[*].Instances[*].State.Name' --output text)
    if [ "$instance_state" != "running" ]; then
        echo "Instance $instance_id is not running. Waiting for it to start..."
        aws ec2 wait instance-running --instance-ids "$instance_id"
    fi
    # Register target if instance is running
    aws elbv2 register-targets \
      --target-group-arn "$target_group_arn" \
      --targets "Id=$instance_id,Port=80"
done

echo "EC2 instances have been created and attached to the load balancer."
