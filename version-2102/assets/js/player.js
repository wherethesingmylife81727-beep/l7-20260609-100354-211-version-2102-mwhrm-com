(function () {
    window.setupMoviePlayer = function (source) {
        var video = document.querySelector("[data-player-video]");
        var overlay = document.querySelector("[data-player-overlay]");
        var status = document.querySelector("[data-player-status]");
        var hls = null;

        if (!video || !overlay) {
            return;
        }

        function setStatus(text) {
            if (status) {
                status.textContent = text;
            }
        }

        function bindStream() {
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    setStatus("点击播放");
                });
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (!data || !data.fatal) {
                        return;
                    }
                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        setStatus("视频加载失败，请刷新重试");
                        hls.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        setStatus("视频正在恢复");
                        hls.recoverMediaError();
                    } else {
                        setStatus("视频加载失败，请刷新重试");
                        hls.destroy();
                    }
                });
                return;
            }
            setStatus("视频加载失败，请刷新重试");
        }

        function playVideo() {
            overlay.hidden = true;
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {
                    overlay.hidden = false;
                    setStatus("点击播放");
                });
            }
        }

        bindStream();

        overlay.addEventListener("click", playVideo);
        video.addEventListener("click", function () {
            if (video.paused) {
                playVideo();
            } else {
                video.pause();
            }
        });
        video.addEventListener("play", function () {
            overlay.hidden = true;
        });
        video.addEventListener("pause", function () {
            if (video.currentTime === 0 || video.ended) {
                overlay.hidden = false;
            }
        });
        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    };
}());
