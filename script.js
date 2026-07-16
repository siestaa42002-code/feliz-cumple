/* =====================================================
   CONFIG — edita SOLO este bloque con tus textos y fotos
   ===================================================== */
const CONFIG = {
  nombre: "Mi amor", // su nombre o apodo

  portada: {
    eyebrow: "Hoy es tu día",
    subtitulo: "Hice esto para ti, con código y con el corazón.",
  },

  carta: {
    texto:
`Feliz cumpleaños.

Quería regalarte algo que nadie más pudiera darte, así que construí este pequeño rincón del internet solo para ti.

Gracias por cada risa, cada plan improvisado y cada día a tu lado. Este año que empieza va a ser increíble, y quiero verlo todo contigo.`,
    firma: "— Con todo mi amor, Santi",
  },

  // Recuerdos: entre 4 y 7 se ve mejor. "fecha" es libre (texto).
  recuerdos: [
    { titulo: "El inicio", fecha: "El día que empezó todo", texto: "Aquí va la historia de cómo empezó todo. Edítame." },
    { titulo: "Primera cita", fecha: "Nuestra primera salida", texto: "Aquí va ese recuerdo de la primera cita. Edítame." },
    { titulo: "Ese viaje", fecha: "Una aventura juntos", texto: "Aquí va un viaje o paseo que no olvidan. Edítame." },
    { titulo: "Una risa", fecha: "Ese chiste interno", texto: "Aquí va ese momento que solo ustedes entienden. Edítame." },
    { titulo: "Hoy", fecha: "Tu cumpleaños", texto: "Y hoy celebro que existas. Feliz cumpleaños." },
  ],

  // Fotos: pon los archivos en /img y escribe el nombre aquí.
  // Si "src" queda vacío (""), se muestra un placeholder bonito.
  fotos: [
    { src: "https://drive.google.com/file/d/1v3IDICAqGGADgr72d6GvRcQRQjAhrShf/view?usp=sharing", caption: "Pon una foto aquí" },
    { src: "https://drive.google.com/file/d/1ZvJeNonSdq-2hOt18N9xm0FsjR1kcN86/view?usp=drive_link", caption: "Y otra aquí" },
    { src: "https://drive.google.com/file/d/1ZvJeNonSdq-2hOt18N9xm0FsjR1kcN86/view?usp=sharing", caption: "Una más" },
    { src: "https://drive.google.com/file/d/1ZvJeNonSdq-2hOt18N9xm0FsjR1kcN86/view?usp=sharing", caption: "La última" },
    // Ejemplo con foto real: { src: "img/nosotros.jpg", caption: "Nosotros" },
  ],

  deseo: {
    hint: "Mantén presionado el pastel para soplar las velas",
    mensajeFinal: "Deseo concedido. Te amo. Feliz cumpleaños.",
  },

  footer: "Hecho a mano para ti · 2026",
};

/* =====================================================
   A partir de aquí no necesitas editar nada
   ===================================================== */

const $ = (id) => document.getElementById(id);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Poblar contenido ---------- */
$("hero-eyebrow").textContent = CONFIG.portada.eyebrow;
$("hero-name").textContent = CONFIG.nombre;
$("hero-sub").textContent = CONFIG.portada.subtitulo;
$("letter-sign").textContent = CONFIG.carta.firma;
$("cake-hint").textContent = CONFIG.deseo.hint;
$("footer-text").textContent = CONFIG.footer;
document.title = `Para ${CONFIG.nombre}`;

/* ---------- Cielo estrellado ---------- */
const sky = $("sky");
const skyCtx = sky.getContext("2d");
let stars = [];

function buildSky() {
  sky.width = window.innerWidth * devicePixelRatio;
  sky.height = window.innerHeight * devicePixelRatio;
  skyCtx.scale(devicePixelRatio, devicePixelRatio);
  const count = Math.floor((window.innerWidth * window.innerHeight) / 6500);
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.4 + 0.3,
    phase: Math.random() * Math.PI * 2,
    speed: 0.4 + Math.random() * 0.8,
  }));
}

function drawSky(t) {
  skyCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (const s of stars) {
    const glow = reducedMotion ? 0.8 : 0.55 + 0.45 * Math.sin(t / 1000 * s.speed + s.phase);
    skyCtx.beginPath();
    skyCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    skyCtx.fillStyle = `rgba(253, 246, 233, ${0.5 * glow})`;
    skyCtx.fill();
  }
  if (!reducedMotion) requestAnimationFrame(drawSky);
}

buildSky();
requestAnimationFrame(drawSky);
window.addEventListener("resize", () => { buildSky(); if (reducedMotion) drawSky(0); });

/* ---------- Abrir el regalo ---------- */
const main = $("regalo");
const footer = $("footer");

$("btn-open").addEventListener("click", () => {
  main.hidden = false;
  footer.hidden = false;
  markReveals();
  $("carta").scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  setTimeout(typeLetter, reducedMotion ? 0 : 600);
});

/* ---------- Carta typewriter ---------- */
const letterEl = $("letter-text");
let typed = false;

function typeLetter() {
  if (typed) return;
  typed = true;
  const text = CONFIG.carta.texto;
  if (reducedMotion) {
    letterEl.textContent = text;
    letterEl.classList.add("done");
    $("letter-sign").classList.add("visible");
    return;
  }
  let i = 0;
  const tick = () => {
    letterEl.textContent = text.slice(0, i++);
    if (i <= text.length) {
      setTimeout(tick, text[i - 2] === "\n" ? 220 : 34);
    } else {
      letterEl.classList.add("done");
      $("letter-sign").classList.add("visible");
    }
  };
  tick();
}

/* ---------- Constelación de recuerdos ---------- */
const svg = $("constellation-svg");
const NS = "http://www.w3.org/2000/svg";
const card = $("memory-card");

function buildConstellation() {
  const n = CONFIG.recuerdos.length;
  const W = 360, H = 420, padX = 56, padY = 46;
  // Posiciones en zigzag suave para que parezca constelación
  const pts = CONFIG.recuerdos.map((_, i) => {
    const ty = padY + (H - 2 * padY) * (i / Math.max(n - 1, 1));
    const tx = W / 2 + (i % 2 === 0 ? -1 : 1) * (padX + (i * 37) % 60);
    return { x: tx, y: ty };
  });

  // Líneas entre estrellas
  for (let i = 0; i < n - 1; i++) {
    const line = document.createElementNS(NS, "line");
    line.setAttribute("x1", pts[i].x); line.setAttribute("y1", pts[i].y);
    line.setAttribute("x2", pts[i + 1].x); line.setAttribute("y2", pts[i + 1].y);
    line.setAttribute("class", "const-line");
    svg.appendChild(line);
  }

  // Estrellas
  CONFIG.recuerdos.forEach((rec, i) => {
    const g = document.createElementNS(NS, "g");
    g.setAttribute("class", "star-group");
    g.setAttribute("role", "listitem");
    g.setAttribute("tabindex", "0");
    g.setAttribute("aria-label", rec.titulo);

    const halo = document.createElementNS(NS, "circle");
    halo.setAttribute("cx", pts[i].x); halo.setAttribute("cy", pts[i].y);
    halo.setAttribute("r", 16); halo.setAttribute("class", "halo");

    const core = document.createElementNS(NS, "circle");
    core.setAttribute("cx", pts[i].x); core.setAttribute("cy", pts[i].y);
    core.setAttribute("r", 5); core.setAttribute("class", "core");

    const label = document.createElementNS(NS, "text");
    label.setAttribute("x", pts[i].x + (pts[i].x > 180 ? -14 : 14));
    label.setAttribute("y", pts[i].y + 4);
    label.setAttribute("text-anchor", pts[i].x > 180 ? "end" : "start");
    label.textContent = rec.titulo;

    const open = () => {
      svg.querySelectorAll(".star-group").forEach(el => el.classList.remove("active"));
      g.classList.add("active");
      $("memory-date").textContent = rec.fecha;
      $("memory-text").textContent = rec.texto;
      card.hidden = false;
    };
    g.addEventListener("click", open);
    g.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });

    g.append(halo, core, label);
    svg.appendChild(g);
  });
}
buildConstellation();

/* ---------- Galería ---------- */
// Convierte enlaces de compartir de Google Drive en URLs de imagen directa.
// Acepta: .../file/d/ID/view, .../open?id=ID, .../uc?id=ID, o el ID pelado.
function driveSrc(url) {
  if (!url) return "";
  if (!url.includes("drive.google.com") && !url.includes("/")) {
    // Parece un ID pelado
    return `https://drive.google.com/thumbnail?id=${url}&sz=w1200`;
  }
  const m = url.match(/\/d\/([\w-]+)/) || url.match(/[?&]id=([\w-]+)/);
  if (m) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w1200`;
  return url; // no es de Drive: se usa tal cual (ej. img/foto.jpg)
}

const gallery = $("gallery");
CONFIG.fotos.forEach((f, i) => {
  const fig = document.createElement("figure");
  fig.className = "polaroid";
  fig.style.setProperty("--tilt", `${(i % 2 === 0 ? -1 : 1) * (1.5 + (i % 3))}deg`);

  const src = driveSrc(f.src);
  if (src) {
    const img = document.createElement("img");
    img.className = "ph";
    img.src = src;
    img.alt = f.caption || "Foto";
    img.loading = "lazy";
    img.referrerPolicy = "no-referrer";
    // Si Drive falla, se muestra el placeholder en vez de un icono roto
    img.addEventListener("error", () => {
      const ph = document.createElement("div");
      ph.className = "ph ph-empty";
      ph.textContent = "✳";
      img.replaceWith(ph);
    });
    fig.appendChild(img);
  } else {
    const ph = document.createElement("div");
    ph.className = "ph ph-empty";
    ph.textContent = "✳";
    fig.appendChild(ph);
  }

  const cap = document.createElement("figcaption");
  cap.textContent = f.caption || "";
  fig.appendChild(cap);
  gallery.appendChild(fig);
});

/* ---------- Pastel: mantener presionado ---------- */
const cake = $("cake");
const HOLD_MS = 1600;
let holdTimer = null;
let blown = false;

const progress = document.createElement("div");
progress.className = "progress";
cake.appendChild(progress);

function startHold() {
  if (blown) return;
  cake.classList.add("holding");
  holdTimer = setTimeout(blowCandles, HOLD_MS);
}
function cancelHold() {
  cake.classList.remove("holding");
  if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
}
function blowCandles() {
  blown = true;
  cancelHold();
  cake.classList.add("blown");
  cake.setAttribute("aria-label", "Velas apagadas. Deseo pedido.");
  const msg = $("final-message");
  msg.textContent = CONFIG.deseo.mensajeFinal;
  msg.hidden = false;
  launchConfetti();
}

cake.addEventListener("pointerdown", startHold);
cake.addEventListener("pointerup", cancelHold);
cake.addEventListener("pointerleave", cancelHold);
cake.addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && !blown) { e.preventDefault(); blowCandles(); }
});

/* ---------- Confeti ---------- */
const conf = $("confetti");
const confCtx = conf.getContext("2d");
let pieces = [];

function launchConfetti() {
  conf.width = window.innerWidth * devicePixelRatio;
  conf.height = window.innerHeight * devicePixelRatio;
  confCtx.scale(devicePixelRatio, devicePixelRatio);
  const colors = ["#f5c86b", "#f2a9b8", "#fdf6e9", "#9fb4ff"];
  pieces = Array.from({ length: reducedMotion ? 40 : 160 }, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * window.innerHeight * 0.5,
    w: 6 + Math.random() * 6,
    h: 8 + Math.random() * 8,
    vy: 2 + Math.random() * 3,
    vx: -1 + Math.random() * 2,
    rot: Math.random() * Math.PI,
    vr: -0.1 + Math.random() * 0.2,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
  requestAnimationFrame(stepConfetti);
}

function stepConfetti() {
  confCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  let alive = false;
  for (const p of pieces) {
    p.x += p.vx; p.y += p.vy; p.rot += p.vr;
    if (p.y < window.innerHeight + 30) alive = true;
    confCtx.save();
    confCtx.translate(p.x, p.y);
    confCtx.rotate(p.rot);
    confCtx.fillStyle = p.color;
    confCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    confCtx.restore();
  }
  if (alive) requestAnimationFrame(stepConfetti);
  else confCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

/* ---------- Reveal on scroll ---------- */
function markReveals() {
  const sections = document.querySelectorAll("main .section");
  sections.forEach(s => s.classList.add("reveal"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  sections.forEach(s => io.observe(s));
}
