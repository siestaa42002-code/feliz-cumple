/* =====================================================
   EXTRAS_CONFIG — edita este bloque si quieres
   ===================================================== */
const EXTRAS_CONFIG = {
  // Frases lindas en varios idiomas. Puedes agregar o quitar.
  idiomas: [
    { lang: "Francés", frase: "Tu es la plus belle chose qui me soit arrivée.", trad: "Eres lo más lindo que me ha pasado." },
    { lang: "Italiano", frase: "Sei il mio sole in ogni giornata.", trad: "Eres mi sol en cada día." },
    { lang: "Portugués", frase: "Você faz meu coração sorrir.", trad: "Haces sonreír a mi corazón." },
    { lang: "Japonés", frase: "君は僕の宝物 (Kimi wa boku no takaramono).", trad: "Eres mi tesoro." },
    { lang: "Alemán", frase: "Mit dir ist jeder Tag ein Geschenk.", trad: "Contigo, cada día es un regalo." },
    { lang: "Coreano", frase: "너는 나의 별이야 (Neoneun naui byeoriya).", trad: "Eres mi estrella." },
    { lang: "Inglés", frase: "You are my favorite place in the world.", trad: "Eres mi lugar favorito en el mundo." },
    { lang: "Griego", frase: "Είσαι το φως μου (Eísai to fos mou).", trad: "Eres mi luz." },
  ],

  juego: {
    meta: 10, // corazones que debe atrapar
    mensajeVictoria: "Atrapaste todos mis corazones. Igual ya eran tuyos.",
  },

  raspadito: {
    mensaje: "Vale por un abrazo infinito, una cena y todo mi amor. Canjeable hoy y siempre.",
  },
};

/* =====================================================
   A partir de aquí no necesitas editar nada
   ===================================================== */

(function () {
  const $x = (id) => document.getElementById(id);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Idiomas ---------- */
  const card = $x("idioma-card");
  const langEl = $x("idioma-lang");
  const fraseEl = $x("idioma-frase");
  const tradEl = $x("idioma-trad");
  let orden = [...EXTRAS_CONFIG.idiomas].sort(() => Math.random() - 0.5);
  let idx = 0;

  function mostrarFrase() {
    const f = orden[idx % orden.length];
    langEl.textContent = f.lang;
    fraseEl.textContent = f.frase;
    tradEl.textContent = f.trad;
    tradEl.hidden = true;
    card.classList.remove("swap");
    void card.offsetWidth; // reinicia la animación
    card.classList.add("swap");
  }

  card.addEventListener("click", () => { tradEl.hidden = !tradEl.hidden; });
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tradEl.hidden = !tradEl.hidden; }
  });
  $x("idioma-next").addEventListener("click", () => { idx++; mostrarFrase(); });
  mostrarFrase();

  /* ---------- Minijuego: atrapa corazones ---------- */
  const canvas = $x("game-canvas");
  const ctx = canvas.getContext("2d");
  const scoreEl = $x("game-score");
  const goalEl = $x("game-goal");
  const startBtn = $x("game-start");
  const winEl = $x("game-win");
  const GOAL = EXTRAS_CONFIG.juego.meta;
  goalEl.textContent = GOAL;

  let hearts = [];
  let score = 0;
  let playing = false;
  let spawnTimer = 0;
  let lastT = 0;

  function sizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function drawHeart(x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 30, size / 30);
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.bezierCurveTo(0, 4, -6, -4, -14, -4);
    ctx.bezierCurveTo(-26, -4, -26, 10, -26, 10);
    ctx.bezierCurveTo(-26, 20, -14, 28, 0, 38);
    ctx.bezierCurveTo(14, 28, 26, 20, 26, 10);
    ctx.bezierCurveTo(26, 10, 26, -4, 14, -4);
    ctx.bezierCurveTo(6, -4, 0, 4, 0, 10);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.restore();
  }

  function spawnHeart() {
    const w = canvas.getBoundingClientRect().width;
    const colors = ["#f2a9b8", "#f5c86b", "#fdf6e9"];
    hearts.push({
      x: 30 + Math.random() * (w - 60),
      y: -30,
      size: 22 + Math.random() * 16,
      vy: 55 + Math.random() * 65, // px por segundo
      sway: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      pop: 0, // animación al atraparlo
    });
  }

  function loop(t) {
    if (!playing) return;
    const dt = Math.min((t - lastT) / 1000, 0.05);
    lastT = t;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    spawnTimer -= dt;
    if (spawnTimer <= 0) {
      spawnHeart();
      spawnTimer = reduced ? 1.1 : 0.75;
    }

    hearts = hearts.filter(h => h.y < rect.height + 50 && h.pop < 1);
    for (const h of hearts) {
      if (h.pop > 0) {
        h.pop += dt * 4;
        drawHeart(h.x, h.y, h.size * (1 + h.pop * 0.8), `rgba(245, 200, 107, ${1 - h.pop})`);
        continue;
      }
      h.y += h.vy * dt;
      h.x += Math.sin(t / 600 + h.sway) * 0.6;
      drawHeart(h.x, h.y, h.size, h.color);
    }

    requestAnimationFrame(loop);
  }

  function tryCatch(clientX, clientY) {
    if (!playing) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    for (const h of hearts) {
      if (h.pop > 0) continue;
      const dx = x - h.x, dy = y - (h.y + h.size * 0.4);
      if (Math.hypot(dx, dy) < h.size * 1.1) {
        h.pop = 0.01;
        score++;
        scoreEl.textContent = score;
        if (score >= GOAL) winGame();
        break;
      }
    }
  }

  function winGame() {
    playing = false;
    winEl.textContent = EXTRAS_CONFIG.juego.mensajeVictoria;
    winEl.hidden = false;
    startBtn.textContent = "Jugar otra vez";
    startBtn.style.display = "";
    if (typeof launchConfetti === "function") launchConfetti();
  }

  startBtn.addEventListener("click", () => {
    sizeCanvas();
    hearts = [];
    score = 0;
    scoreEl.textContent = "0";
    winEl.hidden = true;
    startBtn.style.display = "none";
    playing = true;
    lastT = performance.now();
    spawnTimer = 0;
    requestAnimationFrame(loop);
  });

  canvas.addEventListener("pointerdown", (e) => tryCatch(e.clientX, e.clientY));
  window.addEventListener("resize", () => { if (playing) sizeCanvas(); });

  /* ---------- Raspadito ---------- */
  const sCanvas = $x("scratch-canvas");
  const sCtx = sCanvas.getContext("2d");
  $x("scratch-message").textContent = EXTRAS_CONFIG.raspadito.mensaje;

  let scratching = false;
  let revealed = false;

  function paintCover() {
    const wrap = sCanvas.parentElement.getBoundingClientRect();
    sCanvas.width = wrap.width * devicePixelRatio;
    sCanvas.height = wrap.height * devicePixelRatio;
    sCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

    const grad = sCtx.createLinearGradient(0, 0, wrap.width, wrap.height);
    grad.addColorStop(0, "#f5c86b");
    grad.addColorStop(0.5, "#e0a93f");
    grad.addColorStop(1, "#f5c86b");
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, wrap.width, wrap.height);

    // Textura de brillitos
    for (let i = 0; i < 90; i++) {
      sCtx.fillStyle = `rgba(253, 246, 233, ${0.15 + Math.random() * 0.3})`;
      sCtx.beginPath();
      sCtx.arc(Math.random() * wrap.width, Math.random() * wrap.height, Math.random() * 2 + 0.5, 0, Math.PI * 2);
      sCtx.fill();
    }

    sCtx.fillStyle = "rgba(11, 16, 38, 0.75)";
    sCtx.font = "600 15px Karla, sans-serif";
    sCtx.textAlign = "center";
    sCtx.fillText("Raspa aquí", wrap.width / 2, wrap.height / 2 + 5);
  }

  function scratchAt(clientX, clientY) {
    const rect = sCanvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    sCtx.globalCompositeOperation = "destination-out";
    sCtx.beginPath();
    sCtx.arc(x, y, 24, 0, Math.PI * 2);
    sCtx.fill();
    sCtx.globalCompositeOperation = "source-over";
  }

  function checkReveal() {
    if (revealed) return;
    const data = sCtx.getImageData(0, 0, sCanvas.width, sCanvas.height).data;
    let clear = 0;
    // Muestreo cada 16 píxeles para no bloquear el hilo
    for (let i = 3; i < data.length; i += 64) {
      if (data[i] === 0) clear++;
    }
    const total = data.length / 64;
    if (clear / total > 0.55) {
      revealed = true;
      sCanvas.classList.add("cleared");
    }
  }

  sCanvas.addEventListener("pointerdown", (e) => {
    scratching = true;
    sCanvas.setPointerCapture(e.pointerId);
    scratchAt(e.clientX, e.clientY);
  });
  sCanvas.addEventListener("pointermove", (e) => {
    if (scratching) scratchAt(e.clientX, e.clientY);
  });
  sCanvas.addEventListener("pointerup", () => {
    scratching = false;
    checkReveal();
  });

  // Pintar la cubierta cuando la sección ya es visible (main empieza oculto)
  const openBtn = document.getElementById("btn-open");
  if (openBtn) openBtn.addEventListener("click", () => setTimeout(paintCover, 100));
  window.addEventListener("resize", () => { if (!revealed) paintCover(); });
})();
