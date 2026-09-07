(function () {
  "use strict";

  var root = document.querySelector("[data-ioc-workbench]");
  if (!root) return;

  var input = root.querySelector("[data-ioc-input]");
  var analyzeButton = root.querySelector("[data-ioc-analyze]");
  var clearButton = root.querySelector("[data-ioc-clear]");
  var sampleButton = root.querySelector("[data-ioc-sample]");
  var emptyState = root.querySelector("[data-ioc-empty]");
  var output = root.querySelector("[data-ioc-output]");
  var summary = root.querySelector("[data-ioc-summary]");
  var list = root.querySelector("[data-ioc-list]");
  var status = root.querySelector("[data-ioc-status]");
  var modeFieldset = root.querySelector("[data-ioc-mode]");
  var copyButton = root.querySelector("[data-ioc-copy]");
  var exportButton = root.querySelector("[data-ioc-export]");
  var feedback = root.querySelector("[data-ioc-feedback]");
  var typeFilter = root.querySelector("[data-ioc-filter]");
  var searchInput = root.querySelector("[data-ioc-search]");
  var moreButton = root.querySelector("[data-ioc-more]");
  var visibleLimit = 100;
  var indicators = [];
  var displayMode = "defanged";

  var typeMeta = {
    url: { label: "URL", group: "Web" },
    domain: { label: "Domain", group: "Infrastructure" },
    ipv4: { label: "IPv4", group: "Network" },
    email: { label: "Email", group: "Identity" },
    md5: { label: "MD5", group: "File" },
    sha1: { label: "SHA-1", group: "File" },
    sha256: { label: "SHA-256", group: "File" }
  };

  function track(name, parameters) {
    if (!window.measurementConsentGranted || typeof window.gtag !== "function") return;
    window.gtag("event", name, parameters || {});
  }

  function refang(value) {
    return value
      .replace(/\bhxxps\b/gi, "https")
      .replace(/\bhxxp\b/gi, "http")
      .replace(/\[(?:\.|dot)\]|\((?:\.|dot)\)|\{(?:\.|dot)\}/gi, ".")
      .replace(/\[:\]/g, ":")
      .replace(/\[\/\]/g, "/")
      .replace(/\[@\]|\(at\)/gi, "@")
      .replace(/\s+dot\s+/gi, ".");
  }

  function defang(value, type) {
    var result = value;
    if (type === "url") {
      result = result.replace(/^https/gi, "hxxps").replace(/^http/gi, "hxxp");
      result = result.replace("://", "[:]//");
    }
    if (type === "url" || type === "domain" || type === "ipv4" || type === "email") {
      result = result.replace(/\./g, "[.]");
    }
    return result;
  }

  function overlaps(start, end, ranges) {
    return ranges.some(function (range) {
      return start < range.end && end > range.start;
    });
  }

  function validIpv4(value) {
    var parts = value.split(".");
    return parts.length === 4 && parts.every(function (part) {
      return /^\d{1,3}$/.test(part) && Number(part) <= 255;
    });
  }

  function normalizeUrl(value) {
    try {
      var parsed = new URL(value);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
      parsed.hostname = parsed.hostname.toLowerCase();
      return parsed.toString();
    } catch (error) {
      return null;
    }
  }

  function hashType(value) {
    if (value.length === 32) return "md5";
    if (value.length === 40) return "sha1";
    return "sha256";
  }

  function addMatches(text, regex, type, ranges, found, validator, normalizer) {
    var match;
    regex.lastIndex = 0;
    while ((match = regex.exec(text)) !== null) {
      // The email pattern consumes its boundary instead of using lookbehind.
      // Only capture group 1 is the indicator; exclude the prefix from offsets.
      var raw = type === "email" ? match[1] : match[0];
      var start = match.index + match[0].length - raw.length;
      if (type === "url") {
        // Remove unmatched prose wrappers, but preserve balanced URL parentheses
        // and meaningful query/path punctuation.
        while (/[)\]}]$/.test(raw)) {
          var close = raw.slice(-1);
          var open = { ")": "(", "]": "[", "}": "{" }[close];
          if (raw.split(close).length <= raw.split(open).length) break;
          raw = raw.slice(0, -1);
        }
      }
      var end = start + raw.length;
      if (type !== "url" && (/[a-z0-9_@.%-]/i.test(text.charAt(start - 1)) ||
          /[a-z0-9_@%-]/i.test(text.charAt(end)))) continue;
      if (type !== "url" && text.charAt(end) === "." && /[a-z0-9.]/i.test(text.charAt(end + 1))) continue;
      if (!raw || overlaps(start, end, ranges) || (validator && !validator(raw))) continue;
      var value = normalizer ? normalizer(raw) : raw;
      if (!value) continue;
      found.push({ type: typeof type === "function" ? type(value) : type, value: value });
      ranges.push({ start: start, end: end });
    }
  }

  function extract(rawText) {
    var text = refang(rawText);
    var found = [];
    var ranges = [];

    addMatches(text, /\bhttps?:\/\/[^\s<>"'\x60]+/gi, "url", ranges, found, null, normalizeUrl);
    addMatches(text, /\b(?:[a-f0-9]{64}|[a-f0-9]{40}|[a-f0-9]{32})\b/gi, hashType, ranges, found, null, function (value) { return value.toLowerCase(); });
    addMatches(text, /(?:^|[^a-z0-9._%+\-])([a-z0-9._%+\-]+@[a-z0-9.-]+\.[a-z]{2,63}\b)/gi, "email", ranges, found, function (value) {
      var parts = value.split("@");
      return !/^\.|\.$|\.\./.test(parts[0]) && validDomain(parts[1]);
    }, function (value) {
      var parts = value.split("@");
      return parts[0] + "@" + parts[1].toLowerCase();
    });
    addMatches(text, /\b(?:\d{1,3}\.){3}\d{1,3}\b/g, "ipv4", ranges, found, validIpv4);
    addMatches(text, /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:xn--[a-z0-9-]{2,59}|[a-z]{2,63})\b/gi, "domain", ranges, found, validDomain, function (value) { return value.toLowerCase(); });

    var seen = new Map();
    return found.filter(function (indicator) {
      var key = indicator.type + ":" + indicator.value;
      if (seen.has(key)) {
        seen.get(key).occurrences += 1;
        return false;
      }
      indicator.occurrences = 1;
      seen.set(key, indicator);
      return true;
    });
  }

  function validDomain(value) {
    return value.length <= 253 && value.split(".").every(function (label) {
      return /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label);
    });
  }

  function matchingIndicators() {
    var query = refang(searchInput.value.trim()).toLowerCase();
    return indicators.filter(function (indicator) {
      return (typeFilter.value === "all" || indicator.type === typeFilter.value) &&
        indicator.value.toLowerCase().includes(query);
    });
  }

  function shownValue(indicator) {
    return displayMode === "defanged" ? defang(indicator.value, indicator.type) : indicator.value;
  }

  function lookupLinks(indicator) {
    var value = indicator.value;
    var links = [{ label: "VirusTotal", url: "https://www.virustotal.com/gui/search/" + encodeURIComponent(value) }];
    if (indicator.type === "ipv4") {
      links.push({ label: "AbuseIPDB", url: "https://www.abuseipdb.com/check/" + encodeURIComponent(value) });
    } else if (indicator.type === "domain") {
      links.push({ label: "urlscan.io", url: "https://urlscan.io/search/#" + encodeURIComponent("domain:" + value) });
    } else if (indicator.type === "url") {
      links.push({ label: "urlscan.io", url: "https://urlscan.io/search/#" + encodeURIComponent('page.url:"' + value + '"') });
    }
    return links;
  }

  function renderSummary() {
    var counts = indicators.reduce(function (result, indicator) {
      result[indicator.type] = (result[indicator.type] || 0) + 1;
      return result;
    }, {});
    summary.replaceChildren();

    Object.keys(typeMeta).forEach(function (type) {
      if (!counts[type]) return;
      var item = document.createElement("div");
      var count = document.createElement("strong");
      var label = document.createElement("span");
      item.className = "ioc-summary-item ioc-type-" + type;
      count.textContent = counts[type];
      label.textContent = typeMeta[type].label;
      item.append(count, label);
      summary.appendChild(item);
    });
  }

  function renderList() {
    list.replaceChildren();
    var matching = matchingIndicators();
    matching.slice(0, visibleLimit).forEach(function (indicator, index) {
      var item = document.createElement("li");
      var heading = document.createElement("div");
      var type = document.createElement("span");
      var group = document.createElement("span");
      var value = document.createElement("code");
      var actions = document.createElement("div");
      var copy = document.createElement("button");

      item.className = "ioc-item";
      item.style.setProperty("--ioc-index", Math.min(index, 8));
      heading.className = "ioc-item-heading";
      type.className = "ioc-type ioc-type-" + indicator.type;
      type.textContent = typeMeta[indicator.type].label;
      group.textContent = typeMeta[indicator.type].group + " · " + indicator.occurrences + (indicator.occurrences === 1 ? " occurrence" : " occurrences");
      value.textContent = shownValue(indicator);
      value.title = shownValue(indicator);
      actions.className = "ioc-item-actions";
      copy.type = "button";
      copy.textContent = "Copy";
      copy.addEventListener("click", function () {
        copyText(shownValue(indicator), copy, "Copied");
        track("ioc_copy_one", { indicator_type: indicator.type });
      });

      lookupLinks(indicator).forEach(function (lookup) {
        var link = document.createElement("a");
        link.href = lookup.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = lookup.label;
        link.setAttribute("aria-label", "Investigate this " + typeMeta[indicator.type].label + " with " + lookup.label + " (opens in a new tab)");
        link.addEventListener("click", function () {
          track("ioc_lookup_open", { indicator_type: indicator.type, provider: lookup.label });
        });
        actions.appendChild(link);
      });

      actions.prepend(copy);
      heading.append(type, group);
      item.append(heading, value, actions);
      list.appendChild(item);
    });
    moreButton.hidden = matching.length <= visibleLimit;
    copyButton.disabled = exportButton.disabled = matching.length === 0;
    setStatus(matching.length + " of " + indicators.length + " unique indicators match. " +
      (matching.length > visibleLimit ? "Showing " + visibleLimit + "; copy and export include all matches." : ""));
  }

  function setStatus(message) {
    status.textContent = message;
  }

  function render() {
    var hasResults = indicators.length > 0;
    emptyState.hidden = hasResults;
    output.hidden = !hasResults;
    modeFieldset.disabled = !hasResults;
    if (!hasResults) {
      list.replaceChildren();
      summary.replaceChildren();
      return;
    }
    renderSummary();
    renderList();
  }

  function copyText(text, button, successLabel) {
    var originalLabel = button.textContent;
    function showSuccess() {
      button.textContent = successLabel;
      window.setTimeout(function () { button.textContent = originalLabel; }, 1400);
    }

    function fallbackCopy() {
      var helper = document.createElement("textarea");
      var previousFocus = document.activeElement;
      helper.value = text;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      var copied = false;
      try { copied = document.execCommand("copy"); }
      catch (error) { copied = false; }
      finally {
        helper.remove();
        if (previousFocus) previousFocus.focus();
      }
      if (copied) showSuccess();
      else setStatus("Copy was blocked by the browser. Select the text and copy it manually.");
    }

    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      fallbackCopy();
      return;
    }

    navigator.clipboard.writeText(text).then(showSuccess).catch(function () {
      fallbackCopy();
    }).catch(function () {
      setStatus("Copy was blocked by the browser. Select the text and copy it manually.");
    });
  }

  function csvCell(value) {
    var safe = /^[=+\-@]/.test(value) ? "'" + value : value;
    return '"' + safe.replace(/"/g, '""') + '"';
  }

  function exportCsv() {
    var matching = matchingIndicators();
    if (!matching.length) return;
    var rows = [["type", "indicator", "defanged", "occurrences"]];
    matching.forEach(function (indicator) {
      rows.push([typeMeta[indicator.type].label, indicator.value, defang(indicator.value, indicator.type), String(indicator.occurrences)]);
    });
    var csv = rows.map(function (row) { return row.map(csvCell).join(","); }).join("\r\n");
    var blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "ioc-workbench-" + new Date().toISOString().slice(0, 10) + ".csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    setStatus("CSV export created for " + matching.length + " indicators.");
    track("ioc_export", { indicator_count: matching.length });
  }

  analyzeButton.addEventListener("click", function () {
    if (input.value.length > 100000) {
      invalidateResults();
      feedback.textContent = "This batch is too large. Split it into batches of 100,000 characters or fewer.";
      return;
    }
    typeFilter.value = "all";
    searchInput.value = "";
    visibleLimit = 100;
    indicators = extract(input.value);
    render();
    var total = indicators.reduce(function (sum, indicator) { return sum + indicator.occurrences; }, 0);
    feedback.textContent = indicators.length + " unique indicators found; " + (total - indicators.length) + " duplicate occurrences combined.";
    if (!indicators.length) {
      emptyState.querySelector("h3").textContent = input.value.trim() ? "No supported indicators found" : "Add indicators to begin";
      emptyState.querySelector("p").textContent = input.value.trim() ? "Check the formatting or try the safe sample." : "Paste alert text or load the safe sample above.";
    }
    track("ioc_analyze", { indicator_count: indicators.length });
  });

  clearButton.addEventListener("click", function () {
    input.value = "";
    indicators = [];
    feedback.textContent = "Input and results cleared.";
    render();
    emptyState.querySelector("h3").textContent = "Ready for signal";
    emptyState.querySelector("p").textContent = "Your classified indicators will appear here.";
    input.focus();
  });

  sampleButton.addEventListener("click", function () {
    input.value = [
      "Alert artifacts:",
      "hxxps://login-example[.]test/update?id=42",
      "203[.]0[.]113[.]24",
      "notify@example[.]test",
      "44d88612fea8a8f36de82e1278abb02f",
      "44d88612fea8a8f36de82e1278abb02f"
    ].join("\n");
    invalidateResults();
    input.focus();
  });

  modeFieldset.addEventListener("change", function (event) {
    if (event.target.name !== "ioc-mode") return;
    displayMode = event.target.value;
    renderList();
    setStatus("Indicators are now shown " + displayMode + ".");
  });

  copyButton.addEventListener("click", function () {
    var matching = matchingIndicators();
    if (!matching.length) return;
    copyText(matching.map(shownValue).join("\n"), copyButton, "Copied");
    track("ioc_copy_all", { indicator_count: matching.length });
  });

  exportButton.addEventListener("click", exportCsv);

  function invalidateResults() {
    indicators = [];
    render();
    feedback.textContent = "Input changed. Analyze again to refresh results.";
    emptyState.querySelector("h3").textContent = "Ready to analyze";
    emptyState.querySelector("p").textContent = "Analyze the current input to see matching indicators.";
  }

  Object.keys(typeMeta).forEach(function (type) {
    var option = document.createElement("option");
    option.value = type;
    option.textContent = typeMeta[type].label;
    typeFilter.appendChild(option);
  });
  input.addEventListener("input", invalidateResults);
  [typeFilter, searchInput].forEach(function (control) {
    control.addEventListener("input", function () { visibleLimit = 100; renderList(); });
  });
  moreButton.addEventListener("click", function () { visibleLimit += 100; renderList(); });

  input.addEventListener("keydown", function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") analyzeButton.click();
  });
})();
