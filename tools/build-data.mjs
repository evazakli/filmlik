/**
 * filmlik veri derleyicisi
 * movies.json (ham kazınmış veri) -> data/index.js (küçük filtre indeksi) + data/s/<n>.js (parçalı film detayları)
 *
 * Kullanım: node tools/build-data.mjs
 *
 * - Sayfa açılışında 33 MB'lık tek dosya yerine yalnızca ~300 KB'lık sıkıştırılmış indeks yüklenir.
 * - Film detayları 200'erli parçalar (shard) halinde, yalnızca ihtiyaç duyulduğunda yüklenir.
 * - Filmler IMDb puanına göre sıralanır; böylece puan filtresi indeks üzerinde tek bir aralık (slice) olur.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'movies.json');
const OUT_DIR = path.join(ROOT, 'data');
const SHARD_DIR = path.join(OUT_DIR, 's');
const SHARD_SIZE = 200;

const GENRES = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Family', 'Fantasy', 'Film-Noir', 'History',
  'Horror', 'Music', 'Musical', 'Mystery', 'Romance', 'Sci-Fi',
  'Sport', 'Thriller', 'War', 'Western'
];
const IMG_PREFIX = 'https://m.media-amazon.com/images/M/';
const IMG_SUFFIX = '._V1_QL85_UX500_.jpg';

const raw = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const movies = raw.filter(
  (m) => m && m.id && typeof m.r === 'number' && typeof m.img === 'string' &&
    m.img.startsWith(IMG_PREFIX) && m.img.endsWith(IMG_SUFFIX)
);

// Shuffle first, then stable-sort by rating code => random order inside each rating bucket
for (let i = movies.length - 1; i > 0; i--) {
  const j = crypto.randomInt(0, i + 1);
  [movies[i], movies[j]] = [movies[j], movies[i]];
}
const rCode = (m) => Math.max(0, Math.min(100, Math.round(m.r * 10)));
movies.sort((a, b) => rCode(a) - rCode(b));

const N = movies.length;

// Rating bucket start offsets: starts[c] = first index with code >= c (c = 0..101)
const starts = new Array(102).fill(N);
for (let i = N - 1; i >= 0; i--) starts[rCode(movies[i])] = i;
for (let c = 100; c >= 0; c--) starts[c] = Math.min(starts[c], starts[c + 1]);

// Year column (year - 1900, 0 = unknown)
const years = new Uint8Array(N);
// Genre combo dictionary + per-movie combo id (uint16)
const comboMap = new Map();
const combos = [];
const comboIds = new Uint8Array(N * 2);

movies.forEach((m, i) => {
  years[i] = typeof m.y === 'number' ? Math.max(1, Math.min(255, m.y - 1900)) : 0;
  let mask = 0;
  for (const g of m.g || []) {
    const bit = GENRES.indexOf(g);
    if (bit >= 0) mask |= 1 << bit;
  }
  let id = comboMap.get(mask);
  if (id === undefined) {
    id = combos.length;
    comboMap.set(mask, id);
    combos.push(mask);
  }
  comboIds[i] = id & 0xff;
  comboIds[N + i] = id >> 8;
});

if (combos.length > 65535) throw new Error('Too many genre combos');

const version = crypto.createHash('sha1').update(JSON.stringify(movies.map((m) => m.id))).digest('hex').slice(0, 10);

fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(SHARD_DIR, { recursive: true });

const index = {
  v: version,
  n: N,
  s: SHARD_SIZE,
  genres: GENRES,
  starts,
  combos,
  y: Buffer.from(years).toString('base64'),
  c: Buffer.from(comboIds).toString('base64')
};
fs.writeFileSync(
  path.join(OUT_DIR, 'index.js'),
  `(window.__filmlikIndex||(i=>{window.__FILMLIK_INDEX__=i}))(${JSON.stringify(index)});\n`
);

let shardCount = 0;
for (let off = 0; off < N; off += SHARD_SIZE) {
  const slice = movies.slice(off, off + SHARD_SIZE).map((m) => {
    const o = {
      id: m.id,
      t: m.t,
      y: m.y,
      r: m.r,
      m: m.m || undefined,
      g: m.g && m.g.length ? m.g : undefined,
      p: m.p || undefined,
      d: m.d,
      c: m.c,
      i: m.img.slice(IMG_PREFIX.length, -IMG_SUFFIX.length)
    };
    if (m.ot && m.ot !== m.t) o.ot = m.ot;
    return o;
  });
  fs.writeFileSync(path.join(SHARD_DIR, `${shardCount}.js`), `window.__filmlikShard(${shardCount},${JSON.stringify(slice)});\n`);
  shardCount++;
}

const idxKB = (fs.statSync(path.join(OUT_DIR, 'index.js')).size / 1024).toFixed(1);
console.log(`Built ${N} movies -> data/index.js (${idxKB} KB, ${combos.length} genre combos) + ${shardCount} shards. v=${version}`);
