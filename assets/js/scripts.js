(function () {
  "use strict";

  var body = document.body;
  var menuButton = document.getElementById("menu");
  var sidebar = document.getElementById("sidebar");
  var mask = document.getElementById("mask");
  var searchButton = document.getElementById("search");
  var searchWrapper = document.getElementById("site-search");
  var searchForm = searchWrapper && searchWrapper.querySelector(".search-form");
  var searchInput = searchWrapper && searchWrapper.querySelector(".search-field");
  var searchClose = searchWrapper && searchWrapper.querySelector(".search-close");
  var searchResults = searchWrapper && searchWrapper.querySelector(".search-results");
  var searchStatus = searchWrapper && searchWrapper.querySelector(".search-status");
  var searchIndex;
  var previousFocus;

  function openMenu() {
    body.classList.add("push-menu-to-right");
    sidebar.classList.add("open");
    mask.classList.add("show");
    menuButton.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    body.classList.remove("push-menu-to-right");
    sidebar.classList.remove("open");
    mask.classList.remove("show");
    menuButton.setAttribute("aria-expanded", "false");
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
    previousFocus = document.activeElement;
    searchWrapper.classList.add("active");
    searchForm.classList.add("active");
    searchWrapper.setAttribute("aria-hidden", "false");
    searchButton.setAttribute("aria-expanded", "true");
    body.classList.add("search-overlay");
    searchInput.focus();
    loadSearchIndex();
  }

  function closeSearch() {
    if (!searchWrapper || !searchForm) return;
    searchWrapper.classList.remove("active");
    searchForm.classList.remove("active");
    searchWrapper.setAttribute("aria-hidden", "true");
    searchButton.setAttribute("aria-expanded", "false");
    body.classList.remove("search-overlay");
    searchResults.replaceChildren();
    if (searchStatus) searchStatus.textContent = "";
    if (previousFocus && previousFocus.focus) previousFocus.focus();
  }

  function renderSearchResults(posts) {
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
      link.append(category, document.createTextNode(post.title + " "), date);
      item.appendChild(link);
      searchResults.appendChild(item);
    });
    searchStatus.textContent = posts.length ? posts.length + " result" + (posts.length === 1 ? "" : "s") : "No case files found. Try another threat, tool, or topic.";
  }

  if (menuButton && sidebar && mask) {
    menuButton.addEventListener("click", openMenu);
    mask.addEventListener("click", closeMenu);
  }

  if (searchButton && searchWrapper && searchInput && searchClose && searchResults) {
    searchButton.addEventListener("click", openSearch);
    searchClose.addEventListener("click", closeSearch);
    searchInput.addEventListener("input", function () {
      var query = searchInput.value.trim().toLowerCase();
      if (query.length < 2) {
        searchResults.replaceChildren();
        searchStatus.textContent = query.length ? "Type one more character to search." : "";
        return;
      }
      loadSearchIndex().then(function (posts) {
        renderSearchResults(posts.filter(function (post) {
          return [post.title, post.tags, post.categories, post.description, post.content].join(" ").toLowerCase().includes(query);
        }));
      });
    });
  }

  document.querySelectorAll("[data-open-search]").forEach(function (button) {
    button.addEventListener("click", openSearch);
  });

  document.addEventListener("keydown", function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      body.classList.contains("search-overlay") ? closeSearch() : openSearch();
      return;
    }
    if (event.key !== "Escape") return;
    if (body.classList.contains("search-overlay")) closeSearch();
    if (body.classList.contains("push-menu-to-right")) closeMenu();
  });

  var filterButtons = document.querySelectorAll("[data-filter]");
  var caseFiles = document.querySelectorAll("[data-case-file]");
  var visibleCount = document.querySelector("[data-visible-count]");
  var noResults = document.querySelector("[data-no-results]");
  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.dataset.filter;
      var count = 0;
      filterButtons.forEach(function (item) {
        var active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", active.toString());
      });
      caseFiles.forEach(function (item) {
        var visible = filter === "all" || item.dataset.category === filter;
        item.hidden = !visible;
        if (visible) count += 1;
      });
      if (visibleCount) visibleCount.textContent = count.toString();
      if (noResults) noResults.hidden = count !== 0;
    });
  });

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
    button.addEventListener("click", function () { copyText(code.innerText, button, "Copied"); });
    pre.appendChild(button);
  });

  var tocList = document.querySelector("[data-toc-list]");
  if (tocList) {
    document.querySelectorAll(".post-content > h2, .post-content > h3").forEach(function (heading, index) {
      if (heading.closest(".investigation-path")) return;
      if (!heading.id) heading.id = "section-" + (index + 1);
      var item = document.createElement("li");
      var link = document.createElement("a");
      link.href = "#" + heading.id;
      link.textContent = heading.textContent;
      if (heading.tagName === "H3") item.className = "toc-subsection";
      item.appendChild(link);
      tocList.appendChild(item);
    });
    if (!tocList.children.length) tocList.closest("details").hidden = true;
  }

  var printButton = document.querySelector("[data-print-playbook]");
  if (printButton) printButton.addEventListener("click", function () { window.print(); });
  var copyLinkButton = document.querySelector("[data-copy-link]");
  if (copyLinkButton) copyLinkButton.addEventListener("click", function () { copyText(window.location.href, copyLinkButton, "Link copied"); });

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
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollState);
      ticking = true;
    }
  }, { passive: true });
  updateScrollState();
})();
