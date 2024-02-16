---
date: 2021-10-20
layout: post
title: Securing SSH
subtitle: 'Implementing Basic Security Measures to Harden the SSH Port'
description: >-
  Explore essential steps to harden your SSH port and prevent unauthorized access in this concise guide. Learn key security measures to protect your systems effectively.
image: >-
  https://res.cloudinary.com/dm7h7e8xj/image/upload/v1559821647/theme6_qeeojf.jpg
optimized_image: >-
  https://res.cloudinary.com/dm7h7e8xj/image/upload/c_scale,w_380/v1559821647/theme6_qeeojf.jpg
category: blog
tags:
  - SSH
  - cybersecurity
  - ports
  - blog
author: Harsimran Sidhu
paginate: true
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

Vivamus sagittis lacus vel augue rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.

--page-break--

## Code

Cum sociis natoque penatibus et magnis dis `code element` montes, nascetur ridiculus mus.

```js
// Example can be run directly in your JavaScript console

// Create a function that takes two arguments and returns the sum of those arguments
var adder = new Function("a", "b", "return a + b");

// Call the function
adder(2, 6);
// > 8
```

Aenean lacinia bibendum nulla sed consectetur. Etiam porta sem malesuada magna mollis euismod. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa.

## Lists

Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean lacinia bibendum nulla sed consectetur. Etiam porta sem malesuada magna mollis euismod. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.

* Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
* Donec id elit non mi porta gravida at eget metus.
* Nulla vitae elit libero, a pharetra augue.

Donec ullamcorper nulla non metus auctor fringilla. Nulla vitae elit libero, a pharetra augue.

1. Vestibulum id ligula porta felis euismod semper.
2. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
3. Maecenas sed diam eget risus varius blandit sit amet non magna.

Cras mattis consectetur purus sit amet fermentum. Sed posuere consectetur est at lobortis.

Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Nullam quis risus eget urna mollis ornare vel eu leo.

## Images

Quisque consequat sapien eget quam rhoncus, sit amet laoreet diam tempus. Aliquam aliquam metus erat, a pulvinar turpis suscipit at.

![placeholder](https://placehold.it/800x400 "Large example image") ![placeholder](https://placehold.it/400x200 "Medium example image") ![placeholder](https://placehold.it/200x200 "Small example image")

## Tables

Aenean lacinia bibendum nulla sed consectetur. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Upvotes</th>
      <th>Downvotes</th>
    </tr>
  </thead>
  <tfoot>
    <tr>
      <td>Totals</td>
      <td>21</td>
      <td>23</td>
    </tr>
  </tfoot>
  <tbody>
    <tr>
      <td>Alice</td>
      <td>10</td>
      <td>11</td>
    </tr>
    <tr>
      <td>Bob</td>
      <td>4</td>
      <td>3</td>
    </tr>
    <tr>
      <td>Charlie</td>
      <td>7</td>
      <td>9</td>
    </tr>
  </tbody>
</table>

Nullam id dolor id nibh ultricies vehicula ut id elit. Sed posuere consectetur est at lobortis. Nullam quis risus eget urna mollis ornare vel eu leo.
