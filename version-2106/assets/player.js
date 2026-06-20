(function () {
    function bootPlayer(wrapper) {
        var video = wrapper.querySelector('video');
        var cover = wrapper.querySelector('.player-cover');
        var button = wrapper.querySelector('.player-start');
        var stream = wrapper.getAttribute('data-stream');
        var hlsInstance = null;
        var isReady = false;

        if (!video || !stream) {
            return;
        }

        function attachStream() {
            if (isReady) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
                isReady = true;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hlsInstance.loadSource(stream);
                hlsInstance.attachMedia(video);
                isReady = true;
                return;
            }

            video.src = stream;
            isReady = true;
        }

        function playVideo() {
            attachStream();
            wrapper.classList.add('is-playing');
            var playPromise = video.play();

            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {});
            }
        }

        if (button) {
            button.addEventListener('click', playVideo);
        }

        if (cover) {
            cover.addEventListener('click', playVideo);
        }

        video.addEventListener('click', function () {
            if (!isReady) {
                playVideo();
            }
        });

        video.addEventListener('play', function () {
            wrapper.classList.add('is-playing');
        });

        video.addEventListener('ended', function () {
            wrapper.classList.remove('is-playing');
        });

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(bootPlayer);
}());
