(function () {
  "use strict";

  var body = document.body;
  var menuButton = document.getElementById("menu");
  var sidebar = document.getElementById("sidebar");
  var mask = document.getElementById("mask");
  var menuClose = sidebar && sidebar.querySelector(".menu-close");
  var searchButton = document.getElementById("search");
  var searchWrapper = document.getElementById("site-search");
  var searchForm = searchWrapper && searchWrapper.querySelector(".search-form");
  var searchInput = searchWrapper && searchWrapper.querySelector(".search-field");
  var searchClose = searchWrapper && searchWrapper.querySelector(".search-close");
  var searchResults = searchWrapper && searchWrapper.querySelector(".search-results");
  var searchStatus = searchWrapper && searchWrapper.querySelector(".search-status");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var searchIndex;
  var searchEventTimer;
  var searchRenderTimer;
  var searchRequestId = 0;
  var previousFocus;

  function trackEvent(name, parameters) {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", name, parameters || {});
  }

  function focusableElements(container) {
    return Array.from(container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), summary, [tabindex]:not([tabindex="-1"])')).filter(function (element) {
      return element.getClientRects().length > 0 && element.getAttribute("aria-hidden") !== "true";
    });
  }

  function trapFocus(container, event) {
    if (event.key !== "Tab") return;
    var focusable = focusableElements(container);
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !container.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function openMenu() {
    if (body.classList.contains("search-overlay")) closeSearch(false);
    body.classList.add("menu-open");
    sidebar.classList.add("open");
    mask.classList.add("show");
    sidebar.setAttribute("aria-hidden", "false");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Close menu");
    if (menuClose) menuClose.focus();
    trackEvent("navigation_menu_open");
  }

  function closeMenu(restoreFocus) {
    body.classList.remove("menu-open");
    sidebar.classList.remove("open");
    mask.classList.remove("show");
    sidebar.setAttribute("aria-hidden", "true");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
    if (restoreFocus !== false) menuButton.focus();
  }

  function loadSearchIndex() {
    if (!searchIndex) {
      searchIndex = fetch("/search.json")
        .then(function (response) {
          if (!response.ok) throw new Error("Search index unavailable");
          return response.json();
        })
        .catch(function () {
          if (searchStatus) searchStatus.textContent = "Search is temporarily unavailable.";
          return [];
        });
    }
    return searchIndex;
  }

  function openSearch() {
    if (!searchWrapper || !searchForm || !searchInput) return;
    var openedFromMenu = body.classList.contains("menu-open");
    var searchTrigger = document.activeElement;
    if (openedFromMenu) closeMenu(false);
    previousFocus = openedFromMenu ? (menuButton || searchTrigger) : searchTrigger;
    searchWrapper.classList.add("active");
    searchForm.classList.add("active");
    searchWrapper.setAttribute("aria-hidden", "false");
    searchButton.setAttribute("aria-expanded", "true");
    body.classList.add("search-overlay");
    searchInput.focus();
    loadSearchIndex();
    trackEvent("search_open");
  }

  function closeSearch(restoreFocus) {
    if (!searchWrapper || !searchForm) return;
    searchWrapper.classList.remove("active");
    searchForm.classList.remove("active");
    searchWrapper.setAttribute("aria-hidden", "true");
    searchButton.setAttribute("aria-expanded", "false");
    body.classList.remove("search-overlay");
    searchRequestId += 1;
    window.clearTimeout(searchRenderTimer);
    window.clearTimeout(searchEventTimer);
    searchInput.value = "";
    searchResults.replaceChildren();
    if (searchStatus) searchStatus.textContent = "";
    if (restoreFocus !== false && previousFocus && previousFocus.focus) previousFocus.focus();
  }

  function renderSearchResults(posts, query) {
    searchResults.replaceChildren();
    posts.slice(0, 10).forEach(function (post) {
      var item = document.createElement("li");
      var link = document.createElement("a");
      var category = document.createElement("span");
      var date = document.createElement("span");
      category.className = "entry-category";
      category.textContent = post.categories || "Article";
      date.className = "entry-date";
      date.textContent = post.date;
      link.href = post.url;
      item.style.setProperty("--search-delay", (Math.min(searchResults.children.length, 7) * 35) + "ms");
      link.addEventListener("click", function () {
        trackEvent("select_content", {
          content_type: "search_result",
          item_id: post.url,
          item_name: post.title,
          search_term: query
        });
      });
      link.addEventListener("keydown", function (event) {
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        event.preventDefault();
        var links = Array.from(searchResults.querySelectorAll("a"));
        var index = links.indexOf(link);
        if (event.key === "ArrowUp" && index === 0) {
          searchInput.focus();
          return;
        }
        var nextIndex = event.key === "ArrowDown" ? Math.min(index + 1, links.length - 1) : Math.max(index - 1, 0);
        links[nextIndex].focus();
      });
      link.append(category, document.createTextNode(post.title + " "), date);
      item.appendChild(link);
      searchResults.appendChild(item);
    });
    searchStatus.textContent = posts.length ? posts.length + " result" + (posts.length === 1 ? "" : "s") : "No case files found. Try another threat, tool, or topic.";
    window.clearTimeout(searchEventTimer);
    searchEventTimer = window.setTimeout(function () {
      trackEvent("search", { search_term: query, result_count: posts.length });
    }, 750);
  }

  if (menuButton && sidebar && mask) {
    menuButton.addEventListener("click", openMenu);
    if (menuClose) {
      menuClose.addEventListener("click", closeMenu);
    }
    mask.addEventListener("click", closeMenu);
    sidebar.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  if (searchButton && searchWrapper && searchInput && searchClose && searchResults) {
    searchButton.addEventListener("click", openSearch);
    searchClose.addEventListener("click", closeSearch);
    searchInput.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowDown") return;
      var firstResult = searchResults.querySelector("a");
      if (!firstResult) return;
      event.preventDefault();
      firstResult.focus();
    });
    searchInput.addEventListener("input", function () {
      var query = searchInput.value.trim().toLowerCase();
      var requestId = ++searchRequestId;
      window.clearTimeout(searchRenderTimer);
      if (query.length < 2) {
        window.clearTimeout(searchEventTimer);
        searchResults.replaceChildren();
        searchStatus.textContent = query.length ? "Type one more character to search." : "";
        return;
      }
      searchRenderTimer = window.setTimeout(function () {
        loadSearchIndex().then(function (posts) {
          if (requestId !== searchRequestId || searchInput.value.trim().toLowerCase() !== query) return;
          renderSearchResults(posts.filter(function (post) {
            return [post.title, post.tags, post.categories, post.description, post.content].join(" ").toLowerCase().includes(query);
          }), query);
        });
      }, 140);
    });
  }

  document.querySelectorAll("[data-open-search]").forEach(function (button) {
    button.addEventListener("click", openSearch);
  });

  document.addEventListener("keydown", function (event) {
    if (body.classList.contains("search-overlay")) trapFocus(searchWrapper, event);
    if (body.classList.contains("menu-open")) trapFocus(sidebar, event);
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      body.classList.contains("search-overlay") ? closeSearch() : openSearch();
      return;
    }
    if (event.key !== "Escape") return;
    if (body.classList.contains("search-overlay")) closeSearch();
    if (body.classList.contains("menu-open")) closeMenu();
  });

  var filterButtons = document.querySelectorAll("[data-filter]");
  var caseFiles = document.querySelectorAll("[data-case-file]");
  var visibleCount = document.querySelector("[data-visible-count]");
  var noResults = document.querySelector("[data-no-results]");
  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.dataset.filter;
      var count = 0;
      var visibleIndex = 0;
      filterButtons.forEach(function (item) {
        var active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", active.toString());
      });
      caseFiles.forEach(function (item) {
        var visible = filter === "all" || item.dataset.category === filter;
        item.hidden = !visible;
        item.classList.remove("filter-enter");
        if (visible) {
          count += 1;
          if (!reduceMotion) {
            item.style.setProperty("--filter-delay", (Math.min(visibleIndex, 5) * 45) + "ms");
            window.requestAnimationFrame(function () { item.classList.add("filter-enter"); });
          }
          visibleIndex += 1;
        }
      });
      if (visibleCount) visibleCount.textContent = count.toString();
      if (noResults) noResults.hidden = count !== 0;
      trackEvent("select_content", {
        content_type: "case_file_filter",
        item_id: filter,
        result_count: count
      });
    });
  });

  document.querySelectorAll("[data-case-file] .cover, [data-case-file] .post-link").forEach(function (link) {
    link.addEventListener("click", function () {
      var card = link.closest("[data-case-file]");
      var title = card && card.querySelector(".post-title");
      trackEvent("select_content", {
        content_type: "case_file",
        item_id: link.getAttribute("href"),
        item_name: title ? title.textContent.trim() : "",
        item_category: card ? card.dataset.category : ""
      });
    });
  });

  document.querySelectorAll(".hero .button, .hero-latest").forEach(function (link) {
    link.addEventListener("click", function () {
      trackEvent("select_content", {
        content_type: link.classList.contains("hero-latest") ? "latest_investigation" : "hero_cta",
        item_id: link.getAttribute("href"),
        item_name: link.textContent.trim().replace(/\s+/g, " ")
      });
    });
  });

  document.querySelectorAll("a.resume-download").forEach(function (link) {
    link.addEventListener("click", function () {
      trackEvent("resume_download", {
        file_name: link.getAttribute("href").split("/").pop().split("?")[0],
        link_text: link.textContent.trim()
      });
    });
  });

  if (!reduceMotion && "IntersectionObserver" in window) {
    document.documentElement.classList.add("motion-ready");
    var revealTargets = document.querySelectorAll([
      ".case-files-heading",
      ".case-filters",
      "[data-case-file]",
      ".resume-hero",
      ".resume-role",
      ".resume-work-card",
      ".resume-skill-group",
      ".resume-education",
      ".post-content > h2",
      ".post-content > h3",
      ".post-content > figure",
      ".post-content > blockquote",
      ".post-content > pre",
      ".investigation-path"
    ].join(","));
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -7% 0px", threshold: 0.08 });
    revealTargets.forEach(function (target, index) {
      target.classList.add("reveal-on-scroll");
      target.style.setProperty("--reveal-delay", ((index % 3) * 70) + "ms");
      revealObserver.observe(target);
    });

    var hero = document.querySelector(".hero");
    if (hero) {
      hero.classList.add("motion-managed");
      var heroObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          entry.target.classList.toggle("is-in-view", entry.isIntersecting);
        });
      }, { threshold: 0.08 });
      heroObserver.observe(hero);
    }
  }

  function copyText(text, button, successLabel) {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(function () {
      var original = button.textContent;
      button.textContent = successLabel;
      window.setTimeout(function () { button.textContent = original; }, 1600);
    });
  }

  document.querySelectorAll(".post-content pre").forEach(function (pre) {
    var code = pre.querySelector("code");
    if (!code) return;
    var button = document.createElement("button");
    button.type = "button";
    button.className = "code-copy";
    button.textContent = "Copy";
    button.setAttribute("aria-label", "Copy code");
    button.addEventListener("click", function () {
      copyText(code.innerText, button, "Copied");
      trackEvent("copy_code", { article_title: document.title });
    });
    pre.appendChild(button);
  });

  var tocList = document.querySelector("[data-toc-list]");
  var tocHeadings = [];
  var tocLinks = [];
  if (tocList) {
    document.querySelectorAll(".post-content > h2, .post-content > h3").forEach(function (heading, index) {
      if (heading.closest(".investigation-path")) return;
      if (!heading.id) heading.id = "section-" + (index + 1);
      var item = document.createElement("li");
      var link = document.createElement("a");
      link.href = "#" + heading.id;
      link.textContent = heading.textContent;
      link.addEventListener("click", function () {
        var details = tocList.closest("details");
        if (details) details.open = false;
      });
      if (heading.tagName === "H3") item.className = "toc-subsection";
      item.appendChild(link);
      tocList.appendChild(item);
      tocHeadings.push(heading);
      tocLinks.push(link);
    });
    if (!tocList.children.length) tocList.closest("details").hidden = true;
  }

  function updateTocState() {
    if (!tocHeadings.length) return;
    var currentIndex = 0;
    tocHeadings.forEach(function (heading, index) {
      if (heading.getBoundingClientRect().top <= 150) currentIndex = index;
    });
    tocLinks.forEach(function (link, index) {
      if (index === currentIndex) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  var printButton = document.querySelector("[data-print-playbook]");
  if (printButton) printButton.addEventListener("click", function () {
    trackEvent("print_playbook", { article_title: document.title });
    window.print();
  });
  var copyLinkButton = document.querySelector("[data-copy-link]");
  if (copyLinkButton) copyLinkButton.addEventListener("click", function () {
    copyText(window.location.href, copyLinkButton, "Link copied");
    trackEvent("share", { method: "copy_link", content_type: "article", item_id: window.location.pathname });
  });

  document.querySelectorAll('a[target="_blank"]').forEach(function (link) {
    link.rel = "noopener noreferrer";
  });

  var recommendationButton = document.querySelector(".recommendation .message button");
  if (recommendationButton) {
    recommendationButton.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
  }

  var timeBar = document.querySelector(".time-bar");
  var article = document.querySelector(".post-content");
  var recommendation = document.querySelector(".recommendation");
  var readingMilestones = [25, 50, 75, 100];
  var reachedMilestones = {};
  var ticking = false;
  function updateScrollState() {
    body.classList.toggle("light", window.scrollY > 0);
    if (timeBar && article) {
      var start = article.offsetTop;
      var distance = Math.max(article.scrollHeight - window.innerHeight, 1);
      var progress = Math.min(Math.max((window.scrollY - start) / distance, 0), 1);
      var completed = timeBar.querySelector(".completed");
      var remaining = timeBar.querySelector(".remaining");
      completed.style.width = (progress * 100).toFixed(1) + "%";
      remaining.style.width = ((1 - progress) * 100).toFixed(1) + "%";
      timeBar.setAttribute("aria-valuenow", Math.round(progress * 100).toString());
      timeBar.style.bottom = progress < 1 ? "0" : "-100%";
      if (recommendation) recommendation.style.bottom = progress >= 0.98 ? "0" : "-100%";
      readingMilestones.forEach(function (milestone) {
        if (progress * 100 < milestone || reachedMilestones[milestone]) return;
        reachedMilestones[milestone] = true;
        trackEvent("article_progress", {
          article_title: document.title,
          percent_scrolled: milestone
        });
      });
    }
    updateTocState();
    ticking = false;
  }
  function scheduleScrollUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollState);
      ticking = true;
    }
  }
  window.addEventListener("scroll", scheduleScrollUpdate, { passive: true });
  window.addEventListener("resize", scheduleScrollUpdate, { passive: true });
  updateScrollState();
})();
