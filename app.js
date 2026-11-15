/**
 * Minimalist & Surprising Random IMDb Movie Selector
 * 100% Unbiased Cryptographic Random Selection
 */

const GENRE_TR_MAP = {
  'Action': 'Aksiyon',
  'Adventure': 'Macera',
  'Animation': 'Animasyon',
  'Biography': 'Biyografi',
  'Comedy': 'Komedi',
  'Crime': 'Suç',
  'Documentary': 'Belgesel',
  'Drama': 'Dram',
  'Family': 'Aile',
  'Fantasy': 'Fantastik',
  'Film-Noir': 'Kara Film',
  'History': 'Tarih',
  'Horror': 'Korku',
  'Music': 'Müzik',
  'Musical': 'Müzikal',
  'Mystery': 'Gizem',
  'Romance': 'Romantik',
  'Sci-Fi': 'Bilim Kurgu',
  'Sport': 'Spor',
  'Thriller': 'Gerilim',
  'War': 'Savaş',
  'Western': 'Western'
};

const GENRE_THEME_PALETTES = {
  'Sci-Fi':    ['oklch(0.78 0.18 205)', 'oklch(0.68 0.22 285)', 'oklch(0.82 0.16 165)'],
  'Horror':    ['oklch(0.68 0.24 25)',  'oklch(0.62 0.22 340)', 'oklch(0.75 0.15 55)'],
  'Action':    ['oklch(0.78 0.20 55)',  'oklch(0.68 0.23 25)',  'oklch(0.76 0.16 215)'],
  'Comedy':    ['oklch(0.82 0.19 85)',  'oklch(0.74 0.20 350)', 'oklch(0.78 0.17 175)'],
  'Fantasy':   ['oklch(0.76 0.20 310)', 'oklch(0.78 0.18 75)',  'oklch(0.74 0.18 210)'],
  'Crime':     ['oklch(0.76 0.18 65)',  'oklch(0.65 0.22 20)',  'oklch(0.72 0.14 235)'],
  'Romance':   ['oklch(0.76 0.20 350)', 'oklch(0.78 0.17 55)',  'oklch(0.74 0.18 295)'],
  'Animation': ['oklch(0.80 0.19 145)', 'oklch(0.76 0.20 65)',  'oklch(0.75 0.19 230)'],
  'Thriller':  ['oklch(0.75 0.18 195)', 'oklch(0.68 0.22 25)',  'oklch(0.78 0.18 85)'],
  'Film-Noir': ['oklch(0.84 0.06 85)',  'oklch(0.70 0.12 55)',  'oklch(0.72 0.08 250)'],
  'Western':   ['oklch(0.77 0.18 60)',  'oklch(0.68 0.19 35)',  'oklch(0.80 0.15 90)']
};

// Discrete display transition feature detection (modern-web-guidance: animate-element-entry-exit)
let supportsDisplayTransition;
function canTransitionDisplay() {
  if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
  if (!window.CSS?.supports?.('transition-behavior', 'allow-discrete') || !document.body) {
    return false;
  }
  const probe = document.createElement('div');
  probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
  document.body.appendChild(probe);
  getComputedStyle(probe).display;
  probe.style.display = 'none';
  supportsDisplayTransition = getComputedStyle(probe).display === 'block';
  probe.remove();
  return supportsDisplayTransition;
}

async function hideElement(el) {
  if (canTransitionDisplay()) {
    el.hidden = true;
  } else {
    el.setAttribute('data-closing', '');
  }
  const animations = el.getAnimations();
  if (animations.length > 0) {
    await Promise.race([
      Promise.allSettled(animations.map((a) => a.finished)),
      new Promise((r) => setTimeout(r, 700))
    ]);
  }
  if (el.hasAttribute('data-closing')) {
    el.removeAttribute('data-closing');
    el.hidden = true;
  }
}

function showElement(el) {
  el.removeAttribute('data-closing');
  el.hidden = false;
}

// Cryptographically uniform random integer in [0, max) with zero modulo bias
function getCryptoRandomInt(max) {
  if (max <= 1) return 0;
  const array = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / max) * max;
  let val;
  do {
    window.crypto.getRandomValues(array);
    val = array[0];
  } while (val >= limit);
  return val % max;
}

// Web Audio API Synthesized Cinema Sound Engine
class CinemaSynth {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playTick(progress = 0) {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = 180 + progress * 440;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.45, now + 0.045);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  playPortalCharge() {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(70, now);
    osc.frequency.exponentialRampToValueAtTime(250, now + 1.4);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.55);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 1.6);
  }

  playRevelationChord() {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [73.42, 110.0, 146.83, 185.0, 220.0, 329.63];

    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = idx < 2 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(f * 0.98, now);
      osc.frequency.exponentialRampToValueAtTime(f, now + 0.16);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(2400, now + 0.32);
      filter.frequency.exponentialRampToValueAtTime(600, now + 1.6);

      const peak = idx < 2 ? 0.055 : 0.04;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(peak, now + 0.07);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 1.65);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.7);
    });
  }
}

// 3D Starfield & Supernova Burst Canvas Engine
class VortexCanvasEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.stars = [];
    this.burstParticles = [];
    this.warpSpeed = 1;
    this.targetWarpSpeed = 1;
    this.pointerX = 0;
    this.pointerY = 0;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.running = true;

    this.resize();
    this.initStars();

    window.addEventListener('resize', () => this.resize());
    document.addEventListener('visibilitychange', () => {
      this.running = !document.hidden;
      if (this.running) requestAnimationFrame(() => this.loop());
    });

    requestAnimationFrame(() => this.loop());
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.cx = this.width / 2;
    this.cy = this.height / 2;
  }

  initStars() {
    const starCount = window.innerWidth < 640 ? 85 : 160;
    this.stars = Array.from({ length: starCount }, () => ({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 2000,
      z: Math.random() * 1500 + 50,
      hue: 45 + Math.random() * 260
    }));
  }

  setWarp(multiplier) {
    this.targetWarpSpeed = this.reducedMotion ? 1 : multiplier;
  }

  triggerBurst() {
    if (this.reducedMotion) return;
    const count = window.innerWidth < 640 ? 55 : 95;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 13;
      this.burstParticles.push({
        x: this.cx,
        y: this.cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.8 + Math.random() * 3.6,
        alpha: 1,
        hue: 35 + Math.random() * 290
      });
    }
  }

  loop() {
    if (!this.running) return;
    const ctx = this.ctx;
    this.warpSpeed += (this.targetWarpSpeed - this.warpSpeed) * 0.14;

    ctx.fillStyle = this.warpSpeed > 3 ? 'rgba(9, 10, 18, 0.25)' : 'rgba(9, 10, 18, 0.45)';
    ctx.fillRect(0, 0, this.width, this.height);

    const stepZ = this.reducedMotion ? 0.4 : 2.2 * this.warpSpeed;

    for (const s of this.stars) {
      const prevZ = s.z;
      s.z -= stepZ;
      if (s.z <= 10) {
        s.x = (Math.random() - 0.5) * 2000;
        s.y = (Math.random() - 0.5) * 2000;
        s.z = 1500;
        continue;
      }

      const sx = this.cx + ((s.x + this.pointerX * 60) / s.z) * 420;
      const sy = this.cy + ((s.y + this.pointerY * 60) / s.z) * 420;
      const px = this.cx + ((s.x + this.pointerX * 60) / prevZ) * 420;
      const py = this.cy + ((s.y + this.pointerY * 60) / prevZ) * 420;

      const size = Math.max(0.6, (1 - s.z / 1500) * 3.2);
      const alpha = Math.min(1, (1 - s.z / 1500) * 0.9);

      ctx.strokeStyle = `hsla(${s.hue}, 85%, 72%, ${alpha})`;
      ctx.lineWidth = size;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(sx, sy);
      ctx.stroke();
    }

    for (let i = this.burstParticles.length - 1; i >= 0; i--) {
      const p = this.burstParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.alpha -= 0.018;
      if (p.alpha <= 0) {
        this.burstParticles.splice(i, 1);
        continue;
      }
      ctx.fillStyle = `hsla(${p.hue}, 95%, 70%, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(() => this.loop());
  }
}

const state = {
  isRolling: false,
  chaosCounter: 0,
  nextPick: null
};

const synth = new CinemaSynth();
let canvasEngine = null;

/* ==========================================================================
   LAZY DATA LAYER
   - data/index.js  : tiny filter index (rating buckets, years, genre combos)
   - data/s/<n>.js  : movie details in shards of 200, loaded only on demand
   Script injection (JSONP-style) works on both file:// and https://.
   ========================================================================== */
const IMG_PREFIX = 'https://m.media-amazon.com/images/M/';
const IMG_FULL = '._V1_QL85_UX500_.jpg';
const IMG_SMALL = '._V1_QL75_UX300_.jpg';

const data = {
  index: null,
  years: null,
  comboIds: null,
  comboMasks: null,
  genreBits: {},
  shards: new Map(),
  shardPromises: new Map(),
  indexPromise: null
};

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => {
      s.remove();
      resolve();
    };
    s.onerror = () => {
      s.remove();
      reject(new Error(`Failed to load ${src}`));
    };
    document.head.appendChild(s);
  });
}

function decodeBase64(b64) {
  if (typeof Uint8Array.fromBase64 === 'function') return Uint8Array.fromBase64(b64);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

window.__filmlikIndex = (idx) => {
  const n = idx.n;
  const comboBytes = decodeBase64(idx.c);
  const comboIds = new Uint16Array(n);
  for (let i = 0; i < n; i++) comboIds[i] = comboBytes[i] | (comboBytes[n + i] << 8);
  data.years = decodeBase64(idx.y);
  data.comboIds = comboIds;
  data.comboMasks = Uint32Array.from(idx.combos);
  idx.genres.forEach((g, bit) => {
    data.genreBits[g] = 1 << bit;
  });
  data.index = idx;
};

if (window.__FILMLIK_INDEX__) {
  window.__filmlikIndex(window.__FILMLIK_INDEX__);
  delete window.__FILMLIK_INDEX__;
}

window.__filmlikShard = (k, movies) => {
  data.shards.set(k, movies);
};

function ensureIndex() {
  if (data.index) return Promise.resolve(data.index);
  if (!data.indexPromise) {
    data.indexPromise = loadScript('data/index.js').then(() => data.index);
    data.indexPromise.catch(() => {
      data.indexPromise = null;
    });
  }
  return data.indexPromise;
}

function loadShard(k) {
  if (data.shards.has(k)) return Promise.resolve(data.shards.get(k));
  if (!data.shardPromises.has(k)) {
    const p = loadScript(`data/s/${k}.js?v=${data.index.v}`).then(() => data.shards.get(k));
    p.catch(() => data.shardPromises.delete(k));
    data.shardPromises.set(k, p);
  }
  return data.shardPromises.get(k);
}

function hydrateMovie(raw, small = false) {
  return {
    ...raw,
    img: IMG_PREFIX + raw.i + (small ? IMG_SMALL : IMG_FULL)
  };
}

async function getMovieAt(globalIndex) {
  const size = data.index.s;
  const k = Math.floor(globalIndex / size);
  const shard = await loadShard(k);
  return { movie: hydrateMovie(shard[globalIndex % size]), shard };
}

function preloadImage(src, priority = 'low') {
  const img = new Image();
  img.decoding = 'async';
  img.fetchPriority = priority;
  img.src = src;
  return img;
}

function runWhenIdle(fn, timeout = 1500) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(fn, { timeout });
  } else {
    setTimeout(fn, 200);
  }
}

function setupPointerInteractions() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return;
  }

  let bodyRect = document.body.getBoundingClientRect();
  const ro = new ResizeObserver(() => {
    bodyRect = document.body.getBoundingClientRect();
  });
  ro.observe(document.body);

  window.addEventListener('pointermove', (e) => {
    const xPct = ((e.clientX - bodyRect.left) / Math.max(1, window.innerWidth)) * 100;
    const yPct = ((e.clientY - bodyRect.top) / Math.max(1, window.innerHeight)) * 100;
    document.documentElement.style.setProperty('--mouse-x', `${xPct.toFixed(1)}%`);
    document.documentElement.style.setProperty('--mouse-y', `${yPct.toFixed(1)}%`);

    if (canvasEngine) {
      canvasEngine.pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      canvasEngine.pointerY = (e.clientY / window.innerHeight - 0.5) * 2;
    }
  });

  const card = document.getElementById('movie-card');
  if (card) {
    let cardRect = null;
    card.addEventListener('pointerenter', () => {
      cardRect = card.getBoundingClientRect();
    });
    card.addEventListener('pointermove', (e) => {
      if (!cardRect) cardRect = card.getBoundingClientRect();
      const relX = (e.clientX - cardRect.left) / cardRect.width;
      const relY = (e.clientY - cardRect.top) / cardRect.height;
      card.style.setProperty('--card-mouse-x', `${(relX * 100).toFixed(1)}%`);
      card.style.setProperty('--card-mouse-y', `${(relY * 100).toFixed(1)}%`);

      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const rotY = (relX - 0.5) * 7;
        const rotX = (0.5 - relY) * 6;
        card.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      }
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
      cardRect = null;
    });
  }
}

function applyMovieTheme(movie) {
  const primaryGenre = movie.g?.[0] || 'Sci-Fi';
  const palette = GENRE_THEME_PALETTES[primaryGenre] || GENRE_THEME_PALETTES['Sci-Fi'];
  const root = document.documentElement;
  root.style.setProperty('--accent-primary', palette[0]);
  root.style.setProperty('--accent-secondary', palette[1]);
  root.style.setProperty('--accent-tertiary', palette[2]);
}

function populateMovieCard(movie) {
  const poster = document.getElementById('movie-poster');
  poster.fetchPriority = 'high';
  poster.src = movie.img;
  poster.alt = `${movie.t} (${movie.y || ''}) film afişi`;

  document.title = 'filmlik';

  const titleLink = document.getElementById('movie-title-link');
  const imdbUrl = `https://www.imdb.com/title/${movie.id}/`;
  titleLink.textContent = movie.t;
  titleLink.href = imdbUrl;

  const origEl = document.getElementById('movie-original-title');
  if (movie.ot && movie.ot !== movie.t) {
    origEl.textContent = movie.ot;
    origEl.hidden = false;
  } else {
    origEl.hidden = true;
  }

  document.getElementById('movie-rating-chip').textContent = `★ ${movie.r ? movie.r.toFixed(1) : '—'}`;
  document.getElementById('movie-year-chip').textContent = String(movie.y || '—');
  document.getElementById('movie-runtime-chip').textContent = movie.m ? `${movie.m} dk` : '—';

  const genresList = document.getElementById('movie-genres-list');
  const genresFrag = document.createDocumentFragment();
  for (const g of movie.g || []) {
    const li = document.createElement('li');
    li.className = 'genre-pill';
    li.textContent = GENRE_TR_MAP[g] || g;
    genresFrag.appendChild(li);
  }
  genresList.replaceChildren(genresFrag);

  const plotEl = document.getElementById('movie-plot-text');
  plotEl.textContent = movie.p || '';
  plotEl.hidden = !movie.p;

  document.getElementById('movie-director-text').textContent =
    movie.d?.length ? movie.d.join(', ') : '—';
  document.getElementById('movie-cast-text').textContent =
    movie.c?.length ? movie.c.join(', ') : '—';

  document.getElementById('imdb-external-btn').href = imdbUrl;
}

// Pure Visual Spectacle 1: 3D Poster Vortex Tunnel (Mobile-Responsive Spread)
async function runVortexSpectacle(visualBox, chosenMovie, decoys) {
  const frag = document.createDocumentFragment();
  const posterNodes = decoys.slice(0, 9).map((m) => {
    const img = document.createElement('img');
    img.className = 'flying-poster';
    img.decoding = 'async';
    img.fetchPriority = 'low';
    img.src = m.img;
    img.alt = '';
    frag.appendChild(img);
    return img;
  });
  visualBox.replaceChildren(frag);

  const vw = window.innerWidth;
  const spreadX = Math.min(95, Math.max(32, vw * 0.11));
  const spreadZ = Math.min(130, Math.max(60, vw * 0.15));

  const totalSteps = 14;
  for (let step = 0; step < totalSteps; step++) {
    synth.playTick(step / totalSteps);
    posterNodes.forEach((img, idx) => {
      const offset = ((idx + step) % posterNodes.length) - 4;
      const z = offset * spreadZ;
      const x = offset * spreadX;
      const rotY = offset * -14;
      const scale = Math.max(0.48, 1 - Math.abs(offset) * 0.13);
      img.style.transform = `translate3d(${x.toFixed(1)}px, 0px, ${z.toFixed(1)}px) rotateY(${rotY}deg) scale(${scale})`;
      img.style.opacity = String(Math.max(0.14, 1 - Math.abs(offset) * 0.22));
    });
    await new Promise((r) => setTimeout(r, 70 + step * 7));
  }

  posterNodes.forEach((img, idx) => {
    if (idx === 4) {
      img.src = chosenMovie.img;
      img.style.transform = 'translate3d(0px, 0px, 120px) rotateY(0deg) scale(1.22)';
      img.style.opacity = '1';
      img.style.borderColor = 'var(--accent-primary)';
    } else {
      img.style.opacity = '0';
      img.style.filter = 'blur(6px)';
    }
  });
}

// Pure Visual Spectacle 2: 3D Holographic Tarot Flip
async function runTarotSpectacle(visualBox, chosenMovie, decoys) {
  const deck = document.createElement('div');
  deck.className = 'tarot-deck-stage';

  const cards = [];
  const winSlot = 2;
  for (let i = 0; i < 5; i++) {
    const card = document.createElement('div');
    card.className = 'tarot-fate-card';
    const movieForSlot = i === winSlot ? chosenMovie : decoys[i];
    card.innerHTML = `
      <div class="tarot-face tarot-back"></div>
      <div class="tarot-face tarot-front">
        <img src="${movieForSlot.img}" alt="" decoding="async" fetchpriority="low">
      </div>
    `;
    deck.appendChild(card);
    cards.push(card);
  }
  visualBox.replaceChildren(deck);

  const waveAmp = window.innerWidth < 640 ? 18 : 30;
  for (let step = 0; step < 12; step++) {
    synth.playTick(step / 12);
    cards.forEach((c, idx) => {
      const wave = Math.sin((step + idx) * 1.35) * waveAmp;
      const rotZ = (idx - 2) * 5 + Math.cos(step + idx) * 8;
      c.style.transform = `translateY(${wave.toFixed(1)}px) rotateZ(${rotZ.toFixed(1)}deg) rotateY(${step % 2 === 0 ? 16 : -16}deg)`;
    });
    await new Promise((r) => setTimeout(r, 90));
  }

  cards.forEach((c, idx) => {
    c.style.transform = '';
    if (idx === winSlot) {
      c.classList.add('Chosen-Card');
    } else {
      c.classList.add('Dimmed-Card');
    }
  });
}

// Pure Visual Spectacle 3: Quantum Rift Reality Fracture
async function runRiftSpectacle(visualBox, chosenMovie, decoys) {
  const chamber = document.createElement('div');
  chamber.className = 'rift-chamber';
  chamber.innerHTML = `
    <div class="rift-ring-wave"></div>
    <div class="rift-portal-core">
      <img id="rift-core-img" src="${decoys[0].img}" alt="" decoding="async" fetchpriority="low">
    </div>
  `;
  visualBox.replaceChildren(chamber);
  const coreImg = document.getElementById('rift-core-img');

  for (let step = 0; step < 15; step++) {
    synth.playTick(step / 15);
    coreImg.src = decoys[step % decoys.length].img;
    await new Promise((r) => setTimeout(r, 65 + step * 6));
  }

  coreImg.src = chosenMovie.img;
}

function populateYearSelects() {
  const fromEl = document.getElementById('year-from-select');
  const toEl = document.getElementById('year-to-select');
  if (!fromEl || !toEl) return;

  const minYear = 1915;
  const maxYear = 2027;

  const fromFrag = document.createDocumentFragment();
  for (let y = minYear; y <= maxYear; y++) {
    const opt = document.createElement('option');
    opt.value = String(y);
    opt.textContent = String(y);
    if (y === minYear) opt.selected = true;
    fromFrag.appendChild(opt);
  }
  fromEl.replaceChildren(fromFrag);

  const toFrag = document.createDocumentFragment();
  for (let y = maxYear; y >= minYear; y--) {
    const opt = document.createElement('option');
    opt.value = String(y);
    opt.textContent = String(y);
    if (y === maxYear) opt.selected = true;
    toFrag.appendChild(opt);
  }
  toEl.replaceChildren(toFrag);

  fromEl.addEventListener('change', () => {
    const fromVal = Number(fromEl.value) || minYear;
    const toVal = Number(toEl.value) || maxYear;
    if (fromVal > toVal) {
      toEl.value = String(fromVal);
    }
  });

  toEl.addEventListener('change', () => {
    const fromVal = Number(fromEl.value) || minYear;
    const toVal = Number(toEl.value) || maxYear;
    if (toVal < fromVal) {
      fromEl.value = String(toVal);
    }
  });
}

function formatRatingLabel(val) {
  if (val === 0) return '0';
  if (val === 10) return '10';
  return val.toFixed(1);
}

function setupRatingRangeSliders() {
  const stage = document.getElementById('rating-slider-stage');
  const minSlider = document.getElementById('rating-min-slider');
  const maxSlider = document.getElementById('rating-max-slider');
  const minBadge = document.getElementById('rating-min-badge');
  const maxBadge = document.getElementById('rating-max-badge');
  if (!stage || !minSlider || !maxSlider || !minBadge || !maxBadge) return;

  const syncSliders = (activeWhich) => {
    let minVal = parseFloat(minSlider.value);
    let maxVal = parseFloat(maxSlider.value);
    if (Number.isNaN(minVal)) minVal = 7.0;
    if (Number.isNaN(maxVal)) maxVal = 10.0;

    if (activeWhich === 'min' && minVal > maxVal) {
      minVal = maxVal;
      minSlider.value = String(minVal);
    } else if (activeWhich === 'max' && maxVal < minVal) {
      maxVal = minVal;
      maxSlider.value = String(maxVal);
    }

    const minRatio = minVal / 10;
    const maxRatio = maxVal / 10;
    stage.style.setProperty('--min-ratio', minRatio.toFixed(3));
    stage.style.setProperty('--max-ratio', maxRatio.toFixed(3));
    stage.style.setProperty('--min-pct', `${(minRatio * 100).toFixed(1)}%`);
    stage.style.setProperty('--max-pct', `${(maxRatio * 100).toFixed(1)}%`);
    stage.dataset.badgesClose = maxVal - minVal < 1.3 ? 'true' : 'false';

    const minText = formatRatingLabel(minVal);
    const maxText = formatRatingLabel(maxVal);
    minBadge.textContent = minText;
    maxBadge.textContent = maxText;
    minSlider.setAttribute('aria-valuetext', `En düşük puan ${minText}`);
    maxSlider.setAttribute('aria-valuetext', `En yüksek puan ${maxText}`);

    // If both thumbs are pushed to the right edge, keep min thumb on top so user can drag it left
    if (minVal > 8.5) {
      minSlider.style.zIndex = '4';
      maxSlider.style.zIndex = '3';
    } else {
      minSlider.style.zIndex = '3';
      maxSlider.style.zIndex = '4';
    }
  };

  minSlider.addEventListener('input', () => syncSliders('min'));
  maxSlider.addEventListener('input', () => syncSliders('max'));

  // Smart pointer proximity so tapping/dragging anywhere on the line grabs the nearest thumb
  const prioritizeClosestThumb = (clientX) => {
    const rect = stage.getBoundingClientRect();
    if (!rect.width) return;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const targetScore = Math.round(ratio * 100) / 10;
    const minVal = parseFloat(minSlider.value) || 0;
    const maxVal = parseFloat(maxSlider.value) || 10;
    const distMin = Math.abs(targetScore - minVal);
    const distMax = Math.abs(targetScore - maxVal);

    if (distMin < distMax || (distMin === distMax && targetScore < minVal)) {
      minSlider.style.zIndex = '4';
      maxSlider.style.zIndex = '3';
    } else {
      maxSlider.style.zIndex = '4';
      minSlider.style.zIndex = '3';
    }
  };

  stage.addEventListener('pointermove', (e) => {
    if (e.buttons === 0) {
      prioritizeClosestThumb(e.clientX);
    }
  });

  stage.addEventListener('pointerdown', (e) => {
    prioritizeClosestThumb(e.clientX);
    if (e.target === stage) {
      const rect = stage.getBoundingClientRect();
      if (!rect.width) return;
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const tappedVal = Math.round(ratio * 100) / 10;
      const minVal = parseFloat(minSlider.value) || 0;
      const maxVal = parseFloat(maxSlider.value) || 10;
      if (Math.abs(tappedVal - minVal) <= Math.abs(tappedVal - maxVal)) {
        minSlider.value = String(Math.min(tappedVal, maxVal));
        syncSliders('min');
      } else {
        maxSlider.value = String(Math.max(tappedVal, minVal));
        syncSliders('max');
      }
    }
  });

  syncSliders();
}

function readFilters() {
  const selectEl = document.getElementById('genre-select');
  const fromEl = document.getElementById('year-from-select');
  const toEl = document.getElementById('year-to-select');
  const minRatingEl = document.getElementById('rating-min-slider');
  const maxRatingEl = document.getElementById('rating-max-slider');

  const genre = (selectEl && selectEl.value) || 'all';
  const y1 = Number(fromEl?.value) || 1915;
  const y2 = Number(toEl?.value) || 2027;
  const r1 = parseFloat(minRatingEl?.value);
  const r2 = parseFloat(maxRatingEl?.value);
  const rA = Number.isNaN(r1) ? 7.0 : r1;
  const rB = Number.isNaN(r2) ? 10.0 : r2;

  const f = {
    genre,
    minYear: Math.min(y1, y2),
    maxYear: Math.max(y1, y2),
    minCode: Math.round(Math.min(rA, rB) * 10),
    maxCode: Math.round(Math.max(rA, rB) * 10)
  };
  f.key = `${f.genre}|${f.minYear}-${f.maxYear}|${f.minCode}-${f.maxCode}`;
  return f;
}

// Builds the candidate pool as global indices using the compact index (no movie details needed).
// Movies are sorted by rating in the index, so the rating filter is a single contiguous slice.
function buildPool(f) {
  const { starts, n } = data.index;
  const lo = starts[Math.max(0, Math.min(101, f.minCode))];
  const hi = starts[Math.max(0, Math.min(101, f.maxCode + 1))];
  const years = data.years;
  const comboIds = data.comboIds;
  const masks = data.comboMasks;
  const bit = f.genre !== 'all' ? data.genreBits[f.genre] || 0 : 0;
  const yLo = f.minYear - 1900;
  const yHi = f.maxYear - 1900;

  const genreOk = (i) => !bit || (masks[comboIds[i]] & bit) !== 0;
  const yearOk = (i) => years[i] !== 0 && years[i] >= yLo && years[i] <= yHi;
  const collect = (from, to, test) => {
    const out = [];
    for (let i = from; i < to; i++) if (test(i)) out.push(i);
    return out;
  };

  // Exact: rating + year + genre
  let test = (i) => yearOk(i) && genreOk(i);
  let indices = collect(lo, hi, test);

  // Fallback 1: rating + genre
  if (!indices.length) {
    test = genreOk;
    indices = collect(lo, hi, test);
  }
  // Fallback 2: rating only
  if (!indices.length && hi > lo) {
    test = () => true;
    indices = collect(lo, hi, test);
  }
  // Fallback 3: everything
  if (!indices.length) {
    indices = collect(0, n, () => true);
    return { indices, matches: () => true };
  }
  return { indices, matches: (i) => i >= lo && i < hi && test(i) };
}

function pickDecoys(shard, shardOffset, chosenIndex, matches, count = 10) {
  const preferred = [];
  const others = [];
  for (let j = 0; j < shard.length; j++) {
    const gi = shardOffset + j;
    if (gi === chosenIndex) continue;
    (matches(gi) ? preferred : others).push(j);
  }
  const out = [];
  const take = (list) => {
    while (out.length < count && list.length) {
      const k = getCryptoRandomInt(list.length);
      out.push(hydrateMovie(shard[list[k]], true));
      list[k] = list[list.length - 1];
      list.pop();
    }
  };
  take(preferred);
  take(others);
  return out;
}

// 100% unbiased cryptographic uniform pick from the filtered pool, then load only its shard.
async function preparePick(f) {
  await ensureIndex();
  const pool = buildPool(f);
  const globalIndex = pool.indices[getCryptoRandomInt(pool.indices.length)];
  const { movie, shard } = await getMovieAt(globalIndex);
  const offset = Math.floor(globalIndex / data.index.s) * data.index.s;
  const decoys = pickDecoys(shard, offset, globalIndex, pool.matches);
  return { key: f.key, movie, decoys };
}

const DECOYS_PER_MODE = { vortex: 9, tarot: 5, rift: 10 };
const SPECTACLE_MODES = ['vortex', 'tarot', 'rift'];

// Pre-pick the next random film in the background so the next tap is instant.
let warmTimer = 0;
function warmNextPick(delay = 0) {
  clearTimeout(warmTimer);
  warmTimer = setTimeout(() => {
    runWhenIdle(async () => {
      if (state.isRolling) return;
      const f = readFilters();
      if (state.nextPick && state.nextPick.key === f.key) return;
      const promise = preparePick(f);
      state.nextPick = { key: f.key, promise };
      try {
        const pick = await promise;
        if (state.nextPick?.promise !== promise) return;
        preloadImage(pick.movie.img);
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          const mode = SPECTACLE_MODES[state.chaosCounter % SPECTACLE_MODES.length];
          pick.decoys.slice(0, DECOYS_PER_MODE[mode]).forEach((d) => preloadImage(d.img));
        }
      } catch (err) {
        if (state.nextPick?.promise === promise) state.nextPick = null;
      }
    });
  }, delay);
}

async function resolvePick(f) {
  const reusable = state.nextPick && state.nextPick.key === f.key ? state.nextPick.promise : null;
  state.nextPick = null;
  if (reusable) {
    try {
      return await reusable;
    } catch {
      /* fall through to a fresh pick */
    }
  }
  return preparePick(f);
}

async function triggerRandomMovieRoll() {
  if (state.isRolling) return;
  state.isRolling = true;

  // Subtle mobile haptic feedback on tap
  try {
    navigator.vibrate?.(18);
  } catch {}

  const portalZone = document.getElementById('portal-trigger-zone');
  const rollBtn = document.getElementById('roll-movie-btn');
  const rerollBtn = document.getElementById('reroll-btn');
  rollBtn.disabled = true;
  if (rerollBtn) rerollBtn.disabled = true;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const artifactWrapper = document.getElementById('movie-artifact-wrapper');
  const spectacleStage = document.getElementById('spectacle-stage');
  const visualBox = document.getElementById('spectacle-visual-box');
  const filters = readFilters();

  // Hide the initial big button once clicked
  portalZone.hidden = true;

  if (window.scrollY > 40) {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  if (!reducedMotion) {
    if (!artifactWrapper.hidden) {
      await hideElement(artifactWrapper);
    }
    spectacleStage.hidden = false;
    spectacleStage.classList.remove('flare-active');
    visualBox.innerHTML = '';
    if (canvasEngine) canvasEngine.setWarp(24);
    synth.playPortalCharge();
  }

  let pick;
  try {
    pick = await resolvePick(filters);
  } catch (err) {
    console.error('Film verisi yüklenemedi:', err);
    spectacleStage.hidden = true;
    if (canvasEngine) canvasEngine.setWarp(1);
    if (artifactWrapper.hidden) portalZone.hidden = false;
    rollBtn.disabled = false;
    if (rerollBtn) rerollBtn.disabled = false;
    state.isRolling = false;
    return;
  }

  const chosenMovie = pick.movie;
  const decoys = pick.decoys;
  preloadImage(chosenMovie.img, 'high');

  if (!reducedMotion) {
    const mode = SPECTACLE_MODES[state.chaosCounter % SPECTACLE_MODES.length];
    state.chaosCounter++;

    if (mode === 'tarot') {
      await runTarotSpectacle(visualBox, chosenMovie, decoys);
    } else if (mode === 'rift') {
      await runRiftSpectacle(visualBox, chosenMovie, decoys);
    } else {
      await runVortexSpectacle(visualBox, chosenMovie, decoys);
    }

    applyMovieTheme(chosenMovie);
    spectacleStage.classList.add('flare-active');
    synth.playRevelationChord();
    try {
      navigator.vibrate?.([22, 45, 35]);
    } catch {}
    if (canvasEngine) {
      canvasEngine.setWarp(1);
      canvasEngine.triggerBurst();
    }

    await new Promise((r) => setTimeout(r, 480));
    spectacleStage.hidden = true;
    visualBox.innerHTML = '';
  } else {
    applyMovieTheme(chosenMovie);
  }

  const updateDOM = () => {
    populateMovieCard(chosenMovie);
    showElement(artifactWrapper);
  };

  if (document.startViewTransition && !reducedMotion) {
    const vt = document.startViewTransition(() => updateDOM());
    vt.finished.finally(() => {
      document.getElementById('movie-title-heading')?.focus({ preventScroll: true });
    });
  } else {
    updateDOM();
    document.getElementById('movie-title-heading')?.focus({ preventScroll: true });
  }

  rollBtn.disabled = false;
  if (rerollBtn) rerollBtn.disabled = false;
  state.isRolling = false;

  // Quietly prepare the next random film for an instant re-roll
  warmNextPick(1200);
}

function initApp() {
  canvasEngine = new VortexCanvasEngine(document.getElementById('vortex-canvas'));
  setupPointerInteractions();
  populateYearSelects();
  setupRatingRangeSliders();

  const rollBtn = document.getElementById('roll-movie-btn');
  const genreSelect = document.getElementById('genre-select');
  rollBtn.disabled = false;

  // Start fetching the small filter index right away (non-blocking), then pre-pick a film when idle
  ensureIndex()
    .then(() => warmNextPick())
    .catch((err) => console.error('Film indeksi yüklenemedi:', err));

  genreSelect?.addEventListener('change', () => {
    const g = genreSelect.value;
    if (g && g !== 'all') {
      applyMovieTheme({ g: [g] });
    }
  });

  // Re-warm the pre-picked film whenever filters change
  for (const id of ['genre-select', 'year-from-select', 'year-to-select', 'rating-min-slider', 'rating-max-slider']) {
    document.getElementById(id)?.addEventListener('change', () => warmNextPick(500));
  }

  rollBtn.addEventListener('click', triggerRandomMovieRoll);
  document.getElementById('reroll-btn')?.addEventListener('click', triggerRandomMovieRoll);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
