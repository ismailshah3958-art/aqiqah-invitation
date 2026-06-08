(function () {
  const cfg = typeof INVITATION !== "undefined" ? INVITATION : {};

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value != null && value !== "") el.textContent = value;
  }

  function applyConfig() {
    if (cfg.pageTitle) document.title = cfg.pageTitle;

    if (cfg.bismillah) {
      setText("bismillah-ar", cfg.bismillah.arabic);
      setText("bismillah-en", cfg.bismillah.english);
    }

    if (cfg.intro) {
      setText("intro-heading", cfg.intro.heading);
      setText("intro-sub", cfg.intro.subtext);
    }

    if (cfg.aqeeqah) {
      setText("aqeeqah-label", cfg.aqeeqah.label);
      setText("aqeeqah-name-ar", cfg.aqeeqah.nameArabic);
      setText("aqeeqah-name-en", cfg.aqeeqah.nameEnglish);
      setText("aqeeqah-relation", cfg.aqeeqah.relation);
    }

    if (cfg.quranRecitation) {
      setText("quran-label", cfg.quranRecitation.label);
      setText("quran-name-ar", cfg.quranRecitation.nameArabic);
      setText("quran-name-en", cfg.quranRecitation.nameEnglish);
      setText("quran-relation", cfg.quranRecitation.relation);
    }

    setText("blessing-message", cfg.message);
    setText("footer-text", cfg.footer);

    if (cfg.event) {
      setText("event-date", cfg.event.date);
      setText("event-time", cfg.event.time);
      setText("event-venue", cfg.event.venue);
      setText("event-regards", cfg.event.warmRegards);

      const mapLink = document.getElementById("map-link");
      if (mapLink) {
        const url =
          cfg.event.mapLink ||
          "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(cfg.event.venue || "");
        mapLink.href = url;
      }
    }
  }

  function initQuranAudio() {
    const ayah = cfg.quranAyah;
    if (!ayah || !ayah.audioUrl) return;

    const audio = document.getElementById("quran-audio");
    const overlay = document.getElementById("welcome-overlay");
    const toggle = document.getElementById("audio-toggle");
    if (!audio || !overlay || !toggle) return;

    audio.src = ayah.audioUrl;
    audio.volume = typeof ayah.volume === "number" ? ayah.volume : 0.3;
    audio.loop = ayah.loop !== false;

    function updateToggle(playing) {
      toggle.classList.toggle("is-playing", playing);
      toggle.setAttribute("aria-label", playing ? "Pause Quran recitation" : "Play Quran recitation");
    }

    function startAudio() {
      audio.play().then(() => updateToggle(true)).catch(() => updateToggle(false));
    }

    function openInvitation() {
      overlay.classList.add("is-hidden");
      toggle.hidden = false;
      startAudio();
    }

    overlay.addEventListener("click", openInvitation, { once: true });

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (audio.paused) startAudio();
      else { audio.pause(); updateToggle(false); }
    });

    audio.addEventListener("play", () => updateToggle(true));
    audio.addEventListener("pause", () => updateToggle(false));
  }

  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }

  applyConfig();
  initReveal();
  initQuranAudio();
})();
