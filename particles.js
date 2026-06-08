(function () {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let particles = [];
  let animId = null;

  const COLORS = [
    "rgba(212, 175, 55, 0.55)",
    "rgba(196, 160, 98, 0.4)",
    "rgba(140, 98, 57, 0.35)",
    "rgba(255, 248, 230, 0.6)",
  ];

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    const count = Math.min(Math.floor((width * height) / 7000), 100);
    particles = Array.from({ length: count }, () => createParticle(true));
  }

  function createParticle(randomY) {
    const sparkle = Math.random() > 0.75;
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : height + 20,
      vx: (Math.random() - 0.5) * 0.45,
      vy: -(Math.random() * 0.55 + 0.2),
      size: sparkle ? Math.random() * 2 + 1.5 : Math.random() * 3.5 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.008,
      sparkle,
    };
  }

  function drawSparkle(x, y, r, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = "rgba(212, 175, 55, 0.85)";
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(x, y - r);
      ctx.lineTo(x, y + r);
      ctx.stroke();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4);
      ctx.translate(-x, -y);
    }
    ctx.restore();
  }

  function connectNearby() {
    const dist = width < 500 ? 100 : 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < dist) {
          ctx.strokeStyle = `rgba(212, 175, 55, ${0.12 * (1 - d / dist)})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  }

  function drawParticle(p) {
    const alpha = p.alpha * (0.55 + 0.45 * Math.sin(p.pulse));
    if (p.sparkle) {
      drawSparkle(p.x, p.y, p.size * 2, alpha);
      return;
    }
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function update() {
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;
      if (p.y < -20) {
        Object.assign(p, createParticle(false));
        p.y = height + 15;
        p.x = Math.random() * width;
      }
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
    });
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    connectNearby();
    particles.forEach(drawParticle);
    update();
    animId = requestAnimationFrame(loop);
  }

  window.addEventListener("resize", resize);
  resize();
  loop();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else loop();
  });
})();
