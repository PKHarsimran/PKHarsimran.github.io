---
date: 2024-05-20
last_modified_at: 2026-08-31
layout: post
title: "Mastering DKIM: Google’s New Email Authentication Rules for 2024 Explained"
subtitle: "Enhancing Email Security with DKIM, SPF, and DMARC"
description: "A comprehensive guide to understanding Google's new email sender requirements for 2024, with a focus on implementing DKIM to enhance email security and reduce spam."
image: /assets/img/dkim-google-2024.webp
optimized_image: /assets/img/dkim-google-2024.webp
thumbnail_image: /assets/img/thumbs/dkim-google-2024.webp
image_width: 1024
image_height: 1024
category: email-security
tags:
- DKIM
- Email Security
- Google Update
- Cybersecurity
- SPF
- DMARC
author: Harsimran Sidhu
paginate: true
comments: true
---

### Introduction

Starting February 1, 2024, Google introduced new requirements for mail sent to personal Gmail accounts. Google began ramping up enforcement against non-compliant traffic in November 2025, so these requirements remain operational guidance, not just a historical announcement. The current source of truth is Google's [Email sender guidelines](https://support.google.com/mail/answer/81126).

These changes are significant for everyone who relies on email, from businesses to individual users. For businesses, it means adopting new practices to comply with Google's requirements. For individual users, it means a cleaner, safer inbox with fewer unwanted emails. Let's dive into what these changes entail and how they will impact email communication.

### What is DKIM?

DKIM, or DomainKeys Identified Mail, is a way to check if an email is truly from the person or organization it claims to be from. It adds a digital signature to the email, like a seal of authenticity, which can be verified by the recipient’s email server. This helps ensure that the email has not been tampered with and is genuinely from the stated sender.

### How DKIM Works with SPF and DMARC

To enhance email security, DKIM works alongside SPF (Sender Policy Framework) and DMARC (Domain-based Message Authentication, Reporting, and Conformance). Here's a brief overview of each:

#### 1. SPF (Sender Policy Framework)

**SPF** is like a list of approved senders for your email domain. It helps identify which mail servers are allowed to send emails on behalf of your domain.

#### 2. DKIM (DomainKeys Identified Mail)

**DKIM** adds a unique digital signature to each email sent from your domain. This signature is verified by the recipient's email server to ensure the email hasn't been altered and is genuinely from you.

#### 3. DMARC (Domain-based Message Authentication, Reporting, and Conformance)

**DMARC** builds on SPF and DKIM. It tells receiving servers what to do if an email fails SPF or DKIM checks, helping protect your domain from unauthorized use.

### How They Work Together

When an email is sent, the receiving email server performs these checks:
1. **SPF Check**: Verifies the email is sent from an authorized server.
2. **DKIM Check**: Verifies the digital signature to ensure the email hasn't been tampered with.
3. **DMARC Check**: Decides what to do with the email based on the results of the SPF and DKIM checks.

### Diagram Explanation

Here's a diagram to illustrate how DKIM, along with SPF and DMARC, works to authenticate an email:
![image](https://github.com/PKHarsimran/PKHarsimran.github.io/assets/22066581/b9acfad6-5fa7-456a-8225-1dfb8f9b8579)

1. **Sender**: Sends an email.
2. **Sending Email Server**: Processes the email.
3. **SPF, DKIM, and DMARC Checks**: The receiving server checks the SPF record, verifies the DKIM signature, and follows the DMARC policy.
4. **Receiving Email Server**: Delivers the email to the inbox, sends it to the spam folder, or rejects it based on the checks.
5. **DMARC Reports**: Provides feedback to the sender about email authentication results.

By using DKIM together with SPF and DMARC, you can significantly improve your email security and ensure that your emails are trusted and delivered correctly. This helps protect against spam and phishing attacks and enhances the overall reliability of your email communications.

### How to Check DKIM in Gmail

To verify DKIM, SPF, and DMARC for an email in Gmail, you can view the email’s original message details. Here’s a step-by-step guide:

1. **Open the Email**: Go to your Gmail inbox and open the email you want to check.
2. **Click on More Options**: In the top right corner of the email (next to the reply button), click on the three vertical dots to open more options.
3. **Select "Show Original"**: From the dropdown menu, select "Show original." This will open a new tab showing the email's original message details.

In the original message view, you will see details about SPF, DKIM, and DMARC authentication results. For example, you might see:

- **SPF**: PASS with IP (followed by the sending IP address)
- **DKIM**: 'PASS' with domain (followed by the sender’s domain)
- **DMARC**: 'PASS'

Here’s an example screenshot to illustrate:

![image](https://github.com/PKHarsimran/PKHarsimran.github.io/assets/22066581/034a4379-44c5-41f1-a21c-e93ab20b9a23)

This shows the authentication results for SPF, DKIM, and DMARC, helping you confirm that the email is genuine and hasn’t been tampered with.

### Why is Google Implementing These Changes? 🌐

Google’s new requirements are designed to:
- **Prevent Fake Emails** 🛡️: Ensure emails come from real sources, reducing the risk of scams.
- **Improve Delivery** 📥: Verified emails are less likely to end up in the spam folder.
- **Build Trust** 🤝: By cutting down on spam and fake emails, users can trust their inbox more.

### Key Changes and Requirements 📝

Google separates the rules into two tiers:

1. **All senders:** authenticate with SPF or DKIM, use TLS, publish valid forward and reverse DNS, follow RFC 5322, and keep the Postmaster Tools spam rate below 0.3%.
2. **Bulk senders (more than 5,000 messages per day to personal Gmail accounts):** use SPF and DKIM, publish DMARC (a `p=none` policy is accepted), align the visible From domain with SPF or DKIM, and provide RFC 8058 one-click unsubscribe for marketing and subscription mail.

Google recommends configuring SPF, DKIM, and DMARC even when only one authentication method is strictly required. A body link or `mailto:` address alone does not satisfy the bulk-sender one-click unsubscribe requirement.

By following these new rules, organizations can protect their email domains from being used for scams and ensure their communications are safe and trustworthy.


### Conclusion

Google's new email rules for 2024 are a big step towards making email more secure. Using DKIM, along with SPF and DMARC, helps ensure that emails are genuine and trusted. By understanding and applying these protocols, you can protect your email, build trust with your audience, and improve your email deliverability.

For more information on implementing these changes and ensuring compliance, refer to the following resources:
- [Google: Email sender guidelines](https://support.google.com/mail/answer/81126)
- [Google: Email sender guidelines FAQ](https://support.google.com/mail/answer/14229414)
- [New Gmail protections for a safer, less spammy inbox](https://blog.google/products/gmail/gmail-security-authentication-spam-protection/)
