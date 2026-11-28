/**
 * Cover-to-Spine Color Extractor
 * Extracts dominant background & accent colors from a book's coverUrl via offscreen <canvas>,
 * caches results in memory + localStorage, and falls back to a deterministic vintage cloth palette.
 */

const CACHE_KEY = 'chapter_co_spine_palette_cache';

const VINTAGE_PALETTES = [
  { bg: '#713D46', accent: '#E8C59B', border: '#542A31' }, // Burgundy
  { bg: '#59634F', accent: '#DCE4D3', border: '#414939' }, // Olive
  { bg: '#45372F', accent: '#DFC5A4', border: '#2E231E' }, // Espresso
  { bg: '#B97861', accent: '#FCE8DF', border: '#925844' }, // Terracotta
  { bg: '#899581', accent: '#282522', border: '#6A7563' }, // Sage
  { bg: '#3B4856', accent: '#D8CFC2', border: '#29333D' }, // Slate Navy
  { bg: '#6E5060', accent: '#EBD7DF', border: '#513946' }, // Vintage Plum
  { bg: '#C89D9B', accent: '#342B29', border: '#A87D7B' }  // Dusty Rose
];

const memoryCache = new Map();
let storageLoaded = false;

function loadStorageCache() {
  if (storageLoaded) return;
  storageLoaded = true;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      Object.entries(parsed).forEach(([k, v]) => {
        if (v && v.bg) memoryCache.set(k, v);
      });
    }
  } catch {
    // Ignore storage errors
  }
}

function persistCache() {
  try {
    const obj = {};
    // Keep cache bounded to 200 entries
    const entries = Array.from(memoryCache.entries()).slice(-200);
    entries.forEach(([k, v]) => {
      obj[k] = v;
    });
    localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
  } catch {
    // Ignore storage quota errors
  }
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function rgbToHex(r, g, b) {
  const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
  );
}

function hexToRgb(hex) {
  const clean = (hex || '#45372F').replace('#', '');
  const num = parseInt(clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function getLuminance(r, g, b) {
  const toLinear = (c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function getContrastTextColor(bgHex) {
  const { r, g, b } = hexToRgb(bgHex);
  const lum = getLuminance(r, g, b);
  return lum > 0.34 ? '#2B231E' : '#FAF7F2';
}

function darkenHex(hex, amount = 0.22) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

export function getFallbackSpinePalette(book) {
  const seed = `${book?.title || ''}-${book?.genre || ''}`;
  const idx = hashString(seed) % VINTAGE_PALETTES.length;
  const base = VINTAGE_PALETTES[idx];
  return {
    bg: base.bg,
    accent: base.accent,
    border: base.border,
    text: getContrastTextColor(base.bg),
    order: idx,
    source: 'fallback'
  };
}

export function getCachedSpinePalette(book) {
  loadStorageCache();
  if (book?.coverUrl && memoryCache.has(book.coverUrl)) {
    return memoryCache.get(book.coverUrl);
  }
  return getFallbackSpinePalette(book);
}

export function extractCoverPalette(book) {
  loadStorageCache();
  const url = book?.coverUrl;
  if (!url) {
    return Promise.resolve(getFallbackSpinePalette(book));
  }

  if (memoryCache.has(url)) {
    return Promise.resolve(memoryCache.get(url));
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 24;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(getFallbackSpinePalette(book));
          return;
        }

        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        // Quantize pixels into coarse buckets to find dominant background & distinct accent
        const buckets = new Map();
        for (let i = 0; i < data.length; i += 4) {
          const a = data[i + 3];
          if (a < 128) continue;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Quantize by 24
          const qr = Math.round(r / 24) * 24;
          const qg = Math.round(g / 24) * 24;
          const qb = Math.round(b / 24) * 24;
          const key = `${qr},${qg},${qb}`;
          const existing = buckets.get(key);
          if (existing) {
            existing.count += 1;
            existing.rSum += r;
            existing.gSum += g;
            existing.bSum += b;
          } else {
            buckets.set(key, { count: 1, rSum: r, gSum: g, bSum: b });
          }
        }

        const sorted = Array.from(buckets.values()).sort((a, b) => b.count - a.count);
        if (sorted.length === 0) {
          resolve(getFallbackSpinePalette(book));
          return;
        }

        const dom = sorted[0];
        const domR = dom.rSum / dom.count;
        const domG = dom.gSum / dom.count;
        const domB = dom.bSum / dom.count;
        const bgHex = rgbToHex(domR, domG, domB);
        const text = getContrastTextColor(bgHex);

        // Find an accent color sufficiently distinct from dominant
        let accentHex = text === '#FAF7F2' ? '#E5C687' : '#5C3B2E';
        for (let i = 1; i < sorted.length; i += 1) {
          const cand = sorted[i];
          const cr = cand.rSum / cand.count;
          const cg = cand.gSum / cand.count;
          const cb = cand.bSum / cand.count;
          const dist = Math.hypot(cr - domR, cg - domG, cb - domB);
          if (dist > 55) {
            accentHex = rgbToHex(cr, cg, cb);
            break;
          }
        }

        const palette = {
          bg: bgHex,
          accent: accentHex,
          border: darkenHex(bgHex, 0.24),
          text,
          order: Math.round((domR + domG + domB) / 3),
          source: 'extracted'
        };

        memoryCache.set(url, palette);
        persistCache();
        resolve(palette);
      } catch {
        // CORS tainted canvas or other error -> deterministic vintage fallback
        const fallback = getFallbackSpinePalette(book);
        memoryCache.set(url, fallback);
        resolve(fallback);
      }
    };

    img.onerror = () => {
      const fallback = getFallbackSpinePalette(book);
      memoryCache.set(url, fallback);
      resolve(fallback);
    };

    img.src = url;
  });
}
