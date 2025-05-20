---
date: 2025-05-05
layout: post
title: "Qilin (Agenda) Ransomware Explained: Real‑World Attack Timeline & 7 Fast Defenses"
subtitle: "Stop Double‑Extortion Attacks Before They Start"
description: "Walk through a realistic Qilin ransomware breach mapped to MITRE ATT&CK, review fresh IOCs, and leave with a seven‑step hardening checklist you can apply before the ransom note arrives."
image: /assets/img/qilinPoster.webp        
optimized_image: /assets/img/qilinPoster.webp
category: ransomware
tags:
  - Qilin Ransomware
  - Agenda Ransomware
  - Double‑Extortion
  - MITRE ATT&CK
  - Incident Response
  - Cybersecurity
author: Harsimran Sidhu
paginate: true
comments: true
---

> **TL;DR** — **Qilin** (formerly *Agenda*) is a cross‑platform, double‑extortion ransomware written in Go and Rust.

![Coffee break—before the chaos](https://media.giphy.com/media/l4q8kQqDLUUEBVDk4/giphy.gif)

---
## 1 — Why You Should Care

You're sipping your morning coffee, casually scanning your dashboards. Then something strange catches your eye — unfamiliar file extensions, odd filenames.
A few virtual machines suddenly go dark. Moments later, a message pops up in your inbox: a ransom note.
No, this isn't a Netflix plot. This is ransomware — and not just any strain. We're talking about **Qilin**, also known as **Agenda**.
In this blog, I’ll guide you through a detailed hypothetical attack scenario rooted in real-world tactics used by this ransomware group. We'll explore how these attacks unfold, highlight common weaknesses that threat actors exploit, and provide clear actions you can take to strengthen your defenses.
This isn’t fear-mongering. It’s preparation — the kind every organization should take seriously.

> As of now, Qilin has publicly claimed responsibility for over **437 victims**, and that number is still growing — according to [ransomware.live](https://www.ransomware.live/group/qilin).

---
### 🧬 What Is Qilin (aka Agenda) Ransomware?

Qilin, previously tracked as **Agenda**, is a ransomware-as-a-service (RaaS) operation that surfaced in mid-2022. It is written in both Go and Rust, and is capable of targeting both Windows and Linux systems — including VMware ESXi.

Victims are often hit with highly customized payloads — operators configure what files to skip, services to disable, and when encryption should trigger.

The group later rebranded from Agenda to Qilin, evolving its tooling, improving detection evasion, and expanding affiliate adoption.

#### Targeted Industries:
- Healthcare
- Education
- Manufacturing
- Legal and Professional Services
- Cloud and Hosting Providers

#### Double Extortion Tactics:
1. **Data Encryption** – Files are encrypted using AES-256 and RSA-2048.
2. **Data Exfiltration** – Stolen data is used for leverage via public leaks if ransom is not paid.

### 2.1 Evolution

- **Agenda** → initial branding  
- **Qilin** → rebrand featuring stronger obfuscation, Chrome credential theft, and BYOVD drivers

### 2.2 How Double Extortion Works

1. **Encryption** — Files are locked with AES‑256, keys protected by RSA‑2048.  
2. **Data theft** — Sensitive documents are exfiltrated during the breach.  
3. **Leverage** — Refuse to pay and the data is published on the leak portal.

---
## 🧨 How Qilin Executes Each Step – From Initial Access to Impact

Understanding Qilin’s attack chain isn’t just about listing tactics — it’s about knowing **how and when** they’re used in real intrusions. Below is a walkthrough of how each MITRE ATT&CK tactic might play out during a typical Qilin campaign, based on observed behavior.

---

## 🕵️ Abuse of Kickidler Monitoring Software

Qilin affiliates have been observed abusing **Kickidler**, a legitimate employee-monitoring software, to enhance their visibility post-compromise.

After gaining access (often via a **trojanized RVTools installer** hosted on `rv-tool[.]net`), attackers deploy a PowerShell loader called **SMOKEDHAM**. This backdoor then installs **Kickidler** — allowing the attacker to:

- 🎥 Record user sessions in real-time  
- ⌨️ Capture keystrokes and credentials  
- 👀 Monitor administrator behavior  
- 🧭 Track internal movements across the network

Originally built for workplace monitoring, Kickidler’s screen recording and session replay features are repurposed for credential theft, reconnaissance, and even backup system access.

> 📎 **Source:** [BleepingComputer – Kickidler Abuse in Ransomware Attacks](https://www.bleepingcomputer.com/news/security/kickidler-employee-monitoring-software-abused-in-ransomware-attacks/)

#### 🧰 Observed Tool Chain:
- Initial lure via **fake Google Ads** impersonating RVTools
- Trojanized installer from `rv-tool[.]net`
- Loader: **SMOKEDHAM** PowerShell-based backdoor
- Post-access: Deployment of **Kickidler** monitoring agent

These tactics show how attackers increasingly rely on *living-off-the-land* and *legitimate software abuse* to bypass defenses and stay under the radar.

---

## 🛠 Initial Access  
**Techniques:**  
- `T1078` – Valid Accounts  
- `T1190` – Exploit Public-Facing Application  

It starts quietly. A phishing email mimicking Dropbox or invoicing software arrives — or an IT staffer unknowingly installs a **trojanized version of RVTools** from `rv-tool[.]net`. In other cases, attackers log in directly using **purchased or reused RDP credentials**.  
**Source:** [SentinelOne](https://www.sentinelone.com/anthology/agenda-qilin/)

---

### 🧬 Execution  
**Technique:**  
- `T1059` – Command and Scripting Interpreter  

Once inside, Qilin drops custom payloads using native scripting tools. A PowerShell command silently downloads `NETXLOADER`, which pulls in the ransomware binary — all without triggering traditional antivirus.  
**Source:** [Sophos](https://news.sophos.com/en-us/2024/08/22/qilin-ransomware-caught-stealing-credentials-stored-in-google-chrome/)

---

**T1547.001 – Registry Run Keys / Startup Folder**  
In at least one documented case, Qilin's loader disguised itself as a Windows "SystemHealthMonitor" tool and used the Registry Run key to establish persistence:

```powershell
New-ItemProperty -Path "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" `
  -Name "SystemHealthMonitor" `
  -Value "C:\Windows\System32\wscript.exe //B //E:jscript C:\ProgramData\svchost.js" `
  -PropertyType String -Force
```

This allowed the malicious script (svchost.js) to execute automatically on startup.

🔗 Source: [Cyber Security News – Qilin Tops April 2025](https://cybersecuritynews.com/qilin-has-emerged-as-the-top-ransomware-group/)

---

### 🔓 Privilege Escalation  
**Technique:**  
- `T1548` – Abuse Elevation Control Mechanism  

They don’t wait for permission. Qilin brings their own **vulnerable drivers (BYOVD)** — like **Zemana AntiMalware** or **Toshiba power drivers** — to disable security tools and gain **SYSTEM-level access**.

---

### 🎭 Defense Evasion  
**Technique:**  
- `T1562` – Impair Defenses  

Using renamed binaries like `upd.exe` (a spoof of legitimate AV updaters), Qilin disables EDR, clears logs, and bypasses detection. The malware might even exploit outdated **Carbon Black Cloud sensors** to remain hidden.

---

### 🛂 Credential Access  
**Technique:**  
- `T1003` – OS Credential Dumping  

Once elevated, Qilin dumps LSASS memory and **extracts credentials from browsers like Chrome**. These are used to access other systems silently.  
**Source:** [Sophos Report on Chrome Theft](https://news.sophos.com/en-us/2024/08/22/qilin-ransomware-caught-stealing-credentials-stored-in-google-chrome/)

---

### 🔄 Lateral Movement  
**Technique:**  
- `T1021` – Remote Services  

With credentials in hand, Qilin moves laterally across the network using **SMB, RDP, WinRM, and PsExec**.  
IT tools like **ScreenConnect** and **AnyDesk** are sometimes hijacked to extend access.

---

### 💥 Impact  
**Technique:**  
- `T1486` – Data Encrypted for Impact  

When ready, Qilin triggers its payload. Files are encrypted with `.qilin` or `.qln` extensions.  
Ransom notes like `README.txt` or `qilin_readme.txt` appear across file shares and desktop paths.  
Backups, if reachable, are targeted and encrypted first.

---

> ℹ️ If the technique IDs look cryptic, they’re part of the [MITRE ATT&CK](https://attack.mitre.org) framework — a public catalog of adversary behavior used across cybersecurity.

---

### 🧠 Lessons Learned

**Credential Hygiene**
- Shared admin accounts still exist across machines
- No MFA on remote portals = recipe for breach

**Network Design**
- Flat networks = lateral movement playground

**Backup Safety**
- No isolation = encrypted backups

**Comms Plan**
- Teams default to Slack, WhatsApp — no fallback if infra is down

**Decision Paralysis**
- Who shuts down systems? Who notifies legal? No one’s sure

---

## 🧪 Indicators of Compromise (IOCs)

Below are the observed IOCs associated with Qilin/Agenda ransomware from multiple trusted sources including SentinelOne, HHS, Sophos, Blackpoint Cyber, and Cyble.

### 📁 File Names
- `upd[.]exe`
- `main[.]exe`
- `web[.]dat`
- `TPwSav[.]sys`
- `avupdate[.]dll`
- `qilin_readme[.]txt`
- `README[.]txt`

**Source:** SentinelOne, Blackpoint Cyber, Sophos

---

### 🔐 SHA-256 Hashes
- `aeddd8240c09777a84bb24b5be98e9f5465dc7638bec41fb67bbc209c3960ae1`
- `3dfae7b75fbd029130ed4ea123d8bc37d5df0dbe456dbf403f755cb1ed5e6bc0`
- `d3af11d6bb6382717bf7b6a3aceada24f42f49a9489811a66505e03dd76fd1af`
- `011df46e94218cbb2f0b8da13ab3cec397246fdc63436e58b1bf597550a647f6`
- `08224e4c619c7bbae1852d3a2d8dc1b7eb90d65bba9b73500ef7118af98e7e05`

**Source:** SentinelOne, Rewterz, Blackpoint Cyber

---

### 🌐 Domains and IPs (Used for Payload Delivery or C2)
- `rv-tool[.]net` – Fake RVTools site used to deliver loader (from Cyble, SentinelOne)
- IPs related to payload hosting and exfiltration were not published directly, but traffic was observed connecting to unknown external hosts via PowerShell (`Invoke-WebRequest`) in sandbox testing by Cyble.

**Source:** Cyble, SentinelOne

---

### 🔗 Leak Site (Tor)
- `hxxp://qilinxxc4zxthxse46tmrjppn6s2p7vnmw4nclsbxugrgfcgqz2wx4id[.]onion/`

**Source:** ransomware.live, Blackpoint Cyber

---

These IOCs should be monitored across:
- EDR/XDR alerts
- DNS resolution logs
- Email gateways
- Proxy and firewall connections
- Process creation and PowerShell logs (Event IDs 4104, 4688)

> ⚠️ Note: Always verify IOCs with internal telemetry to avoid false positives. Use them in conjunction with behavioral detections for maximum effectiveness.


---
### 🧼 Cyber Hygiene Tips That Actually Work

- Use **MFA** on everything you can — especially remote access
- Limit **admin rights** and clean up stale accounts
- Patch **internet-facing systems** quickly
- Segment **critical assets** from everyday users
- Store **at least one backup copy offline** — and test recovery
- Set up **alerts** for service creation, file rename bursts, and odd login patterns
- Define **offline comms and response plans** in advance

---

### ✅ What Helped Most

- Quick isolation of infected hosts, even manually, slowed spread
- Visibility from tools like Defender, CrowdStrike, and Splunk helped trace lateral movement
- Out-of-band comms (Signal, SMS, even Zoom) helped keep coordination alive
- Having a printed or static IR checklist meant fewer delays

---

### 🎯 Final Thoughts

You don’t need perfect. You need **ready**.

Qilin isn’t unique in how it attacks — but in how well it exposes your gaps. The lesson?

> You don’t rise to the level of your plan. You fall to the level of your training.

Run a tabletop. Review your backups. Update your response tree.

![tabletop](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGxyZDkwa3FmZTVuZmt4MDl3MzE0OG5rNTQzNXE2dmlremZkZ3Z1ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/jNJyXCAwY8NxTTAFuK/giphy.gif)

You’ve got time now. Use it.

**Stay safe. Stay ready.**

---

## 📚 Further Reading & Sources

- [**Ransomware.live** – Qilin victim list (live count)](https://www.ransomware.live/group/qilin)  
- [**SentinelOne** – Agenda/Qilin Deep Dive](https://www.sentinelone.com/anthology/agenda-qilin/)  
- [**U.S. HHS HC3** – Qilin Threat Profile (PDF)](https://www.hhs.gov/sites/default/files/qilin-threat-profile-tlpclear.pdf)  
- [**Sophos X-Ops** – Chrome credential-stealing tactic](https://news.sophos.com/en-us/2024/08/22/qilin-ransomware-caught-stealing-credentials-stored-in-google-chrome/)  
- [**Blackpoint Cyber** – Qilin Ransomware Threat Profile (PDF)](https://blackpointcyber.com/wp-content/uploads/2024/08/Qilin-Ransomware-Threat-Profile_Adversary-Pursuit-Group-Blackpoint-Cyber_2024Q3.pdf)  
- [**SOCRadar** – Dark-web profile & leak-site URL](https://socradar.io/dark-web-profile-qilin-agenda-ransomware/)  
- [**GitHub** – Ransomware Tool Matrix](https://github.com/BushidoUK/Ransomware-Tool-Matrix)  
- [**Cyble** – Ransomware Attacks April 2025: Qilin Emerges from Chaos](https://cyble.com/blog/qilin-tops-april-2025-ransomware-report/)  
- [**BleepingComputer** – Kickidler software abused in ransomware attacks](https://www.bleepingcomputer.com/news/security/kickidler-employee-monitoring-software-abused-in-ransomware-attacks/)  
- [**Rewterz** – Lazarus Qilin samples and hashes](https://www.rewterz.com/reports/)  

