---
date: 2022-10-20
layout: post
title: Securing SSH
subtitle: 'Implementing Basic Security Measures to Harden the SSH Port'
description: >-
  Explore essential steps to harden your SSH port and prevent unauthorized access in this concise guide. Learn key security measures to protect your systems effectively.
image: >-
  /assets/img/ssh.png
optimized_image: >-
  /assets/img/ssh.png
category: blog
tags:
  - SSH
  - cybersecurity
  - ports
  - tutorials
author: Harsimran Sidhu
paginate: true
comments: true
---
Back in 2021, I wrote a [blog](https://www.harsim.ca/SecuringSSH/) post about how to manually harden the SSH configuration on a Raspberry Pi. While the post was helpful, I realized that automating the process would make it even more convenient and efficient. So, I created SSHieldPi - a powerful and user-friendly bash script to automate SSH security on your Raspberry Pi.
In this blog post, I'll guide you through the features of SSHieldPi, how to set it up, and how to use it.

## Features of SSHieldPi

SSHieldPi provides a streamlined solution to secure your Raspberry Pi's SSH access. Key features include:

- Adding a new user with a custom username and password
- Granting sudo privileges to the new user
- Configuring SSH settings for increased security
- Modifying the SSH port to a custom value
- Restarting the SSH service to apply changes

## Setting Up SSHieldPi
Before you begin, make sure you have a Raspberry Pi with Raspbian or a compatible OS and root or sudo access to the device.

## Installation

1. Clone the SSHieldPi repository:

        git clone https://github.com/PKHarsimran/SSHieldPi-The-Raspberry-Pi-SSH-Protection-Solution.git
    
2. Navigate to the SSHieldPi directory:

        cd SSHieldPi

3. Make the script executable:

        chmod +x sshieldpi.sh
    
## Using SSHieldPi

1. Open sshieldpi.sh in a text editor and replace the placeholders for USERNAME and PASSWORD with the desired username and a strong password.
2. Uncomment the appropriate lines depending on whether you are using a Debian/Ubuntu or CentOS/RHEL system.
3. Run the script as root or with sudo privileges:

        sudo ./sshieldpi.sh

4. The script will create a new user, grant sudo privileges, and apply the recommended SSH settings. The SSH service will be restarted to apply the changes.
5. Test the new SSH configuration by logging in with the newly created user and the custom SSH port.
## Conclusion
SSHieldPi simplifies the process of hardening your Raspberry Pi's SSH configuration. By automating the steps outlined in my 2021 blog post, SSHieldPi saves you time and ensures consistent security across your devices. Give it a try and protect your Raspberry Pi with ease.

You can find the SSHieldPi project on [GitHub](https://github.com/PKHarsimran/SSHieldPi-The-Raspberry-Pi-SSH-Protection-Solution)
