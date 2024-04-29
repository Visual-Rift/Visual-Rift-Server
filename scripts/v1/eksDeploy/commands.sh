#installing helm
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh

# create helm chart directory structure/template
helm create web-app1

## values.yaml file inside templates is your default configuration
## charts folder -> contains dependencies of other charts that are used
## templates contains deployements, services, ingress etc.

helm install webapp webapp/
helm upgrade my-release webapp/ --values webapp1/values.yaml 
# for having mulitple values files for different enviroments
helm upgrade my-release webapp/ --values -f webapp1/values.yaml -n dev 

helm uninstall app-release-1

# dynamic value assingment
helm install app-release-1 your-chart-name --set replicaCount=5,image.repository=vidhant/app,image.tag=latest



## Monitoring EKS