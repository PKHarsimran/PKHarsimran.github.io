# Harsimran Sidhu — Cybersecurity Field Notes

Source for [harsim.ca](https://harsim.ca), a Jekyll blog covering SOC investigations, incident response, threat research, and hands-on security projects.

## Local development

Requirements:

- Ruby 3.4 (see `.ruby-version`)
- Bundler

Install dependencies and start the site:

```sh
bundle install
bundle exec jekyll serve --livereload
```

The site is available at `http://127.0.0.1:4000/`.

## Publishing an article

Add a Markdown file to `_posts` using `YYYY-MM-DD-slug.md`. Include this front matter:

```yaml
---
layout: post
title: "Article title"
subtitle: "Short supporting line"
description: "A concise search and social description."
date: 2026-08-31
last_modified_at: 2026-08-31
image: /assets/img/article-image.webp
optimized_image: /assets/img/article-image.webp
thumbnail_image: /assets/img/thumbs/article-image.webp
category: cybersecurity
tags:
  - Incident Response
author: Harsimran Sidhu
---
```

Category names must use lowercase slugs. If adding a category, create the matching page in `category/`.

Before publishing:

```sh
bundle exec jekyll build --strict_front_matter
```

Check that referenced images and internal links exist, technical claims are dated and sourced, and no credentials or private indicators are present.

## Deployment

GitHub Pages deploys the `master` branch using the repository’s existing branch-based Pages configuration. Pull requests run `.github/workflows/jekyll.yml` as a build validation check. This separation prevents two deployment pipelines from running on each push.

After deployment:

- In GA4, [mark `resume_download` as a key event](https://support.google.com/analytics/answer/12946393), then [import it as a Google Ads conversion](https://support.google.com/google-ads/answer/2375435) if résumé downloads are a campaign goal.
- If `harsim.ca` is placed behind a configurable proxy or CDN, mirror the current CSP as an HTTP response header and add HSTS, `X-Content-Type-Options: nosniff`, and a minimal Permissions Policy there.

## Site architecture

- `_config.yml` is the only site configuration source.
- `_posts/` contains articles.
- `_layouts/` and `_includes/` contain Liquid templates.
- `_sass/` and `assets/css/styles.scss` contain styling.
- `assets/js/scripts.js` contains dependency-free site interactions; `assets/js/privacy.js` owns consent-gated measurement.
- `assets/fonts/` contains the self-hosted Titillium Web files and their OFL license.
- `jekyll-seo-tag` and `jekyll-sitemap` generate metadata and the sitemap.

The retired Gulp/Node and Netlify CMS layers were removed. They are not required to build or publish this GitHub Pages site.
