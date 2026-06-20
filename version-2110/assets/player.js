(function () {
  window.setupMoviePlayer = function (streamUrl) {
    const video = document.getElementById("moviePlayer");
    const cover = document.querySelector("[data-player-cover]");
    let ready = false;

    if (!video || !streamUrl) {
      return;
    }

    function bind() {
      if (ready) {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else {
        video.src = streamUrl;
      }

      ready = true;
    }

    function play() {
      bind();
      if (cover) {
        cover.classList.add("is-hidden");
      }
      const result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener("click", play);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener("play", function () {
      if (cover) {
        cover.classList.add("is-hidden");
      }
    });
  };
})();
