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
  var searchIndex;

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

  function openSearch() {
    searchWrapper.classList.add("active");
    searchForm.classList.add("active");
    searchWrapper.setAttribute("aria-hidden", "false");
    searchButton.setAttribute("aria-expanded", "true");
    body.classList.add("search-overlay");
    searchInput.focus();
    if (!searchIndex) {
      searchIndex = fetch("/search.json")
        .then(function (response) {
          if (!response.ok) throw new Error("Search index unavailable");
          return response.json();
        })
        .catch(function () { return []; });
    }
  }

  function closeSearch() {
    searchWrapper.classList.remove("active");
    searchForm.classList.remove("active");
    searchWrapper.setAttribute("aria-hidden", "true");
    searchButton.setAttribute("aria-expanded", "false");
    body.classList.remove("search-overlay");
    searchResults.replaceChildren();
    searchButton.focus();
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
        return;
      }
      searchIndex.then(function (posts) {
        renderSearchResults(posts.filter(function (post) {
          return [post.title, post.tags, post.categories].join(" ").toLowerCase().includes(query);
        }));
      });
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    if (body.classList.contains("search-overlay")) closeSearch();
    if (body.classList.contains("push-menu-to-right")) closeMenu();
  });

  document.querySelectorAll('a[target="_blank"]').forEach(function (link) {
    link.rel = "noopener noreferrer";
  });

  var recommendationButton = document.querySelector(".recommendation .message button");
  if (recommendationButton) {
    recommendationButton.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
      });
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
