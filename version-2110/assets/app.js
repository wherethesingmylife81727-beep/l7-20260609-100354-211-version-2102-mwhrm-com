(function () {
  const header = document.querySelector("[data-header]");
  const mobileToggle = document.querySelector("[data-mobile-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

  function setHeaderState() {
    if (!header) {
      return;
    }
    header.classList.toggle("is-scrolled", window.scrollY > 32);
  }

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  if (mobileToggle && mobileNav && header) {
    mobileToggle.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
      header.classList.toggle("menu-open", mobileNav.classList.contains("is-open"));
    });
  }

  const hero = document.querySelector("[data-hero-slider]");

  if (hero) {
    const slides = Array.from(hero.querySelectorAll(".hero-slide"));
    const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
    const prev = hero.querySelector("[data-hero-prev]");
    const next = hero.querySelector("[data-hero-next]");
    let index = 0;
    let timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }

    function startTimer() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 6500);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(index - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showSlide(index + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.dataset.heroDot || 0));
        startTimer();
      });
    });

    showSlide(0);
    startTimer();
  }

  const homeSearchForm = document.querySelector("[data-home-search-form]");

  if (homeSearchForm) {
    homeSearchForm.addEventListener("submit", function (event) {
      const input = homeSearchForm.querySelector("[data-home-search]");
      if (!input || !input.value.trim()) {
        return;
      }
      event.preventDefault();
      window.location.href = "./search.html?q=" + encodeURIComponent(input.value.trim());
    });
  }

  document.querySelectorAll("[data-filter-root]").forEach(function (root) {
    const input = root.querySelector("[data-filter-input]");
    const region = root.querySelector("[data-region-filter]");
    const type = root.querySelector("[data-type-filter]");
    const year = root.querySelector("[data-year-filter]");
    const cards = Array.from(root.querySelectorAll("[data-movie-card]"));

    function normalize(value) {
      return String(value || "").toLowerCase().trim();
    }

    function update() {
      const query = normalize(input ? input.value : "");
      const regionValue = normalize(region ? region.value : "");
      const typeValue = normalize(type ? type.value : "");
      const yearValue = normalize(year ? year.value : "");

      cards.forEach(function (card) {
        const text = normalize(card.dataset.search);
        const cardRegion = normalize(card.dataset.region);
        const cardType = normalize(card.dataset.type);
        const cardYear = normalize(card.dataset.year);
        const matched = (!query || text.indexOf(query) !== -1) &&
          (!regionValue || cardRegion === regionValue) &&
          (!typeValue || cardType === typeValue) &&
          (!yearValue || cardYear === yearValue);

        card.classList.toggle("is-hidden", !matched);
      });
    }

    if (root.hasAttribute("data-url-query")) {
      const params = new URLSearchParams(window.location.search);
      const query = params.get("q");
      if (query && input) {
        input.value = query;
      }
    }

    [input, region, type, year].forEach(function (element) {
      if (element) {
        element.addEventListener("input", update);
        element.addEventListener("change", update);
      }
    });

    update();
  });
})();
