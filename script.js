(function () {
  const cfg = typeof INVITATION !== "undefined" ? INVITATION : {};
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const STEP_DELAY = 750;

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
        mapLink.href =
          cfg.event.mapLink ||
          "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(cfg.event.venue || "");
      }
    }
  }

  function splitIntroHeading() {
    const h = document.getElementById("intro-heading");
    if (!h || h.dataset.split) return;
    const words = h.textContent.trim().split(/\s+/);
    h.innerHTML = words
      .map((w, i) => `<span class="intro-word" style="--wi:${i}">${w}</span>`)
      .join(" ");
    h.dataset.split = "1";
  }

  function activateElement(el) {
    el.classList.add("visible");
    el.querySelectorAll(".reveal-stagger, .ornament-divider").forEach((child) => {
      child.classList.add("visible");
      if (child.classList.contains("ornament-divider")) child.classList.add("is-drawn");
    });
    if (el.classList.contains("ornament-divider")) el.classList.add("is-drawn");
  }

  function runOpeningShow() {
    const items = document.querySelectorAll("#invitation > .reveal");
    if (!items.length) {
      document.querySelectorAll(".reveal").forEach((el) => activateElement(el));
      return;
    }

    items.forEach((el, i) => {
      setTimeout(() => {
        activateElement(el);
        el.classList.add("show-now");

        if (i > 1 && window.innerWidth < 768) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 400 + i * STEP_DELAY);
    });
  }

  function showAllInstant() {
    document.body.classList.add("invitation-open");
    document.querySelectorAll(".reveal").forEach((el) => activateElement(el));
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
      document.body.classList.add("invitation-open");
      toggle.hidden = false;
      toggle.classList.add("audio-enter");
      startAudio();

      if (window.InvitationFX) {
        window.InvitationFX.flash();
        window.InvitationFX.burst(document.getElementById("invitation"));
      }

      splitIntroHeading();

      if (reducedMotion) showAllInstant();
      else runOpeningShow();
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

  applyConfig();
  initQuranAudio();
})();
