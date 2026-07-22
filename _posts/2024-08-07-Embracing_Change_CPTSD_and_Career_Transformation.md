---
date: 2024-08-07
layout: post
title: "I Didn't Heal First"
subtitle: "CPTSD, lupus, and how being the odd kid with a computer became a career in threat hunting"
description: "I used to think healing led me into cybersecurity. It was the other way around. A story about Complex PTSD, a lupus diagnosis I ignored, a failed exam, and the ransomware incident where the thing I learned as a lonely kid finally became useful."
image: /assets/img/cptsd-career-change.png
optimized_image: /assets/img/cptsd-career-change.png
category: personal growth
tags:
- CPTSD
- Cybersecurity
- Threat Hunting
- Lupus
- Chronic Illness
- Career Change
- Healing
- Mental Health
author: Harsimran Sidhu
paginate: true
comments: true
---

**Introduction**

At 10 years old, I was severely underweight, malnourished, and often dissociated from the world around me. I was a shy kid who didn't know how to speak up, living in full people-pleaser mode without a real sense of self. My family didn't see illness; they saw a "quiet" child and assumed I'd grow out of it.

But neglect isn't always loud — sometimes it's the silence, the inaction, and the absence of care.

What no one realized then was that my body was already fighting lupus, and beneath that was something even deeper: unprocessed trauma.

This is the story of what came out of that. Not in the order I used to tell it.

**Growing Up in Survival Mode**

I was born in a modest home in Northern India. My father's job meant constant moving — new schools, new languages, new kids who didn't understand me. Wearing a turban as a young Sikh child made me a visible target for relentless bullying. At school, my silence and shyness were read as weakness, an open invitation. That pattern followed me into college and university, where my fear of speaking up and my need to please people kept me from setting boundaries. I didn't know how to say, *please stop, I don't like how you're treating me.*

At home, things were no better. My parents were emotionally distant and, at times, physically and emotionally abusive. They didn't like the way I looked, or how I expressed myself.

Once, around nine or ten, I was beaten because I couldn't answer my father's boss when he asked me the meaning of my own name.

Experiences like that taught me to hide my emotions, and taught me to mistake numbness for strength.

When we moved to Canada at 13, I thought things would get better. They didn't. Racism, isolation, and pressure to succeed only added to the weight. But in my family, mental health wasn't discussed. We just pushed through.

Here is the part I left out of every previous version of this story.

State to state, then country to country, I was always the odd kid — the new one, the wrong one, the one nobody had a slot for. So I spent my time with a computer. The computer didn't care that I was new. It didn't care about my accent or my turban or how quiet I was. It answered the same way for everybody. I'd sit there for hours seeing what I could learn, what I could make it do, how far I could push it before something broke.

I thought that was just what lonely kids do. It turned out to be a career.

**What CPTSD Actually Is**

Complex PTSD isn't caused by one event. It's the result of many, usually starting in childhood, and it rewires how you see yourself and the world.

For me it showed up as:

- Always being on edge, even in safe places.
- Deep shame and low self-worth.
- Emotional numbness, or sudden outbursts.
- Trouble with trust, boundaries, and relationships.

Left alone, it seeps into your health, your confidence, and what you think you're allowed to want.

**The Diagnosis I Ignored**

I found out I had lupus in Canada. I went to a doctor about a flare on my arm, and the doctor gave it a name.

But I'd been having flares since I was a child. I still have the scars on my lower body to prove it. We did go to doctors back then — I don't remember much of it, and nothing came of it. Whatever was happening to me, nobody ever sat down and tried to understand it.

So by the time someone finally handed me the word, I couldn't do much with it. I was in the middle of leaving my parents' home. That was the emergency I had capacity for. A chronic autoimmune condition can't compete with getting out.

It flares regularly now — hands and arms, mostly. This isn't the part of the essay where I tell you I beat it.

**I Didn't Heal First**

The first version of this post said that healing led me into cybersecurity. That was tidy, and it was wrong.

The career change came first, and it wasn't about being well. It was about something narrower and more useful than that: I worked out that I could decide something for myself. That I didn't need anyone's permission, praise, or direction to want a thing and go after it. That was the whole realization. It looks small written down. It wasn't.

When COVID hit, I enrolled in the University of Toronto's Cybersecurity Boot Camp.

Then I failed the CompTIA Security+ on the first attempt.

I'd like to tell you it devastated me. It didn't, and the reason isn't inspiring: I was used to failing. I'd failed at plenty by then. When you've spent your life being told you're not much, a failed exam doesn't arrive as news.

But being used to it had one advantage — I didn't need to recover. I just went back.

Three weeks. That's all the second attempt took. What changed wasn't how hard I studied. It was that the fear was gone. I'd seen the exam now. I knew the shape of the questions and what they actually wanted from me, and with the fear out of the way there was suddenly room to *understand* the material instead of memorizing my way past it.

The fear had been sitting in the space that understanding needed. Once it moved, three weeks was enough.

My first real break came during the pandemic, as an IT Specialist at Telecom Metric, working entirely virtually.

**Healing Through Therapy**

The actual healing started later, once I was in therapy.

Cognitive Behavioural Therapy taught me to name what happened to me as abuse — not "people being rude," not "strict parents," not something I'd exaggerated. Just abuse, plainly.

EMDR did something harder. It let me get back to my younger self, process the grief I'd stepped over, and let go of things I'd been holding since I was small.

None of it was fast. But it gave me tools to take my life back from both the CPTSD and the years of not being looked after.

**The Incident**

A few years into the work, the company I was at got hit with ransomware.

I won't go into what happened to us — that isn't mine to publish. What I can tell you is what I did.

I went looking. I pulled everything available in the open on the group behind it: their TTPs, their tooling, the indicators other victims and researchers had already published. Then I took those indicators into our XDR and started hunting. The network communication logs gave it up. I found the exact VPS that had been popped.

And then I said the thing I'm proudest of in my whole career. I told the team: our XDR doesn't cover everything we own. If the attackers went at this box, they probably went at the ones we can't see. We should pull WAF traffic for the servers that aren't instrumented.

That's the job, really. Not looking at the alert that fired. Looking at the place where no alert *could* fire.

I wrote earlier that neglect isn't always loud — that sometimes it's the silence, the inaction, the absence of care. I learned to read absence before I learned almost anything else. I learned it as a child, badly, and at a price. It happens to be the single most useful instinct in threat hunting.

Two things surprised me about that stretch.

The first is that I loved it. We worked around the clock and I was signing on early. I wasn't dreading it and I wasn't gritting my teeth through it. I'd found the thing I was for.

The second is that I spoke up. The kid who couldn't manage *please stop, I don't like how you're treating me* was now the one saying *hey — we should also look at the WAF traffic.* Out loud, to a room of people who outranked him, during the worst week the company had ever had.

That took twenty years.

**Things I Built**

The turning point was never really the jobs. It was making things that didn't exist before.

**[IOC-Inspector](https://github.com/PKHarsimran/IOC-Inspector)** — a Python tool I wrote to scan and analyze malicious documents for Indicators of Compromise. Work that would otherwise eat hours, done automatically. Proof I could build something practical from nothing but an idea and a few weeks.

**[SwiftIOC](https://github.com/PKHarsimran/SwiftIOC-Automated-Threat-Intelligence-Collector)** — this one is the direct descendant of the incident above. During those weeks I collected open-source indicators by hand, over and over, at all hours. SwiftIOC is the machine that does it for me now: it pulls recent IOCs from feeds like CISA KEV, URLhaus, MalwareBazaar, ThreatFox and Feodo Tracker, normalizes and deduplicates them, defangs anything dangerous, and publishes clean feeds in CSV, JSON and STIX 2.1 on a schedule through GitHub Actions. The manual thing I did in a crisis, turned into infrastructure.

**[website-downloader](https://github.com/PKHarsimran/website-downloader)** — my most-starred project, and the one with the least to do with my job. I built it because I wanted it to exist. Other people found it and wanted it too. That's the clearest evidence I have that the curiosity itself was worth something, separate from any career it happened to feed.

**This blog** — launched with no web development experience, figuring out hosting, design and everything else as I went, because I wanted a place to put what I was learning.

The same kid, still seeing how far he can push the machine.

**What I've Actually Learned**

**Failure isn't information about you.** It's information about the attempt. My second Security+ went better than my first because I'd learned the exam, not because I'd become a different person in three weeks.

**You can start before you're okay.** I did the boot camp, got the job and changed my life while I was still very much in it. Waiting to be well would have cost me years I didn't have to spend.

**Your own health counts as a real problem.** I got taught early that my body's complaints were background noise, and I believed it long enough to ignore a lupus diagnosis. Not a mistake I'd repeat.

**The curiosity was always the asset.** Not the pain. Not the hypervigilance. The wanting-to-know, which loneliness happened to give me a lot of practice at.

**Where I'm At**

I'm writing this with a flare on my hands.

I still work a job where I spend most of the day looking for the thing that isn't there. I'm still the odd kid who'd rather find out what a machine will do if he pushes it. None of that got fixed, exactly. It got aimed.

If you're somewhere in the middle of your own version of this — you don't have to be well before you start. I wasn't. I'm still not, entirely.

I started anyway, and the starting turned out to do most of the work.
