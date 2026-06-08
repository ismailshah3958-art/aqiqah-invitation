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
    "rgba(210, 195, 170, 0.28)",
    "rgba(166, 137, 78, 0.15)",
    "rgba(253, 251, 242, 0.45)",
    "rgba(180, 155, 120, 0.2)",
  ];

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

    const count = Math.min(Math.floor((width * height) / 12000), 55);
    particles = Array.from({ length: count }, () => createParticle(true));
  }

  function createParticle(randomY) {
    const size = Math.random() * 3 + 1;
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : Math.random() * height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.12,
      size,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.4 + 0.15,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.008 + 0.003,
    };
  }

  function drawParticle(p) {
    const alpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
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

      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(drawParticle);
  }

  function loop() {
    update();
    draw();
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
