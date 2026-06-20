(function () {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let current = 0;

    const showSlide = function (index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        const index = Number(dot.getAttribute('data-hero-dot')) || 0;
        showSlide(index);
      });
    });

    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    const input = form.querySelector('[data-filter-input]');
    const regionSelect = form.querySelector('[data-region-select]');
    const typeSelect = form.querySelector('[data-type-select]');
    const list = form.parentElement.querySelector('[data-card-list]');
    const emptyState = form.parentElement.querySelector('[data-empty-state]');

    if (!list) {
      return;
    }

    const cards = Array.from(list.querySelectorAll('[data-filter-card]'));

    const applyFilter = function () {
      const keyword = input ? input.value.trim().toLowerCase() : '';
      const region = regionSelect ? regionSelect.value : '';
      const type = typeSelect ? typeSelect.value : '';
      let visible = 0;

      cards.forEach(function (card) {
        const haystack = card.getAttribute('data-title') || '';
        const cardRegion = card.getAttribute('data-region') || '';
        const cardType = card.getAttribute('data-type') || '';
        const matchedKeyword = !keyword || haystack.indexOf(keyword) > -1;
        const matchedRegion = !region || cardRegion === region;
        const matchedType = !type || cardType.indexOf(type) > -1;
        const matched = matchedKeyword && matchedRegion && matchedType;

        card.style.display = matched ? '' : 'none';

        if (matched) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('is-visible', visible === 0);
      }
    };

    [input, regionSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });
  });
})();

function initMoviePlayer(src, videoId, buttonId, stageId) {
  const video = document.getElementById(videoId);
  const button = document.getElementById(buttonId);
  const stage = document.getElementById(stageId);

  if (!video || !button || !stage) {
    return;
  }

  let attached = false;

  const attach = function () {
    if (attached) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({ enableWorker: true });
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      video.src = src;
    }

    attached = true;
  };

  const play = function () {
    attach();
    stage.classList.add('is-playing');
    video.controls = true;

    const promise = video.play();

    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        video.controls = true;
      });
    }
  };

  button.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();
    play();
  });

  stage.addEventListener('click', function (event) {
    if (event.target === video && !video.paused) {
      return;
    }

    play();
  });

  video.addEventListener('play', function () {
    stage.classList.add('is-playing');
  });
}
