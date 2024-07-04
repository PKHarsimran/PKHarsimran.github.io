---
date: 2022-10-20
layout: post
title: Securing SSH: Implementing Basic Security Measures to Harden the SSH Port
subtitle: A Step-by-Step Guide to Enhancing Your SSH Security
description: Explore essential steps to harden your SSH port and prevent unauthorized access in this concise guide. Learn key security measures to protect your systems effectively.
image: /assets/img/ssh.png
optimized_image: /assets/img/ssh.png
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

🔒 **Securing SSH: Implementing Basic Security Measures to Harden the SSH Port**

Back in 2021, I wrote a [blog post](https://harsim.ca/PKHarsimranOldGithubPages/SecuringSSH/) about manually hardening SSH configuration on a Raspberry Pi. While that guide was useful, I realized an automated approach would make the process more convenient and efficient. That's why I created **SSHieldPi**—a powerful, user-friendly bash script designed to automate SSH security on your Raspberry Pi.

In this post, I'll introduce you to SSHieldPi, detailing its features, setup process, and usage. Let's dive in! 🚀

## Why Secure Your SSH? 🔑

Securing your SSH port is crucial in preventing unauthorized access to your system. By implementing basic security measures, you can significantly reduce the risk of cyber threats. SSHieldPi aims to make this task effortless.

## Features of SSHieldPi 🌟

SSHieldPi offers a streamlined solution to secure your Raspberry Pi's SSH access. Here are its key features:

- **User Management:** Adds a new user with a custom username and password.
- **Sudo Privileges:** Grants sudo privileges to the new user.
- **SSH Configuration:** Adjusts SSH settings for enhanced security.
- **Custom Port:** Allows modification of the SSH port to a custom value.
- **Service Restart:** Restarts the SSH service to apply changes.

## Setting Up SSHieldPi 🛠️

Before we begin, ensure you have a Raspberry Pi running Raspbian or a compatible OS, along with root or sudo access to the device.

### Installation 📥

1. **Clone the SSHieldPi repository:**

    ```sh
    git clone https://github.com/PKHarsimran/SSHieldPi-The-Raspberry-Pi-SSH-Protection-Solution.git
    ```

2. **Navigate to the SSHieldPi directory:**

    ```sh
    cd SSHieldPi
    ```

3. **Make the script executable:**

    ```sh
    chmod +x sshieldpi.sh
    ```

### Using SSHieldPi 🚀

1. **Edit the Script:**
    - Open `sshieldpi.sh` in a text editor.
    - Replace the placeholders for `USERNAME` and `PASSWORD` with your desired username and a strong password.

2. **Uncomment Relevant Lines:**
    - Depending on your system (Debian/Ubuntu or CentOS/RHEL), uncomment the appropriate lines.

3. **Run the Script:**
    - Execute the script as root or with sudo privileges:

    ```sh
    sudo ./sshieldpi.sh
    ```

4. **Apply Changes:**
    - The script will create a new user, grant sudo privileges, and apply the recommended SSH settings. The SSH service will be restarted to apply these changes.

5. **Test the Configuration:**
    - Test the new SSH setup by logging in with the newly created user and the custom SSH port.

## Conclusion 🎉

SSHieldPi simplifies the process of hardening your Raspberry Pi's SSH configuration. By automating the steps outlined in my 2021 blog post, SSHieldPi saves you time and ensures consistent security across your devices. Give it a try and protect your Raspberry Pi with ease.

Explore the SSHieldPi project on [GitHub](https://github.com/PKHarsimran/SSHieldPi-The-Raspberry-Pi-SSH-Protection-Solution) and start securing your SSH today! 🔐

Your insights are invaluable in improving our security solutions. Stay secure! 🔒
