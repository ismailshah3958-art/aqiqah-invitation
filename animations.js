(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  window.InvitationFX = {
    burst(container) {
      const root = container || document.body;
      const wrap = document.createElement("div");
      wrap.className = "gold-burst";
      root.appendChild(wrap);

      for (let i = 0; i < 40; i++) {
        const p = document.createElement("span");
        p.className = "gold-burst__particle";
        const angle = (Math.PI * 2 * i) / 40 + Math.random() * 0.4;
        const dist = 80 + Math.random() * 160;
        p.style.setProperty("--tx", Math.cos(angle) * dist + "px");
        p.style.setProperty("--ty", Math.sin(angle) * dist + "px");
        p.style.setProperty("--rot", Math.random() * 720 + "deg");
        p.style.animationDelay = Math.random() * 0.15 + "s";
        wrap.appendChild(p);
      }

      setTimeout(() => wrap.remove(), 2200);
    },

    flash() {
      const el = document.createElement("div");
      el.className = "gold-flash";
      document.body.appendChild(el);
      requestAnimationFrame(() => el.classList.add("is-active"));
      setTimeout(() => el.remove(), 900);
    },
  };
})();
