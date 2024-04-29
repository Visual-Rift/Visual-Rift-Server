#!/bin/bash

# Initialize variables with default values
NAME="eks2"
REGION="us-east-1"
NODE_TYPE="t2.small"


# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        --repo-url)
        REPO_URL="$2"
        shift
        shift
        ;;
        --nodes-min)
        NODES_MIN="$2"
        shift
        shift
        ;;
        --nodes-max)
        NODES_MAX="$2"
        shift
        shift
        ;;
        --name)
        NAME="$2"
        shift
        shift
        ;;
        --region)
        REGION="$2"
        shift
        shift
        ;;
        --node-type)
        NODE_TYPE="$2"
        shift
        shift
        ;;
        *)
        echo "Unknown option: $1"
        exit 1
        ;;
    esac
done

ecr_uri=$(aws ecr create-repository --repository-name vr-ec2 --query 'repository.repositoryUri' --output text)
aws_account_id=$(aws sts get-caller-identity --query 'Account' --output text)
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $aws_account_id.dkr.ecr.us-east-1.amazonaws.com
aws ecr set-repository-policy --repository-name vr-ec2 --policy-text '{"Version": "2008-10-17", "Statement": [{"Sid": "AllowPublicAccess", "Effect": "Allow", "Principal": "*", "Action": ["ecr:GetDownloadUrlForLayer", "ecr:BatchGetImage"], "Condition": {"StringEquals": {"aws:PrincipalOrgID": "*"}}}]}' --region us-east-1 >/dev/null 2>&1

# Build the Docker image
sudo docker build --build-arg GITHUB_REPO_URL="$REPO_URL" -t app .

# Tag the Docker image
sudo docker tag app $ecr_uri:latest

# Push the Docker image to Docker Hub
sudo docker push $ecr_uri:latest

# Create the EKS cluster
eksctl create cluster \
  --name eks2 \
  --node-type "$NODE_TYPE" \
  --nodes "$NODES_MIN" \
  --nodes-min "$NODES_MIN" \
  --nodes-max "$NODES_MAX" \
  --region "$REGION" \
  --nodegroup-name my-nodes


eksctl get cluster --name eks2 --region us-east-1

aws eks update-kubeconfig --name eks2 --region us-east-1

kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

kubectl get deployment metrics-server -n kube-system

helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm repo list
kubectl create namespace prometheus
helm install prometheus prometheus-community/prometheus \
    --namespace prometheus \
    --set alertmanager.persistentVolume.storageClass="gp2" \
    --set server.persistentVolume.storageClass="gp2"


kubectl get all -n prometheus


oidc_id=$(aws eks describe-cluster --name eks2 --query "cluster.identity.oidc.issuer" --output text | cut -d '/' -f 5)
aws iam list-open-id-connect-providers | grep $oidc_id | cut -d "/" -f4

eksctl utils associate-iam-oidc-provider --cluster eks2 --approve

eksctl create iamserviceaccount \
  --name ebs-csi-controller-sa \
  --namespace kube-system \
  --cluster eks2 \
  --attach-policy-arn arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy \
  --approve \
  --role-only \
  --role-name AmazonEKS_EBS_CSI_DriverRole

eksctl create addon --name aws-ebs-csi-driver --cluster eks2 --service-account-role-arn arn:aws:iam::746965028358:role/AmazonEKS_EBS_CSI_DriverRole --force

kubectl get all -n -prometheus

## this should run on background
kubectl port-forward deployment/prometheus-server 9090:9090 -n prometheus &

curl localhost:9090/graph

helm repo add grafana https://grafana.github.io/helm-charts 
helm repo update

# create yaml file

kubectl create namespace grafana


helm install grafana grafana/grafana \
    --namespace grafana \
    --set persistence.storageClassName="gp2" \
    --set persistence.enabled=true \
    --set adminPassword='admin' \
    --values prometheus-datasource.yaml \
    --set service.type=LoadBalancer

kubectl get all -n grafana


# Apply the helm chart
helm install app-release-1 eks-deploy/ --set replicaCount=$NODES_MIN,image.repository=$ecr_uri,image.tag=latest -n default

sleep 30

# Get the hostname of the LoadBalancer
kubectl get services
kubectl get services frontend -o=jsonpath='{.status.loadBalancer.ingress[0].hostname}'

