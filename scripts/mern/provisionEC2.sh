#!/bin/bash

# CHECKING IF REQUIRED ARGUMENTS ARE PROVIDED
if [ $# -ne 4 ]; then
    echo "Mandatory arguments are missing. Usage: $0 <USER_ID> <GITHUB_REPO_URL> <PORT> <EC2_INSTANCE_NAME> <INSTANCE_TYPE> <AMI>"
    exit 1
fi

# ASSIGNING COMMAND-LINE ARGUMENTS TO VARIABLES
USER_ID=$1
EC2_INSTANCE_NAME=$2
EC2_INSTANCE_TYPE=$3
AMI=$4
# GITHUB_REPO_URL=$5
# PORT=$6

# MOVE TO USER'S TERRAFORM DIRECTORY
cd ../../terraform/$USER_ID

# CREATING AMI, EC2_INSTANCE & EC2_INSTANCE_NAME TYPE VARIABLES
echo "variable \"ami\" {
  description = \"The AMI ID\"
  type        = string
  default     = \"$AMI\"
}

variable \"instance_type\" {
  description = \"The instance type\"
  type        = string
  default     = \"$EC2_INSTANCE_TYPE\"
}

variable \"ec2_name\" {
  description = \"The EC2 instance name\"
  type        = string
  default     = \"$EC2_INSTANCE_NAME\"
}
" >> ./variables.tf

# CREATING INSTANCE.TF FILE
echo 'resource "aws_security_group" "'$EC2_INSTANCE_NAME'" {
  name        = "'$EC2_INSTANCE_NAME'"
  description = "Allow inbound traffic"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_key_pair" "'$EC2_INSTANCE_NAME'_KEY" {
  key_name   = "'$EC2_INSTANCE_NAME'_key"
  public_key = file("./key.pub")
}

resource "aws_instance" "'$EC2_INSTANCE_NAME'" {
  ami           = var.ami
  instance_type = var.instance_type
  count         = 1
  key_name      = aws_key_pair.'$EC2_INSTANCE_NAME'_KEY.key_name
  tags = {
    Name = "'$EC2_INSTANCE_NAME'"
  }

  provisioner "remote-exec" {
    inline = ["echo 'Wait until SSH is ready'"]

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("./key")
      host        = self.public_ip
    }
  }
}

output "public_ip" {
  value = aws_instance.mern.*.public_ip
}
' >> ./instance.tf

# CREATE A SECURITY KEY
ssh-keygen -t rsa -b 2048 -f key -N ""
chmod 600 key

# APPLY TERRAFORM CONFIGURATION
terraform apply -auto-approve

# FETCH PUBLIC IP ADDRESS
public_ip=$(terraform output -json public_ip)

echo "Public IP Address: $public_ip"
echo "Public IP Address: ${public_ip:1:-1}"

# CREATING NGINX_INSTALL ANSIBLE YAML FILE
echo '---
- hosts: '${public_ip:1:-1}'
  become: true
  tasks:
    - name: Update apt package cache
      apt:
        update_cache: yes
    - name: Install Nginx
      apt:
        name: nginx
        state: present

    - name: Start Nginx
      service:
        name: nginx
        state: started
      
    - name: Enable Nginx
      service:
        name: nginx
        enabled: yes
' >> ./nginx_install.yml

ansible-playbook -i ${public_ip:1:-1}, --private-key key -u ubuntu nginx_install.yml

# DISPLAY PUBLIC IP ADDRESS
echo "Public IP Address: $public_ip"