'use strict';

/* ---------- Helfer ---------- */
const $ = (s, el = document) => el.querySelector(s);
const view = $('#view');
const sheet = $('#sheet');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const DAY = 86400000;
const today = () => new Date(new Date().toDateString());
const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const fmtDate = s => new Date(s + 'T00:00').toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });

// Toasts sprechen immer mit Namen an: auf Mamas Seiten sie, auf Papas Seiten ihn, sonst beide
function toastName() {
  const s = state.settings, aud = (typeof PAGE_AUDIENCE !== 'undefined' && PAGE_AUDIENCE[location.hash.replace(/^#\//, '') || 'home']) || 'together', m = (s.mama || '').trim(), p = (s.partner || '').trim();
  if (aud === 'mama') return m || 'Mama';
  if (aud === 'papa') return p || 'Papa';
  return m && p ? `${m} und ${p}` : (m || p || 'ihr');
}
// Hängt die Anrede mit Namen an den Satz: "Lies ein Kapitel." wird zu "Lies ein Kapitel, Norbert."
function addName(msg, name) {
  const m = String(msg).trim();
  if (!name || m.includes(name)) return m;
  const parts = m.match(/^([\s\S]*?)([.!?…]*)$/), body = parts[1].replace(/[\s,]+$/, ''), end = parts[2] || '.';
  return `${body}, ${name}${end}`;
}
const personalize = msg => addName(msg, toastName());
// Papa-Texte sprechen den Mann mit Namen an
const papaName = t => addName(t, (state.settings.partner || '').trim() || 'Papa');
/* ---------- Anrede: "Mama"/"Papa" sind frei wählbar (z. B. Mutti, Vati) und gelten für alle sichtbaren Texte ---------- */
const TITLE_MAX = 20;
const cleanTitle = v => String(v || '').replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u2028-\u202E]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, TITLE_MAX);
const titleKey = who => who === 'mama' ? 'mamaTitle' : 'partnerTitle';
const roleTitle = who => cleanTitle(state.settings[titleKey(who)]) || (who === 'mama' ? 'Mama' : 'Papa');
const hasTitles = () => roleTitle('mama') !== 'Mama' || roleTitle('partner') !== 'Papa';
// Ersetzt die Wörter Mama/Papa (auch Mamas, Papa-Kapitän); html=true entschärft den Titel für HTML-Dokumente
const retitleStr = (t, html) => {
  if (!t || !hasTitles()) return t;
  const e = html ? esc : x => x, m = e(roleTitle('mama')), p = e(roleTitle('partner'));
  return String(t).replace(/\b(Mama|Papa)(s?)\b/g, (_, w, g) => (w === 'Mama' ? m : p) + g);
};
const rtText = new WeakMap(), rtAttr = new WeakMap(), RT_ATTRS = ['aria-label', 'title', 'placeholder', 'alt'];
function retitleAttrs(n) {
  for (const a of RT_ATTRS) {
    if (!n.hasAttribute(a)) continue;
    const all = rtAttr.get(n) || {}, rec = all[a], cur = n.getAttribute(a), src = rec && cur === rec.out ? rec.orig : cur, out = retitleStr(src);
    if (out !== cur) n.setAttribute(a, out);
    if (out !== src) { all[a] = { orig: src, out }; rtAttr.set(n, all); } else if (rec) delete all[a];
  }
}
function retitleNode(n) {
  if (!n) return;
  if (n.nodeType === 3) {
    if (/^(SCRIPT|STYLE|TEXTAREA)$/.test(n.parentNode ? n.parentNode.nodeName : '')) return;
    const cur = n.nodeValue, rec = rtText.get(n), src = rec && cur === rec.out ? rec.orig : cur, out = retitleStr(src);
    if (out !== cur) n.nodeValue = out;
    if (out !== src) rtText.set(n, { orig: src, out }); else if (rec) rtText.delete(n);
    return;
  }
  if (n.nodeType !== 1 || /^(SCRIPT|STYLE)$/.test(n.nodeName)) return;
  retitleAttrs(n); n.childNodes.forEach(retitleNode);
}
const retitleAll = () => retitleNode(document.body);
let rtObs;
function startRetitle() {
  if (rtObs) return;
  rtObs = new MutationObserver(ms => {
    if (!hasTitles()) return;
    for (const m of ms) {
      if (m.type === 'childList') m.addedNodes.forEach(retitleNode);
      else if (m.type === 'characterData') retitleNode(m.target);
      else retitleAttrs(m.target);
    }
  });
  rtObs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: RT_ATTRS });
}
// Bestätigungen lassen sich abschalten (Einstellungen). Probleme und Fehler melden sich immer.
const TOAST_ALWAYS = /fehlgeschlagen|konnte|nicht |ungültig|höchstens|mindestens|bitte|fehler|voll|kein /i;
function toast(msg) {
  if (state.settings.toasts !== true && !TOAST_ALWAYS.test(String(msg))) return;
  const t = $('#toast');
  t.textContent = personalize(msg); t.classList.add('show');
  clearTimeout(toast.id); toast.id = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ---------- Speicher: Daten in localStorage, Bilder in IndexedDB (nur lokal) ---------- */
const KEY = 'babylove:v1';
const emptyState = () => ({
  settings: { dueDate: '', nick: 'Krümel', secretName: '', mama: '', partner: '', theme: 'mauve', mode: 'auto' },
  diary: [], photos: [], todos: DEFAULT_TODOS.map(text => ({ id: uid(), text, done: false })), appts: [],
  together: {}, letters: [], names: [], wishes: [], lists: {}, water: {}, waterGoal: 8, vits: [], vitLog: {}, contacts: [], pass: [], baby: [], sleepStart: null,
  milestones: MEILENSTEINE.map(([id, title, icon]) => ({ id, title, icon, date: '', note: '', photoId: null }))
});
let state = (() => {
  try { return Object.assign(emptyState(), JSON.parse(localStorage.getItem(KEY)) || {}); }
  catch { return emptyState(); }
})();
const save = () => {
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch { toast('Speichern fehlgeschlagen – Speicher voll?'); }
};

const idb = new Promise((res, rej) => {
  const r = indexedDB.open('babylove', 1);
  r.onupgradeneeded = () => r.result.createObjectStore('img');
  r.onsuccess = () => res(r.result);
  r.onerror = () => rej(r.error);
});
const idbOp = async (mode, fn) => {
  const db = await idb;
  return new Promise((res, rej) => {
    const req = fn(db.transaction('img', mode).objectStore('img'));
    req.onsuccess = () => res(req.result); req.onerror = () => rej(req.error);
  });
};
const putImg = (id, blob) => idbOp('readwrite', s => s.put(blob, id));
const getImg = id => idbOp('readonly', s => s.get(id));
const delImg = id => idbOp('readwrite', s => s.delete(id));

// Jedes hochgeladene Bild wird automatisch komprimiert: längste Seite höchstens max Pixel, JPEG, bei großen Dateien stufenweise stärker
// (Ziel: höchstens targetKB). Weiße Fläche statt Schwarz bei Transparenz; ein bereits kleineres Original bleibt unverändert.
const decodeImage = async file => {
  try { return await createImageBitmap(file); }
  catch { const url = URL.createObjectURL(file); try { const img = new Image(); img.src = url; await img.decode(); return img; } finally { URL.revokeObjectURL(url); } }
};
async function shrink(file, max = 1280, targetKB = 350, square = false) {
  const bmp = await decodeImage(file), w0 = bmp.width || bmp.naturalWidth, h0 = bmp.height || bmp.naturalHeight;
  // Quadrat (für Profilbilder): mittig zuschneiden, bei Hochformat etwas nach oben verschoben, damit das Gesicht erhalten bleibt
  const side = Math.min(w0, h0), sx = square ? (w0 - side) / 2 : 0, sy = square ? (h0 - side) * 0.3 : 0, sw = square ? side : w0, sh = square ? side : h0;
  let dim = Math.min(max, Math.max(sw, sh)), q = 0.82, blob = null;
  for (let i = 0; i < 4; i++) {
    const k = Math.min(1, dim / Math.max(sw, sh)), c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(sw * k)); c.height = Math.max(1, Math.round(sh * k));
    const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(bmp, sx, sy, sw, sh, 0, 0, c.width, c.height);
    blob = await new Promise(r => c.toBlob(r, 'image/jpeg', q));
    if (!blob || blob.size <= targetKB * 1024) break;
    q = Math.max(0.55, q - 0.08); dim = Math.round(dim * 0.85);
  }
  if (!blob) throw new Error('Bild konnte nicht komprimiert werden');
  return !square && file.type === 'image/jpeg' && Math.max(w0, h0) <= max && file.size <= blob.size ? file : blob;
}
async function storeFile(file) {
  const id = uid();
  await putImg(id, await shrink(file));
  return id;
}
const urls = new Map();
async function hydrateImages(root = view) {
  for (const img of root.querySelectorAll('img[data-img],audio[data-aud]')) {
    const id = img.dataset.img || img.dataset.aud;
    if (!urls.has(id)) { const b = await getImg(id); if (b) urls.set(id, URL.createObjectURL(b)); }
    if (urls.has(id)) img.src = urls.get(id);
  }
  for (const el of root.querySelectorAll('[data-bg]')) {
    const id = el.dataset.bg; if (!urls.has(id)) { const b = await getImg(id); if (b) urls.set(id, URL.createObjectURL(b)); }
    if (urls.has(id)) el.style.setProperty('--hero-img', `url("${urls.get(id)}")`);
  }
}

/* ---------- Schwangerschaftsberechnung ---------- */
function pregnancy() {
  const due = state.settings.dueDate;
  if (!due) return null;
  const left = Math.round((new Date(due + 'T00:00') - today()) / DAY);
  const elapsed = 280 - left;
  const weeks = Math.floor(elapsed / 7), days = ((elapsed % 7) + 7) % 7;
  return { left, elapsed, weeks, days, pct: Math.max(0, Math.min(100, elapsed / 2.8)) };
}
const trimester = w => w < 14 ? 1 : w < 28 ? 2 : 3;
const weekFor = dateStr => {
  if (!state.settings.dueDate) return null;
  const e = 280 - Math.round((new Date(state.settings.dueDate + 'T00:00') - new Date(dateStr + 'T00:00')) / DAY);
  return e >= 0 ? Math.floor(e / 7) : null;
};
const fruitFor = w => FRUITS[Math.min(42, Math.max(4, w))] || FRUITS[4];
// Tagestext: wirkt zufällig, bleibt aber den ganzen Tag gleich und wechselt täglich (nie zweimal derselbe in Folge)
const hashStr = s => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
function dailyPickAt(pool, salt, date, depth = 0) {
  const i = hashStr(date + '|' + salt) % pool.length;
  if (pool.length < 2 || depth > 8) return pool[i];
  const prev = iso(new Date(new Date(date + 'T00:00').getTime() - DAY));
  return pool[i] === dailyPickAt(pool, salt, prev, depth + 1) ? pool[(i + 1) % pool.length] : pool[i];
}
const dailyPick = (pool, salt = '') => dailyPickAt(pool, salt, iso(today()));
const dailyMsg = () => dailyPick(quotePool('daily'), 'daily');
// "ca. 52 Tage" statt Prozentzahlen: freundlich, täglich wechselnde Sätze
const daysTxt = n => `ca. ${n} ${n === 1 ? 'Tag' : 'Tage'}`;
const tagenTxt = n => `ca. ${n} ${n === 1 ? 'Tag' : 'Tagen'}`;
function dayLine(who, p) {
  const pool = p.left > 0 ? (who === 'papa' ? DAYS_PAPA : DAYS_MAMA) : (who === 'papa' ? DAYS_AFTER_PAPA : DAYS_AFTER_MAMA);
  return dailyPick(pool, 'days-' + who).replace('{days}', daysTxt(p.left)).replace('{tagen}', tagenTxt(p.left)).replace(/\{kid\}/g, state.settings.nick || 'Baby');
}
const todayLong = () => today().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const pick = a => a[Math.floor(Math.random() * a.length)];
// Motivierender Toast; kind wählt den Pool (save, add, done, water, style, fav, photo)
const cheer = (kind = 'save') => toast(pick((typeof CHEER_POOLS !== 'undefined' && CHEER_POOLS[kind]) || CHEERS));
// Zufälliger Partner-Spruch aus einem "Beutel": erst wenn alle einmal dran waren, wird neu gemischt (kein direkter Wiederholer)
let partnerBag = [], lastPartner = -1, partnerBagSize = 0;
const partnerMsg = () => {
  const pool = quotePool('papa');
  if (!partnerBag.length || partnerBagSize !== pool.length) {
    partnerBagSize = pool.length; partnerBag = pool.map((_, i) => i).sort(() => Math.random() - .5);
    if (partnerBag.length > 1 && partnerBag[partnerBag.length - 1] === lastPartner) partnerBag.unshift(partnerBag.pop());
  }
  lastPartner = partnerBag.pop();
  return pool[lastPartner];
};
// Spruch des Tages für den Papa: wechselt täglich, bleibt am Tag stabil (zusätzlich per Icon zufällig erneuerbar)
const partnerMsgToday = () => dailyPick(quotePool('papa'), 'papa');
const nick = () => esc(state.settings.nick || 'Baby');
// Namen von Mama, Papa und Kind unter jeder Überschrift; ziehen beim Tippen der Namen sofort mit (data-name, data-kid)
const nmHeart = k => `<i class="bi bi-heart-fill nm-heart" style="color:var(--heart-${k})" aria-hidden="true"></i>`;
const namesTag = () => { const s = state.settings;
  return `<span class="aud-names"><span class="nm">${nmHeart('mama')}<span data-name="mama" data-fallback="Mama">${esc(s.mama || 'Mama')}</span></span> <span class="nm">${nmHeart('papa')}<span data-name="partner" data-fallback="Papa">${esc(s.partner || 'Papa')}</span></span> <span class="nm">${nmHeart('kid')}<span data-kid>${esc(s.nick || 'Baby')}</span></span></span>`; };

/* ---------- Theme ---------- */
const hexToHsl = hex => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  let h = 0, s = 0;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h = Math.round(h * 60 + 360) % 360;
  }
  return [h, Math.round(s * 100), Math.round(l * 100)];
};
// Hell: Werte aus THEME_DEFS. Dunkel: aus dem Farbton der Primärfarbe abgeleitet (helle Primärfarbe, dunkle Schrift darauf).
// Eigene Farbkombination: Hauptfarbe, Akzent und Hintergrund-Ton frei wählbar. Texte und Flächen werden automatisch so berechnet, dass sie gut lesbar bleiben.
const themeDef = id => id === 'custom' ? customThemeDef() : (THEME_DEFS[id] || THEME_DEFS.mauve);
const CUSTOM_DEFAULT = { primary: '#A0537A', accent: '#E3B27A', bg: '#FAF3F6' };
const customColors = () => { const c = state.settings.customTheme || {}; return { primary: isHex(c.primary) ? c.primary.toUpperCase() : CUSTOM_DEFAULT.primary, accent: isHex(c.accent) ? c.accent.toUpperCase() : CUSTOM_DEFAULT.accent, bg: isHex(c.bg) ? c.bg.toUpperCase() : CUSTOM_DEFAULT.bg }; };
// Die gewählten Farben werden unverändert verwendet. Nur Schrift- und Flächenfarben werden berechnet, damit alles lesbar bleibt (mindestens 4,5:1):
// Schrift auf dem Hauptton hell oder dunkel, Überschriften- und Linkfarbe abgedunkelt bzw. aufgehellt, Hintergrund hell oder dunkel erkannt.
const normHex = v => { let x = String(v || '').trim().replace(/\s+/g, ''); if (x && x[0] !== '#') x = '#' + x; if (/^#[0-9a-f]{3}$/i.test(x)) x = '#' + [...x.slice(1)].map(c => c + c).join(''); return isHex(x) ? x.toUpperCase() : ''; };
function customThemeDef() {
  const c = customColors(), [h, s0] = hexToHsl(c.primary), [hb, sb, lb] = hexToHsl(c.bg), darkBg = contrastHex('#FFFFFF', c.bg) > contrastHex('#000000', c.bg), sat = Math.min(sb, 60);
  const L = (hue, s, l) => hslToHex(hue, s, Math.max(0, Math.min(100, l)));
  const onPrimary = contrastHex('#FFFFFF', c.primary) >= contrastHex('#1B1416', c.primary) ? '#FFFFFF' : '#1B1416';
  const up = darkBg || lb < 55; // Flächen heller als der Hintergrund, wenn der Hintergrund dunkel oder mittel ist
  const surface = darkBg ? L(hb, sat, lb + 5) : '#FFFFFF', s2 = L(hb, sat, up ? lb + (darkBg ? 9 : 6) : lb - 4), line = L(hb, sat, up ? lb + (darkBg ? 17 : 12) : lb - 11);
  let tl = darkBg ? 94 : 15, text = L(hb, 22, tl); while (contrastHex(text, c.bg) < 7 && tl > 0 && tl < 100) { tl += darkBg ? 2 : -2; text = L(hb, 22, tl); }
  let sl = darkBg ? 72 : 38, soft = L(hb, 14, sl); while ((contrastHex(soft, s2) < 4.6 || contrastHex(soft, c.bg) < 4.6) && sl > 0 && sl < 100) { sl += darkBg ? 3 : -2; soft = L(hb, 14, sl); }
  let pl = hexToHsl(c.primary)[2], strong = c.primary; while ((contrastHex(strong, s2) < 4.6 || contrastHex(strong, c.bg) < 4.6) && pl > 0 && pl < 100) { pl += darkBg ? 3 : -2; strong = L(h, s0, pl); }
  return { name: 'Eigene Kombination', bg: c.bg, surface, s2, line, text, soft, primary: c.primary, strong, onPrimary, accent: c.accent };
}function themeVars(id, dark) {
  const t = themeDef(id);
  if (!dark) return { '--bg': t.bg, '--surface': t.surface || '#FFFFFF', '--surface-2': t.s2, '--line': t.line, '--text': t.text, '--text-soft': t.soft,
    '--primary': t.primary, '--primary-strong': t.strong, '--on-primary': t.onPrimary || '#FFFFFF', '--accent': t.accent, '--shadow': '0 6px 20px rgba(80, 50, 50, .08)' };
  const [h, s] = hexToHsl(t.primary), sat = Math.min(s, 55);
  return { '--bg': `hsl(${h} 14% 10%)`, '--surface': `hsl(${h} 14% 14%)`, '--surface-2': `hsl(${h} 14% 19%)`, '--line': `hsl(${h} 12% 27%)`,
    '--text': `hsl(${h} 25% 94%)`, '--text-soft': `hsl(${h} 12% 72%)`, '--primary': `hsl(${h} ${sat}% 70%)`, '--primary-strong': `hsl(${h} ${sat}% 80%)`,
    '--on-primary': `hsl(${h} 30% 10%)`, '--accent': t.accent, '--shadow': '0 6px 20px rgba(0, 0, 0, .35)' };
}
// Lieblingsfarbe von Mama und Papa (eine der acht Farbwelten): färbt Herzen und Kennzeichnungen
// Lieblingsfarbe: eine der acht Farbwelten (Name) ODER ein eigener Farbwert (#RRGGBB)
const DEFAULT_FAV = { mama: 'rose', partner: 'sky', kid: 'sage' };
const isHex = v => /^#[0-9a-f]{6}$/i.test(v || '');
const favKey = who => who === 'mama' ? 'mamaColor' : who === 'kid' ? 'kidColor' : 'partnerColor';
const favColor = who => { const v = state.settings[favKey(who)]; return isHex(v) ? v.toUpperCase() : (THEME_DEFS[v] ? v : DEFAULT_FAV[who]); };
const isCustomFav = who => isHex(favColor(who));
const hexToRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const relLum = ([r, g, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const contrastHex = (a, b) => { const [x, y] = [relLum(hexToRgb(a)), relLum(hexToRgb(b))].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
function hslToHex(h, s, l) {
  s /= 100; l /= 100; const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return '#' + [f(0), f(8), f(4)].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
}
// Farben für Herz und Kennzeichnung: Farbwelt oder eigener Wert. Bei eigenen Werten werden Tönung und Schrift so berechnet, dass der Text immer gut lesbar bleibt (mind. 4,8:1).
function favVars(who, dark) {
  const v = favColor(who);
  // Das Herz zeigt immer die Originalfarbe der Person, unabhängig von Farbschema und Hell/Dunkel; nur Fläche und Schrift der Kennzeichnung passen sich an
  if (!isHex(v)) { const t = themeVars(v, dark); return { heart: THEME_DEFS[v].primary, bg: t['--surface-2'], fg: t['--primary-strong'], bd: t['--line'] }; }
  const [h, s, l0] = hexToHsl(v), sat = s < 8 ? 0 : Math.max(30, Math.min(s, 85));
  if (!dark) {
    const bg = hslToHex(h, Math.min(sat, 60), 95), bd = hslToHex(h, Math.min(sat, 50), 82); let l = 36, fg = hslToHex(h, sat, l);
    while (contrastHex(fg, bg) < 4.8 && l > 4) { l -= 2; fg = hslToHex(h, sat, l); }
    return { heart: v.toUpperCase(), bg, fg, bd };
  }
  const bg = hslToHex(h, sat ? 24 : 0, 18), bd = hslToHex(h, sat ? 20 : 0, 32); let l = 78, fg = hslToHex(h, Math.min(sat, 70), l);
  while (contrastHex(fg, bg) < 4.8 && l < 98) { l += 2; fg = hslToHex(h, Math.min(sat, 70), l); }
  return { heart: v.toUpperCase(), bg, fg, bd };
}
const heartHex = who => favVars(who, false).heart; // helle Variante, auch für den Druck
// Schriftgröße in Prozent (85 bis 140); ältere Einstellungen (klein/normal/groß) werden übernommen
function fontScale() {
  const v = Number(state.settings.fontScale);
  if (v >= FONT_SCALE.min && v <= FONT_SCALE.max) return v;
  const old = FONT_SIZES[state.settings.fontSize]; return old ? parseFloat(old.pct) : FONT_SCALE.def;
}
function applyTheme() {
  const s = state.settings, root = document.documentElement;
  if (!THEME_DEFS[s.theme] && s.theme !== 'custom') s.theme = 'mauve';
  root.dataset.theme = s.theme;
  const dark = s.mode === 'dark' || (s.mode === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  root.dataset.mode = dark ? 'dark' : 'light';
  root.dataset.bsTheme = root.dataset.mode;
  for (const [k, v] of Object.entries(themeVars(s.theme, dark))) root.style.setProperty(k, v);
  root.style.fontSize = fontScale() + '%';
  root.style.setProperty('--font', (FONT_FAMILIES[s.fontFamily] || FONT_FAMILIES.soft).stack);
  for (const [who, k] of [['mama', 'mama'], ['partner', 'papa'], ['kid', 'kid']]) {
    const v = favVars(who, dark);
    root.style.setProperty(`--heart-${k}`, v.heart); root.style.setProperty(`--aud-${k}-bg`, v.bg);
    root.style.setProperty(`--aud-${k}-fg`, v.fg); root.style.setProperty(`--aud-${k}-bd`, v.bd);
  }
  const mi = $('#topModeIcon'), mb = $('#topMode');
  if (mi) mi.className = 'bi ' + (dark ? 'bi-sun-fill' : 'bi-moon-stars-fill');
  if (mb) mb.setAttribute('aria-label', dark ? 'Zum hellen Modus wechseln' : 'Zum dunklen Modus wechseln');
  $('meta[name="theme-color"]').content = getComputedStyle(root).getPropertyValue('--bg').trim() || themeDef(s.theme).bg;
}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

/* ---------- Dialog ---------- */
function enhance(root) {
  root.querySelectorAll('input:not([type=checkbox]):not([type=hidden]):not([type=color]),textarea,select').forEach(e => e.classList.add('form-control'));
  root.querySelectorAll('label:not(.keep)').forEach(l => l.classList.add('form-label'));
}
function openSheet(html, onMount) {
  sheet.innerHTML = '<button type="button" class="sheet-x" id="sheetX" aria-label="Schließen">' + bi('x-lg') + '</button>' + html;
  $('#sheetX', sheet).onclick = closeSheet;
  enhance(sheet);
  if (!sheet.open) sheet.showModal();
  onMount && onMount(sheet);
  hydrateImages(sheet);
}
const closeSheet = () => sheet.open && sheet.close();
sheet.addEventListener('click', e => { if (e.target === sheet) closeSheet(); });

/* ---------- Ansichten ---------- */
const routes = {};

// Der errechnete Termin muss heute oder später liegen (höchstens etwa 42 Wochen voraus)
const DUE_MAX_DAYS = 300;
function dueError(v) {
  if (!v || !/^\d{4}-\d{2}-\d{2}$/.test(v) || isNaN(new Date(v + 'T00:00'))) return 'Bitte den errechneten Geburtstermin angeben.';
  if (v < iso(today())) return 'Der errechnete Termin muss heute oder in der Zukunft liegen. Euer Baby ist ja noch unterwegs.';
  if (v > iso(new Date(today().getTime() + DUE_MAX_DAYS * DAY))) return 'Das ist zu weit in der Zukunft. Eine Schwangerschaft dauert rund 40 Wochen.';
  return '';
}
routes.onboarding = () => {
  document.body.classList.add('onboarding');
  view.innerHTML = `
    <div class="ob-head"><div class="ob-ico">${bi('heart-fill')}</div>
      <h1>Willkommen bei ${esc(brandName())}</h1>
      <p class="brand"><span data-brand-by>${esc(brandSub())}</span></p>
      <p class="soft mb-0">Nur für euch: ohne Konto, alles bleibt auf diesem Gerät.</p></div>
    <form class="card ob-form" id="ob" novalidate>
      <label for="due">Errechneter Geburtstermin</label>
      <input id="due" type="date" min="${iso(today())}" max="${iso(new Date(today().getTime() + DUE_MAX_DAYS * DAY))}" aria-describedby="dueErr">
      <p class="small ob-err" id="dueErr" role="alert" hidden></p>
      <div class="ob-grid"><div><label for="mama">Mama (optional)</label><input id="mama" autocomplete="given-name" placeholder="z. B. Anna" maxlength="30"></div>
        <div><label for="partner">Papa (optional)</label><input id="partner" placeholder="z. B. Max" maxlength="30"></div></div>
      <label for="nick">Kosename fürs Baby</label>
      <input id="nick" value="Krümel" maxlength="24">
      <button class="btn btn-solid theme-primary w-100 ob-go">Los geht’s</button>
      <p class="small soft center mb-0">Den echten Namen könnt ihr später geheim hinterlegen.</p>
    </form>`;
  $('#ob').onsubmit = e => {
    e.preventDefault();
    const err = dueError($('#due').value), box = $('#dueErr'); box.hidden = !err; box.textContent = err; $('#due').setAttribute('aria-invalid', !!err); if (err) { $('#due').focus(); return; }
    Object.assign(state.settings, { dueDate: $('#due').value, mama: $('#mama').value.trim(), partner: $('#partner').value.trim(), nick: $('#nick').value.trim() || 'Baby' });
    save(); location.hash = '#/'; render(); setTimeout(maybeGuide, 400);
  };
};

/* ---------- Startseite: schlicht, Bausteine frei wählbar ----------
   Fest: Begrüßung, Countdown, Wochenkarte. Alles andere sind Bausteine, die man in den Einstellungen ein-/ausschalten und sortieren kann. */
const HOME_MODULES = {
  quick:     { label: 'Schnellzugriff', desc: 'Vier Buttons für das, was du am häufigsten brauchst', icon: 'lightning-charge-fill' },
  together:  { label: 'Gemeinsam heute', desc: 'Tägliches Paar-Ritual mit Serie', icon: 'people-fill' },
  daily:     { label: 'Tagesimpuls', desc: 'Ein Spruch für den Tag, dazu einer für den Partner', icon: 'chat-quote' },
  story:     { label: 'Wochen-Story', desc: 'Die aktuelle Entwicklung schön teilen: drei Bilder', icon: 'stars' },
  pins:      { label: 'Meine Favoriten', desc: 'Seiten, die du mit „Zur Startseite“ hinzugefügt hast', icon: 'pin-angle-fill' },
  family:    { label: 'Foto von euch', desc: 'Zufällig aus euren Profilfotos', icon: 'image' },
  secret:    { label: 'Der geheime Name', desc: 'Verdeckt, nur auf Antippen sichtbar', icon: 'lock-fill' },
  milestone: { label: 'Meilenstein der Woche', desc: 'Ein Hinweis, sobald eine Etappe erreicht ist', icon: 'stars' },
  planner:   { label: 'To-dos und Termine', desc: 'Offene Aufgaben und der nächste Termin', icon: 'check2-square' },
  tips:      { label: 'Tipps vor Ort', desc: 'Hebammen, Kurse, Beratung, Infoabende (Ort frei wählbar)', icon: 'geo-alt-fill' },
  last:      { label: 'Zuletzt festgehalten', desc: 'Das neueste Foto aus Tagebuch oder Album', icon: 'clock-history' }
};
// Einfach: Schnellzugriff, Gemeinsam heute, Wochen-Story. Standard: dazu der Tagesimpuls. Die Reihenfolge der Vorlage gilt auch für die Liste der Bausteine.
const HOME_DEFAULT = { order: Object.keys(HOME_MODULES), on: ['quick', 'together', 'daily', 'story'] };
const HOME_PRESETS = { simple: ['quick', 'together', 'story'], default: HOME_DEFAULT.on, all: Object.keys(HOME_MODULES) };
const presetOrder = ids => [...ids, ...HOME_DEFAULT.order.filter(k => !ids.includes(k))];

function homeLayout() {
  const c = state.settings.home || {};
  const order = (c.order || HOME_DEFAULT.order).filter(id => HOME_MODULES[id]);
  for (const id of Object.keys(HOME_MODULES)) if (!order.includes(id)) order.push(id); // neue Bausteine nach Updates anhängen
  return { order, on: new Set((c.on || HOME_DEFAULT.on).filter(id => HOME_MODULES[id])) };
}
const saveHome = (order, on) => { state.settings.home = { ...(state.settings.home || {}), order, on: [...on] }; save(); };

/* ---------- Zur Startseite hinzufügen: jede Seite lässt sich als Kachel auf die Startseite legen ---------- */
// Seiten, die als Favorit möglich sind: Tagebuch, Fotos und alle Funktionen aus der Schatzkiste (ohne Einstellungen)
const pinInfo = () => { const m = { diary: ['journal-text', 'Tagebuch'], photos: ['images', 'Fotos'] }; HUB.forEach(([k, i, t]) => { if (k !== 'einstellungen' && k !== 'more') m[k] = [i, labelOf(t)]; }); return m; };
const homePins = () => { const info = pinInfo(); return ((state.settings.home || {}).pins || []).filter(k => info[k]); };
function setHomePin(key, wanted) {
  const info = pinInfo()[key]; if (!info) return false;
  const { order, on } = homeLayout(), pins = homePins().filter(k => k !== key);
  if (wanted) { pins.push(key); on.add('pins'); }
  state.settings.home = { ...(state.settings.home || {}), order, on: [...on], pins }; save(); return wanted;
}
const pinBtnHTML = key => { const p = homePins().includes(key); return `<button type="button" class="pin-btn no-print ${p ? 'on' : ''}" id="pinBtn" data-pin="${key}" aria-pressed="${p}" title="Legt diese Seite als Favorit auf die Startseite. Zum Lösen noch einmal tippen." aria-label="${p ? 'Auf der Startseite angepinnt, zum Lösen tippen' : 'Zur Startseite anpinnen: legt diese Seite als Favorit auf die Startseite'}">${bi(p ? 'pin-angle-fill' : 'pin-angle')}<span>${p ? 'Auf der Startseite angepinnt' : 'Zur Startseite anpinnen'}</span></button>`; };
function bindPinBtn() {
  const b = $('#pinBtn'); if (!b) return;
  b.onclick = () => {
    const key = b.dataset.pin, now = !homePins().includes(key), label = pinInfo()[key][1]; setHomePin(key, now);
    b.classList.toggle('on', now); b.setAttribute('aria-pressed', now); b.innerHTML = `${bi(now ? 'pin-angle-fill' : 'pin-angle')}<span>${now ? 'Auf der Startseite angepinnt' : 'Zur Startseite anpinnen'}</span>`; b.setAttribute('aria-label', now ? 'Auf der Startseite angepinnt, zum Lösen tippen' : 'Zur Startseite anpinnen: legt diese Seite als Favorit auf die Startseite');
    toast(now ? `${label} sitzt jetzt auf eurer Startseite. Ein Klick, und ihr seid da.` : `${label} ist wieder von der Startseite verschwunden.`);
  };
}

// Schnellzugriff: Standard sind Tagebuch, Fotos, Wasser und Aufgaben, frei wählbar (2 bis 4, in beliebiger Reihenfolge)
const QUICK_DEFAULT = ['diary', 'photos', 'water', 'planner'], QUICK_MAX = 4, QUICK_MIN = 2, QUICK_NAMES = { planner: 'Aufgaben' };
const quickInfo = k => { const i = pinInfo()[k] || ['grid', k]; return [i[0], QUICK_NAMES[k] || i[1]]; };
const quickKeys = () => { const l = state.settings.quickItems, ok = Array.isArray(l) ? [...new Set(l)].filter(k => pinInfo()[k]) : []; return ok.length >= QUICK_MIN && ok.length <= QUICK_MAX ? ok : [...QUICK_DEFAULT]; };
const HOME_RENDER = {
  pins: () => { const info = pinInfo(), pins = homePins(); return pins.length ? `<div class="pins"><div class="pin-head small soft">${bi('pin-angle-fill')} Meine Favoriten</div><div class="pin-grid">${pins.map(k => `<a class="pin-tile" href="#/${k}">${bi(info[k][0])}<span>${info[k][1]}</span></a>`).join('')}</div></div>` : ''; },
  story: () => { const p = pregnancy(), [, fruit] = fruitFor(p.weeks), kid = (state.settings.nick || '').trim() || 'Dein Baby', art = (typeof FRUIT_ART !== 'undefined' && FRUIT_ART[fruit]) || 'ein';
    return `<a class="card link-card story-tile" href="#/weekstory"><div class="hstack gap-3"><span class="story-mini" aria-hidden="true">${fruitSVG(fruit)}<i class="bi bi-stars sm-badge"></i></span><div class="flex-grow-1"><b>Wochen-Story</b><div class="small soft">${esc(kid)} ist so groß wie ${art} ${esc(fruit)}. Jetzt als Bild teilen.</div></div>${bi('share-fill')}</div></a>`; },
  quick: () => `<div class="quick" data-count="${quickKeys().length}">${quickKeys().map(r => `<a class="quick-btn" href="#/${r}">${bi(quickInfo(r)[0])}<span>${quickInfo(r)[1]}</span></a>`).join('')}</div>`,
  together: () => togetherCard(),
  daily: () => `<div class="card daily"><div class="hstack gap-2 mb-2">${audBadge('mama', 'sm')}<span class="flex-grow-1"></span><button class="btn btn-subtle theme-secondary btn-sm" id="newMamaMsg" aria-label="Neuer Spruch für Mama">${bi('arrow-repeat')}</button></div><p class="quote mb-0" id="mamaMsg">${esc(dailyMsg())}</p>
    <div class="hstack gap-2 mt-3 pt-3 daily-sep">${audBadge('papa', 'sm')}<span class="flex-grow-1"></span>
      <button class="btn btn-subtle theme-secondary btn-sm" id="newPartnerMsg" aria-label="Neuer Spruch">${bi('arrow-repeat')}</button></div>
    <p class="mb-0 mt-1" id="partnerMsg">${esc(papaName(partnerMsgToday()))}</p></div>`,
  family: () => familyCard(),
  secret: () => { const s = state.settings;
    return `<div class="card" id="secretCard"><div class="hstack gap-3">${bi('lock-fill')}<div class="flex-grow-1"><b>Psst!</b> Den Namen von ${nick()} wissen bisher nur Mama und Papa.</div>
      ${s.secretName ? `<button class="btn btn-subtle theme-secondary btn-sm" id="reveal" aria-label="Namen kurz anzeigen">${bi('eye')}</button>` : ''}</div>
      ${s.secretName ? `<div class="secret-line"><span class="secret" id="secret">${esc(s.secretName)}</span></div>` : ''}</div>`; },
  milestone: () => { const ms = MILESTONES.filter(m => pregnancy().weeks >= m[0]).pop(); return ms ? `<div class="card"><b>Meilenstein</b><br>${ms[1]}</div>` : ''; },
  planner: () => { const open = state.todos.filter(t => !t.done).length;
    const next = state.appts.filter(a => a.date >= iso(today())).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0];
    return `<div class="grid" style="grid-template-columns:1fr 1fr">
      <a class="card link-card mb-0" href="#/planner"><b>${open}</b> offene To-dos<br><span class="small soft">Checkliste</span></a>
      <a class="card link-card mb-0" href="#/planner">${next ? `<b>${esc(next.title)}</b><br><span class="small soft">${fmtDate(next.date)}${next.time ? ' · ' + esc(next.time) : ''}</span>` : '<b>Kein Termin</b><br><span class="small soft">Alles entspannt</span>'}</a></div>`; },
  tips: () => `<a class="card link-card" href="#/tips"><div class="hstack gap-3">${bi('geo-alt-fill')}<div class="flex-grow-1"><b>Tipps für Schwangere in ${esc(tipsCity())}</b><div class="small soft">Hebammen, Kurse, Beratung, Infoabende</div></div>${bi('chevron-right')}</div></a>`,
  last: () => { const last = state.photos[0] || state.diary.find(d => d.photoId);
    return last ? `<div class="card"><div class="small soft mb-2">Zuletzt festgehalten</div><img data-img="${last.photoId}" alt="" style="width:100%;border-radius:14px;display:block"></div>` : ''; }
};

/* ---------- Banner (Wochenkarte) auf der Startseite: Inhalt und Hintergrund frei einstellbar ---------- */
const BANNER_DEFAULT = { weeks: true, bar: true, days: true, size: true, quote: true, bg: 'gradient', color: '', bgId: '', dim: 50, pos: 'center', compact: false };
const BANNER_ITEMS = [['weeks', 'Woche und Tage', 'Die große SSW-Anzeige mit Trimester'], ['bar', 'Fortschrittsbalken', 'Wie weit die Schwangerschaft ist'], ['days', 'Satz zum Termin', 'Die Tagesaussage mit den Tagen bis zum Termin'], ['size', 'Größenvergleich', 'Zum Beispiel „so groß wie ein Kürbis“'], ['quote', 'Tagesspruch', 'Der tägliche Spruch mit Erneuern-Knopf']];
const bannerCfg = () => Object.assign({}, BANNER_DEFAULT, state.settings.banner || {});
const BANNER_POS = { top: 'center top', center: 'center center', bottom: 'center bottom' };
const BANNER_COLORS = [['', 'Passend zum Farbschema'], ['#A0537A', 'Malve'], ['#C4566A', 'Rosenrot'], ['#D2693E', 'Terrakotta'], ['#8A6D1E', 'Senfgold'], ['#3F7D5C', 'Salbeigrün'], ['#2F7F86', 'Petrol'], ['#3E6CB0', 'Himmelblau'], ['#6B4FA3', 'Lila'], ['#4A4458', 'Schiefer']];
function heroHTML(p = pregnancy()) {
  const c = bannerCfg(), [, name] = fruitFor(p.weeks), photo = c.bg === 'photo' && c.bgId, cls = ['card', 'hero', photo ? 'hero-photo' : '', c.bg === 'solid' ? 'hero-solid' : '', !photo && isHex(c.color) ? 'hero-tint' : '', c.compact ? 'hero-compact' : ''].filter(Boolean).join(' ');
  const style = photo ? ` data-bg="${esc(c.bgId)}" style="--hero-dim:${Math.min(80, Math.max(30, +c.dim || 50)) / 100};--hero-pos:${BANNER_POS[c.pos] || BANNER_POS.center}"` : isHex(c.color) ? ` style="--hero-c:${c.color}"` : '';
  const parts = [
    c.weeks && `<div class="hero-top"><span class="fruit" aria-hidden="true">${bi('balloon-heart-fill')}</span><div><div class="big">${p.weeks}. SSW</div><div class="hero-sub">+ ${p.days} Tag${p.days === 1 ? '' : 'e'} · ${trimester(p.weeks)}. Trimester</div></div></div>`,
    c.bar && `<div class="progress my-3" role="progressbar" aria-label="Schwangerschaftsfortschritt" aria-valuenow="${Math.round(p.pct)}" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" style="width:${p.pct}%"></div></div>`,
    c.days && `<p class="hero-days" id="heroDays">${esc(dayLine('mama', p))}</p>`,
    c.size && `<div class="small">${nick()} ist ungefähr so groß wie: <b>${name}</b></div>`,
    c.quote && `<div class="hero-quote-row"><p class="hero-quote" id="heroQuote">${esc(dailyPick(quotePool('hero'), 'hero'))}</p><button class="hero-refresh" id="newHeroQuote" aria-label="Neuer Spruch">${bi('arrow-repeat')}</button></div>`
  ].filter(Boolean);
  return parts.length ? `<div class="${cls}"${style}>${parts.join('')}</div>` : '';
}
async function storeBanner(file) { const id = uid(); await putImg(id, await shrink(file, 1200, 220)); return id; }

routes.home = () => {
  const p = pregnancy(), s = state.settings;
  const [, name] = fruitFor(p.weeks);
  const names = [s.mama, s.partner].filter(Boolean).map(esc).join(' &amp; ');
  // Ohne Anrede: bei zwei Namen verschmelzen die beiden Herzen in der Mitte (statt "&"), bei einem Namen steht sein Herz davor
  const gname = (v, k) => `<span class="gn">${esc(v)}</span>`, gl = s.mama && s.partner ? `${gname(s.mama, 'mama')} <span class="gn-duo">${duoHearts()}</span> ${gname(s.partner, 'papa')}` : s.mama ? `<span class="gn">${nmHeart('mama')}${esc(s.mama)}</span>` : s.partner ? `<span class="gn">${nmHeart('papa')}${esc(s.partner)}</span>` : '';
  const greet = gl || 'Ihr Superhelden';
  const { order, on } = homeLayout();
  view.innerHTML = `
    <div class="greet">${avatarStack()}
      <div class="greet-text"><p class="greet-hello">${greet}</p></div></div>
    <div class="today-row today-sticky"><p class="today" id="todayLine">${bi('calendar-heart')}${esc(todayLong())}</p>${searchBoxHTML()}</div>
    <h1>${p.left > 0 ? `Noch ${daysTxt(p.left)} bis ${nick()}` : p.left === 0 ? `Heute ist ${nick()}s Termin!` : `${nick()} lässt sich Zeit (${-p.left} Tage drüber)`}</h1>
    ${heroHTML(p)}
    ${order.filter(id => on.has(id)).map(id => HOME_RENDER[id]()).join('')}
    <a class="home-edit" href="#/homeconfig">${bi('sliders')} Startseite anpassen</a>`;
  bindTogether();
  const nhq = $('#newHeroQuote'); if (nhq) nhq.onclick = () => { const cur = $('#heroQuote').textContent; const pool = quotePool('hero'); let q, guard = 0; do { q = pick(pool); } while (q === cur && pool.length > 1 && ++guard < 20); $('#heroQuote').textContent = q; };
  const nm = $('#newMamaMsg'); if (nm) nm.onclick = () => { const pool = quotePool('daily'), cur = $('#mamaMsg').textContent; let q, g = 0; do { q = pick(pool); } while (q === cur && pool.length > 1 && ++g < 20); $('#mamaMsg').textContent = q; };
  const np = $('#newPartnerMsg'); if (np) np.onclick = () => { const cur = $('#partnerMsg').textContent; let q, g = 0; do { q = partnerMsg(); } while (papaName(q) === cur && ++g < 20); $('#partnerMsg').textContent = papaName(q); };
  const r = $('#reveal');
  if (r) r.onclick = () => { $('#secret').classList.add('show'); clearTimeout(r.t); r.t = setTimeout(() => $('#secret')?.classList.remove('show'), 5000); };
  if (typeof bindSearch === 'function') bindSearch();
};

// Einstellungen: Startseite einrichten (Vorlage, Bausteine ein/aus, Reihenfolge, Favoriten)
routes.homeconfig = () => {
  const { order, on } = homeLayout(), pins = homePins(), info = pinInfo();
  const preset = Object.entries(HOME_PRESETS).find(([, v]) => v.length === on.size && v.every(x => on.has(x)))?.[0];
  view.innerHTML = `
    <h1>Startseite einrichten</h1><p class="soft">Weniger ist mehr: Wähle nur, was du jeden Tag sehen willst. Begrüßung, Countdown und Wochenkarte bleiben immer.</p>
    <h2>1. Vorlage wählen</h2>
    <div class="seg" role="group" aria-label="Vorlage">${[['simple', 'Einfach'], ['default', 'Standard'], ['all', 'Alles']].map(([k, l]) => `<button type="button" data-preset="${k}" class="${preset === k ? 'on' : ''}" aria-pressed="${preset === k}">${l}</button>`).join('')}</div>
    <h2>2. Bausteine <span class="chip" id="hmCount">${on.size} von ${order.length} sichtbar</span></h2>
    <div class="card hm-list">${order.map((id, i) => { const m = HOME_MODULES[id];
      return `<div class="hm-row"><span class="hm-ico">${bi(m.icon)}</span><label class="keep hm-text" for="hm_${id}"><b>${m.label}</b><span class="small soft">${m.desc}</span></label>
        <input type="checkbox" role="switch" id="hm_${id}" data-hm="${id}" ${on.has(id) ? 'checked' : ''} aria-label="${m.label} anzeigen">
        <span class="hm-move"><button type="button" class="btn btn-text btn-sm" data-up="${id}" ${i === 0 ? 'disabled' : ''} aria-label="${m.label} nach oben">${bi('chevron-up')}</button>
        <button type="button" class="btn btn-text btn-sm" data-down="${id}" ${i === order.length - 1 ? 'disabled' : ''} aria-label="${m.label} nach unten">${bi('chevron-down')}</button></span>${id === 'tips' ? `<div class="hm-extra"><label for="hmCity">Ort für die Tipps</label><input id="hmCity" maxlength="40" value="${esc(state.settings.tipsCity || '')}" placeholder="Frankfurt" autocomplete="off"><span class="small soft">Zum Beispiel Frankfurt (mit ausgewählten Anlaufstellen) oder euer eigener Ort.</span></div>` : ''}</div>`; }).join('')}</div>
    <h2>3. Favoriten <span class="chip" id="pinCount">${pins.length} gewählt</span></h2>
    <p class="small soft">Tippe die Seiten an, die als Kachel auf der Startseite stehen sollen. Auf jeder Seite gibt es dafür auch den Knopf „Zur Startseite“.</p>
    <div class="pin-pick">${Object.entries(info).map(([k, [ic, t]]) => `<button type="button" class="pin-opt ${pins.includes(k) ? 'on' : ''}" data-pinopt="${k}" aria-pressed="${pins.includes(k)}">${bi(ic)}<span>${t}</span>${pins.includes(k) ? bi('check-lg') : ''}</button>`).join('')}</div>
    <h2>4. Schnellzugriff <span class="chip" id="quickCount">${quickKeys().length} von ${QUICK_MAX}</span></h2>
    <p class="small soft">Wähle 2 bis 4 Knöpfe und bringe sie mit den Pfeilen in die Reihenfolge, die du magst. Standard: Tagebuch, Fotos, Wasser, Aufgaben.</p>
    <div class="card hm-list">${(() => { const cur = quickKeys(), all = [...cur, ...Object.keys(pinInfo()).filter(k => !cur.includes(k))]; return all.map(k => { const i = cur.indexOf(k), on = i >= 0; return `<div class="hm-row"><span class="hm-ico">${bi(quickInfo(k)[0])}</span><label class="keep hm-text" for="qs_${k}"><b>${esc(quickInfo(k)[1])}</b>${on ? `<span class="small soft">Platz ${i + 1} von ${cur.length}</span>` : ''}</label>${on ? `<button type="button" class="btn btn-text btn-sm" data-qup="${k}" ${i === 0 ? 'disabled' : ''} aria-label="${esc(quickInfo(k)[1])} nach vorn">${bi('chevron-up')}</button><button type="button" class="btn btn-text btn-sm" data-qdown="${k}" ${i === cur.length - 1 ? 'disabled' : ''} aria-label="${esc(quickInfo(k)[1])} nach hinten">${bi('chevron-down')}</button>` : ''}<input type="checkbox" role="switch" id="qs_${k}" data-qs="${k}" ${on ? 'checked' : ''} aria-label="${esc(quickInfo(k)[1])} im Schnellzugriff"></div>`; }).join(''); })()}</div>
    <button type="button" class="btn btn-subtle theme-secondary mt-2" id="quickReset">${bi('arrow-counterclockwise')} Standard wiederherstellen</button>
    <a class="btn btn-solid theme-primary w-100 mt-3" href="#/">Fertig, zur Startseite</a>`;
  view.querySelectorAll('[data-qs]').forEach(cb => cb.onchange = () => { const k0 = cb.dataset.qs, base = quickKeys(), picked = cb.checked ? [...base.filter(k => k !== k0), k0] : base.filter(k => k !== k0);
    if (picked.length > QUICK_MAX) { cb.checked = false; toast(`Höchstens ${QUICK_MAX} Knöpfe passen in den Schnellzugriff.`); return; }
    if (picked.length < QUICK_MIN) { cb.checked = true; toast(`Mindestens ${QUICK_MIN} Knöpfe bleiben im Schnellzugriff.`); return; }
    state.settings.quickItems = picked; save(); render(); });
  const moveQuick = (k, d) => { const l = quickKeys(), i = l.indexOf(k), j = i + d; if (i < 0 || j < 0 || j >= l.length) return; [l[i], l[j]] = [l[j], l[i]]; state.settings.quickItems = l; save(); render(); };
  view.querySelectorAll('[data-qup]').forEach(b => b.onclick = () => moveQuick(b.dataset.qup, -1));
  view.querySelectorAll('[data-qdown]').forEach(b => b.onclick = () => moveQuick(b.dataset.qdown, 1));
  $('#quickReset').onclick = () => { delete state.settings.quickItems; save(); render(); toast('Schnellzugriff ist wieder im Standard'); };
  view.querySelectorAll('[data-hm]').forEach(c => c.onchange = () => { c.checked ? on.add(c.dataset.hm) : on.delete(c.dataset.hm); saveHome(order, on); markPreset(); $('#hmCount').textContent = `${on.size} von ${order.length} sichtbar`; });
  const markPreset = () => { const cur = Object.entries(HOME_PRESETS).find(([, v]) => v.length === on.size && v.every(x => on.has(x)))?.[0]; view.querySelectorAll('[data-preset]').forEach(b => { const p = b.dataset.preset === cur; b.classList.toggle('on', p); b.setAttribute('aria-pressed', p); }); };
  const move = (id, d) => { const i = order.indexOf(id), j = i + d; if (j < 0 || j >= order.length) return; [order[i], order[j]] = [order[j], order[i]]; saveHome(order, on); render(); };
  view.querySelectorAll('[data-up]').forEach(b => b.onclick = () => move(b.dataset.up, -1));
  view.querySelectorAll('[data-down]').forEach(b => b.onclick = () => move(b.dataset.down, 1));
  view.querySelectorAll('[data-preset]').forEach(b => b.onclick = () => { saveHome(presetOrder(HOME_PRESETS[b.dataset.preset]), new Set(HOME_PRESETS[b.dataset.preset])); render(); toast('Startseite angepasst'); });
  const hc = $('#hmCity'); if (hc) bindCityInput(hc);
  view.querySelectorAll('[data-pinopt]').forEach(b => b.onclick = () => { setHomePin(b.dataset.pinopt, !homePins().includes(b.dataset.pinopt)); render(); });
};
// Tagebuch: für Mama (Hauptbereich) und für Papa (geschützter Papa-Bereich), gleiche Bedienung
const diaryList = () => state.diary;
const setDiaryList = (_who, list) => { state.diary = list; };
const DIARY_TEXT = {
  mama: { title: 'Tagebuch', intro: 'Euer gemeinsames Tagebuch für heute, für später und für den 18. Geburtstag. Jede und jeder schreibt, wie es passt.', empty: 'Noch leer wie ein frisch gewaschener Strampler.<br>Schreibt den ersten Eintrag!', ask: 'Wie geht’s euch?', placeholder: 'Heißhunger, Tritte, Gedanken, Aufregung …', print: 'diaryprint' }
};
// Wer hat den Eintrag geschrieben? mama, partner oder both (gemeinsam). Herz in der Lieblingsfarbe.
const authorName = by => by === 'mama' ? (state.settings.mama || 'Mama') : by === 'partner' ? (state.settings.partner || 'Papa') : 'Gemeinsam';
// Autor-Kennzeichnung: mit Profilfoto (Rand in der Lieblingsfarbe), sonst Herz in der Lieblingsfarbe
const authorMark = by => { const who = by === 'mama' ? 'mama' : 'partner', k = by === 'mama' ? 'mama' : 'papa', id = photosOf(who).length ? randomPhoto(who) : null;
  return id ? `<img class="by-av" data-img="${id}" alt="" style="--ring:var(--heart-${k})">` : `<i class="bi bi-heart-fill" style="color:var(--heart-${k})"></i>`; };
const authorChip = by => by ? `<span class="chip by-chip" data-by="${by}">${by === 'both' ? duoHearts() : authorMark(by)} ${esc(authorName(by))}</span>` : '';
const lastDiaryBy = () => state.settings.lastDiaryBy || 'mama';
function diaryPage(who) {
  const T = DIARY_TEXT[who], list = diaryList(who);
  view.innerHTML = `
    <h1>${T.title}</h1><p class="soft">${T.intro}</p>
    <a class="btn btn-subtle theme-secondary mb-3" href="#/${T.print}">${bi('printer')} Drucken und exportieren</a>
    ${list.length ? list.map(d => {
      const w = weekFor(d.date);
      return `<article class="card entry">
        <div class="meta"><div><span class="mood">${bi(MOOD_ICON[d.mood] || 'emoji-smile')}</span> <b>${fmtDate(d.date)}</b> ${authorChip(d.by)}${w !== null ? `<br><span class="small soft">${w}. SSW</span>` : ''}</div>
        <button class="btn btn-subtle theme-secondary btn-sm" data-edit="${d.id}">Bearbeiten</button></div>
        ${d.text ? `<p style="margin-top:10px;white-space:pre-wrap">${esc(d.text)}</p>` : ''}
        ${d.photoId ? `<img class="photo" data-img="${d.photoId}" alt="Foto zum Eintrag">` : ''}
      </article>`;
    }).join('') : `<div class="card center"><div class="empty-ico">${bi('journal-text')}</div><p>${T.empty}</p></div>`}
    <button class="btn btn-solid theme-primary fab" id="add" aria-label="Neuer Eintrag"><i class="bi bi-plus-lg"></i></button>`;
  $('#add').onclick = () => diaryForm(null, who);
  view.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => diaryForm(b.dataset.edit, who));
}
routes.diary = () => diaryPage('mama');

function diaryForm(id, who = 'mama') {
  const T = DIARY_TEXT[who], list = diaryList(who);
  const d = list.find(x => x.id === id) || { id: uid(), date: iso(today()), mood: 'happy', text: '', photoId: null, isNew: true };
  let photoId = d.photoId, mood = d.mood, by = d.by || lastDiaryBy();
  openSheet(`
    <h2 style="margin-top:0">${d.isNew ? 'Neuer Eintrag' : 'Eintrag bearbeiten'}</h2>
    <label class="keep form-label">Wer schreibt?</label>
    <div class="seg" style="margin:0 0 4px">${[['mama', authorName('mama')], ['partner', authorName('partner')], ['both', 'Gemeinsam']].map(([k, l]) => `<button type="button" data-by="${k}" class="${by === k ? 'on' : ''}">${esc(l)}</button>`).join('')}</div>
    <label>${T.ask}</label>
    <div class="moods">${MOODS.map(m => `<button type="button" data-m="${m}" aria-label="${MOOD_LABEL[m]}" aria-pressed="${m === mood}">${bi(MOOD_ICON[m])}</button>`).join('')}</div>
    <label for="dd">Datum</label><input id="dd" type="date" value="${d.date}">
    <label for="dt">Was war heute?</label><textarea id="dt" placeholder="${T.placeholder}">${esc(d.text)}</textarea>
    <label for="df">Foto</label><input id="df" type="file" accept="image/*">
    <div id="prev">${photoId ? `<img data-img="${photoId}" alt="" style="width:100%;border-radius:14px;margin-top:10px">` : ''}</div>
    <div class="hstack gap-2" style="margin-top:18px">
      ${d.isNew ? '' : '<button class="btn btn-text theme-danger" id="del" type="button">Löschen</button>'}
      <span class="flex-grow-1"></span><button class="btn btn-subtle theme-secondary" id="cancel" type="button">Abbrechen</button><button id="ok" type="button" class="btn btn-solid theme-primary">Speichern</button>
    </div>`, el => {
    el.querySelectorAll('[data-by]').forEach(b => b.onclick = () => { by = b.dataset.by; el.querySelectorAll('[data-by]').forEach(x => x.classList.toggle('on', x === b)); });
    el.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { mood = b.dataset.m; el.querySelectorAll('[data-m]').forEach(x => x.setAttribute('aria-pressed', x === b)); });
    $('#df', el).onchange = async e => {
      const f = e.target.files[0]; if (!f) return;
      try { photoId = await storeFile(f); $('#prev', el).innerHTML = `<img data-img="${photoId}" alt="" style="width:100%;border-radius:14px;margin-top:10px">`; hydrateImages(el); }
      catch { toast('Bild konnte nicht gelesen werden'); }
    };
    $('#cancel', el).onclick = closeSheet;
    $('#ok', el).onclick = () => {
      Object.assign(d, { date: $('#dd', el).value || iso(today()), text: $('#dt', el).value.trim(), mood, photoId, by }); state.settings.lastDiaryBy = by;
      delete d.isNew;
      const all = diaryList(who);
      if (!all.some(x => x.id === d.id)) all.push(d);
      all.sort((a, b) => b.date.localeCompare(a.date));
      save(); closeSheet(); render(); cheer();
    };
    const del = $('#del', el);
    if (del) del.onclick = async () => {
      if (!confirm('Diesen Eintrag wirklich löschen?')) return;
      if (d.photoId) await delImg(d.photoId).catch(() => {});
      setDiaryList(who, diaryList(who).filter(x => x.id !== d.id)); save(); closeSheet(); render();
    };
  });
}

routes.photos = () => {
  view.innerHTML = `
    <h1>Fotos</h1><p class="soft">Bauchbilder, Ultraschall, Lieblingsmomente – nur auf deinem Gerät.</p>
    ${state.photos.length ? `<div class="grid">${state.photos.map(p => `
      <button class="tile" data-p="${p.id}" aria-label="Foto ansehen"><img data-img="${p.photoId}" alt="${esc(p.caption)}">
      <span class="cap">${p.week !== null ? p.week + '. SSW' : fmtDate(p.date)}${p.caption ? ' · ' + esc(p.caption) : ''}</span></button>`).join('')}</div>`
      : `<div class="card center"><div class="empty-ico">${bi('images')}</div><p>Hier wohnt bald dein Babybauch-Album.<br>Das erste Foto wartet.</p></div>`}
    <button class="btn btn-solid theme-primary fab" id="add" aria-label="Foto hinzufügen"><i class="bi bi-camera-fill"></i></button>`;
  $('#add').onclick = photoForm;
  view.querySelectorAll('[data-p]').forEach(b => b.onclick = () => photoView(b.dataset.p));
};

function photoForm() {
  let photoId = null;
  openSheet(`
    <h2 style="margin-top:0">Neues Foto</h2>
    <label for="pf">Bild auswählen oder aufnehmen</label><input id="pf" type="file" accept="image/*">
    <div id="prev"></div>
    <label for="pc">Beschriftung (optional)</label><input id="pc" maxlength="60" placeholder="z. B. Der erste Tritt!">
    <label for="pd">Datum</label><input id="pd" type="date" value="${iso(today())}">
    <div class="hstack gap-2" style="margin-top:18px"><span class="flex-grow-1"></span><button class="btn btn-subtle theme-secondary" id="cancel" type="button">Abbrechen</button><button id="ok" type="button" class="btn btn-solid theme-primary">Speichern</button></div>`, el => {
    $('#pf', el).onchange = async e => {
      const f = e.target.files[0]; if (!f) return;
      try { photoId = await storeFile(f); $('#prev', el).innerHTML = `<img data-img="${photoId}" alt="" style="width:100%;border-radius:14px;margin-top:10px">`; hydrateImages(el); }
      catch { toast('Bild konnte nicht gelesen werden'); }
    };
    $('#cancel', el).onclick = closeSheet;
    $('#ok', el).onclick = () => {
      if (!photoId) return toast('Bitte zuerst ein Bild wählen');
      const date = $('#pd', el).value || iso(today());
      state.photos.unshift({ id: uid(), date, caption: $('#pc', el).value.trim(), week: weekFor(date), photoId });
      save(); closeSheet(); render(); cheer('photo');
    };
  });
}

function photoView(id) {
  const p = state.photos.find(x => x.id === id); if (!p) return;
  openSheet(`
    <img data-img="${p.photoId}" alt="${esc(p.caption)}" style="width:100%;border-radius:16px">
    <p style="margin-top:10px"><b>${fmtDate(p.date)}</b>${p.week !== null ? ` · ${p.week}. SSW` : ''}<br>${esc(p.caption)}</p>
    <div class="hstack gap-2"><button class="btn btn-text theme-danger" id="del">Löschen</button><span class="flex-grow-1"></span><button class="btn btn-subtle theme-secondary" id="close">Schließen</button></div>`, el => {
    $('#close', el).onclick = closeSheet;
    $('#del', el).onclick = async () => {
      if (!confirm('Dieses Foto wirklich löschen?')) return;
      await delImg(p.photoId).catch(() => {});
      state.photos = state.photos.filter(x => x.id !== id); save(); closeSheet(); render();
    };
  });
}

let plannerTab = 'todo';
routes.planner = () => {
  const done = state.todos.filter(t => t.done).length;
  const appts = [...state.appts].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  view.innerHTML = `
    <h1>Planer</h1>
    <div class="seg" role="tablist"><button data-t="todo" class="${plannerTab === 'todo' ? 'on' : ''}">Checkliste</button><button data-t="appt" class="${plannerTab === 'appt' ? 'on' : ''}">Termine</button></div>
    ${plannerTab === 'todo' ? `
      <p class="soft">${done} von ${state.todos.length} erledigt${done === state.todos.length && done ? ' – Wahnsinn!' : ''}</p>
      <div class="card">${state.todos.map(t => `
        <div class="todo ${t.done ? 'done' : ''}"><input type="checkbox" id="c${t.id}" data-c="${t.id}" ${t.done ? 'checked' : ''}><label for="c${t.id}" style="margin:0;font-weight:400;flex:1"><span>${esc(t.text)}</span></label>
        <button class="btn btn-text theme-danger btn-sm" data-d="${t.id}" aria-label="Entfernen"><i class="bi bi-x-lg"></i></button></div>`).join('') || '<p class="soft center">Nichts zu tun. Verdächtig.</p>'}
      </div>
      <form class="hstack gap-2" id="tf"><input id="tn" placeholder="Neue Aufgabe …" aria-label="Neue Aufgabe" required><button class="btn btn-solid theme-primary">Hinzufügen</button></form>`
    : `
      ${appts.length ? appts.map(a => `<div class="card hstack gap-2"><div class="flex-grow-1"><b>${esc(a.title)}</b><br><span class="small soft">${fmtDate(a.date)}${a.time ? ' · ' + esc(a.time) + ' Uhr' : ''}</span></div>
        <button class="btn btn-text theme-danger btn-sm" data-ad="${a.id}" aria-label="Termin löschen"><i class="bi bi-x-lg"></i></button></div>`).join('') : '<div class="card center"><p>Keine Termine. Zeit für ein Eis.</p></div>'}
      <button class="btn btn-solid theme-primary fab" id="add" aria-label="Termin hinzufügen"><i class="bi bi-calendar-heart"></i></button>`}`;
  view.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { plannerTab = b.dataset.t; render(); });
  view.querySelectorAll('[data-c]').forEach(c => c.onchange = () => { state.todos.find(t => t.id === c.dataset.c).done = c.checked; save(); render(); if (c.checked) toast(pick(TODO_CHEERS)); });
  view.querySelectorAll('[data-d]').forEach(b => b.onclick = () => { state.todos = state.todos.filter(t => t.id !== b.dataset.d); save(); render(); });
  view.querySelectorAll('[data-ad]').forEach(b => b.onclick = () => { state.appts = state.appts.filter(a => a.id !== b.dataset.ad); save(); render(); });
  const tf = $('#tf'); if (tf) tf.onsubmit = e => { e.preventDefault(); state.todos.push({ id: uid(), text: $('#tn').value.trim(), done: false }); save(); render(); cheer('add'); };
  const add = $('#add'); if (add) add.onclick = apptForm;
};

function apptForm() {
  openSheet(`
    <h2 style="margin-top:0">Neuer Termin</h2>
    <label for="at">Titel</label><input id="at" placeholder="z. B. Ultraschall" maxlength="60">
    <label for="ad">Datum</label><input id="ad" type="date" value="${iso(today())}">
    <label for="ah">Uhrzeit (optional)</label><input id="ah" type="time">
    <div class="hstack gap-2" style="margin-top:18px"><span class="flex-grow-1"></span><button class="btn btn-subtle theme-secondary" id="cancel" type="button">Abbrechen</button><button id="ok" type="button" class="btn btn-solid theme-primary">Speichern</button></div>`, el => {
    $('#cancel', el).onclick = closeSheet;
    $('#ok', el).onclick = () => {
      const title = $('#at', el).value.trim(); if (!title) return toast('Bitte einen Titel eingeben');
      state.appts.push({ id: uid(), title, date: $('#ad', el).value || iso(today()), time: $('#ah', el).value });
      save(); closeSheet(); render(); cheer('add');
    };
  });
}

// Ort für die Tipps: Frankfurt ist voreingestellt (mit geprüften Anlaufstellen), jeder andere Ort lässt sich frei eintragen und mit eigenen Anlaufstellen füllen
const tipsCity = () => cleanText(state.settings.tipsCity, 40) || 'Frankfurt';
const isFfm = () => /^frankfurt(\s+am\s+main)?$/i.test(tipsCity());
const labelOf = v => typeof v === 'function' ? v() : v;
const GENERAL_HELP = [
  { icon: 'search-heart', title: 'Hebammensuche (Deutscher Hebammenverband)', url: 'https://www.hebammensuche.de', text: 'Hebammen in der Nähe finden. Am besten direkt nach dem positiven Test anfragen.' },
  { icon: 'people', title: 'Elternsein.info (Frühe Hilfen)', url: 'https://www.elternsein.info', text: 'Informationen und Angebote für Schwangere und Eltern, auch zur Suche in der eigenen Region.' }
];
function bindCityInput(el, after) {
  el.addEventListener('input', () => { const v = cleanText(el.value, 40); if (v) state.settings.tipsCity = v; else delete state.settings.tipsCity; save(); after && after(); });
  el.addEventListener('change', () => { el.value = state.settings.tipsCity || ''; cheer('style'); if (location.hash === '#/tips') render(); });
}
// Seite "Tipps vor Ort": alles ist anpassbar. Reihenfolge der Abschnitte, Anlaufstellen verschieben (Pfeile oder Ziehen), eingebaute ausblenden, eigene hinzufügen
let tipsEdit = false, tipsDragId = null;
const TIPS_SECTIONS = ['own', 'know', 'places'];
const tipsLayout = () => { const l = state.settings.tipsLayout || {}, order = (l.order || []).filter(k => TIPS_SECTIONS.includes(k)); TIPS_SECTIONS.forEach(k => { if (!order.includes(k)) order.push(k); }); return { order, places: l.places || [], hidden: l.hidden || [] }; };
const saveTipsLayout = l => { state.settings.tipsLayout = l; save(); };
const moveItem = (arr, i, d) => { const j = i + d; if (j < 0 || j >= arr.length) return arr; const c = [...arr]; [c[i], c[j]] = [c[j], c[i]]; return c; };
const tipItem = t => { const i = t.indexOf(':'), has = i > 0 && i < 60; return `<li class="tip-item"><span class="tip-ico">${bi('lightbulb-fill')}</span><div>${has ? `<b>${esc(t.slice(0, i))}</b> ` : ''}${esc(has ? t.slice(i + 1).trim() : t)}</div></li>`; };
const arrowBtns = (attr, id, i, n, label) => `<span class="mv-btns no-print"><button type="button" class="btn btn-text btn-sm" ${attr}-up="${id}" ${i === 0 ? 'disabled' : ''} aria-label="${esc(label)} nach oben">${bi('chevron-up')}</button><button type="button" class="btn btn-text btn-sm" ${attr}-down="${id}" ${i === n - 1 ? 'disabled' : ''} aria-label="${esc(label)} nach unten">${bi('chevron-down')}</button></span>`;
routes.tips = () => {
  const city = tipsCity(), own = state.localTips = state.localTips || [], ffm = isFfm(), lay = tipsLayout(), edit = tipsEdit;
  const base = (ffm ? FFM.map((f, i) => ({ ...f, pid: 'p' + i })) : GENERAL_HELP.map((f, i) => ({ ...f, pid: 'g' + i })));
  const places = [...lay.places.map(id => base.find(x => x.pid === id)).filter(Boolean), ...base.filter(x => !lay.places.includes(x.pid))];
  const shown = edit ? places : places.filter(x => !lay.hidden.includes(x.pid));
  const placeCard = (f, i) => `<div class="tips-row ${lay.hidden.includes(f.pid) ? 'is-hidden' : ''}"><a class="card link-card flex-grow-1" href="${esc(f.url)}" target="_blank" rel="noopener noreferrer">
      <div class="hstack gap-3 align-items-start"><i class="bi bi-${f.icon || 'geo-alt'} ico" aria-hidden="true"></i><div class="flex-grow-1"><b>${esc(f.title)}</b>${f.text ? `<p class="small soft mb-0">${esc(f.text)}</p>` : ''}</div><i class="bi bi-box-arrow-up-right soft small" aria-hidden="true"></i></div></a>
      ${edit ? `<div class="tips-ctl">${arrowBtns('data-pl', f.pid, i, places.length, f.title)}<button type="button" class="btn btn-text btn-sm" data-pl-hide="${f.pid}" aria-pressed="${lay.hidden.includes(f.pid)}" aria-label="${esc(f.title)} ${lay.hidden.includes(f.pid) ? 'einblenden' : 'ausblenden'}">${bi(lay.hidden.includes(f.pid) ? 'eye-slash' : 'eye')}</button></div>` : ''}</div>`;
  const ownCard = (o, i) => `<div class="tips-row" ${edit ? `draggable="true" data-drag="${o.id}"` : ''}><div class="card flex-grow-1"><div class="hstack gap-3 align-items-start"><i class="bi bi-${edit ? 'grip-vertical' : 'geo-alt'} ico" aria-hidden="true"></i><div class="flex-grow-1"><b>${esc(o.title)}</b>${o.text ? `<p class="small soft mb-0">${esc(o.text)}</p>` : ''}${o.url ? `<a class="small" href="${esc(o.url)}" target="_blank" rel="noopener noreferrer">${bi('box-arrow-up-right')} Link öffnen</a>` : ''}</div><button type="button" class="btn btn-text theme-danger btn-sm" data-ltdel="${o.id}" aria-label="${esc(o.title)} entfernen">${bi('x-lg')}</button></div></div>${edit ? `<div class="tips-ctl">${arrowBtns('data-lt', o.id, i, own.length, o.title)}</div>` : ''}</div>`;
  const secHead = (k, title, extra = '') => `<h2 class="tips-h">${title}${extra} ${edit ? arrowBtns('data-sec', k, lay.order.indexOf(k), lay.order.length, title) : ''}</h2>`;
  const know = ffm ? FFM_TIPS : ['Hebamme früh suchen: Fragt direkt nach dem positiven Test an, gute Plätze sind oft schnell vergeben.', 'Geburtsklinik anschauen: Viele Kliniken bieten Infoabende und Kreißsaalführungen an.', 'Kosten klären: Krankenkassen übernehmen Hebammenhilfe und viele Kurse. Fragt bei eurer Krankenkasse nach.'];
  const SEC = {
    own: () => `<section data-sec="own">${secHead('own', 'Eigene Anlaufstellen', ` <span class="chip">${own.length}</span>`)}
      ${own.length ? own.map(ownCard).join('') : '<div class="card center soft">Noch nichts gesammelt. Tragt hier eure Hebamme, Klinik oder einen guten Kurs ein, damit ihr alles an einem Ort habt.</div>'}
      <details class="card tips-add" ${own.length ? '' : 'open'}><summary>${bi('plus-circle-fill')} Neue Anlaufstelle hinzufügen</summary>
        <form id="ltForm"><label for="ltTitle">Name der Anlaufstelle</label><input id="ltTitle" maxlength="80" required placeholder="z. B. Hebamme Anna Muster"><label for="ltText">Notiz (optional)</label><input id="ltText" maxlength="160" placeholder="z. B. Telefon, Sprechzeiten, Kosten"><label for="ltUrl">Link (optional)</label><input id="ltUrl" type="url" maxlength="300" placeholder="https://"><button class="btn btn-solid theme-primary w-100 mt-2" type="submit">${bi('plus-lg')} Hinzufügen</button></form></details></section>`,
    know: () => `<section data-sec="know">${secHead('know', 'Gut zu wissen')}<ul class="tip-list">${know.map(tipItem).join('')}</ul></section>`,
    places: () => `<section data-sec="places">${secHead('places', ffm ? 'Anlaufstellen' : 'Hilfreich in ganz Deutschland')}${shown.map((f, i) => placeCard(f, edit ? i : places.indexOf(f))).join('')}
      <p class="small soft">${ffm ? `Quelle: <a href="${FFM_WEGWEISER}" target="_blank" rel="noopener noreferrer">Wegweiser „Frühe Hilfen“ der Stadt Frankfurt</a>. Angaben ohne Gewähr, bitte Termine, Kosten und Öffnungszeiten beim Träger prüfen. Zum Öffnen der Links brauchst du Internet.` : 'Angaben ohne Gewähr. Ärztlicher Bereitschaftsdienst: 116 117, im Notfall 112.'}</p></section>`
  };
  view.innerHTML = `
    <h1>${esc(city)}</h1><p class="soft">Hilfe und Tipps für Schwangere in ${esc(city)}${ffm ? ' am Main' : ''}. Ihr könnt die Seite selbst einrichten.</p>
    <div class="hstack gap-2 flex-wrap mb-3"><button type="button" class="btn ${edit ? 'btn-solid theme-primary' : 'btn-subtle theme-secondary'}" id="tipsEdit" aria-pressed="${edit}">${bi(edit ? 'check2' : 'sliders')} ${edit ? 'Fertig' : 'Seite anpassen'}</button>${edit ? `<button type="button" class="btn btn-text" id="tipsReset">Anordnung zurücksetzen</button>` : ''}</div>
    ${edit ? '<p class="small soft">Abschnitte und Anlaufstellen lassen sich mit den Pfeilen verschieben, eigene auch per Ziehen. Eingebaute Anlaufstellen könnt ihr mit dem Auge ausblenden.</p>' : ''}
    ${lay.order.map(k => SEC[k]()).join('')}
    <div class="card"><label for="tipsCity">Ort für die Tipps</label><input id="tipsCity" maxlength="40" value="${esc(state.settings.tipsCity || '')}" placeholder="Frankfurt" autocomplete="off">
      <p class="small soft mt-2 mb-0">${ffm ? 'Für Frankfurt zeigen wir ausgewählte Anlaufstellen. ' : ''}Für jeden anderen Ort sammelt ihr oben eigene Anlaufstellen: Hebamme, Klinik, Kurse, Beratung.</p></div>
    <p class="small soft">Bei akuten Beschwerden: Frauenarzt oder Hebamme, im Notfall 112.</p>`;
  bindCityInput($('#tipsCity'));
  $('#ltForm').onsubmit = e => { e.preventDefault(); const title = $('#ltTitle').value.trim(); if (!title) return; const url = $('#ltUrl').value.trim(); own.push({ id: uid(), title, text: $('#ltText').value.trim(), url: isUrl(url) ? url : '', icon: 'geo-alt' }); save(); render(); cheer('add'); };
  view.querySelectorAll('[data-ltdel]').forEach(b => b.onclick = ev => { ev.preventDefault(); ev.stopPropagation(); state.localTips = own.filter(x => x.id !== b.dataset.ltdel); save(); render(); });
  $('#tipsEdit').onclick = () => { tipsEdit = !tipsEdit; render(); };
  const rs = $('#tipsReset'); if (rs) rs.onclick = () => { delete state.settings.tipsLayout; save(); render(); toast('Anordnung zurückgesetzt'); };
  view.querySelectorAll('[data-sec-up],[data-sec-down]').forEach(b => b.onclick = () => { const k = b.dataset.secUp || b.dataset.secDown, i = lay.order.indexOf(k); saveTipsLayout({ ...lay, order: moveItem(lay.order, i, b.dataset.secUp ? -1 : 1) }); render(); });
  view.querySelectorAll('[data-pl-up],[data-pl-down]').forEach(b => b.onclick = () => { const id = b.dataset.plUp || b.dataset.plDown, ids = places.map(x => x.pid); saveTipsLayout({ ...lay, places: moveItem(ids, ids.indexOf(id), b.dataset.plUp ? -1 : 1) }); render(); });
  view.querySelectorAll('[data-pl-hide]').forEach(b => b.onclick = () => { const id = b.dataset.plHide, h = lay.hidden.includes(id) ? lay.hidden.filter(x => x !== id) : [...lay.hidden, id]; saveTipsLayout({ ...lay, places: places.map(x => x.pid), hidden: h }); render(); });
  view.querySelectorAll('[data-lt-up],[data-lt-down]').forEach(b => b.onclick = () => { const id = b.dataset.ltUp || b.dataset.ltDown, i = own.findIndex(x => x.id === id); state.localTips = moveItem(own, i, b.dataset.ltUp ? -1 : 1); save(); render(); });
  // Ziehen und Ablegen (Maus): eigene Anlaufstellen umsortieren
  view.querySelectorAll('[data-drag]').forEach(el => {
    el.addEventListener('dragstart', e => { tipsDragId = el.dataset.drag; el.classList.add('dragging'); if (e.dataTransfer) { e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', tipsDragId); } catch { /* egal */ } } });
    el.addEventListener('dragend', () => { el.classList.remove('dragging'); tipsDragId = null; });
    el.addEventListener('dragover', e => { if (tipsDragId) e.preventDefault(); });
    el.addEventListener('drop', e => { e.preventDefault(); const from = own.findIndex(x => x.id === tipsDragId), to = own.findIndex(x => x.id === el.dataset.drag); if (from < 0 || to < 0 || from === to) return; const c = [...own]; c.splice(to, 0, c.splice(from, 1)[0]); state.localTips = c; save(); tipsDragId = null; render(); });
  });
};
routes.colors = () => {
  const s = state.settings;
  const card = id => {
    const t = THEME_DEFS[id], sel = s.theme === id;
    return `<button class="theme-card ${sel ? 'sel' : ''}" data-th="${id}" aria-pressed="${sel}" aria-label="Farbwelt ${t.name}">
      <span class="theme-prev" style="background:${t.bg};border-color:${t.line}"><i style="background:${t.s2}"></i><i style="background:${t.primary}"></i><i style="background:${t.accent}"></i></span>
      <b>${t.name}</b>${sel ? bi('check-circle-fill') : ''}</button>`;
  };
  view.innerHTML = `
    <h1>Farben</h1><p class="soft">Such dir die Stimmung aus, die zu dir passt. Alle Farbwelten sind so gewählt, dass Texte gut lesbar bleiben.</p>
    <div class="theme-grid">${Object.keys(THEME_DEFS).map(card).join('')}</div>
    <h2>Eigene Kombination</h2>
    <div class="card custom-theme" id="customCard">
      <button type="button" class="theme-card ${s.theme === 'custom' ? 'sel' : ''}" id="useCustom" aria-pressed="${s.theme === 'custom'}" aria-label="Eigene Kombination verwenden">
        <span class="theme-prev" id="customPrev" style="background:${themeDef('custom').bg};border-color:${themeDef('custom').line}"><i style="background:${themeDef('custom').s2}"></i><i style="background:${themeDef('custom').primary}"></i><i style="background:${themeDef('custom').accent}"></i></span>
        <b>Eigene Kombination</b>${s.theme === 'custom' ? bi('check-circle-fill') : ''}</button>
      <p class="small soft mt-2">Wähle drei Farben. Wir passen Texte und Flächen automatisch an, damit alles gut lesbar bleibt.</p>
      ${[['primary', 'Hauptfarbe', 'Knöpfe, Überschriften, Symbole'], ['accent', 'Akzentfarbe', 'kleine Highlights'], ['bg', 'Hintergrund-Ton', 'der Farbton des Hintergrunds']].map(([k, l, d]) => `<div class="cc-row"><label class="keep cc-label" for="cc_${k}"><b>${l}</b><span class="small soft">${d}</span></label><input type="color" class="color-input" id="cc_${k}" data-cc="${k}" value="${customColors()[k].toLowerCase()}" aria-label="${l} wählen"><input class="hex-input" data-cch="${k}" value="${customColors()[k]}" maxlength="7" autocomplete="off" spellcheck="false" aria-label="${l} als Hex-Wert"></div>`).join('')}
      <div class="cc-check small" id="ccCheck" aria-live="polite"></div>
      <div class="hstack gap-2 mt-2 flex-wrap"><button type="button" class="btn btn-solid theme-primary" id="ccApply">${bi('check2')} Diese Kombination verwenden</button><button type="button" class="btn btn-text" id="ccReset">Zurücksetzen</button></div>
    </div>
    <h2>Darstellung</h2>
    <div class="card"><div class="seg" style="margin:0">${[['auto', 'Automatisch'], ['light', 'Hell'], ['dark', 'Dunkel']].map(([k, l]) => `<button data-m="${k}" class="${s.mode === k ? 'on' : ''}">${l}</button>`).join('')}</div></div>`;
  view.querySelectorAll('[data-th]').forEach(b => b.onclick = () => { s.theme = b.dataset.th; save(); applyTheme(); render(); cheer('style'); });
  // Eigene Kombination: live anzeigen, mit "Verwenden" speichern
  const refreshCustom = () => {
    const t = themeDef('custom'); if (s.theme === 'custom') applyTheme();
    const pv = $('#customPrev'); if (pv) { pv.style.background = t.bg; pv.style.borderColor = t.line; const i = pv.querySelectorAll('i'); i[0].style.background = t.s2; i[1].style.background = t.primary; i[2].style.background = t.accent; }
    const r = contrastHex(t.onPrimary, t.primary), rt = contrastHex(t.text, t.bg), ck = $('#ccCheck');
    if (ck) { const lvl = x => x >= 7 ? 'sehr gut' : x >= 4.5 ? 'gut' : 'schwach'; ck.textContent = `Lesbarkeit: Knöpfe ${lvl(r)} (${r.toFixed(1).replace('.', ',')} : 1), Text ${lvl(rt)} (${rt.toFixed(1).replace('.', ',')} : 1). Eure Farben bleiben unverändert, nur die Schrift darauf passt sich an.`; }
  };
  const markCustom = () => { view.querySelectorAll('[data-th]').forEach(b => { b.classList.remove('sel'); b.setAttribute('aria-pressed', 'false'); }); const u = $('#useCustom'); if (u) { u.classList.add('sel'); u.setAttribute('aria-pressed', 'true'); } };
  const setCustom = (k, v) => { s.customTheme = { ...customColors(), ...(s.customTheme || {}), [k]: v.toUpperCase() }; s.theme = 'custom'; markCustom(); refreshCustom(); };
  view.querySelectorAll('[data-cc]').forEach(inp => {
    const k = inp.dataset.cc, hex = view.querySelector(`[data-cch="${k}"]`);
    inp.addEventListener('input', () => { hex.value = inp.value.toUpperCase(); setCustom(k, inp.value); });
    inp.addEventListener('change', () => { save(); });
    hex.addEventListener('change', () => { const v = normHex(hex.value); if (v) { inp.value = v.toLowerCase(); hex.value = v; setCustom(k, v); save(); } else { toast('Bitte einen Farbwert wie #A0537A eingeben'); hex.value = customColors()[k]; } });
  });
  $('#ccApply').onclick = () => { s.customTheme = { ...customColors() }; s.theme = 'custom'; save(); applyTheme(); render(); cheer('style'); };
  $('#useCustom').onclick = () => { s.customTheme = { ...customColors() }; s.theme = 'custom'; save(); applyTheme(); render(); cheer('style'); };
  $('#ccReset').onclick = () => { delete s.customTheme; save(); if (s.theme === 'custom') applyTheme(); render(); };
  refreshCustom();
  view.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { s.mode = b.dataset.m; save(); applyTheme(); render(); });
};

routes.backup = () => {
  view.innerHTML = `
    <h1>Datensicherung</h1><p class="soft">Alles liegt nur auf diesem Gerät. Mach hin und wieder ein Backup, sonst sind die Erinnerungen bei einem Gerätewechsel weg.</p>
    <div class="card">
      <div class="hstack gap-2 flex-wrap"><button class="btn btn-solid theme-primary" id="exp">${bi('download')} Backup speichern</button><button class="btn btn-subtle theme-secondary" id="imp">${bi('upload')} Backup laden</button><input id="impf" type="file" accept="application/json" hidden></div>
      <p class="small soft mt-3 mb-0">Die Datei enthält persönliche Daten und Fotos. Bewahre sie sicher auf und teile sie nur mit Menschen, denen du vertraust.</p>
    </div>
    <h2>Erinnerung</h2>
    <div class="card">
      <p class="mb-2"><b>Letztes Backup:</b> ${state.settings.lastBackup ? `${fmtDate(state.settings.lastBackup)} (${daysSince(state.settings.lastBackup)} Tage her)` : 'noch nie'}</p>
      <label class="keep form-label">Erinnere mich alle …</label>
      <div class="seg" style="margin-bottom:8px">${[7, 14, 30].map(n => `<button data-b="${n}" class="${backupDays() === n ? 'on' : ''}">${n} Tage</button>`).join('')}</div>
      <p class="small soft mb-0">Nächste Erinnerung: <b>${fmtDate(nextBackupDate())}</b>. Ohne Sicherung fragt dich die App danach automatisch beim Öffnen.</p>
    </div>
    <h2>Alles löschen</h2>
    <div class="card"><p class="small soft">Entfernt alle Einträge, Fotos und Einstellungen von diesem Gerät. Das lässt sich nicht rückgängig machen.</p>
      <button class="btn btn-text theme-danger" id="wipe">${bi('trash')} Alle Daten löschen</button></div>`;
  $('#exp').onclick = () => exportData().then(render);
  $('#imp').onclick = () => $('#impf').click();
  $('#impf').onchange = importData;
  view.querySelectorAll('[data-b]').forEach(b => b.onclick = () => { state.settings.backupDays = +b.dataset.b; save(); render(); toast(`Alle ${b.dataset.b} Tage. Ich melde mich!`); });
  $('#wipe').onclick = async () => {
    if (!confirm('Wirklich ALLES löschen? Das kann nicht rückgängig gemacht werden.')) return;
    const db = await idb; db.transaction('img', 'readwrite').objectStore('img').clear();
    localStorage.removeItem(KEY); state = emptyState(); urls.clear(); applyTheme(); location.hash = '#/'; render();
  };
};

// Lieblingsfarbe (Farbwelt oder eigener Hex-Wert) für Mama, Papa und das Baby
const favPicker = (who, name, label, hint) => `<label class="keep form-label mt-3" id="${who}-fav-label">${label}</label>
    <div class="swatches" role="radiogroup" aria-labelledby="${who}-fav-label">${Object.entries(THEME_DEFS).map(([id, t]) => `<button type="button" class="swatch" role="radio" aria-checked="${favColor(who) === id}" aria-label="${t.name}" data-pc="${who}:${id}" style="background:${t.primary}"></button>`).join('')}</div>
    <div class="fav-custom mt-2 ${isCustomFav(who) ? 'is-custom' : ''}">
      <input type="color" class="color-input" data-pcc="${who}" value="${isCustomFav(who) ? favColor(who).toLowerCase() : THEME_DEFS[favColor(who)].primary.toLowerCase()}" aria-label="Eigene Farbe für ${esc(name)} wählen">
      <input class="hex-input" data-pch="${who}" value="${isCustomFav(who) ? favColor(who) : ''}" maxlength="7" autocomplete="off" spellcheck="false" placeholder="#C25A72" aria-label="Eigener Farbwert als Hex, zum Beispiel #C25A72">
      <span class="small soft">Eigene Farbe</span>
    </div>
    <p class="small soft mt-2 mb-0">${hint}</p>`;// Profilformular einer Person. Für Frau und Mann identisch aufgebaut: 1. Name (ganz oben), 2. bis zu 3 Fotos.
// Foto-Plätze (bis zu 3) für Mama, Papa und das Baby
const slotsHTML = (who, list) => Array.from({ length: MAX_PHOTOS }, (_, i) => list[i]
  ? `<div class="slot"><img data-img="${list[i]}" alt=""><button class="slot-del" data-pdel="${who}:${list[i]}" aria-label="Foto entfernen">${bi('x-lg')}</button></div>`
  : `<button class="slot add" data-padd="${who}" aria-label="Foto hinzufügen">${bi('plus-lg')}</button>`).join('');
// Bild vom Baby: zum Beispiel das Ultraschallbild, später Fotos vom Kind
const kidPhotoBlock = () => { const list = photosOf('kid');
  return `<div class="kid-photos" data-person="kid"><div class="hstack gap-2 mt-3 mb-2"><b class="flex-grow-1">Bild vom Baby</b><span class="chip">${list.length}/${MAX_PHOTOS}</span></div>
    <div class="photo-slots">${slotsHTML('kid', list)}</div>
    <input type="file" class="pfile" data-who="kid" accept="image/*" multiple hidden>
    <p class="small soft mt-2 mb-0">Zum Beispiel das Ultraschallbild oder später ein Foto von ${nick()}. Bis zu ${MAX_PHOTOS} Bilder, sie bleiben auf diesem Gerät und werden automatisch verkleinert.</p></div>`; };
const personBlock = who => {
  const s = state.settings, w = WHO[who], list = photosOf(who), inputId = who === 'mama' ? 'sm' : 'sp';
  const slots = slotsHTML(who, list);
  return `<div class="card person-form" data-person="${who}">
    <label for="${inputId}">Name</label>
    <input id="${inputId}" value="${esc(s[w.name])}" autocomplete="given-name" maxlength="30" placeholder="${who === 'mama' ? 'Dein Name, z. B. Sarah' : 'Dein Name, z. B. Norbert'}">
    <label class="keep form-label mt-3" for="${who}-title">Anrede in der App</label>
    <input id="${who}-title" data-ptitle="${who}" value="${esc(s[titleKey(who)] || '')}" maxlength="${TITLE_MAX}" autocomplete="off" placeholder="${who === 'mama' ? 'Mama' : 'Papa'}">
    <p class="small soft mt-1 mb-0">Wie sollen dich alle nennen? Zum Beispiel Mutti, Mami, Vati oder Papi. So steht es dann überall in der App.</p>
    ${favPicker(who, s[w.name] || w.fallback, 'Lieblingsfarbe', 'Deine Farbe färbt dein Herz, überall dort, wo es um dich geht.')}
    <div class="hstack gap-2 mt-3 mb-2"><b class="flex-grow-1">Fotos</b><span class="chip">${list.length}/${MAX_PHOTOS}</span></div>
    <div class="photo-slots">${slots}</div>
    <input type="file" class="pfile" data-who="${who}" accept="image/*" multiple hidden>
    <p class="small soft mt-2 mb-0">Bis zu ${MAX_PHOTOS} Fotos. Sie tauchen überall in der App auf und bleiben auf diesem Gerät. Fotos werden automatisch verkleinert, das spart Platz.</p></div>`;
};
// Lieblingsfarbe binden (Mama, Papa, Baby)
function bindFav(who) {
  const s = state.settings;
  view.querySelectorAll(`[data-pc^="${who}:"]`).forEach(b => b.onclick = () => { s[favKey(who)] = b.dataset.pc.split(':')[1]; save(); applyTheme(); render(); cheer('style'); });
  // Eigener Farbwert: Farbwähler (wirkt sofort) und Hex-Feld
  const cin = view.querySelector(`[data-pcc="${who}"]`), hin = view.querySelector(`[data-pch="${who}"]`);
  if (cin) {
    cin.addEventListener('input', e => { s[favKey(who)] = e.target.value.toUpperCase(); hin.value = s[favKey(who)]; applyTheme(); });
    cin.addEventListener('change', () => { save(); render(); cheer('style'); });
    hin.addEventListener('change', e => {
      let v = e.target.value.trim(); if (v && v[0] !== '#') v = '#' + v;
      if (isHex(v)) { s[favKey(who)] = v.toUpperCase(); save(); applyTheme(); render(); cheer('style'); }
      else { toast('Bitte einen Farbwert wie #C25A72 eingeben'); e.target.value = isCustomFav(who) ? favColor(who) : ''; }
    });
  }
}
function bindPerson(who) {
  const s = state.settings, w = WHO[who];
  const file = view.querySelector(`.pfile[data-who="${who}"]`);
  view.querySelectorAll(`[data-padd="${who}"]`).forEach(b => b.onclick = () => file.click());
  bindFav(who);
  const ti = view.querySelector(`[data-ptitle="${who}"]`);
  if (ti) ti.addEventListener('input', e => { const v = cleanTitle(e.target.value); if (v) s[titleKey(who)] = v; else delete s[titleKey(who)]; retitleAll(); });
  if (ti) ti.addEventListener('change', () => { save(); render(); toast(`Ab jetzt heißt es überall: ${roleTitle(who)}. Schön!`); });
  file.onchange = async e => {
    const files = [...e.target.files].slice(0, MAX_PHOTOS - photosOf(who).length); e.target.value = '';
    if (!files.length) return;
    try { const ids = []; for (const f of files) ids.push(await storeAvatar(f)); s[w.photos] = [...photosOf(who), ...ids]; save(); render(); cheer('photo'); }
    catch { toast('Bild konnte nicht gelesen werden'); }
  };
  view.querySelectorAll(`[data-pdel^="${who}:"]`).forEach(b => b.onclick = async () => {
    const id = b.dataset.pdel.split(':')[1]; await delImg(id).catch(() => {});
    s[w.photos] = photosOf(who).filter(x => x !== id); save(); render();
  });
}
// Namensfeld: Menüpunkt unten und Überschrift ziehen beim Tippen und beim Fokuswechsel sofort mit
function bindName(inputId, who) {
  const s = state.settings, el = $(inputId), key = WHO[who].name;
  el.addEventListener('input', e => { s[key] = e.target.value.trim(); updateNavName(e.target.value, who); });
  el.addEventListener('blur', e => { s[key] = e.target.value.trim(); save(); updateNavName(undefined, who); });
  el.onchange = e => { s[key] = e.target.value.trim(); save(); cheer(); };
}

routes.settings = () => {
  const s = state.settings;
  view.innerHTML = `
    <h1><span id="meTitle">${esc(s.mama || 'Ich')}</span></h1><p class="soft">Dein Block: Name, Fotos und alles, was ihr zwei gemeinsam braucht.</p>
    ${personBlock('mama')}
    <h2>${duoHearts()} Gemeinsam</h2>
    <div class="card">
      <label for="sd">Errechneter Termin</label><input id="sd" type="date" value="${s.dueDate}" min="${iso(today())}" max="${iso(new Date(today().getTime() + DUE_MAX_DAYS * DAY))}">
      <label for="sn">Kosename fürs Baby</label><input id="sn" value="${esc(s.nick)}" maxlength="24">
      <label for="ss">Geheimer Name</label><div class="ss-wrap"><input id="ss" type="password" value="${esc(s.secretName)}" maxlength="40" autocomplete="new-password" data-lpignore="true" data-1p-ignore placeholder="Nur Mama und Papa wissen’s"><button type="button" class="btn btn-subtle" id="ssEye" aria-label="Geheimen Namen kurz anzeigen" aria-pressed="false">${bi('eye')}</button></div>
      <p class="small soft" style="margin-top:6px">Wird nie geteilt, nie hochgeladen und auf der Startseite verdeckt angezeigt.</p>
      ${favPicker('kid', s.nick || 'das Baby', 'Lieblingsfarbe vom Baby', 'Die Farbe vom Herz deines Babys, sichtbar bei den Namen unter jeder Überschrift.')}
      ${kidPhotoBlock()}
    </div>
    <p class="small soft center">BABYLOVE ersetzt keine ärztliche oder Hebammen-Beratung. Bei Beschwerden: Frauenarzt oder Hebamme fragen, im Notfall 112.</p>`;
  bindPerson('mama'); bindName('#sm', 'mama'); bindPerson('kid');
  const bind = (id, key) => $(id).onchange = e => { s[key] = e.target.value.trim(); save(); cheer(); };
  $('#sd').onchange = e => { const err = dueError(e.target.value); if (err) { e.target.value = s.dueDate; toast(err); return; } s.dueDate = e.target.value; save(); cheer(); }; bind('#sn', 'nick'); bind('#ss', 'secretName'); const eye = $('#ssEye'); if (eye) eye.onclick = () => { const f = $('#ss'), show = f.type === 'password'; f.type = show ? 'text' : 'password'; eye.setAttribute('aria-pressed', show); eye.innerHTML = bi(show ? 'eye-slash' : 'eye'); };
  // Kosename: Kennzeichnung unter der Überschrift zieht beim Tippen sofort mit
  $('#sn').addEventListener('input', e => { s.nick = e.target.value.trim(); document.querySelectorAll('[data-kid]').forEach(n => { n.textContent = e.target.value.trim() || 'Baby'; }); });
};

const PAPA_RANK = {
  1: ['Papa-Praktikant', 'Du lernst gerade den Job. Kaffee kochen und Zuhören zählen schon als Überstunden.'],
  2: ['Papa in Ausbildung', 'Jetzt wird’s ernst und schön: Kinderzimmer, Kurse, erste Tritte. Du machst das stark.'],
  3: ['Papa-Kapitän', 'Die Zielgerade! Tasche gepackt, Route getestet, Nerven wie Drahtseile. Du bist bereit.']
};
routes.papa = () => {
  const s = state.settings, p = pregnancy(), tri = trimester(p.weeks), [rank] = PAPA_RANK[tri], rankText = papaName(dailyPick(quotePool('papaRank', tri), 'rank' + tri));
  view.innerHTML = `
    <h1><span id="paTitle">${esc(s.partner || 'Papa')}</span></h1><p class="soft">Dein Block: Name, Fotos und alles, was dich motiviert. Du bist nicht Nebenfigur, du bist Co-Held dieser Geschichte.</p>
    ${personBlock('partner')}
    <div class="card hero">
      <div class="small" style="opacity:.9">Rang von <span data-name="partner" data-fallback="Papa">${esc(s.partner || 'Papa')}</span></div>
      <div class="big" style="font-size:2rem;margin:4px 0 6px">${rank}</div>
      <p class="mb-2">${esc(rankText)}</p>
      <div class="progress my-2" role="progressbar" aria-label="Weg zum Papa" aria-valuenow="${Math.round(p.pct)}" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" style="width:${p.pct}%"></div></div>
      <p class="hero-days mb-0" id="papaDays">${esc(papaName(dayLine('papa', p)))}</p>
    </div>
    ${papaDailyCard(tri)}
    <h2>Weiteres für dich</h2>
    <a class="card link-card" href="#/partner"><div class="hstack gap-3">${bi('people-fill')}<div class="flex-grow-1"><b>Partner-Modus</b><div class="small soft">Wochenstand und wie du richtig gut unterstützt</div></div>${bi('chevron-right')}</div></a>
    <p class="small soft center">Du schaffst das. Und wenn nicht sofort: Das Baby verzeiht alles, solange du lächelst.</p>`;
  bindTip(tri);
  bindPerson('partner'); bindName('#sp', 'partner');
};

// Eigener Bereich "Einstellungen": Farben und Datensicherung
// Einstellungen als Akkordeon: jeder Bereich lässt sich auf- und zuklappen, es ist immer nur einer offen
let settingsOpen = null;
routes.einstellungen = () => {
  const s = state.settings, last = s.lastBackup;
  const modeLabel = { auto: 'Automatisch', light: 'Hell', dark: 'Dunkel' }[s.mode] || 'Automatisch';
  const acc = (id, icon, title, sub, body) => `<details class="acc card" data-acc="${id}"${settingsOpen === id ? ' open' : ''}><summary><span class="acc-ico">${bi(icon)}</span><span class="acc-text"><b>${title}</b><span class="small soft" data-sub="${id}" ${id === 'brand' ? 'id="accBrandSub"' : ''}>${sub}</span></span>${bi('chevron-down')}</summary><div class="acc-body">${body}</div></details>`;
  const go = (href, label) => `<a class="btn btn-solid theme-primary" href="${href}">${label} ${bi('arrow-right')}</a>`;
  const fontBody = `<b id="ffLabel">Schriftart</b>
      <div class="font-list mt-2" role="radiogroup" aria-labelledby="ffLabel">${Object.entries(FONT_FAMILIES).map(([k, f]) => `<button type="button" class="font-opt ${(s.fontFamily || 'soft') === k ? 'on' : ''}" role="radio" aria-checked="${(s.fontFamily || 'soft') === k}" data-ff="${k}" style="font-family:${esc(f.stack)}"><span class="fo-name">${f.label}</span><span class="fo-sample">Aa · Du schaffst das!</span><span class="fo-note small">${f.note}</span></button>`).join('')}</div>
      <p class="small soft mt-2 mb-3">Alle Schriften sind auf jedem Gerät und in jedem Browser schon vorhanden: Sie laden schnell, funktionieren offline und übertragen nichts.</p>
      <b id="fsLabel">Schriftgröße</b>
      <div class="fs-row mt-2"><button type="button" class="btn btn-subtle theme-secondary" id="fsDown" aria-label="Schrift kleiner">${bi('dash-lg')}</button>
        <input type="range" id="fsRange" min="${FONT_SCALE.min}" max="${FONT_SCALE.max}" step="${FONT_SCALE.step}" value="${fontScale()}" aria-label="Schriftgröße in Prozent" aria-valuetext="${fontScale()} Prozent">
        <button type="button" class="btn btn-subtle theme-secondary" id="fsUp" aria-label="Schrift größer">${bi('plus-lg')}</button></div>
      <div class="hstack justify-content-between mt-1"><span class="small soft"><span id="fsValue">${fontScale()}</span> %</span><button type="button" class="btn btn-text btn-sm" id="fsReset">Zurücksetzen auf ${FONT_SCALE.def} %</button></div>
      <div class="size-preview"><b>So sieht deine Schrift aus</b><p class="mb-0 soft">Noch ${daysLeftText()} bis zum Termin. Du schaffst das, großartig!</p></div>`;
  const bc = bannerCfg(), bgName = { gradient: 'Farbverlauf', photo: 'Eigenes Foto', solid: 'Einfarbig' };
  const bannerSub = () => { const c = bannerCfg(); return `${bgName[c.bg === 'photo' && !c.bgId ? 'gradient' : c.bg]} · ${BANNER_ITEMS.filter(([k]) => c[k]).length} von ${BANNER_ITEMS.length} Elementen${c.compact ? ' · kompakt' : ''}`; };
  const bannerBody = `<p class="small soft">Das ist die große Karte oben auf der Startseite. Ihr entscheidet, was darauf steht und wie sie aussieht.</p>
    <b>Was soll auf dem Banner stehen?</b>
    <div class="bn-list mt-1">${BANNER_ITEMS.map(([k, l, dsc]) => `<div class="hm-row bn-row"><label class="keep hm-text" for="bn_${k}"><b>${l}</b><span class="small soft">${dsc}</span></label><input type="checkbox" role="switch" id="bn_${k}" data-bn="${k}" ${bc[k] ? 'checked' : ''} aria-label="${l} anzeigen"></div>`).join('')}</div>
    <b class="d-block mt-3">Hintergrund</b>
    <div class="seg mt-2" role="group" aria-label="Hintergrund" style="margin-bottom:8px">${[['gradient', 'Farbverlauf'], ['photo', 'Eigenes Foto'], ['solid', 'Einfarbig']].map(([k, l]) => `<button type="button" data-bnbg="${k}" class="${bc.bg === k ? 'on' : ''}" aria-pressed="${bc.bg === k}">${l}</button>`).join('')}</div>
    ${bc.bg !== 'photo' ? `<b class="d-block mt-2">Farbe</b><div class="bn-colors" role="group" aria-label="Bannerfarbe">${BANNER_COLORS.map(([hex, nm]) => `<button type="button" class="bn-sw${(bc.color || '') === hex ? ' on' : ''}" data-bncolor="${hex}" aria-label="${nm}" aria-pressed="${(bc.color || '') === hex}" title="${nm}" style="${hex ? `background:${hex}` : ''}">${hex ? '' : bi('magic')}</button>`).join('')}</div>` : ''}
    ${bc.bg === 'photo' ? `<div class="bn-photo">${bc.bgId ? `<div class="bn-thumb" data-bg="${esc(bc.bgId)}" aria-hidden="true"></div>` : '<p class="small soft">Noch kein Foto gewählt. Bis dahin zeigt der Banner den Farbverlauf.</p>'}
      <div class="hstack gap-2 flex-wrap mt-2"><button type="button" class="btn btn-subtle theme-secondary" id="bnPick">${bi('image')} ${bc.bgId ? 'Anderes Foto wählen' : 'Foto wählen'}</button>${bc.bgId ? `<button type="button" class="btn btn-text theme-danger" id="bnRemove">${bi('trash')} Foto entfernen</button>` : ''}</div><input type="file" id="bnFile" accept="image/*" hidden>
      <label for="bnDim" class="mt-3">Abdunkeln: <span id="bnDimVal">${bc.dim}</span> %</label><input type="range" id="bnDim" min="30" max="80" step="5" value="${bc.dim}" aria-valuetext="${bc.dim} Prozent">
      <b class="d-block mt-2">Bildausschnitt</b><div class="seg mt-2" role="group" aria-label="Bildausschnitt" style="margin-bottom:0">${[['top', 'Oben'], ['center', 'Mitte'], ['bottom', 'Unten']].map(([k, l]) => `<button type="button" data-bnpos="${k}" class="${bc.pos === k ? 'on' : ''}" aria-pressed="${bc.pos === k}">${l}</button>`).join('')}</div>
      <p class="small soft mt-2 mb-0">Das Foto wird automatisch verkleinert und abgedunkelt, damit die weiße Schrift gut lesbar bleibt.</p></div>` : ''}
    <div class="todo mt-3"><input type="checkbox" id="bnCompact" ${bc.compact ? 'checked' : ''}><label for="bnCompact" class="keep" style="margin:0;font-weight:400;flex:1">Kompakt (weniger Höhe)</label></div>
    <b class="d-block mt-3">Vorschau</b><div id="bannerPrev" class="mt-2">${heroHTML() || '<div class="card center soft">Der Banner ist leer und wird auf der Startseite nicht angezeigt.</div>'}</div>
    <button type="button" class="btn btn-text mt-2" id="bnReset">Auf Standard zurücksetzen</button>`;
  view.innerHTML = `
    <div class="title-bar"><h1>Einstellungen</h1>${searchBoxHTML()}</div><p class="soft">Tippe einen Bereich an, dann klappt er auf. Es ist immer nur einer offen, so bleibt alles übersichtlich.</p>
    <h2 class="set-group">Eure App</h2>
    ${acc('brand', 'tag-fill', 'Name der App', esc(brandFull()), brandEditorHTML())}
    ${isStandalone() ? '' : acc('install', 'download', 'App installieren?', 'Auf den Startbildschirm, ohne Browserleiste', `<p class="small soft">Mit der Installation startet BABYLOVE wie jede andere App, auch ohne Internet. Diese Frage erscheint nur, solange die App noch nicht installiert ist.</p><button class="btn btn-solid theme-primary" id="openInstall" type="button">${bi('download')} Installieren oder Anleitung zeigen</button>`)}
    ${acc('home', 'sliders', 'Startseite einrichten', 'Welche Bausteine du siehst und in welcher Reihenfolge', go('#/homeconfig', 'Startseite anpassen'))}
    ${acc('nav', 'layout-three-columns', 'Menü unten', s.navIcon === 'photo' ? 'Profilfoto statt Herz' : 'Herz in der Lieblingsfarbe', `<p class="small soft">Was soll unten bei Mama und Papa stehen?</p><div class="seg" role="group" aria-label="Symbol im Menü" style="margin:0">${[['heart', 'Herz in der Lieblingsfarbe'], ['photo', 'Profilfoto']].map(([k, l]) => `<button type="button" data-navicon="${k}" class="${(s.navIcon || 'heart') === k ? 'on' : ''}" aria-pressed="${(s.navIcon || 'heart') === k}">${l}</button>`).join('')}</div>${s.navIcon === 'photo' && !photosOf('mama').length && !photosOf('partner').length ? '<p class="small soft mt-2 mb-0">Noch kein Profilfoto vorhanden. Bis dahin zeigt das Menü das Herz. Fotos lädst du bei Mama und Papa hoch.</p>' : '<p class="small soft mt-2 mb-0">Standard ist das Herz in der Lieblingsfarbe.</p>'}<b class="d-block mt-3">Welche Symbole stehen unten?</b><p class="small soft">Wähle 2 bis 5 Symbole. Standard: Heute, Tagebuch, ${esc(navLabel('mama'))} und ${esc(navLabel('papa'))}.</p><div class="nav-pick">${(() => { const cur = navKeys(), all = [...cur, ...Object.keys(NAV_ITEMS).filter(k => !cur.includes(k))]; return all.map(k => { const i = cur.indexOf(k), on = i >= 0; return `<div class="hm-row"><label class="keep hm-text" for="np_${k}"><b>${esc(navLabel(k))}</b>${on ? `<span class="small soft">Platz ${i + 1} von ${cur.length}</span>` : ''}</label>${on ? `<button type="button" class="btn btn-subtle btn-sm" data-nup="${k}" aria-label="${esc(navLabel(k))} nach links" ${i === 0 ? 'disabled' : ''}>${bi('arrow-left')}</button><button type="button" class="btn btn-subtle btn-sm" data-ndown="${k}" aria-label="${esc(navLabel(k))} nach rechts" ${i === cur.length - 1 ? 'disabled' : ''}>${bi('arrow-right')}</button>` : ''}<input type="checkbox" role="switch" id="np_${k}" data-np="${k}" ${on ? 'checked' : ''} aria-label="${esc(navLabel(k))} im Menü"></div>`; }).join(''); })()}</div><button type="button" class="btn btn-subtle theme-secondary mt-2" id="navReset">${bi('arrow-counterclockwise')} Standard wiederherstellen</button>`)}
    <h2 class="set-group">Aussehen</h2>
    ${acc('colors', 'palette2', 'Farben', `${esc(themeDef(s.theme).name)} · eure Farbwelt`, `<p class="small soft">Acht weiche Farbwelten oder eine eigene Kombination, dazu eine Lieblingsfarbe für Mama, Papa und das Baby.</p>${go('#/colors', 'Farben ändern')}`)}
    ${acc('banner', 'image', 'Banner der Startseite', esc(bannerSub()), bannerBody)}
    ${acc('mode', 'circle-half', 'Darstellung', modeLabel, `<div class="seg" style="margin:0">${[['auto', 'Automatisch'], ['light', 'Hell'], ['dark', 'Dunkel']].map(([k, l]) => `<button data-md="${k}" class="${s.mode === k ? 'on' : ''}">${l}</button>`).join('')}</div>`)}
    ${acc('font', 'fonts', 'Schrift', `${esc((FONT_FAMILIES[s.fontFamily] || FONT_FAMILIES.soft).label)} · ${fontScale()} %`, fontBody)}
    ${acc('hints', 'chat-dots', 'Hinweise nach dem Speichern', s.toasts === true ? 'An, kurze Bestätigung unten' : 'Aus, nur Probleme melden sich', `<p class="small soft">Nach dem Speichern kann unten kurz eine Bestätigung erscheinen. Standard ist aus, damit nichts nervt. Hinweise zu Problemen und Fehlern bleiben immer sichtbar.</p><div class="hm-row" style="border:0;padding:0"><label class="keep hm-text" for="toastSw"><b>Bestätigungen anzeigen</b></label><input type="checkbox" role="switch" id="toastSw" ${s.toasts === true ? 'checked' : ''} aria-label="Bestätigungen anzeigen"></div>`)}
    <h2 class="set-group">Inhalte</h2>
    ${acc('quotes', 'chat-quote', 'Eigene Sprüche und Mundart', 'Sprüche importieren, fünf Mundarten wählen (auch Sächsisch und Ostfriesisch)', go('#/quotes', 'Sprüche und Mundart'))}
    ${acc('city', 'geo-alt-fill', 'Ort für Tipps', esc(tipsCity()), `<p class="small soft">In welcher Stadt wohnt ihr? Für Frankfurt gibt es ausgewählte Anlaufstellen, für jeden anderen Ort sammelt ihr eigene.</p><label for="cityInput">Stadt oder Region</label><input id="cityInput" maxlength="40" value="${esc(s.tipsCity || '')}" placeholder="Frankfurt" autocomplete="off"><div class="hstack gap-2 mt-2">${go('#/tips', 'Zu den Tipps')}</div>`)}
    <h2 class="set-group">Sicherheit und Daten</h2>
    ${acc('lock', 'shield-lock-fill', 'App-Sperre', `${s.lock && s.lock.hash ? 'Aktiv' : 'Aus'} · eine PIN schützt die ganze App`, go('#/applock', 'PIN verwalten'))}
    ${acc('backup', 'shield-lock', 'Datensicherung', `${last ? `Letztes Backup vor ${daysSince(last)} Tagen` : 'Noch kein Backup'} · Erinnerung alle ${backupDays()} Tage`, go('#/backup', 'Zur Datensicherung'))}
    ${acc('storage', 'hdd', 'Speicherplatz', 'Wie viel Platz Texte und Bilder auf diesem Gerät brauchen', `<div class="storage-box" id="storageBox" aria-live="polite"><p class="small soft">Wird berechnet …</p></div><p class="small soft">Alles liegt nur auf diesem Gerät. Wer nicht mehr gebrauchte Fotos löscht, schafft wieder Platz.</p>`)}
    ${acc('export', 'box-arrow-up', 'Datenexport', 'Alles lesbar mitnehmen: JSON, CSV oder HTML', go('#/export', 'Daten exportieren'))}
    ${acc('privacy', 'shield-check', 'Datenschutz und Sicherheit', 'Offen erklärt: Deine Daten bleiben bei dir', go('#/privacy', 'Datenschutz lesen'))}
    <h2 class="set-group">Hilfe und Updates</h2>
    ${acc('guide', 'compass', 'Kurzanleitung', 'So funktioniert BABYLOVE, in einer Minute erklärt', `<button class="btn btn-solid theme-primary" id="openGuide" type="button">${bi('compass')} Kurzanleitung öffnen</button>`)}
    ${acc('update', 'arrow-repeat', 'Version und Updates', `Version ${APP_VERSION.number}`, `<p class="small soft">Neue Versionen werden automatisch gesucht. Sobald eine bereitsteht, erscheint der Hinweis „Neue Version verfügbar“. Eure Daten bleiben dabei erhalten.</p><button type="button" class="btn btn-solid theme-primary" id="checkUpdate">${bi('arrow-repeat')} Nach Updates suchen</button>`)}
    <p class="small soft center">BABYLOVE ersetzt keine ärztliche oder Hebammen-Beratung. Bei Beschwerden: Frauenarzt oder Hebamme fragen, im Notfall 112.</p>
    <p class="version" id="appVersion">${esc(versionLine())}</p>
    <p class="version" id="appThanks">Viel Spaß und Freude wünscht euch Norbert Szpak</p>
    <p class="version" id="appIdeas">Wenn du Ideen hast, wie die BABYLOVE-App noch besser wird, dann schreib mir einfach eine Mail: <a href="mailto:n.szpak@web.de">n.szpak@web.de</a></p>
    <p class="version" id="appOpen">Open-Source-Projekt: offen, ohne Werbung und ohne Tracking.</p>`;
  const panels = [...view.querySelectorAll('details.acc')];
  panels.forEach(d => d.addEventListener('toggle', () => {
    if (d.open) { settingsOpen = d.dataset.acc; panels.forEach(o => { if (o !== d && o.open) o.open = false; }); }
    else if (settingsOpen === d.dataset.acc) settingsOpen = null;
  }));
  const g = $('#openGuide'); if (g) g.onclick = showGuide;
  const oi = $('#openInstall'); if (oi) oi.onclick = () => showInstall(true);
  // Banner: Inhalt, Hintergrund, Foto
  const setBanner = patch => { state.settings.banner = { ...bannerCfg(), ...patch }; save(); };
  const refreshBanner = () => { const pv = $('#bannerPrev'); if (pv) { pv.innerHTML = heroHTML() || '<div class="card center soft">Der Banner ist leer und wird auf der Startseite nicht angezeigt.</div>'; hydrateImages(pv); } const sub = $('[data-sub="banner"]'); if (sub) sub.textContent = bannerSub(); };
  view.querySelectorAll('[data-bn]').forEach(i => i.onchange = () => { setBanner({ [i.dataset.bn]: i.checked }); refreshBanner(); });
  $('#bnCompact').onchange = e => { setBanner({ compact: e.target.checked }); refreshBanner(); };
  view.querySelectorAll('[data-bnbg]').forEach(b => b.onclick = () => { setBanner({ bg: b.dataset.bnbg }); render(); toast('Hintergrund: ' + bgName[b.dataset.bnbg]); });
  view.querySelectorAll('[data-bncolor]').forEach(b => b.onclick = () => { setBanner({ color: b.dataset.bncolor }); render(); toast('Bannerfarbe geändert'); });
  view.querySelectorAll('[data-bnpos]').forEach(b => b.onclick = () => { setBanner({ pos: b.dataset.bnpos }); render(); });
  const pick = $('#bnPick'), file = $('#bnFile');
  if (pick) pick.onclick = () => file.click();
  if (file) file.onchange = async e => { const f = e.target.files[0]; e.target.value = ''; if (!f) return; try { const old = bannerCfg().bgId, id = await storeBanner(f); if (old) await delImg(old).catch(() => {}); setBanner({ bgId: id, bg: 'photo' }); render(); toast('Neues Bannerbild gespeichert. Schaut auf der Startseite vorbei!'); } catch { toast('Bild konnte nicht gelesen werden'); } };
  const rm = $('#bnRemove'); if (rm) rm.onclick = async () => { const old = bannerCfg().bgId; if (old) await delImg(old).catch(() => {}); setBanner({ bgId: '', bg: 'gradient' }); render(); };
  const dim = $('#bnDim'); if (dim) { dim.addEventListener('input', () => { $('#bnDimVal').textContent = dim.value; dim.setAttribute('aria-valuetext', dim.value + ' Prozent'); state.settings.banner = { ...bannerCfg(), dim: +dim.value }; refreshBanner(); }); dim.addEventListener('change', () => save()); }
  $('#bnReset').onclick = async () => { const old = bannerCfg().bgId; if (old) await delImg(old).catch(() => {}); delete state.settings.banner; save(); render(); toast('Banner ist wieder im Standard'); };
  bindBrandEditor();
  const ci = $('#cityInput'); if (ci) bindCityInput(ci, () => { const sub = $('details[data-acc="city"] summary .small'); if (sub) sub.textContent = tipsCity(); });
  view.querySelectorAll('[data-np]').forEach(cb => cb.onchange = () => {
    const k0 = cb.dataset.np, base = navKeys(), picked = cb.checked ? [...base.filter(k => k !== k0), k0] : base.filter(k => k !== k0);
    if (picked.length > NAV_MAX) { cb.checked = false; toast(`Höchstens ${NAV_MAX} Symbole passen unten ins Menü.`); return; }
    if (picked.length < NAV_MIN) { cb.checked = true; toast(`Mindestens ${NAV_MIN} Symbole bleiben im Menü.`); return; }
    s.navItems = picked; save(); buildNav(); render();
  });
  const moveNav = (k, d) => { const l = navKeys(), i = l.indexOf(k), j = i + d; if (i < 0 || j < 0 || j >= l.length) return; [l[i], l[j]] = [l[j], l[i]]; s.navItems = l; save(); buildNav(); render(); };
  view.querySelectorAll('[data-nup]').forEach(b => b.onclick = () => moveNav(b.dataset.nup, -1));
  view.querySelectorAll('[data-ndown]').forEach(b => b.onclick = () => moveNav(b.dataset.ndown, 1));
  const tsw = $('#toastSw'); if (tsw) tsw.onchange = () => { if (tsw.checked) s.toasts = true; else delete s.toasts; save(); const sub = $('[data-sub="hints"]'); if (sub) sub.textContent = tsw.checked ? 'An, kurze Bestätigung unten' : 'Aus, nur Probleme melden sich'; };
  const nr = $('#navReset'); if (nr) nr.onclick = () => { delete s.navItems; save(); buildNav(); render(); toast('Menü unten ist wieder im Standard'); };
  view.querySelectorAll('[data-navicon]').forEach(b => b.onclick = () => { if (b.dataset.navicon === 'photo') s.navIcon = 'photo'; else delete s.navIcon; save(); updateNavAvatar(); render(); toast(s.navIcon === 'photo' ? 'Im Menü stehen jetzt die Profilfotos.' : 'Im Menü stehen wieder die Herzen.'); });
  fillStorage(); if (typeof bindSearch === 'function') bindSearch(); const cu = $('#checkUpdate'); if (cu) cu.onclick = async () => { cu.disabled = true; const r = await checkForUpdate(); cu.disabled = false; toast(r === 'new' ? 'Neue Version gefunden. Sie wird gleich angeboten.' : r === 'current' ? 'Ihr habt schon die neueste Version.' : r === 'none' ? 'Updates werden in der installierten oder online geöffneten App geprüft.' : 'Updates konnten gerade nicht geprüft werden. Bitte später noch einmal versuchen.'); };
  view.querySelectorAll('[data-ff]').forEach(b => b.onclick = () => { s.fontFamily = b.dataset.ff; save(); applyTheme(); render(); cheer('style'); });
  const range = $('#fsRange'), setScale = (v, commit) => { v = Math.min(FONT_SCALE.max, Math.max(FONT_SCALE.min, Math.round(v / FONT_SCALE.step) * FONT_SCALE.step)); s.fontScale = v; range.value = v; range.setAttribute('aria-valuetext', v + ' Prozent'); $('#fsValue').textContent = v; applyTheme(); if (commit) { save(); cheer('style'); } };
  range.addEventListener('input', () => setScale(+range.value, false)); range.addEventListener('change', () => setScale(+range.value, true));
  $('#fsDown').onclick = () => setScale(fontScale() - FONT_SCALE.step, true); $('#fsUp').onclick = () => setScale(fontScale() + FONT_SCALE.step, true); $('#fsReset').onclick = () => setScale(FONT_SCALE.def, true);
  view.querySelectorAll('[data-md]').forEach(b => b.onclick = () => { s.mode = b.dataset.md; save(); applyTheme(); render(); });
};
const daysLeftText = () => { const p = pregnancy(); return p ? `${Math.max(p.left, 0)} Tage` : '0 Tage'; };

/* ---------- Backup ---------- */
const blobToData = b => new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result); f.readAsDataURL(b); });
async function exportData() {
  const ids = [...state.diary.map(d => d.photoId), ...state.photos.map(p => p.photoId), ...state.milestones.map(m => m.photoId),
    ...state.pass.map(p => p.photoId), ...state.letters.map(l => l.audioId), ...photosOf('mama'), ...photosOf('partner'), ...photosOf('kid'), bannerCfg().bgId].filter(Boolean);
  const images = {};
  for (const id of ids) { const b = await getImg(id); if (b) images[id] = await blobToData(b); }
  const file = new Blob([JSON.stringify({ app: 'babylove', v: 1, state, images })], { type: 'application/json' });
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(file), download: `${fileSafe(brandFull()).slice(0, 48)}-backup-${iso(today())}.json` });
  a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  state.settings.lastBackup = iso(today()); state.settings.backupSnooze = ''; save();
  toast('Backup gespeichert. Gut aufbewahren, es enthält persönliche Daten.');
}

/* ---------- Backup-Erinnerung ---------- */
const backupDays = () => [7, 14, 30].includes(state.settings.backupDays) ? state.settings.backupDays : 7;
const daysSince = d => Math.round((today() - new Date(d + 'T00:00')) / DAY);
const backupRef = () => state.settings.lastBackup || state.settings.firstUse || iso(today());
const nextBackupDate = () => iso(new Date(new Date(backupRef() + 'T00:00').getTime() + backupDays() * DAY));
const hasData = () => ['diary', 'photos', 'letters', 'names', 'wishes', 'vits', 'contacts', 'pass', 'baby', 'appts'].some(k => (state[k] || []).length) || state.milestones.some(m => m.date);
function maybeAskBackup() {
  if (appLocked || !state.settings.dueDate || sheet.open || !hasData() || $('#splash')) return;
  if (daysSince(backupRef()) < backupDays() || state.settings.backupSnooze === iso(today())) return;
  const last = state.settings.lastBackup;
  openSheet(`<h2 style="margin-top:0">Zeit fürs Backup</h2>
    <p>${last ? `Dein letztes Backup ist ${daysSince(last)} Tage her.` : 'Du hast noch nie ein Backup gemacht.'} Dein Handy kann auch mal baden gehen. Eure Erinnerungen sollen das überleben.</p>
    <p class="small soft">Die Datei enthält persönliche Daten und Fotos. Bewahre sie sicher auf.</p>
    <div class="hstack gap-2" style="margin-top:14px"><button class="btn btn-subtle theme-secondary" id="later" type="button">Morgen erinnern</button><span class="flex-grow-1"></span><button class="btn btn-solid theme-primary" id="now" type="button">${bi('download')} Jetzt sichern</button></div>`, el => {
    $('#later', el).onclick = () => { state.settings.backupSnooze = iso(today()); save(); closeSheet(); toast('Okay, bis morgen. Aber vergiss uns nicht!'); };
    $('#now', el).onclick = async () => { await exportData(); closeSheet(); if (location.hash === '#/backup') render(); };
  });
}
async function importData(e) {
  const f = e.target.files[0]; if (!f) return;
  try {
    const data = JSON.parse(await f.text());
    if (data.app !== 'babylove' || !data.state) throw new Error('format');
    if (!confirm('Aktuelle Daten werden durch das Backup ersetzt. Fortfahren?')) return;
    for (const [id, url] of Object.entries(data.images || {})) await putImg(id, await (await fetch(url)).blob());
    state = Object.assign(emptyState(), data.state); state.settings.lastBackup = iso(today()); migratePhotos(); migrateDiaries(); save(); urls.clear(); applyTheme(); location.hash = '#/'; render(); toast('Backup geladen');
  } catch { toast('Das ist keine gültige BABYLOVE-Sicherung'); }
}

/* ---------- Router ---------- */
// Personen: Frau (mama) und Mann (partner), je bis zu 3 Fotos. Die Fotos tauchen rotierend überall in der App auf.
const WHO = {
  mama: { photos: 'mamaPhotos', name: 'mama', fallback: 'Ich', nav: 'navMe', title: 'meTitle', navIcon: 'navMeIcon', navImg: 'navMeImg' },
  partner: { photos: 'partnerPhotos', name: 'partner', fallback: 'Papa', nav: 'navPa', title: 'paTitle', navIcon: 'navPaIcon', navImg: 'navPaImg' },
  kid: { photos: 'kidPhotos', name: 'nick', fallback: 'Baby' }
};
const MAX_PHOTOS = 3;
// Menü unten: frei wählbar, 2 bis 5 Symbole. Standard: Heute, Tagebuch, Name Frau, Name Mann
const NAV_ITEMS = {
  home: { route: 'home', href: '#/', icon: 'house-heart-fill', label: 'Heute' },
  diary: { route: 'diary', href: '#/diary', icon: 'journal-text', label: 'Tagebuch' },
  mama: { route: 'settings', href: '#/settings', who: 'mama' },
  papa: { route: 'papa', href: '#/papa', who: 'partner' },
  photos: { route: 'photos', href: '#/photos', icon: 'images', label: 'Fotos' },
  more: { route: 'more', href: '#/more', icon: 'grid-fill', label: 'Schatzkiste' },
  planner: { route: 'planner', href: '#/planner', icon: 'check2-square', label: 'Planer' },
  water: { route: 'water', href: '#/water', icon: 'droplet-half', label: 'Wasser' },
  yoga: { route: 'yoga', href: '#/yoga', icon: 'flower2', label: 'Yoga' },
  breathing: { route: 'breathing', href: '#/breathing', icon: 'wind', label: 'Atmen' },
  weekstory: { route: 'weekstory', href: '#/weekstory', icon: 'stars', label: 'Story' },
  wishes: { route: 'wishes', href: '#/wishes', icon: 'gift', label: 'Wünsche' },
  lists: { route: 'lists', href: '#/lists', icon: 'bag-heart', label: 'Listen' },
  letters: { route: 'letters', href: '#/letters', icon: 'envelope-heart', label: 'Briefe' },
  jokes: { route: 'jokes', href: '#/jokes', icon: 'balloon-heart-fill', label: 'Witze' }
};
const NAV_DEFAULT = ['home', 'diary', 'mama', 'papa'], NAV_MAX = 5, NAV_MIN = 2;
const navKeys = () => { const l = state.settings.navItems; const ok = Array.isArray(l) ? [...new Set(l)].filter(k => NAV_ITEMS[k]) : []; return ok.length >= NAV_MIN && ok.length <= NAV_MAX ? ok : [...NAV_DEFAULT]; };
const navLabel = k => { const it = NAV_ITEMS[k]; return it.who ? ((state.settings[WHO[it.who].name] || '').trim().slice(0, 10) || WHO[it.who].fallback) : it.label; };
function buildNav() {
  const nav = $('#nav'); if (!nav) return;
  const keys = navKeys();
  nav.innerHTML = keys.map(k => {
    const it = NAV_ITEMS[k];
    if (it.who) { const w = WHO[it.who], col = it.who === 'mama' ? 'mama' : 'papa'; return `<a href="${it.href}" data-route="${it.route}"><i class="bi bi-heart-fill" id="${w.navIcon}" style="color:var(--heart-${col})" aria-hidden="true"></i><img id="${w.navImg}" class="avatar avatar-nav" alt="" hidden><span id="${w.nav}">${esc(navLabel(k))}</span></a>`; }
    return `<a href="${it.href}" data-route="${it.route}"><i class="bi bi-${it.icon}" aria-hidden="true"></i>${it.label}</a>`;
  }).join('');
  nav.dataset.count = keys.length;
  updateNavNames(); updateNavAvatar();
}
const photosOf = who => state.settings[WHO[who].photos] || [];
const randomPhoto = who => { const p = photosOf(who); return p.length ? pick(p) : null; };
const avatar = (id, cls = '') => `<span class="avatar ${cls}">${id ? `<img data-img="${id}" alt="">` : bi('heart-fill')}</span>`;
const personAvatar = (who, cls = 'avatar-sm') => { const id = randomPhoto(who); return id ? avatar(id, cls) : ''; };
// Kleiner Foto-Stapel für Überschriften: je Person ein zufälliges Foto
const avatarStack = (cls = 'avatar-sm') => { const ids = ['mama', 'partner', 'kid'].map(randomPhoto).filter(Boolean); return ids.length ? `<span class="avatar-stack">${ids.map(i => avatar(i, cls)).join('')}</span>` : ''; };
const FAMILY_CAPTIONS = ['Euer Team', 'Zwei Herzen, ein Baby', 'Die besten Eltern-to-be der Welt', 'Ihr schafft das. Hier der Beweis.', 'Wer lacht, hat schon gewonnen'];
const familyCard = () => {
  const pool = ['mama', 'partner', 'kid'].flatMap(photosOf);
  return pool.length ? `<div class="card family"><img data-img="${pick(pool)}" alt=""><div class="small soft mt-2">${pick(FAMILY_CAPTIONS)}</div></div>` : '';
};
async function storeAvatar(file) { const id = uid(); await putImg(id, await shrink(file, 360, 60, true)); return id; }
// Früheres Papa-Tagebuch wird ins gemeinsame Tagebuch übernommen (Autor: Papa), nichts geht verloren
function migrateDiaries() {
  if (Array.isArray(state.papaDiary) && state.papaDiary.length) { state.diary.push(...state.papaDiary.map(d => ({ ...d, by: d.by || 'partner' }))); state.diary.sort((a, b) => b.date.localeCompare(a.date)); save(); }
  if ('papaDiary' in state) { delete state.papaDiary; save(); }
}
function migratePhotos() {
  const s = state.settings;
  for (const who of ['mama', 'partner']) {
    const w = WHO[who], legacy = s[who + 'PhotoId'];
    if (legacy) { s[w.photos] = [...(s[w.photos] || []), legacy].slice(0, MAX_PHOTOS); delete s[who + 'PhotoId']; save(); }
    if (!Array.isArray(s[w.photos])) s[w.photos] = [];
  }
}
// Menüpunkte unten: Name und erstes Foto je Person
function updateNavAvatar() {
  for (const who of ['mama', 'partner']) {
    const w = WHO[who], id = state.settings.navIcon === 'photo' ? photosOf(who)[0] : null, img = $('#' + w.navImg), icon = $('#' + w.navIcon);
    if (!img || !icon) continue;
    img.hidden = !id; icon.hidden = !!id;
    if (id) { img.dataset.img = id; hydrateImages($('#nav')); }
  }
}
function updateNavName(name, who = 'mama') {
  const w = WHO[who], v = String(name ?? state.settings[w.name] ?? '').trim();
  const el = $('#' + w.nav); if (el) el.textContent = v.slice(0, 10) || w.fallback;
  const t = $('#' + w.title); if (t) t.textContent = v || w.fallback;
  // Überall, wo der Name steht (z. B. Karte "Gemeinsam heute", Spruch-Überschrift), sofort mitziehen
  document.querySelectorAll(`[data-name="${who}"]`).forEach(n => { n.textContent = v || n.dataset.fallback || w.fallback; });
}
// Marke überall aktuell halten: Titel, App-Name, Kopfleiste, alle Marken-Stellen, Seitenzahl-Zeile im Druck und Name der installierten App
let brandManifestUrl = null;
// Text unter dem App-Namen: beginnt er mit "by", bekommt jeder Name ein Herz in der Lieblingsfarbe (ein Name: Mama, zwei: Mama und Papa, drei: dazu das Kind)
// Ein Herz steht nur vor Namen, die wirklich zu Mama, Papa oder Kind gehören (in deren Farbe). Freier Text bekommt kein Herz.
// Frühere Schreibweise "by A & B & C" ohne passende Namen behält die Herzen der Reihe nach (Mama, Papa, Kind).
function fillBrandBy(el, text) {
  const m = /^by\s+/i.exec(text); el.textContent = '';
  if (!m) { el.append(text); return; }
  const rest = text.slice(m[0].length), s = state.settings;
  const known = [['mama', s.mama], ['papa', s.partner], ['kid', s.nick]].map(([k, n]) => [k, String(n || '').trim()]).filter(([, n]) => n).sort((a, b) => b[1].length - a[1].length);
  const heart = key => { const h = document.createElement('i'); h.className = 'bi bi-heart-fill bh'; h.setAttribute('aria-hidden', 'true'); h.style.color = `var(--heart-${key})`; return h; };
  el.append(m[0]);
  const parts = rest.split(/\s+&\s+/), isKnown = p => known.some(([, n]) => n.toLowerCase() === p.trim().toLowerCase());
  // "by A & B (& C)" mit freien Namen: Herzen der Reihe nach, solange nicht alle Teile echte Namen aus den Einstellungen sind
  if (parts.length >= 2 && parts.length <= 3 && !parts.every(isKnown)) { parts.forEach((p, i) => { if (i) el.append(' & '); el.append(heart(['mama', 'papa', 'kid'][i]), p); }); return; }
  if (known.length) {
    const re = new RegExp('(?<![\\p{L}\\p{N}])(' + known.map(([, n]) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(?![\\p{L}\\p{N}])', 'giu');
    rest.split(re).forEach((part, i) => {
      if (i % 2) { const hit = known.find(([, n]) => n.toLowerCase() === part.toLowerCase()); if (hit) el.append(heart(hit[0])); }
      el.append(part);
    });
    return;
  }
  el.append(rest);
}
function applyBrand() {
  const name = brandName(), sub = brandSub(), full = brandFull();
  document.title = full;
  const at = document.querySelector('meta[name="apple-mobile-web-app-title"]'); if (at) at.content = full;
  document.querySelectorAll('.tb-name, .sb-name, [data-brand-name]').forEach(n => { n.textContent = name; });
  document.querySelectorAll('[data-brand-by]').forEach(n => { n.title = full; fillBrandBy(n, sub); });
  const tb = document.querySelector('.topbrand'); if (tb) tb.setAttribute('aria-label', `${full}, zur Startseite`);
  let st = document.getElementById('brandPrintStyle'); if (!st) { st = document.createElement('style'); st.id = 'brandPrintStyle'; document.head.appendChild(st); }
  st.textContent = `@media print { @page { @bottom-center { content: "${cssStr(full)} · Seite " counter(page); font: 9pt 'Segoe UI', Arial, sans-serif; color: #6e5a59; } } }`;
  // Name der installierten App: eigenes Manifest, sobald ein eigener Name gewählt ist
  const link = document.querySelector('link[rel="manifest"]'); if (!link) return;
  if (isDefaultBrand()) { if (brandManifestUrl) { URL.revokeObjectURL(brandManifestUrl); brandManifestUrl = null; } if (link.getAttribute('href') !== 'manifest.webmanifest') link.setAttribute('href', 'manifest.webmanifest'); return; }
  const base = new URL('./', location.href).href, u = p => new URL(p, location.href).href;
  const m = { name: full, short_name: name.length > 30 ? name.slice(0, 29) + '…' : name, description: 'Begleite deine Schwangerschaft mit Liebe, Humor und eigenen Bildern.', lang: 'de', id: base, start_url: base + 'index.html', scope: base, display: 'standalone', orientation: 'portrait', background_color: '#FAF3F6', theme_color: '#A0537A',
    icons: [{ src: u('icons/icon-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' }, { src: u('icons/icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' }, { src: u('icons/icon-512-maskable.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' }] };
  if (brandManifestUrl) URL.revokeObjectURL(brandManifestUrl);
  brandManifestUrl = URL.createObjectURL(new Blob([JSON.stringify(m)], { type: 'application/manifest+json' })); link.setAttribute('href', brandManifestUrl);
}
// Einstellungen ganz oben: App-Name und Text darunter, beides frei wählbar
function brandEditorHTML() {
  const s = state.settings;
  return `<div id="brandCard">
    <p class="small soft">So heißt eure App. Der Name erscheint überall: Kopfleiste, Begrüßung, Ausdrucke und Exporte.</p>
    <label for="brandName">App-Name</label>
    <input id="brandName" maxlength="${BRAND_NAME_MAX}" value="${esc(cleanBrandName(s.appName))}" placeholder="${BRAND_NAME_DEFAULT}" autocomplete="off">
    <label for="brandSub" class="mt-2">Text darunter</label>
    <input id="brandSub" maxlength="${BRAND_SUB_MAX}" value="${esc(cleanBrandSub(s.appSub))}" placeholder="${BRAND_SUB_DEFAULT}" autocomplete="off" aria-describedby="brandCount">
    <div class="hstack justify-content-between mt-1"><span class="small soft" id="brandCount">${cleanBrandSub(s.appSub).length} von ${BRAND_SUB_MAX} Zeichen</span><button class="btn btn-text btn-sm" id="brandReset" type="button">Zurücksetzen</button></div>
    <div class="brand-preview" id="brandPreview" aria-live="polite">${esc(brandFull())}</div></div>`;
}
function bindBrandEditor() {
  const n = $('#brandName'), t = $('#brandSub'); if (!n || !t) return;
  const refresh = () => { applyBrand(); $('#brandPreview').textContent = brandFull(); const bs = $('#accBrandSub'); if (bs) bs.textContent = brandFull(); const ver = $('#appVersion'); if (ver) ver.textContent = versionLine(); $('#brandCount').textContent = `${cleanBrandSub(t.value).length} von ${BRAND_SUB_MAX} Zeichen`; };
  const put = (key, el, clean) => { const v = clean(el.value); if (v) state.settings[key] = v; else delete state.settings[key]; save(); refresh(); };
  n.addEventListener('input', () => put('appName', n, cleanBrandName));
  t.addEventListener('input', () => put('appSub', t, cleanBrandSub));
  n.addEventListener('change', () => { n.value = state.settings.appName || ''; cheer('style'); });
  t.addEventListener('change', () => { t.value = state.settings.appSub || ''; cheer('style'); });
  $('#brandReset').onclick = () => { delete state.settings.appName; delete state.settings.appSub; n.value = ''; t.value = ''; save(); refresh(); cheer('style'); };
}const updateNavNames = () => { updateNavName(undefined, 'mama'); updateNavName(undefined, 'partner'); };
Object.assign(routes, EXTRA_ROUTES);
const SUBPAGES = new Set(['partner', 'letters', 'names', 'milestones', 'wishes', 'lists', 'planner', 'recipes', 'food', 'move', 'vits', 'water', 'breathing', 'yoga', 'jokes', 'weekstory', 'contacts', 'pass', 'baby', 'tips', 'colors', 'backup']);
const SETTINGS_PAGES = new Set(['einstellungen', 'colors', 'backup', 'homeconfig', 'applock', 'quotes', 'export', 'privacy']); // eigener Bereich, ohne Tab unten
const SETTINGS_SUB = new Set(['colors', 'backup', 'homeconfig', 'applock', 'quotes', 'export', 'privacy']);
// Unterseiten mit eigener Rücksprung-Adresse und passendem Menüpunkt unten
const BACK = { diaryprint: ['#/diary', 'Tagebuch'], wishprint: ['#/wishes', 'Wunschliste'], lettersprint: ['#/letters', 'Briefe ans Baby'], wishlistprint: ['#/wishes', 'Wunschliste'] };
const NAV_FOR = { diaryprint: 'diary', wishprint: 'more', wishlistprint: 'more', lettersprint: 'more', photos: 'diary' };
// Wer eine Seite von der Startseite aus öffnet (Favorit, Schnellzugriff), landet mit Zurück auch wieder dort und nicht in der Schatzkiste
let lastKey = null, cameFromHome = false;
function render() {
  const name = location.hash.replace(/^#\//, '') || 'home';
  const needsSetup = !state.settings.dueDate;
  const key = needsSetup ? 'onboarding' : (routes[name] ? name : 'home');
  if (key !== lastKey) cameFromHome = lastKey === 'home' && SUBPAGES.has(key);
  const navKey = NAV_FOR[key] || (SETTINGS_PAGES.has(key) ? null : SUBPAGES.has(key) ? (cameFromHome ? 'home' : 'more') : key);
  document.body.classList.toggle('onboarding', needsSetup);
  const inNav = [...document.querySelectorAll('#nav a')].map(a => a.dataset.route), navOn = inNav.includes(key) ? key : navKey;
  document.querySelectorAll('#nav a').forEach(a => a.classList.toggle('active', a.dataset.route === navOn));
  // Schatzkiste und Einstellungen stehen oben rechts: dort zeigt sich, wo man gerade ist
  const topHome = $('#topHome'); if (topHome) topHome.classList.toggle('active', key === 'home');
  const topMore = $('#topMore'), topSet = $('#topSettings');
  if (topMore) topMore.classList.toggle('active', navKey === 'more' && key !== 'einstellungen');
  if (topSet) topSet.classList.toggle('active', SETTINGS_PAGES.has(key));
  updateNavNames();
  updateNavAvatar();
  applyBrand(); startRetitle(); retitleAll();
  document.body.classList.toggle('has-topbar', !needsSetup);
  routes[key]();
  // Überschriften: Emojis entfernen, stattdessen ein einheitliches Icon-Badge
  const h1 = view.querySelector('h1'), pi = key === 'papa' || key === 'settings' ? null : PAGE_ICON[key];
  if (h1 && pi) {
    h1.innerHTML = h1.innerHTML.replace(/\p{Extended_Pictographic}\uFE0F?(\u200D\p{Extended_Pictographic}\uFE0F?)*/gu, '').trim();
    h1.insertAdjacentHTML('afterbegin', `<span class="h-ico">${bi(pi)}</span>`);
    h1.classList.add('h-with-ico');
  }
  // Kennzeichnung unter der Überschrift: Mama, Papa oder gemeinsam (zwei Herzen)
  const au = PAGE_AUDIENCE[key];
  if (h1 && au) (h1.closest('.title-bar') || h1).insertAdjacentHTML('afterend', `<div class="aud-row">${audBadge(au)}${key === 'home' ? '' : namesTag()}</div>`);
  if (h1 && pinInfo()[key]) { if (!view.querySelector('.aud-row')) (h1.closest('.title-bar') || h1).insertAdjacentHTML('afterend', '<div class="aud-row"></div>'); view.querySelector('.aud-row').insertAdjacentHTML('beforeend', pinBtnHTML(key)); bindPinBtn(); }
  // Immer gleiche Orientierung: Häuschen mit Herz (Startseite) und ein Schritt zurück in den Bereich
  const backTo = BACK[key] ? BACK[key] : SETTINGS_SUB.has(key) ? ['#/einstellungen', 'Einstellungen'] : SUBPAGES.has(key) ? (cameFromHome ? ['#/', 'Startseite'] : ['#/more', 'Schatzkiste']) : null;
  if (backTo) view.insertAdjacentHTML('afterbegin', `<div class="back-row no-print"><a href="#/" class="back-home" aria-label="Zur Startseite" title="Zur Startseite">${bi('house-heart-fill')}</a><a href="${backTo[0]}" class="back" aria-label="Zurück zu ${backTo[1]}">${bi('arrow-left-circle-fill')} Zurück zu ${backTo[1]}</a></div>`);
  if (backTo) view.insertAdjacentHTML('beforeend', `<div class="back-foot no-print"><a href="${backTo[0]}" class="back-bottom">${bi('arrow-left')} Zurück zu ${backTo[1]}</a></div>`);
  view.insertAdjacentHTML('beforeend', `<div class="brand-foot"><span data-brand-name>${esc(brandName())}</span> <i data-brand-by>${esc(brandSub())}</i></div>`);
  enhance(view);
  if (typeof applySearchMark === 'function') applySearchMark(key);
  hydrateImages();
  if (key !== lastKey) window.scrollTo(0, 0);
  lastKey = key;
}
window.addEventListener('hashchange', () => { closeSheet(); render(); });

if (!state.settings.firstUse) { state.settings.firstUse = iso(today()); save(); }
migratePhotos();
migrateDiaries();
$('#topShare').onclick = shareApp;
// Klick auf den App-Namen oben links: immer zur Startseite und ganz nach oben (auch wenn man schon dort ist)
$('.topbrand').addEventListener('click', e => { e.preventDefault(); const onHome = ['', '#', '#/'].includes(location.hash); if (!onHome) location.hash = '#/'; else render(); document.documentElement.scrollTop = 0; document.body.scrollTop = 0; window.scrollTo(0, 0); });
const syncTopbar = () => { const t = $('#topbar'); if (t && t.offsetHeight) document.documentElement.style.setProperty('--topbar-h', t.offsetHeight + 'px'); };
syncTopbar(); window.addEventListener('resize', syncTopbar);
buildNav();
applyTheme();
render();
syncTopbar();
appStart();
setTimeout(maybeAskBackup, 800);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') maybeAskBackup(); });
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  navigator.serviceWorker.register('sw.js', { scope: './', updateViaCache: 'none' }).then(trackUpdates).catch(() => {});
}
// Updates: neue Version erkennen, anbieten oder beim Start automatisch einspielen
let swReg = null, reloading = false;
function showUpdateBanner(worker) {
  if ($('#updateBanner')) return;
  const b = document.createElement('div');
  b.id = 'updateBanner'; b.className = 'update-banner'; b.setAttribute('role', 'status');
  b.innerHTML = `<i class="bi bi-arrow-repeat" aria-hidden="true"></i><div><strong>Neue Version verfügbar</strong><span>Ein kurzes Update, eure Daten bleiben erhalten.</span></div><button class="btn btn-primary btn-sm" id="updNow">Jetzt aktualisieren</button><button class="btn btn-link btn-sm" id="updLater">Später</button>`;
  document.body.appendChild(b);
  $('#updNow').onclick = () => applyUpdate(worker);
  $('#updLater').onclick = () => b.remove();
}
function applyUpdate(worker) {
  const w = worker || (swReg && swReg.waiting);
  if (w) w.postMessage({ type: 'SKIP_WAITING' }); else location.reload();
}
function trackUpdates(reg) {
  swReg = reg;
  if (!reg) return;
  const watch = w => w && w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) showUpdateBanner(w); });
  reg.addEventListener('updatefound', () => watch(reg.installing));
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (reloading) return; reloading = true; location.reload(); });
  if (reg.waiting && navigator.serviceWorker.controller) {
    let tried = false;
    try { tried = sessionStorage.getItem('babylove:autoUpd') === '1'; sessionStorage.setItem('babylove:autoUpd', '1'); } catch (e) {}
    if (tried) showUpdateBanner(reg.waiting); else applyUpdate(reg.waiting);
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reg.update().catch(() => {}); });
  setInterval(() => reg.update().catch(() => {}), 30 * 60 * 1000);
}
async function checkForUpdate() {
  if (!swReg) return 'none';
  try {
    await swReg.update();
    if (swReg.waiting || swReg.installing) { if (swReg.waiting) showUpdateBanner(swReg.waiting); return 'new'; }
    return 'current';
  } catch (e) { return 'error'; }
}

// Speicherplatz: Texte (localStorage) und Bilder (IndexedDB) auf diesem Gerät
const fmtBytes = n => n < 1024 ? `${n} Byte` : n < 1048576 ? `${(n / 1024).toFixed(1).replace('.', ',')} KB` : `${(n / 1048576).toFixed(1).replace('.', ',')} MB`;
async function storageUsage() {
  let text = 0, imgBytes = 0, imgCount = 0, quota = 0;
  try { text = new Blob([localStorage.getItem(KEY) || '']).size; } catch (e) {}
  try {
    const db = await idb;
    await new Promise(res => {
      const req = db.transaction('img', 'readonly').objectStore('img').openCursor();
      req.onsuccess = () => { const c = req.result; if (!c) return res(); imgCount++; imgBytes += (c.value && c.value.size) || 0; c.continue(); };
      req.onerror = () => res();
    });
  } catch (e) {}
  try { if (navigator.storage && navigator.storage.estimate) quota = (await navigator.storage.estimate()).quota || 0; } catch (e) {}
  return { text, imgBytes, imgCount, quota, total: text + imgBytes };
}
async function fillStorage() {
  const box = $('#storageBox'); if (!box) return;
  const u = await storageUsage(); if (!$('#storageBox')) return;
  const share = u.quota ? `<tr><th scope="row">Anteil am Gerätespeicher der App</th><td>${(u.total / u.quota * 100).toFixed(2).replace('.', ',')} %</td></tr>` : '';
  box.innerHTML = `<table class="table table-sm mb-2"><tbody><tr><th scope="row">Texte und Einstellungen</th><td>${fmtBytes(u.text)}</td></tr><tr><th scope="row">Bilder (${u.imgCount})</th><td>${fmtBytes(u.imgBytes)}</td></tr><tr><th scope="row">Gesamt</th><td><strong>${fmtBytes(u.total)}</strong></td></tr>${share}</tbody></table>`;
}