(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var button = document.querySelector("[data-menu-button]");
        var menu = document.querySelector("[data-mobile-menu]");
        if (!button || !menu) {
            return;
        }
        button.addEventListener("click", function () {
            menu.classList.toggle("is-open");
            document.body.classList.toggle("menu-open", menu.classList.contains("is-open"));
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        var prev = document.querySelector("[data-hero-prev]");
        var next = document.querySelector("[data-hero-next]");
        if (!slides.length) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === current);
            });
        }

        function restart() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                restart();
            });
        }

        show(0);
        restart();
    }

    function setupFilters() {
        var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
        scopes.forEach(function (scope) {
            var input = scope.querySelector("[data-search-input]");
            var cards = Array.prototype.slice.call(scope.parentElement.querySelectorAll("[data-search-card]"));
            var empty = scope.querySelector("[data-search-empty]");
            var activeFilters = {};
            var params = new URLSearchParams(window.location.search);
            var query = params.get("q") || "";

            if (input && query) {
                input.value = query;
            }

            function apply() {
                var words = input ? input.value.trim().toLowerCase().split(/\s+/).filter(Boolean) : [];
                var visible = 0;
                cards.forEach(function (card) {
                    var text = (card.getAttribute("data-title") || "").toLowerCase();
                    var ok = words.every(function (word) {
                        return text.indexOf(word) !== -1;
                    });
                    Object.keys(activeFilters).forEach(function (field) {
                        var value = activeFilters[field];
                        if (value && card.getAttribute("data-" + field) !== value) {
                            ok = false;
                        }
                    });
                    card.hidden = !ok;
                    if (ok) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }

            if (input) {
                input.addEventListener("input", apply);
            }

            Array.prototype.slice.call(scope.querySelectorAll("[data-filter-button]")).forEach(function (button) {
                button.addEventListener("click", function () {
                    var field = button.getAttribute("data-filter-field");
                    var value = button.getAttribute("data-filter-value") || "";
                    var group = button.closest("[data-filter-group]");
                    if (group) {
                        Array.prototype.slice.call(group.querySelectorAll("button")).forEach(function (item) {
                            item.classList.remove("is-active");
                        });
                    }
                    button.classList.add("is-active");
                    activeFilters[field] = value;
                    apply();
                });
            });

            apply();
        });
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupFilters();
    });
}());
