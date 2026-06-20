(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var header = document.querySelector('.site-header');
    var mobileToggle = document.querySelector('.mobile-toggle');
    var mobilePanel = document.querySelector('.mobile-panel');
    var backTop = document.querySelector('.back-top');

    function updateHeader() {
      if (!header) {
        return;
      }
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    function updateBackTop() {
      if (!backTop) {
        return;
      }
      if (window.scrollY > 320) {
        backTop.classList.add('is-visible');
      } else {
        backTop.classList.remove('is-visible');
      }
    }

    updateHeader();
    updateBackTop();
    window.addEventListener('scroll', function () {
      updateHeader();
      updateBackTop();
    });

    if (mobileToggle && mobilePanel) {
      mobileToggle.addEventListener('click', function () {
        mobilePanel.classList.toggle('is-open');
      });
    }

    if (backTop) {
      backTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    setupHero();
    setupFilters();
    setupPlayerJump();
  });

  function setupHero() {
    var slider = document.querySelector('.hero-slider');
    if (!slider) {
      return;
    }

    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var prev = document.querySelector('.hero-prev');
    var next = document.querySelector('.hero-next');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function setupFilters() {
    var grids = Array.prototype.slice.call(document.querySelectorAll('[data-filterable="movies"]'));
    grids.forEach(function (grid) {
      var scopeName = grid.getAttribute('data-scope');
      var search = document.querySelector('[data-search-for="' + scopeName + '"]');
      var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-for="' + scopeName + '"]'));
      var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
      var activeFilter = 'all';

      function normalize(value) {
        return String(value || '').toLowerCase().trim();
      }

      function apply() {
        var keyword = search ? normalize(search.value) : '';
        cards.forEach(function (card) {
          var text = normalize(card.getAttribute('data-search'));
          var region = card.getAttribute('data-region') || '';
          var type = card.getAttribute('data-type') || '';
          var category = card.getAttribute('data-category') || '';
          var matchesKeyword = !keyword || text.indexOf(keyword) !== -1;
          var matchesFilter = activeFilter === 'all' || region === activeFilter || type === activeFilter || category === activeFilter;
          card.classList.toggle('is-hidden-card', !(matchesKeyword && matchesFilter));
        });
      }

      if (search) {
        search.addEventListener('input', apply);
      }

      buttons.forEach(function (button) {
        button.addEventListener('click', function () {
          activeFilter = button.getAttribute('data-filter-value') || 'all';
          buttons.forEach(function (item) {
            item.classList.toggle('is-active', item === button);
          });
          apply();
        });
      });

      apply();
    });
  }

  function setupPlayerJump() {
    var jumpButtons = Array.prototype.slice.call(document.querySelectorAll('[data-player-jump]'));
    jumpButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var player = document.getElementById('player');
        if (player) {
          player.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (typeof window.startMoviePlayback === 'function') {
          window.setTimeout(function () {
            window.startMoviePlayback();
          }, 320);
        }
      });
    });
  }

  window.initMoviePlayer = function (source) {
    var video = document.getElementById('moviePlayer');
    var overlay = document.querySelector('.player-start');
    var prepared = false;
    var hls = null;

    function prepare() {
      if (!video || prepared) {
        return;
      }
      prepared = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function play() {
      if (!video) {
        return;
      }
      prepare();
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    }

    window.startMoviePlayback = play;

    if (overlay) {
      overlay.addEventListener('click', play);
    }

    if (video) {
      video.addEventListener('play', function () {
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
      });
      video.addEventListener('pause', function () {
        if (overlay && video.currentTime === 0) {
          overlay.classList.remove('is-hidden');
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
