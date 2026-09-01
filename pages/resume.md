---
layout: page
menu: false
title: Resume
description: Harsimran Sidhu is a security operations analyst specializing in incident response, threat investigation, detection engineering, and security automation.
permalink: /resume/
---

{% assign resume = site.data.resume %}
<div class="resume-page">
  <section class="resume-hero" aria-labelledby="resume-name">
    <img class="resume-photo" src="/assets/img/uploads/pro.webp" alt="Harsimran Sidhu" width="180" height="180" decoding="async">
    <div>
      <p class="resume-eyebrow">SECURITY OPERATIONS</p>
      <h1 id="resume-name">{{ resume.name }}</h1>
      <p class="resume-headline">{{ resume.headline }}</p>
      <p class="resume-summary">{{ resume.summary }}</p>
      <div class="resume-actions">
        <a class="button resume-download" href="/assets/files/Harsimran-Sidhu-Resume.pdf" download="Harsimran-Sidhu-Resume.pdf">Download PDF</a>
        <a class="button resume-secondary" href="{{ resume.linkedin }}">Connect on LinkedIn</a>
      </div>
      <ul class="resume-contact" aria-label="Contact links">
        <li><a href="mailto:{{ resume.email }}">{{ resume.email }}</a></li>
        <li><a href="{{ resume.github }}">GitHub</a></li>
        <li><a href="{{ resume.website }}">harsim.ca</a></li>
      </ul>
    </div>
  </section>

  <div class="resume-layout">
    <main class="resume-main">
      <section class="resume-section" aria-labelledby="experience-title">
        <p class="resume-section-number">01</p>
        <h2 id="experience-title">Experience</h2>
        {% for job in resume.experience %}
          <article class="resume-role">
            <div class="resume-role-heading">
              <div>
                <h3>{{ job.role }}</h3>
                <p>{{ job.company }} · {{ job.location }}</p>
              </div>
              <time>{{ job.dates }}</time>
            </div>
            <ul>{% for bullet in job.bullets %}<li>{{ bullet }}</li>{% endfor %}</ul>
          </article>
        {% endfor %}
      </section>

      <section class="resume-section" aria-labelledby="work-title">
        <p class="resume-section-number">02</p>
        <h2 id="work-title">Selected security work</h2>
        <div class="resume-work-grid">
          {% for work in resume.selected_work %}
            <article class="resume-work-card">
              <h3><a href="{{ work.url | relative_url }}">{{ work.title }}</a></h3>
              <p>{{ work.description }}</p>
              <a class="resume-work-link" href="{{ work.url | relative_url }}">Read the case file →</a>
            </article>
          {% endfor %}
        </div>
      </section>
    </main>

    <aside class="resume-sidebar" aria-label="Capabilities and education">
      <section class="resume-section" aria-labelledby="capabilities-title">
        <p class="resume-section-number">03</p>
        <h2 id="capabilities-title">Core capabilities</h2>
        {% for skill in resume.skills %}
          <div class="resume-skill-group">
            <h3>{{ skill.group }}</h3>
            <p>{{ skill.items }}</p>
          </div>
        {% endfor %}
      </section>

      <section class="resume-section" aria-labelledby="education-title">
        <p class="resume-section-number">04</p>
        <h2 id="education-title">Education</h2>
        {% for item in resume.education %}
          <article class="resume-education">
            <h3>{{ item.credential }}</h3>
            <p>{{ item.school }}</p>
            <p>{{ item.location }} · {{ item.dates }}</p>
          </article>
        {% endfor %}
      </section>
    </aside>
  </div>
</div>
