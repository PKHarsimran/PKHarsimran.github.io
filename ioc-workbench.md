---
layout: default
title: IOC Workbench
description: A fast, privacy-first browser tool for extracting, classifying, deduplicating, defanging, and exporting cybersecurity indicators of compromise.
permalink: /ioc-workbench/
---

<article class="ioc-workbench" data-ioc-workbench>
  <header class="ioc-hero">
    <div class="ioc-hero-copy">
      <p class="ioc-eyebrow"><span aria-hidden="true"></span> Browser-based SOC utility</p>
      <h1>Turn raw indicators into investigation-ready intelligence.</h1>
      <p>Extract, classify, deduplicate, defang, and export IP addresses, domains, URLs, email addresses, and hashes in seconds.</p>
      <ul class="ioc-trust-list" aria-label="Privacy and usability features">
        <li>Runs locally</li>
        <li>No account</li>
        <li>No IOC telemetry</li>
      </ul>
    </div>
    <div class="ioc-signal" aria-hidden="true">
      <span></span><span></span><span></span><span></span><span></span>
    </div>
  </header>

  <section class="ioc-panel" aria-labelledby="ioc-input-title">
    <div class="ioc-panel-heading">
      <div>
        <p class="ioc-step">01 / INGEST</p>
        <h2 id="ioc-input-title">Paste suspicious indicators</h2>
      </div>
      <button class="ioc-text-button" type="button" data-ioc-sample>Load safe sample</button>
    </div>

    <label class="ioc-label" for="ioc-input">Raw IOC text</label>
    <textarea id="ioc-input" data-ioc-input rows="9" spellcheck="false" autocomplete="off" placeholder="Paste an incident note, alert, or list of indicators…"></textarea>
    <p class="ioc-input-hint">Supports plain and defanged indicators such as <code>hxxps://example[.]com/path</code>. Press <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Enter</kbd> to analyze. Nothing is uploaded.</p>

    <div class="ioc-actions">
      <button class="ioc-primary-button" type="button" data-ioc-analyze>
        <span aria-hidden="true">⌁</span> Analyze indicators
      </button>
      <button class="ioc-secondary-button" type="button" data-ioc-clear>Clear</button>
    </div>
  </section>

  <section class="ioc-results" aria-labelledby="ioc-results-title">
    <div class="ioc-panel-heading">
      <div>
        <p class="ioc-step">02 / TRIAGE</p>
        <h2 id="ioc-results-title">Normalized results</h2>
      </div>
      <fieldset class="ioc-mode" data-ioc-mode disabled>
        <legend class="screen-reader-text">Indicator display format</legend>
        <label><input type="radio" name="ioc-mode" value="defanged" checked> Defanged</label>
        <label><input type="radio" name="ioc-mode" value="refanged"> Refanged</label>
      </fieldset>
    </div>

    <div class="ioc-empty" data-ioc-empty>
      <span aria-hidden="true">◎</span>
      <h3>Ready for signal</h3>
      <p>Your classified indicators will appear here.</p>
    </div>

    <div data-ioc-output hidden>
      <div class="ioc-summary" data-ioc-summary aria-label="Indicator summary"></div>
      <div class="ioc-result-toolbar">
        <p data-ioc-status role="status" aria-live="polite"></p>
        <div>
          <button class="ioc-secondary-button" type="button" data-ioc-copy>Copy all</button>
          <button class="ioc-secondary-button" type="button" data-ioc-export>Export CSV</button>
        </div>
      </div>
      <ol class="ioc-list" data-ioc-list></ol>
      <p class="ioc-lookup-note"><strong>Investigation links are optional.</strong> Opening one shares that single indicator with the named external provider.</p>
    </div>
  </section>

  <aside class="ioc-guidance" aria-labelledby="ioc-guidance-title">
    <p class="ioc-step">FIELD NOTE</p>
    <h2 id="ioc-guidance-title">Treat enrichment as evidence, not a verdict.</h2>
    <p>Correlate reputation results with endpoint, identity, network, and timeline evidence. A clean lookup does not prove an indicator is safe, and a detection does not always prove malicious intent.</p>
  </aside>
</article>

<script src="{{ '/assets/js/ioc-workbench.js' | relative_url }}" defer></script>
