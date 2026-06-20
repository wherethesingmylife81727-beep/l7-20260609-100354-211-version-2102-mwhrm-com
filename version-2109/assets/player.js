(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }

  function bindStream(video, stream) {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = stream;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      return;
    }

    video.src = stream;
  }

  window.initializeMoviePlayer = function (stream) {
    ready(function () {
      const video = document.getElementById("movie-video");
      const button = document.getElementById("movie-play-button");

      if (!video || !button || !stream) {
        return;
      }

      let prepared = false;

      function start() {
        if (!prepared) {
          bindStream(video, stream);
          prepared = true;
        }

        button.classList.add("is-hidden");
        const playTask = video.play();
        if (playTask && typeof playTask.catch === "function") {
          playTask.catch(function () {
            button.classList.remove("is-hidden");
          });
        }
      }

      button.addEventListener("click", start);
      video.addEventListener("play", function () {
        button.classList.add("is-hidden");
      });
    });
  };
})();
