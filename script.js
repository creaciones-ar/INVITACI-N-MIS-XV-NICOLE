document.addEventListener("DOMContentLoaded", function () {
    const welcomeScreen = document.getElementById("welcome-screen");
    const openBtn = document.getElementById("open-btn");
    const music = document.getElementById("background-music");
    const mainContent = document.getElementById("main-content");

    const playBtn = document.getElementById("play-btn");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const player = document.querySelector(".music-player");
    const progress = document.getElementById("progress");
    const progressBar = document.getElementById("progress-bar");

    // Diagnóstico: abrí la página con ?debug=1 al final del link para ver el error de audio
    function debugMsg(text) {
        if (!/[?&]debug/.test(location.search)) return;
        const hint = document.querySelector(".player-hint");
        if (hint) { hint.textContent = text; hint.style.color = "#b00020"; }
    }

    // ---------- ABRIR EL SOBRE ----------
    if (openBtn) {
        openBtn.addEventListener("click", function () {
            if (music) {
                music.play().catch(function (error) {
                    console.log("No se pudo reproducir la música:", error);
                    debugMsg("play() falló: " + error.name);
                    syncPlayerState();
                });
            }
            welcomeScreen.classList.add("hidden");
            mainContent.classList.remove("hidden");
            document.body.classList.remove("welcome-active");
            window.scrollTo(0, 0);
            requestAnimationFrame(fitTitles);
        });
    }

    // ---------- TÍTULOS QUE SE AJUSTAN AL ANCHO ----------
    // Cada título con data-fit queda en un solo renglón; los del mismo grupo usan el mismo tamaño.
    function fitTitles() {
        const groups = {};
        document.querySelectorAll("[data-fit]").forEach(function (el) {
            (groups[el.dataset.fit] = groups[el.dataset.fit] || []).push(el);
        });
        Object.keys(groups).forEach(function (name) {
            const list = groups[name];
            let best = Infinity;
            list.forEach(function (el) {
                const parent = el.parentElement;
                const cs = getComputedStyle(parent);
                const avail = (parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) * 0.98;
                if (avail <= 0) return;                       // sección oculta todavía
                let lo = parseFloat(el.dataset.min || 18);
                let hi = parseFloat(el.dataset.max || 80);
                for (let i = 0; i < 14; i++) {
                    const mid = (lo + hi) / 2;
                    el.style.fontSize = mid + "px";
                    if (el.offsetWidth <= avail) lo = mid; else hi = mid;
                }
                best = Math.min(best, lo);
            });
            if (best !== Infinity) list.forEach(function (el) { el.style.fontSize = best + "px"; });
        });
    }
    let fitTimer;
    window.addEventListener("resize", function () {
        clearTimeout(fitTimer);
        fitTimer = setTimeout(fitTitles, 120);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitTitles);

    // ---------- REPRODUCTOR ----------
    function syncPlayerState() {
        if (!player || !music) return;
        player.classList.toggle("is-playing", !music.paused);
    }

    if (music) {
        // "playing" = suena de verdad (no solo se pidió reproducir)
        music.addEventListener("playing", syncPlayerState);
        music.addEventListener("pause", syncPlayerState);
        music.addEventListener("ended", syncPlayerState);
        music.addEventListener("error", function () {
            player.classList.remove("is-playing");
            console.error("No se pudo cargar musica.mp3. Revisá que el archivo exista y sea un MP3 válido.", music.error);
            debugMsg("Error de audio, código " + (music.error ? music.error.code : "?") + " (4 = archivo no encontrado o formato no válido)");
        });

        // Barra de progreso
        music.addEventListener("timeupdate", function () {
            if (!music.duration) return;
            progressBar.style.width = (music.currentTime / music.duration) * 100 + "%";
        });
    }

    if (playBtn) {
        playBtn.addEventListener("click", function () {
            if (music.paused) {
                music.play().catch(function (e) { console.log(e); debugMsg("play() falló: " + e.name); syncPlayerState(); });
            } else {
                music.pause();
            }
        });
    }

    // Anterior / siguiente: reinician la canción (hay un solo tema)
    [prevBtn, nextBtn].forEach(function (btn) {
        if (btn) btn.addEventListener("click", function () { music.currentTime = 0; });
    });

    // Tocar la barra para saltar a ese punto de la canción
    if (progress) {
        progress.addEventListener("click", function (e) {
            if (!music.duration) return;
            const rect = progress.getBoundingClientRect();
            music.currentTime = ((e.clientX - rect.left) / rect.width) * music.duration;
        });
    }

    // ---------- CUENTA REGRESIVA ----------
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");

    // 14 de noviembre de 2026, 21:00 (Argentina)
    const eventDate = new Date("2026-11-14T21:00:00-03:00").getTime();
    const pad = function (n) { return String(n).padStart(2, "0"); };

    function updateCountdown() {
        const diff = eventDate - Date.now();

        if (diff <= 0) {
            daysEl.textContent = "0";
            hoursEl.textContent = "00";
            minutesEl.textContent = "00";
            return;
        }

        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);

        daysEl.textContent = days;
        hoursEl.textContent = pad(hours);
        minutesEl.textContent = pad(minutes);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
});
