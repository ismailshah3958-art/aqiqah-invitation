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
    const honoree = cfg.bismillahOf || cfg.quranRecitation;
    if (honoree) {
      setText("bismillah-label", honoree.label);
      setText("bismillah-name-ar", honoree.nameArabic);
      setText("bismillah-name-en", honoree.nameEnglish);
      setText("bismillah-relation", honoree.relation);
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
    /* keep heading as plain text so title stays visible with gradient/color */
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

  function openInvitation() {
    document.body.classList.add("invitation-open");
    splitIntroHeading();

    if (window.InvitationFX) {
      window.InvitationFX.flash();
      window.InvitationFX.burst(document.getElementById("invitation"));
    }

    if (reducedMotion) showAllInstant();
    else runOpeningShow();
  }

  function initQuranAudio() {
    const ayah = cfg.quranAyah;
    const audio = document.getElementById("quran-audio");
    const toggle = document.getElementById("audio-toggle");

    openInvitation();

    if (!audio || !toggle) return;

    toggle.classList.add("audio-enter");

    if (!ayah || !ayah.audioUrl) return;

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

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (audio.paused) startAudio();
      else {
        audio.pause();
        updateToggle(false);
      }
    });

    audio.addEventListener("play", () => updateToggle(true));
    audio.addEventListener("pause", () => updateToggle(false));

    startAudio();
  }

  applyConfig();
  initQuranAudio();
})();
