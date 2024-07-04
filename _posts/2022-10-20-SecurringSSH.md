---
date: 2022-10-20
layout: post
title: "Securing SSH: Implementing Basic Security Measures to Harden the SSH Port"
subtitle: "A Step-by-Step Guide to Enhancing Your SSH Security"
description: "Explore essential steps to harden your SSH port and prevent unauthorized access in this concise guide. Learn key security measures to protect your systems effectively."
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

Back in 2021, I wrote a [blog post](https://harsim.ca/PKHarsimranOldGithubPages/SecuringSSH/) about manually hardening SSH configuration on a Raspberry Pi. While that guide was useful, I realized an automated approach would make the process more convenient and efficient. That's why I created **PiSecure-SSH**—a powerful, user-friendly bash script designed to automate SSH security on your Raspberry Pi.

In this post, I'll introduce you to PiSecure-SSH, detailing its features, setup process, and usage. Let's dive in! 🚀

## Why Secure Your SSH? 🔑

Securing your SSH port is crucial in preventing unauthorized access to your system. By implementing basic security measures, you can significantly reduce the risk of cyber threats. PiSecure-SSH aims to make this task effortless.

## Features of PiSecure-SSH 🌟

PiSecure-SSH offers a streamlined solution to secure your Raspberry Pi's SSH access. Here are its key features:

- **User Management:** Adds a new user with a custom username and password.
- **Sudo Privileges:** Grants sudo privileges to the new user.
- **SSH Configuration:** Adjusts SSH settings for enhanced security.
- **Custom Port:** Allows modification of the SSH port to a custom value.
- **Service Restart:** Restarts the SSH service to apply changes.

## Setting Up PiSecure-SSH 🛠️

Before we begin, ensure you have a Raspberry Pi running Raspbian or a compatible OS, along with root or sudo access to the device.

### Installation 📥

1. **Clone the PiSecure-SSH repository:**

    ```sh
    git clone https://github.com/PKHarsimran/PiSecure-SSH.git
    ```

2. **Navigate to the PiSecure-SSH directory:**

    ```sh
    cd PiSecure-SSH
    ```

3. **Make the script executable:**

    ```sh
    chmod +x secure-ssh-setup.sh
    ```

### Using PiSecure-SSH 🚀

1. **Edit the Script:**
    - Open `secure-ssh-setup.sh` in a text editor.
    - Replace the placeholders for `USERNAME` and `PASSWORD` with your desired username and a strong password.

    ```bash
    USERNAME="your-username"
    PASSWORD="your-strong-password"
    ```

2. **Uncomment Relevant Lines:**
    - Depending on your system (Debian/Ubuntu or CentOS/RHEL), uncomment the appropriate lines for adding the user to the sudoers group and restarting the SSH service.

    ```bash
    # Uncomment for Debian/Ubuntu systems
    # usermod -aG sudo ${USERNAME}
    # service ssh restart
    
    # Uncomment for CentOS/RHEL systems
    # usermod -aG wheel ${USERNAME}
    # systemctl restart sshd
    ```

3. **Run the Script:**
    - Execute the script as root or with sudo privileges:

    ```sh
    sudo ./secure-ssh-setup.sh
    ```

4. **Apply Changes:**
    - The script will create a new user, grant sudo privileges, and apply the recommended SSH settings. The SSH service will be restarted to apply these changes.

5. **Test the Configuration:**
    - Test the new SSH setup by logging in with the newly created user and the custom SSH port.

## Conclusion 🎉

PiSecure-SSH simplifies the process of hardening your Raspberry Pi's SSH configuration. By automating the steps outlined in my 2021 blog post, PiSecure-SSH saves you time and ensures consistent security across your devices. Give it a try and protect your Raspberry Pi with ease.

Explore the PiSecure-SSH project on [GitHub](https://github.com/PKHarsimran/PiSecure-SSH) and start securing your SSH today! 🔐

Your insights are invaluable in improving our security solutions. Stay secure! 🔒
