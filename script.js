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

    // ---------- ABRIR EL SOBRE ----------
    if (openBtn) {
        openBtn.addEventListener("click", function () {
            if (music) {
                music.play().catch(function (error) {
                    console.log("No se pudo reproducir la música:", error);
                });
            }
            welcomeScreen.classList.add("hidden");
            mainContent.classList.remove("hidden");
            document.body.classList.remove("welcome-active");
            window.scrollTo(0, 0);
        });
    }

    // ---------- REPRODUCTOR ----------
    function syncPlayerState() {
        if (!player || !music) return;
        player.classList.toggle("is-playing", !music.paused);
    }

    if (music) {
        music.addEventListener("play", syncPlayerState);
        music.addEventListener("pause", syncPlayerState);

        // Barra de progreso
        music.addEventListener("timeupdate", function () {
            if (!music.duration) return;
            progressBar.style.width = (music.currentTime / music.duration) * 100 + "%";
        });
    }

    if (playBtn) {
        playBtn.addEventListener("click", function () {
            if (music.paused) {
                music.play().catch(function (e) { console.log(e); });
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
