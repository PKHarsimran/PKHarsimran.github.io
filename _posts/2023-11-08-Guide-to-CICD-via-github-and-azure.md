---
layout: post
title: "A Blogger's Guide to CI/CD: Hosting with Azure Static Web Apps"
date: 2023-12-22
categories: Blog, azure, github
author: "Harsimran Sidhu"
---

## How I deployed a blog on internet ?
Hey there! Ever wondered how a simple blog turns into a tech adventure? That's what happened to me. This is a story about taking my blog from a basic setup to something way cooler with CI/CD, using Azure and GitHub.

If you're curious about blogging, tech, or just love a good story about learning new things, you're in the right place. I'll share how I used Jekyll, Azure, and GitHub Actions to make my blog better and even land a job!

So, get comfy and join me as we explore this journey, one question at a time.

![image](https://github.com/PKHarsimran/PKHarsimran.github.io/assets/22066581/cccd6b4e-0ff9-4be2-a42a-448e5b19514b)


### Q: To start, could you share what initially inspired you to create a blog and why you chose Jekyll as your platform?

**A:** Absolutely! My path to blogging was a bit like stumbling upon a hidden treasure. One day, while exploring the nooks and crannies of GitHub, a fascinating world where coders share and collaborate, I bumped into Jekyll. It was like finding the perfect tool I didn't know I needed for my blog. There was this ready-made template, kind of like a ready-to-cook meal, and it instantly clicked with me. I thought, "Why not?" and forked the repo (which is tech-speak for making it mine to play around with). GitHub Pages was my sandbox – a place to build, tinker, and see my blog come to life. It felt like embarking on a fun adventure in a land where learning and experimenting were the main attractions.

### Q: What led you to explore CI/CD for your Jekyll blog, and how did you decide on using Azure and GitHub Actions?

**A:** As someone who had dabbled with Azure before, I was intrigued by the possibility of pairing it with GitHub to host a site. My curiosity led me to discover that Azure could host static pages, and even better, it allowed me to use my own domain. Honestly, I hadn't known much about CI/CD before this project. It was pure curiosity that drove me to explore these tools and see how they could work together. It's amazing how much you can learn when you follow your curiosity!

### Q: Can you walk us through the process of purchasing your domain on GoDaddy and setting up Azure DNS? What were the key steps and challenges?

**A:** My journey with the domain started at GoDaddy, mainly because it's well-known and seemed trustworthy. After creating my account, I browsed through their offerings and finally picked a domain. The deal was pretty sweet – just $20 for two years. Then, I dived into the task of changing the DNS zone settings on GoDaddy, guided by their documentation. Honestly, this part felt like stepping into uncharted waters. It was my first time doing something like this, and despite diligently following the instructions, I ran into a few hiccups. There were several moments of trial and error before I successfully got everything working. It was a learning process, filled with small setbacks, but each mistake brought me closer to understanding how it all works.

### Q: After setting up your domain and DNS, what were the steps you took to establish the CI/CD pipeline with Azure and GitHub Actions?

**A:** The next step in my journey was setting up the CI/CD pipeline, which began with creating a workflow folder in my GitHub repository. According to Azure's documentation, this workflow is the magic behind the scenes that makes automatic deployments possible. I configured it so that every time I made changes to my repository, the GitHub workflow would kick in and update the site automatically. It was fascinating to see the changes reflect on the site almost instantaneously with each commit I made. This seamless integration between GitHub and Azure simplified the whole process, turning it into an almost hands-off experience once the initial setup was done.

### Q: What challenges did you encounter while setting up the CI/CD pipeline, and how did you overcome them?

**A:** The most significant hurdle came when I needed to update the Azure workflow key, a move aimed at leveraging better resources in Azure. This change unexpectedly disrupted the DNS settings, leading to an issue where my site, "harsim.ca," wouldn't load. It was a bit like losing a piece in a puzzle and not realizing it until the whole picture wouldn't come together. I had to deep-dive into troubleshooting mode when I got home. After some investigation, I discovered that the Azure and GitHub workflows weren't syncing correctly due to an old key that was interfering with the deployment. Resolving this mismatch was crucial, and once I did, everything clicked into place, restoring the connection to my site.

### Q: Now that you've successfully set up your CI/CD pipeline, how has it impacted the way you manage and update your blog?

**A:** The shift from a WordPress-like environment to managing my site through GitHub with CI/CD has been quite transformative. In the past, updates were more about dragging and dropping elements and saving changes within a graphical interface. Now, I have a newfound flexibility that allows for deeper customization and quicker updates. I can directly edit the site's code on GitHub, and the changes are seamlessly pushed live through the pipeline. This setup not only speeds up the process of updating my blog but also opens the door to adding more features as I continue to learn and experiment. It's like having a set of advanced tools that empower me to craft my site exactly how I envision it.

### Q: What advice would you give to someone who is considering setting up a similar CI/CD pipeline for their blog or website?

**A:** The golden rule is to follow the documentation closely. Dive into it, understand it, and don't just skim through. Every piece of information is crucial. As you learn new topics, make it a habit to document your steps and insights. This practice becomes a lifesaver when you return to make changes after some time. It's easy to forget the little details that make your blog work the way it does, and having your own notes to refer back to can make all the difference. Think of it as creating a personal roadmap that you can rely on in the future.

### Q: Looking back, what has been the most rewarding aspect of this entire experience of setting up and managing your blog with CI/CD?

**A:** The most rewarding part of this journey has been how it played a pivotal role in my professional life. During an interview for a job, this project became a highlight. It showcased my curiosity, willingness to learn, and practical skills in deploying a static site using GitHub and Azure. The interviewer was impressed by my ability to navigate these technologies and apply them in a real-world scenario. This experience not only enriched my knowledge but also opened doors for me in my career. It's a testament to how personal projects can have a significant impact on professional opportunities.

### Q: As a closing note, what message would you like to share with our readers who might be inspired by your story to start their own projects?

**A:** The most important thing is to stay curious and never give up. When you're working on a project like this and find yourself getting frustrated, it's okay to take a break. Step back, clear your mind, and return with a fresh perspective. This approach can make a world of difference. Every challenge is surmountable with persistence and a refreshed mindset. So, to anyone feeling inspired to start their own project, remember: your curiosity is your greatest asset, and with it, you can tackle any challenge that comes your way.

### Wrapping Up and Moving Forward
And that's a wrap on my journey with CI/CD, Azure, and GitHub! I hope this peek into my experiences has sparked some inspiration and confidence in you to start or enhance your own blog.

Before we part ways, I want to leave you with some resources that I found invaluable. These links are great for anyone looking to dive deeper into the world of blogging, CI/CD, and web hosting:

1. Jekyll Documentation: For those starting with Jekyll, this is your go-to guide. [Jekyll Documentation](https://jekyllrb.com/docs/)
2. GitHub Actions Documentation: Learn how to automate your workflows using GitHub Actions. [GitHub Actions Documentation](https://docs.github.com/en/actions)
3. Azure Static Web Apps Documentation: Everything you need to know about hosting with Azure. [Azure Static Web Apps Documentation](https://learn.microsoft.com/en-us/azure/static-web-apps/)
4. A Beginner's Guide to CI/CD: This article simplifies CI/CD concepts for beginners. [A Beginner's Guide to CI/CD](https://github.blog/2022-06-03-a-beginners-guide-to-ci-cd-and-automation-on-github/)
5. Domain Setup with GoDaddy: If you're purchasing a domain, here's a helpful guide. [GoDaddy Domain Setup
](https://ghost.org/help/godaddy-domain-setup-guide/)

Remember, the journey of a thousand miles begins with a single step. So take that step, explore, learn, and most importantly, have fun with it!

Until next time, happy blogging and coding!
