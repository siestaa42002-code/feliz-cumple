/* =====================================================
   FIESTA_CONFIG — edita este bloque con lo tuyo
   ===================================================== */
const FIESTA_CONFIG = {
  cinta: "Feliz cumpleaños ✳ Feliz cumpleaños ✳ Feliz cumpleaños ✳",

  globos: {
    meta: 8,
    palabras: ["hermosa", "valiente", "única", "brillante", "mi paz", "mi caos favorito", "inolvidable", "mía"],
    mensajeVictoria: "Reventaste todo, como mi corazón la primera vez que te vi.",
  },

  pregunta: {
    titulo: "¿Me quieres para siempre?",
    respuestasNo: ["¿Segura?", "Piénsalo", "No te creo", "Última chance", "..."],
    mensajeSi: "Lo sabía. No tenías escapatoria, el otro botón era decorativo.",
  },

  // Humor negro de cumpleaños. Edita o agrega las que quieras.
  cartas: [
    "Un año más cerca de la muerte. Por suerte, también un año más conmigo. No sé qué es peor.",
    "Las estadísticas confirman que la gente que cumple años vive más que la que deja de cumplirlos. Vas muy bien.",
    "Hoy llevas 365 días más esquivando a la muerte. Ella está frustrada; yo, orgulloso.",
    "Si un fantasma te asusta esta noche, dile que haga fila. Yo te vi primero.",
    "Envejecer es obligatorio. Hacerlo conmigo es una amenaza. Digo, una promesa.",
    "Cuando seamos dos esqueletos, el mío va a seguir tomándote de la mano. Qué romántico y qué perturbador.",
  ],

  mediodia: {
    // Su hora exacta de nacimiento: 16 de julio, 12:00 del mediodía (hora local)
    objetivo: "2026-07-16T12:00:00",
    mensaje: "12:00 en punto. Hace exactamente un montón de años llegaste al mundo, y hace un rato llegaste al mío. Feliz hora de nacimiento.",
    yaPaso: "Tus 12:00 ya pasaron hoy, pero la sorpresa sigue siendo tuya:",
  },
};

/* =====================================================
   A partir de aquí no necesitas editar nada
   ===================================================== */

(function () {
  const $f = (id) => document.getElementById(id);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Cinta ---------- */
  const track = $f("marquee-track");
  // Se duplica el contenido para que el bucle sea continuo
  track.textContent = (FIESTA_CONFIG.cinta + " ").repeat(6);

  /* ---------- Globos ---------- */
  const arena = $f("globos-arena");
  const gCount = $f("globos-count");
  const gGoal = $f("globos-goal");
  const gStart = $f("globos-start");
  const gWin = $f("globos-win");
  const META = FIESTA_CONFIG.globos.meta;
  gGoal.textContent = META;

  const pasteles = ["#ffd1dc", "#c9f2e4", "#e3d0ff", "#fff3b0", "#cde7ff"];
  let reventados = 0;
  let jugando = false;
  let spawner = null;

  function crearGlobo() {
    if (!jugando) return;
    const g = document.createElement("button");
    g.className = "globo";
    g.setAttribute("aria-label", "Globo");
    g.style.left = 8 + Math.random() * (arena.clientWidth - 78) + "px";
    g.style.background = pasteles[Math.floor(Math.random() * pasteles.length)];
    g.style.animationDuration = (reduced ? 0.001 : 4.5 + Math.random() * 3.5) + "s";

    g.addEventListener("animationend", () => {
      if (!g.classList.contains("pop")) g.remove();
    });

    g.addEventListener("pointerdown", () => {
      if (g.classList.contains("pop")) return;
      g.classList.add("pop");
      reventados++;
      gCount.textContent = reventados;

      const palabra = document.createElement("span");
      palabra.className = "globo-palabra";
      palabra.textContent = FIESTA_CONFIG.globos.palabras[(reventados - 1) % FIESTA_CONFIG.globos.palabras.length];
      palabra.style.left = g.offsetLeft + "px";
      palabra.style.top = Math.max(g.getBoundingClientRect().top - arena.getBoundingClientRect().top - 10, 8) + "px";
      arena.appendChild(palabra);
      setTimeout(() => palabra.remove(), 1700);
      setTimeout(() => g.remove(), 320);

      if (reventados >= META) ganarGlobos();
    });

    arena.appendChild(g);
  }

  function ganarGlobos() {
    jugando = false;
    clearInterval(spawner);
    gWin.textContent = FIESTA_CONFIG.globos.mensajeVictoria;
    gWin.hidden = false;
    gStart.textContent = "Otra vez";
    gStart.style.display = "";
    if (typeof launchConfetti === "function") launchConfetti();
  }

  gStart.addEventListener("click", () => {
    arena.querySelectorAll(".globo, .globo-palabra").forEach(el => el.remove());
    reventados = 0;
    gCount.textContent = "0";
    gWin.hidden = true;
    gStart.style.display = "none";
    jugando = true;
    crearGlobo();
    spawner = setInterval(crearGlobo, 900);
  });

  /* ---------- Botón travieso ---------- */
  $f("pregunta-titulo").textContent = FIESTA_CONFIG.pregunta.titulo;
  const pArena = $f("pregunta-arena");
  const btnSi = $f("btn-si");
  const btnNo = $f("btn-no");
  const pMsg = $f("pregunta-msg");
  let intentos = 0;
  let respondido = false;

  function huir() {
    if (respondido) return;
    intentos++;

    // El No se encoge y cambia de texto; el Sí crece
    const escala = Math.max(1 - intentos * 0.13, 0.35);
    btnNo.style.transform = `scale(${escala})`;
    btnSi.style.transform = `scale(${1 + intentos * 0.12})`;

    const frases = FIESTA_CONFIG.pregunta.respuestasNo;
    btnNo.textContent = frases[Math.min(intentos - 1, frases.length - 1)];

    // Se mueve a un punto aleatorio dentro del área
    const maxX = pArena.clientWidth - btnNo.offsetWidth - 10;
    const maxY = pArena.clientHeight - btnNo.offsetHeight - 10;
    btnNo.style.left = 5 + Math.random() * Math.max(maxX, 10) + "px";
    btnNo.style.top = 5 + Math.random() * Math.max(maxY, 10) + "px";

    // Después de varios intentos, desaparece del todo
    if (intentos > frases.length) {
      btnNo.style.opacity = "0";
      btnNo.style.pointerEvents = "none";
    }
  }

  btnNo.addEventListener("pointerenter", huir);
  btnNo.addEventListener("pointerdown", (e) => { e.preventDefault(); huir(); });
  btnNo.addEventListener("focus", huir);

  btnSi.addEventListener("click", () => {
    respondido = true;
    pMsg.textContent = FIESTA_CONFIG.pregunta.mensajeSi;
    pMsg.hidden = false;
    btnNo.style.opacity = "0";
    btnNo.style.pointerEvents = "none";
    if (typeof launchConfetti === "function") launchConfetti();
  });

  /* ---------- Cartas del más allá ---------- */
  const grid = $f("cartas-grid");
  FIESTA_CONFIG.cartas.forEach((texto, i) => {
    const carta = document.createElement("div");
    carta.className = "carta3d";
    carta.setAttribute("role", "button");
    carta.setAttribute("tabindex", "0");
    carta.setAttribute("aria-label", `Carta ${i + 1}, tocar para voltear`);
    carta.innerHTML = `
      <div class="carta3d-inner">
        <div class="carta3d-cara carta3d-frente">
          <div class="ghost" aria-hidden="true"></div>
          <span class="carta3d-num">N.º ${i + 1}</span>
        </div>
        <div class="carta3d-cara carta3d-atras"><p></p></div>
      </div>`;
    carta.querySelector(".carta3d-atras p").textContent = texto;

    const voltear = () => carta.classList.toggle("flip");
    carta.addEventListener("click", voltear);
    carta.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); voltear(); }
    });
    grid.appendChild(carta);
  });

  /* ---------- Cuenta regresiva a las 12:00 ---------- */
  const objetivo = new Date(FIESTA_CONFIG.mediodia.objetivo).getTime();
  const cdD = $f("cd-d"), cdH = $f("cd-h"), cdM = $f("cd-m"), cdS = $f("cd-s");
  const countGrid = $f("count-grid");
  const countMsg = $f("count-msg");
  const countHint = $f("count-hint");
  let celebrado = false;

  function celebrar(textoExtra) {
    celebrado = true;
    countGrid.style.display = "none";
    countHint.hidden = true;
    countMsg.textContent = (textoExtra ? textoExtra + " " : "") + FIESTA_CONFIG.mediodia.mensaje;
    countMsg.hidden = false;
    if (typeof launchConfetti === "function") launchConfetti();
  }

  function tick() {
    if (celebrado) return;
    const resta = objetivo - Date.now();

    if (resta <= 0) {
      // Si faltaban menos de 12 h cuando llegó a cero, celebra en vivo;
      // si ya había pasado hace rato, muestra el mensaje alternativo.
      const pasadoHace = Math.abs(resta);
      celebrar(pasadoHace > 60 * 1000 ? FIESTA_CONFIG.mediodia.yaPaso : "");
      return;
    }

    const s = Math.floor(resta / 1000);
    cdD.textContent = Math.floor(s / 86400);
    cdH.textContent = Math.floor((s % 86400) / 3600);
    cdM.textContent = Math.floor((s % 3600) / 60);
    cdS.textContent = s % 60;
    setTimeout(tick, 1000);
  }
  tick();
})();