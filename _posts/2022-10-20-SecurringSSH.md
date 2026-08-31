---
date: 2022-10-20
last_modified_at: 2026-08-31
layout: post
title: "Securing SSH: Implementing Basic Security Measures to Harden the SSH Port"
subtitle: "A Step-by-Step Guide to Enhancing Your SSH Security"
description: "Explore essential steps to harden your SSH port and prevent unauthorized access in this concise guide. Learn key security measures to protect your systems effectively."
image: /assets/img/ssh.webp
optimized_image: /assets/img/ssh.webp
image_width: 1024
image_height: 1024
category: blog
tags:
  - SSH
  - Cybersecurity
  - ports
  - tutorials
author: Harsimran Sidhu
paginate: true
comments: true
---

🔒 **Securing SSH: Implementing Basic Security Measures to Harden the SSH Port**

Back in 2021, I wrote an earlier guide about manually hardening SSH on a Raspberry Pi. I later created **PiSecure-SSH** to make the repeatable parts of that process more convenient while keeping the configuration review explicit.

In this post, I'll introduce you to PiSecure-SSH, detailing its features, setup process, and usage. Let's dive in! 🚀

## Why Secure Your SSH? 🔑

Securing your SSH port is crucial in preventing unauthorized access to your system. By implementing basic security measures, you can significantly reduce the risk of cyber threats. PiSecure-SSH aims to make this task effortless.

## Features of PiSecure-SSH 🌟

PiSecure-SSH offers a streamlined starting point for Raspberry Pi SSH hardening. Review the script before running it and test changes from a second session so you do not lock yourself out. Its key features are:

- **User Management:** Adds a new user with a custom username and password.
- **Sudo Privileges:** Grants sudo privileges to the new user.
- **SSH Configuration:** Adjusts SSH settings for enhanced security.
- **Custom Port:** Allows modification of the SSH port to reduce routine scan noise. A port change is not a substitute for strong authentication or firewall rules.
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

1. **Review the Script:**
    - Read `secure-ssh-setup.sh` before granting it root access.
    - Do not hard-code a reusable password in the file or commit credentials to Git. Prefer an SSH key protected by a passphrase, and create the account interactively if the script does not support secure prompting.

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

4. **Validate and Apply Changes:**
    - Keep the current SSH session open, validate the configuration with `sudo sshd -t`, and only then reload the service. Test a second login before closing the recovery session.

5. **Harden Authentication:**
    - After confirming key-based login works, disable direct root login and password authentication where your environment permits. Restrict inbound SSH with a host or network firewall and keep OpenSSH patched.

## Conclusion 🎉

PiSecure-SSH simplifies the process of hardening your Raspberry Pi's SSH configuration. By automating the steps outlined in my 2021 blog post, PiSecure-SSH saves you time and ensures consistent security across your devices. Give it a try and protect your Raspberry Pi with ease.

Explore the PiSecure-SSH project on [GitHub](https://github.com/PKHarsimran/PiSecure-SSH) and start securing your SSH today! 🔐

Your insights are invaluable in improving our security solutions. Stay secure! 🔒
