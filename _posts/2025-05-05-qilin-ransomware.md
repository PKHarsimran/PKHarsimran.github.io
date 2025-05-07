---
date: 2025-05-05
layout: post
title: "Qilin (Agenda) Ransomware Explained: Real‑World Attack Timeline & 7 Fast Defenses"
subtitle: "Stop Double‑Extortion Attacks Before They Start"
description: "Dive into a realistic Qilin (Agenda) ransomware breach, mapped to MITRE ATT&CK, with fresh IOCs and a seven‑step hardening checklist any team can implement today."
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
> **TL;DR:** *Qilin (aka Agenda) is a cross‑platform, double‑extortion ransomware written in Go & Rust. In this post I’ll walk you through a realistic attack storyline mapped to MITRE ATT&CK, share fresh IOCs, and give you a seven‑step checklist to harden your environment—before the ransom note hits your inbox.*![image]

![Coffe gif](https://media.giphy.com/media/l4q8kQqDLUUEBVDk4/giphy.gif)

You're sipping your morning coffee, casually scanning your dashboards. Then something strange catches your eye — unfamiliar file extensions, odd filenames.
A few virtual machines suddenly go dark. Moments later, a message pops up in your inbox: a ransom note.
No, this isn't a Netflix plot. This is ransomware — and not just any strain. We're talking about Qilin, also known as Agenda.
In this blog, I’ll guide you through a detailed hypothetical attack scenario rooted in real-world tactics used by this ransomware group. We'll explore how these attacks unfold, highlight common weaknesses that threat actors exploit, and provide clear actions you can take to strengthen your defenses.
This isn’t fear-mongering. It’s preparation — the kind every organization should take seriously.

> **As of now, Qilin has publicly claimed responsibility for over 437 victims — and counting**  
> 🔗 [Source: ransomware.live](https://www.ransomware.live/group/qilin)


---

## ✅ 2. What Is Qilin / Agenda Ransomware?

### 🧬 Overview

Qilin, formerly known as **Agenda**, is a sophisticated ransomware-as-a-service (RaaS) operation active since mid-2022. Written in both **Go** and **Rust**, it supports attacks against Windows, Linux, and VMware ESXi systems. Its modular payloads and customization capabilities make it a favorite among affiliates targeting high-value sectors.

Qilin attacks are highly tailored — operators often fine-tune each payload to bypass detection, avoid encrypting critical system files, and operate during off-hours to maximize impact.

---

### 🎭 Aliases & Evolution

- **Agenda** – Initial name used when the ransomware was first reported.
- **Qilin** – Rebranded version with enhanced capabilities and evasive tactics.

The rebrand marked a strategic shift with improvements in payload delivery, stronger obfuscation, and Chrome credential theft behavior observed in newer variants.

---

### 🌍 Industries Targeted

Qilin has impacted over **437 confirmed victims**, particularly targeting sectors with high uptime requirements or sensitive data:

- 🏥 **Healthcare**
- 🧾 **Legal and Professional Services**
- 🏫 **Education**
- 🏭 **Manufacturing**
- ☁️ **Cloud/VPS Hosting Providers**

These industries are typically vulnerable due to outdated infrastructure, lack of segmentation, or slow patching practices.

---

### 💣 Double Extortion Strategy

Qilin combines two major tactics to pressure victims:

1. **Encryption** – Files are encrypted using AES-256 and protected by RSA-2048 keys.
2. **Data Theft** – Sensitive files are exfiltrated and later leaked on their dark web portal if ransom demands are not met.

Victims often receive ransom notes such as `README.txt` or `qilin_readme.txt`, which contain a Tor link to the negotiation portal and a unique victim ID.

> As of the latest reports, Qilin has exposed over **30 organizations** via public leak sites.

---

### 🧠 MITRE ATT&CK Mapping

<div style="overflow-x: auto;">

| Tactic               | Technique       | Description                                      |
|----------------------|------------------|--------------------------------------------------|
| Initial Access        | T1078, T1190     | Valid accounts, vulnerable applications          |
| Execution             | T1059            | PowerShell, WMI, LOLBAS abuse                    |
| Persistence           | T1053            | Scheduled tasks, registry changes                |
| Privilege Escalation  | T1548            | Token manipulation, UAC bypass                   |
| Defense Evasion       | T1562            | AV/EDR disabling, obfuscation                    |
| Credential Access     | T1003            | LSASS dumps, Chrome credential theft             |
| Lateral Movement      | T1021            | RDP, SMB, PsExec                                 |
| Impact                | T1486            | File system encryption and ransom extortion      |

</div>

---

### 🧪 Indicators of Compromise (IOCs)

**File Names:**
- `upd.exe`
- `main.exe`
- `web.dat`
- `TPwSav.sys`
- `avupdate.dll`

**SHA-256 Hashes:**
- `aeddd8240c09777a84bb24b5be98e9f5465dc7638bec41fb67bbc209c3960ae1`
- `3dfae7b75fbd029130ed4ea123d8bc37d5df0dbe456dbf403f755cb1ed5e6bc0`

**Leak Site:**
- `http://qilinxxc4zxthxse46tmrjppn6s2p7vnmw4nclsbxugrgfcgqz2wx4id.onion/`

Always validate these IOCs in your own environment using sandboxed tools and your threat intelligence feeds.

---

### 🛠️ Tools Used by Qilin (Observed in the Wild)

<div style="overflow-x: auto;">

| Discovery | RMM Tools     | Defense Evasion                                           | Credential Theft | Offsec Tools   | Networking   | LOLBAS   | Exfiltration     |
|-----------|---------------|-----------------------------------------------------------|------------------|----------------|--------------|----------|------------------|
| Nmap      | ScreenConnect | EDRSandBlast                                              | Mimikatz         | Cobalt Strike  | Proxychains  | fsutil   | EasyUpload.io    |
| Nping     |               | PCHunter, PowerTool                                       |                  | Evilginx       |              | PsExec   |                  |
|           |               | Toshiba Power Mgmt Driver (BYOVD)                         |                  | NetExec        |              | WinRM    |                  |
|           |               | Updater for Carbon Black Cloud Sensor AV (`upd.exe`)      |                  |                |              |          |                  |
|           |               | YDArk, Zemana Anti-Rootkit Driver                         |                  |                |              |          |                  |

</div>

> _Source: [Ransomware Tool Matrix](https://github.com/mandiant/Ransomware-Tool-Matrix)_

---

### 🔗 Further Reading & References

- [SentinelOne: Agenda/Qilin Deep Dive](https://www.sentinelone.com/anthology/agenda-qilin/)
- [HHS Qilin Threat Profile (PDF)](https://www.hhs.gov/sites/default/files/qilin-threat-profile-tlpclear.pdf)
- [Sophos: Credential Theft via Chrome](https://news.sophos.com/en-us/2024/08/22/qilin-ransomware-caught-stealing-credentials-stored-in-google-chrome/)
- [SOCRadar: Qilin Dark Web Profile](https://socradar.io/dark-web-profile-qilin-agenda-ransomware/)
- [Blackpoint Cyber: Qilin Threat Intel PDF](https://blackpointcyber.com/wp-content/uploads/2025/01/Qilin-3.pdf)

---
