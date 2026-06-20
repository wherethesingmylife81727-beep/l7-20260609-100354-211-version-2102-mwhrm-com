(function () {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector("[data-nav-toggle]");

  function updateHeader() {
    if (!header) {
      return;
    }
    header.classList.toggle("is-scrolled", window.scrollY > 30);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (navToggle && header) {
    navToggle.addEventListener("click", function () {
      header.classList.toggle("is-open");
    });
  }

  document.querySelectorAll("[data-global-search]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const input = form.querySelector("input[name='q']");
      const query = input ? input.value.trim() : "";
      const path = form.getAttribute("data-search-path") || "search.html";
      const target = query ? path + "?q=" + encodeURIComponent(query) : path;
      window.location.href = target;
    });
  });

  document.querySelectorAll("[data-filter-form]").forEach(function (form) {
    const scope = form.parentElement || document;
    const items = Array.from(scope.querySelectorAll("[data-filterable]"));
    const input = form.querySelector("[data-filter-input]");
    const typeSelect = form.querySelector("[data-filter-type]");
    const regionSelect = form.querySelector("[data-filter-region]");
    const count = form.querySelector("[data-result-count]");
    const empty = scope.querySelector("[data-empty-state]");
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q") || "";

    if (input && initialQuery) {
      input.value = initialQuery;
    }

    function matches(item, query, type, region) {
      const haystack = [
        item.getAttribute("data-title"),
        item.getAttribute("data-tags"),
        item.getAttribute("data-year"),
        item.getAttribute("data-type"),
        item.getAttribute("data-region"),
        item.textContent
      ].join(" ").toLowerCase();
      const itemType = item.getAttribute("data-type") || "";
      const itemRegion = item.getAttribute("data-region") || "";
      const queryOk = !query || haystack.includes(query);
      const typeOk = !type || itemType.includes(type);
      const regionOk = !region || itemRegion.includes(region);
      return queryOk && typeOk && regionOk;
    }

    function applyFilter() {
      const query = input ? input.value.trim().toLowerCase() : "";
      const type = typeSelect ? typeSelect.value : "";
      const region = regionSelect ? regionSelect.value : "";
      let visible = 0;

      items.forEach(function (item) {
        const ok = matches(item, query, type, region);
        item.hidden = !ok;
        if (ok) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = String(visible);
      }
      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    [input, typeSelect, regionSelect].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilter);
        control.addEventListener("change", applyFilter);
      }
    });

    applyFilter();
  });

  const hero = document.querySelector("[data-hero]");
  if (hero) {
    const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
    const triggers = Array.from(hero.querySelectorAll("[data-hero-trigger]"));
    const poster = hero.querySelector("[data-hero-poster]");
    let index = 0;
    let timer = null;

    function show(next) {
      if (!slides.length) {
        return;
      }
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      triggers.forEach(function (trigger, triggerIndex) {
        trigger.classList.toggle("is-active", triggerIndex === index);
      });
      const image = slides[index].getAttribute("data-hero-image");
      if (image) {
        hero.style.setProperty("--hero-image", "url('" + image + "')");
      }
      if (poster) {
        const activeLink = slides[index].querySelector(".btn-primary");
        const activeImage = triggers[index] ? triggers[index].querySelector("img") : null;
        if (activeLink) {
          poster.href = activeLink.href;
        }
        if (activeImage) {
          const posterImage = poster.querySelector("img");
          if (posterImage) {
            posterImage.src = activeImage.getAttribute("src");
            posterImage.alt = activeImage.getAttribute("alt") || "";
          }
        }
      }
    }

    function startTimer() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        window.clearInterval(timer);
        show(Number(trigger.getAttribute("data-hero-trigger")) || 0);
        startTimer();
      });
    });

    show(0);
    startTimer();
  }
})();
