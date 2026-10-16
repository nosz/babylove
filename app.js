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
function toast(msg) {
  const t = $('#toast');
  t.textContent = personalize(msg); t.classList.add('show');
  clearTimeout(toast.id); toast.id = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ---------- Speicher: Daten in localStorage, Bilder in IndexedDB (nur lokal) ---------- */
const KEY = 'babylove:v1';
const emptyState = () => ({
  settings: { dueDate: '', nick: 'Krümel', secretName: '', mama: '', partner: '', theme: 'rose', mode: 'auto' },
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

// Bild verkleinern, damit der Gerätespeicher geschont wird
async function shrink(file, max = 1280) {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise(r => c.toBlob(r, 'image/jpeg', 0.82));
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
  return `<span class="aud-names"><span class="nm">${nmHeart('mama')}<span data-name="mama" data-fallback="Mama">${esc(s.mama || 'Mama')}</span></span> &amp; <span class="nm">${nmHeart('papa')}<span data-name="partner" data-fallback="Papa">${esc(s.partner || 'Papa')}</span></span> &amp; <span class="nm">${nmHeart('kid')}<span data-kid>${esc(s.nick || 'Baby')}</span></span></span>`; };

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
function themeVars(id, dark) {
  const t = THEME_DEFS[id] || THEME_DEFS.rose;
  if (!dark) return { '--bg': t.bg, '--surface': '#FFFFFF', '--surface-2': t.s2, '--line': t.line, '--text': t.text, '--text-soft': t.soft,
    '--primary': t.primary, '--primary-strong': t.strong, '--on-primary': '#FFFFFF', '--accent': t.accent, '--shadow': '0 6px 20px rgba(80, 50, 50, .08)' };
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
  if (!isHex(v)) { const t = themeVars(v, dark); return { heart: t['--primary'], bg: t['--surface-2'], fg: t['--primary-strong'], bd: t['--line'] }; }
  const [h, s, l0] = hexToHsl(v), sat = s < 8 ? 0 : Math.max(30, Math.min(s, 85));
  if (!dark) {
    const bg = hslToHex(h, Math.min(sat, 60), 95), bd = hslToHex(h, Math.min(sat, 50), 82); let l = 36, fg = hslToHex(h, sat, l);
    while (contrastHex(fg, bg) < 4.8 && l > 4) { l -= 2; fg = hslToHex(h, sat, l); }
    let heart = v, hl = l0; while (contrastHex(heart, '#FFFFFF') < 2 && hl > 8) { hl -= 3; heart = hslToHex(h, s, hl); }
    return { heart, bg, fg, bd };
  }
  const bg = hslToHex(h, sat ? 24 : 0, 18), bd = hslToHex(h, sat ? 20 : 0, 32); let l = 78, fg = hslToHex(h, Math.min(sat, 70), l);
  while (contrastHex(fg, bg) < 4.8 && l < 98) { l += 2; fg = hslToHex(h, Math.min(sat, 70), l); }
  let heart = v, hl = l0; while (contrastHex(heart, bg) < 2.5 && hl < 92) { hl += 3; heart = hslToHex(h, s, hl); }
  return { heart, bg, fg, bd };
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
  if (!THEME_DEFS[s.theme]) s.theme = 'rose';
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
  $('meta[name="theme-color"]').content = getComputedStyle(root).getPropertyValue('--bg').trim() || THEME_DEFS[s.theme].bg;
}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

/* ---------- Dialog ---------- */
function enhance(root) {
  root.querySelectorAll('input:not([type=checkbox]):not([type=hidden]):not([type=color]),textarea,select').forEach(e => e.classList.add('form-control'));
  root.querySelectorAll('label:not(.keep)').forEach(l => l.classList.add('form-label'));
}
function openSheet(html, onMount) {
  sheet.innerHTML = html;
  enhance(sheet);
  if (!sheet.open) sheet.showModal();
  onMount && onMount(sheet);
  hydrateImages(sheet);
}
const closeSheet = () => sheet.open && sheet.close();
sheet.addEventListener('click', e => { if (e.target === sheet) closeSheet(); });

/* ---------- Ansichten ---------- */
const routes = {};

routes.onboarding = () => {
  document.body.classList.add('onboarding');
  view.innerHTML = `
    <div class="center" style="padding-top:24px"><div class="empty-ico" style="width:88px;height:88px;font-size:2.6rem">${bi('heart-fill')}</div>
      <h1>Willkommen bei BABYLOVE</h1>
      <p class="brand" style="margin-top:-2px"><span data-brand-by>${esc(brandSub())}</span></p>
      <p class="soft">Eure kleine Reise, nur für euch. Alles bleibt auf diesem Gerät – kein Konto, keine Cloud, kein Verrat.</p></div>
    <form class="card" id="ob">
      <label for="due">Errechneter Geburtstermin</label>
      <input id="due" type="date" required>
      <label for="mama">Dein Name (optional)</label>
      <input id="mama" autocomplete="given-name" placeholder="z. B. Anna">
      <label for="partner">Name von Papa / Partner (optional)</label>
      <input id="partner" placeholder="z. B. Max">
      <label for="nick">Kosename fürs Baby</label>
      <input id="nick" value="Krümel" maxlength="24">
      <p class="small soft" style="margin-top:12px">Den echten Namen kannst du später in den Einstellungen geheim hinterlegen – er wird nur nach Antippen sichtbar.</p>
      <button class="flex-grow-1" style="width:100%;margin-top:8px">Los geht’s</button>
    </form>`;
  $('#ob').onsubmit = e => {
    e.preventDefault();
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
  family:    { label: 'Foto von euch', desc: 'Zufällig aus euren Profilfotos', icon: 'image' },
  secret:    { label: 'Der geheime Name', desc: 'Verdeckt, nur auf Antippen sichtbar', icon: 'lock-fill' },
  milestone: { label: 'Meilenstein der Woche', desc: 'Ein Hinweis, sobald eine Etappe erreicht ist', icon: 'stars' },
  planner:   { label: 'To-dos und Termine', desc: 'Offene Aufgaben und der nächste Termin', icon: 'check2-square' },
  tips:      { label: 'Frankfurt-Tipps', desc: 'Hebammen, Kurse, Beratung, Infoabende', icon: 'geo-alt-fill' },
  last:      { label: 'Zuletzt festgehalten', desc: 'Das neueste Foto aus Tagebuch oder Album', icon: 'clock-history' }
};
const HOME_DEFAULT = { order: Object.keys(HOME_MODULES), on: ['quick', 'together', 'daily', 'family', 'secret'] };
const HOME_PRESETS = { simple: ['quick', 'together', 'daily'], all: Object.keys(HOME_MODULES), default: HOME_DEFAULT.on };

function homeLayout() {
  const c = state.settings.home || {};
  const order = (c.order || HOME_DEFAULT.order).filter(id => HOME_MODULES[id]);
  for (const id of Object.keys(HOME_MODULES)) if (!order.includes(id)) order.push(id); // neue Bausteine nach Updates anhängen
  return { order, on: new Set((c.on || HOME_DEFAULT.on).filter(id => HOME_MODULES[id])) };
}
const saveHome = (order, on) => { state.settings.home = { order, on: [...on] }; save(); };

const HOME_RENDER = {
  quick: () => `<div class="quick">${[['diary', 'journal-text', 'Tagebuch'], ['photos', 'images', 'Fotos'], ['water', 'droplet-half', 'Wasser'], ['planner', 'check2-square', 'Aufgaben']]
    .map(([r, i, l]) => `<a class="quick-btn" href="#/${r}">${bi(i)}<span>${l}</span></a>`).join('')}</div>`,
  together: () => togetherCard(),
  daily: () => `<div class="card daily"><div class="mb-2">${audBadge('mama', 'sm')}</div><p class="quote mb-0">${esc(dailyMsg())}</p>
    <div class="hstack gap-2 mt-3 pt-3 daily-sep">${personAvatar('partner') || bi('person-heart')}${audBadge('papa', 'sm')}<b class="flex-grow-1">Für ${state.settings.partner ? esc(state.settings.partner) : 'den Papa / Partner'}</b>
      <button class="btn btn-subtle theme-secondary btn-sm" id="newPartnerMsg" aria-label="Neuer Spruch">${bi('arrow-repeat')}</button></div>
    <p class="mb-0 mt-1" id="partnerMsg">${esc(partnerMsgToday())}</p></div>`,
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
  tips: () => `<a class="card link-card" href="#/tips"><div class="hstack gap-3">${bi('geo-alt-fill')}<div class="flex-grow-1"><b>Tipps für Schwangere in Frankfurt</b><div class="small soft">Hebammen, Kurse, Beratung, Infoabende</div></div>${bi('chevron-right')}</div></a>`,
  last: () => { const last = state.photos[0] || state.diary.find(d => d.photoId);
    return last ? `<div class="card"><div class="small soft mb-2">Zuletzt festgehalten</div><img data-img="${last.photoId}" alt="" style="width:100%;border-radius:14px;display:block"></div>` : ''; }
};

routes.home = () => {
  const p = pregnancy(), s = state.settings;
  const [, name] = fruitFor(p.weeks);
  const names = [s.mama, s.partner].filter(Boolean).map(esc).join(' &amp; ');
  const greet = names ? `Hallo ${names}` : 'Hallo, ihr Superhelden';
  const { order, on } = homeLayout();
  view.innerHTML = `
    <div class="hstack gap-2">${avatarStack()}
      <div><p class="soft mb-0">${greet}</p><p class="today mb-0" id="todayLine">Heute ist ${esc(todayLong())}</p></div></div>
    <h1>${p.left > 0 ? `Noch ${daysTxt(p.left)} bis ${nick()}` : p.left === 0 ? `Heute ist ${nick()}s Termin!` : `${nick()} lässt sich Zeit (${-p.left} Tage drüber)`}</h1>
    <div class="card hero">
      <div class="hero-top"><span class="fruit" aria-hidden="true">${bi('balloon-heart-fill')}</span><div><div class="big">${p.weeks}. SSW</div><div class="hero-sub">+ ${p.days} Tag${p.days === 1 ? '' : 'e'} · ${trimester(p.weeks)}. Trimester</div></div></div>
      <div class="progress my-3" role="progressbar" aria-label="Schwangerschaftsfortschritt" aria-valuenow="${Math.round(p.pct)}" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" style="width:${p.pct}%"></div></div>
      <p class="hero-days" id="heroDays">${esc(dayLine('mama', p))}</p>
      <div class="small">${nick()} ist ungefähr so groß wie: <b>${name}</b></div>
      <div class="hero-quote-row"><p class="hero-quote" id="heroQuote">${esc(dailyPick(quotePool('hero'), 'hero'))}</p><button class="hero-refresh" id="newHeroQuote" aria-label="Neuer Spruch">${bi('arrow-repeat')}</button></div>
    </div>
    ${order.filter(id => on.has(id)).map(id => HOME_RENDER[id]()).join('')}
    <a class="home-edit" href="#/homeconfig">${bi('sliders')} Startseite anpassen</a>`;
  bindTogether();
  $('#newHeroQuote').onclick = () => { const cur = $('#heroQuote').textContent; const pool = quotePool('hero'); let q, guard = 0; do { q = pick(pool); } while (q === cur && pool.length > 1 && ++guard < 20); $('#heroQuote').textContent = q; };
  const np = $('#newPartnerMsg'); if (np) np.onclick = () => { const cur = $('#partnerMsg').textContent; let q, g = 0; do { q = partnerMsg(); } while (q === cur && ++g < 20); $('#partnerMsg').textContent = q; };
  const r = $('#reveal');
  if (r) r.onclick = () => { $('#secret').classList.add('show'); clearTimeout(r.t); r.t = setTimeout(() => $('#secret')?.classList.remove('show'), 5000); };
};

// Einstellungen: Startseite einrichten (Bausteine ein/aus, Reihenfolge)
routes.homeconfig = () => {
  const { order, on } = homeLayout();
  view.innerHTML = `
    <h1>Startseite einrichten</h1><p class="soft">Weniger ist mehr: Wähle nur, was du jeden Tag sehen willst. Begrüßung, Countdown und Wochenkarte bleiben immer.</p>
    <div class="hstack gap-2 flex-wrap mb-3">
      <button class="btn btn-subtle theme-secondary" data-preset="simple">Einfach</button>
      <button class="btn btn-subtle theme-secondary" data-preset="default">Standard</button>
      <button class="btn btn-subtle theme-secondary" data-preset="all">Alles anzeigen</button></div>
    <div class="card">${order.map((id, i) => { const m = HOME_MODULES[id];
      return `<div class="todo hm">${bi(m.icon)}<label class="keep" for="hm_${id}" style="margin:0;font-weight:400;flex:1"><b>${m.label}</b> ${audBadge('together', 'sm')}<div class="small soft">${m.desc}</div></label>
        <input type="checkbox" role="switch" id="hm_${id}" data-hm="${id}" ${on.has(id) ? 'checked' : ''} aria-label="${m.label} anzeigen">
        <button class="btn btn-subtle theme-secondary btn-sm" data-up="${id}" ${i === 0 ? 'disabled' : ''} aria-label="${m.label} nach oben">${bi('chevron-up')}</button>
        <button class="btn btn-subtle theme-secondary btn-sm" data-down="${id}" ${i === order.length - 1 ? 'disabled' : ''} aria-label="${m.label} nach unten">${bi('chevron-down')}</button></div>`; }).join('')}</div>
    <a class="btn btn-solid theme-primary w-100" href="#/">Fertig, zur Startseite</a>`;
  view.querySelectorAll('[data-hm]').forEach(c => c.onchange = () => { c.checked ? on.add(c.dataset.hm) : on.delete(c.dataset.hm); saveHome(order, on); });
  const move = (id, d) => { const i = order.indexOf(id), j = i + d; if (j < 0 || j >= order.length) return; [order[i], order[j]] = [order[j], order[i]]; saveHome(order, on); render(); };
  view.querySelectorAll('[data-up]').forEach(b => b.onclick = () => move(b.dataset.up, -1));
  view.querySelectorAll('[data-down]').forEach(b => b.onclick = () => move(b.dataset.down, 1));
  view.querySelectorAll('[data-preset]').forEach(b => b.onclick = () => { saveHome(order, new Set(HOME_PRESETS[b.dataset.preset])); render(); toast('Startseite angepasst'); });
};

// Tagebuch: für Mama (Hauptbereich) und für Papa (geschützter Papa-Bereich), gleiche Bedienung
const diaryList = () => state.diary;
const setDiaryList = (_who, list) => { state.diary = list; };
const DIARY_TEXT = {
  mama: { title: 'Tagebuch', intro: 'Euer gemeinsames Tagebuch für heute, für später und für den 18. Geburtstag. Jede und jeder schreibt, wie es passt.', empty: 'Noch leer wie ein frisch gewaschener Strampler.<br>Schreibt den ersten Eintrag!', ask: 'Wie geht’s euch?', placeholder: 'Heißhunger, Tritte, Gedanken, Aufregung …', print: 'diaryprint' }
};
// Wer hat den Eintrag geschrieben? mama, partner oder both (gemeinsam). Herz in der Lieblingsfarbe.
const authorName = by => by === 'mama' ? (state.settings.mama || 'Mama') : by === 'partner' ? (state.settings.partner || 'Papa') : 'Gemeinsam';
const authorChip = by => by ? `<span class="chip by-chip" data-by="${by}">${by === 'both' ? duoHearts() : `<i class="bi bi-heart-fill" style="color:var(--heart-${by === 'mama' ? 'mama' : 'papa'})"></i>`} ${esc(authorName(by))}</span>` : '';
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

routes.tips = () => {
  view.innerHTML = `
    <h1>Frankfurt</h1><p class="soft">Hilfe und Tipps für Schwangere in Frankfurt am Main.</p>
    <h2>Gut zu wissen</h2>
    <div class="card"><ul class="mb-0 ps-3">${FFM_TIPS.map(t => `<li class="mb-2">${esc(t)}</li>`).join('')}</ul></div>
    <h2>Anlaufstellen</h2>
    ${FFM.map(f => `<a class="card link-card" href="${f.url}" target="_blank" rel="noopener noreferrer">
      <div class="hstack gap-3 align-items-start"><i class="bi bi-${f.icon} ico" aria-hidden="true"></i>
      <div class="flex-grow-1"><b>${esc(f.title)}</b><p class="small soft mb-0">${esc(f.text)}</p></div><i class="bi bi-box-arrow-up-right soft small" aria-hidden="true"></i></div></a>`).join('')}
    <p class="small soft">Quelle: <a href="${FFM_WEGWEISER}" target="_blank" rel="noopener noreferrer">Wegweiser „Frühe Hilfen“ der Stadt Frankfurt</a>. Angaben ohne Gewähr, bitte Termine, Kosten und Öffnungszeiten beim Träger prüfen. Zum Öffnen der Links brauchst du Internet.</p>
    <p class="small soft">Bei akuten Beschwerden: Frauenarzt oder Hebamme, im Notfall 112.</p>`;
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
    <h2>Darstellung</h2>
    <div class="card"><div class="seg" style="margin:0">${[['auto', 'Automatisch'], ['light', 'Hell'], ['dark', 'Dunkel']].map(([k, l]) => `<button data-m="${k}" class="${s.mode === k ? 'on' : ''}">${l}</button>`).join('')}</div></div>`;
  view.querySelectorAll('[data-th]').forEach(b => b.onclick = () => { s.theme = b.dataset.th; save(); applyTheme(); render(); cheer('style'); });
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
const personBlock = who => {
  const s = state.settings, w = WHO[who], list = photosOf(who), inputId = who === 'mama' ? 'sm' : 'sp';
  const slots = Array.from({ length: MAX_PHOTOS }, (_, i) => list[i]
    ? `<div class="slot"><img data-img="${list[i]}" alt=""><button class="slot-del" data-pdel="${who}:${list[i]}" aria-label="Foto entfernen">${bi('x-lg')}</button></div>`
    : `<button class="slot add" data-padd="${who}" aria-label="Foto hinzufügen">${bi('plus-lg')}</button>`).join('');
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
    <p class="small soft mt-2 mb-0">Bis zu ${MAX_PHOTOS} Fotos. Sie tauchen überall in der App auf und bleiben auf diesem Gerät.</p></div>`;
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
  ti.addEventListener('input', e => { const v = cleanTitle(e.target.value); if (v) s[titleKey(who)] = v; else delete s[titleKey(who)]; retitleAll(); });
  ti.addEventListener('change', () => { save(); render(); toast(`Ab jetzt heißt es überall: ${roleTitle(who)}. Schön!`); });
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
      <label for="sd">Errechneter Termin</label><input id="sd" type="date" value="${s.dueDate}">
      <label for="sn">Kosename fürs Baby</label><input id="sn" value="${esc(s.nick)}" maxlength="24">
      <label for="ss">Geheimer Name</label><input id="ss" value="${esc(s.secretName)}" maxlength="40" autocomplete="off" placeholder="Nur Mama und Papa wissen’s">
      <p class="small soft" style="margin-top:6px">Wird nie geteilt, nie hochgeladen und auf der Startseite verdeckt angezeigt.</p>
      ${favPicker('kid', s.nick || 'das Baby', 'Lieblingsfarbe vom Baby', 'Die Farbe vom Herz deines Babys, sichtbar bei den Namen unter jeder Überschrift.')}
    </div>
    <p class="small soft center">BABYLOVE ersetzt keine ärztliche oder Hebammen-Beratung. Bei Beschwerden: Frauenarzt oder Hebamme fragen, im Notfall 112.</p>`;
  bindPerson('mama'); bindName('#sm', 'mama'); bindFav('kid');
  const bind = (id, key) => $(id).onchange = e => { s[key] = e.target.value.trim(); save(); cheer(); };
  bind('#sd', 'dueDate'); bind('#sn', 'nick'); bind('#ss', 'secretName');
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
routes.einstellungen = () => {
  const s = state.settings, last = s.lastBackup;
  setTimeout(() => {
    const g = $('#openGuide'); if (g) g.onclick = showGuide;
    bindBrandEditor();
  }, 0);
  view.innerHTML = `
    <h1>Einstellungen</h1><p class="soft">Hier stellst du die App so ein, wie sie sich für euch gut anfühlt.</p>
    ${brandEditorHTML()}
    <a class="card link-card" href="#/homeconfig"><div class="hstack gap-3">${bi('sliders')}<div class="flex-grow-1"><b>Startseite einrichten</b><div class="small soft">Welche Bausteine du siehst und in welcher Reihenfolge</div></div>${bi('chevron-right')}</div></a>
    <a class="card link-card" href="#/applock"><div class="hstack gap-3">${bi('shield-lock-fill')}<div class="flex-grow-1"><b>App-Sperre</b><div class="small soft">${s.lock && s.lock.hash ? 'Aktiv' : 'Aus'} · eine PIN schützt die ganze App</div></div>${bi('chevron-right')}</div></a>
    <button class="card link-card w-100 text-start" id="openGuide" type="button" style="border:1px solid var(--line);color:inherit;font-weight:400"><div class="hstack gap-3">${bi('compass')}<div class="flex-grow-1"><b>Kurzanleitung</b><div class="small soft">So funktioniert BABYLOVE, in einer Minute erklärt</div></div>${bi('chevron-right')}</div></button>
    <a class="card link-card" href="#/privacy"><div class="hstack gap-3">${bi('shield-check')}<div class="flex-grow-1"><b>Datenschutz und Sicherheit</b><div class="small soft">Offen erklärt: Deine Daten bleiben bei dir</div></div>${bi('chevron-right')}</div></a>
    <a class="card link-card" href="#/export"><div class="hstack gap-3">${bi('box-arrow-up')}<div class="flex-grow-1"><b>Datenexport</b><div class="small soft">Alles lesbar mitnehmen: JSON, CSV oder HTML</div></div>${bi('chevron-right')}</div></a>
    <a class="card link-card" href="#/quotes"><div class="hstack gap-3">${bi('chat-quote')}<div class="flex-grow-1"><b>Eigene Sprüche</b><div class="small soft">Sprüche importieren, die täglich wechseln</div></div>${bi('chevron-right')}</div></a>
    <a class="card link-card" href="#/colors"><div class="hstack gap-3">${bi('palette2')}<div class="flex-grow-1"><b>Farben</b><div class="small soft">${esc(THEME_DEFS[s.theme].name)} · hell, dunkel oder automatisch</div></div>${bi('chevron-right')}</div></a>
    <a class="card link-card" href="#/backup"><div class="hstack gap-3">${bi('shield-lock')}<div class="flex-grow-1"><b>Datensicherung</b><div class="small soft">${last ? `Letztes Backup vor ${daysSince(last)} Tagen` : 'Noch kein Backup'} · Erinnerung alle ${backupDays()} Tage</div></div>${bi('chevron-right')}</div></a>
    <h2>Schrift</h2>
    <div class="card" id="fontCard">
      <b id="ffLabel">Schriftart</b>
      <div class="font-list mt-2" role="radiogroup" aria-labelledby="ffLabel">${Object.entries(FONT_FAMILIES).map(([k, f]) => `<button type="button" class="font-opt ${(s.fontFamily || 'soft') === k ? 'on' : ''}" role="radio" aria-checked="${(s.fontFamily || 'soft') === k}" data-ff="${k}" style="font-family:${esc(f.stack)}"><span class="fo-name">${f.label}</span><span class="fo-sample">Aa · Du schaffst das!</span><span class="fo-note small">${f.note}</span></button>`).join('')}</div>
      <p class="small soft mt-2 mb-3">Alle Schriften sind auf jedem Gerät und in jedem Browser schon vorhanden: Sie laden schnell, funktionieren offline und übertragen nichts.</p>
      <b id="fsLabel">Schriftgröße</b>
      <div class="fs-row mt-2"><button type="button" class="btn btn-subtle theme-secondary" id="fsDown" aria-label="Schrift kleiner">${bi('dash-lg')}</button>
        <input type="range" id="fsRange" min="${FONT_SCALE.min}" max="${FONT_SCALE.max}" step="${FONT_SCALE.step}" value="${fontScale()}" aria-label="Schriftgröße in Prozent" aria-valuetext="${fontScale()} Prozent">
        <button type="button" class="btn btn-subtle theme-secondary" id="fsUp" aria-label="Schrift größer">${bi('plus-lg')}</button></div>
      <div class="hstack justify-content-between mt-1"><span class="small soft"><span id="fsValue">${fontScale()}</span> %</span><button type="button" class="btn btn-text btn-sm" id="fsReset">Zurücksetzen auf ${FONT_SCALE.def} %</button></div>
      <div class="size-preview"><b>So sieht deine Schrift aus</b><p class="mb-0 soft">Noch ${daysLeftText()} bis zum Termin. Du schaffst das, großartig!</p></div>
    </div>    <h2>Darstellung</h2>
    <div class="card"><div class="seg" style="margin:0">${[['auto', 'Automatisch'], ['light', 'Hell'], ['dark', 'Dunkel']].map(([k, l]) => `<button data-md="${k}" class="${s.mode === k ? 'on' : ''}">${l}</button>`).join('')}</div></div>
    <p class="small soft center">BABYLOVE ersetzt keine ärztliche oder Hebammen-Beratung. Bei Beschwerden: Frauenarzt oder Hebamme fragen, im Notfall 112.</p>
    <p class="version" id="appVersion">${esc(versionLine())}</p>`;
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
    ...state.pass.map(p => p.photoId), ...state.letters.map(l => l.audioId), ...photosOf('mama'), ...photosOf('partner')].filter(Boolean);
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
  partner: { photos: 'partnerPhotos', name: 'partner', fallback: 'Papa', nav: 'navPa', title: 'paTitle', navIcon: 'navPaIcon', navImg: 'navPaImg' }
};
const MAX_PHOTOS = 3;
const photosOf = who => state.settings[WHO[who].photos] || [];
const randomPhoto = who => { const p = photosOf(who); return p.length ? pick(p) : null; };
const avatar = (id, cls = '') => `<span class="avatar ${cls}">${id ? `<img data-img="${id}" alt="">` : bi('person-fill')}</span>`;
const personAvatar = (who, cls = 'avatar-sm') => { const id = randomPhoto(who); return id ? avatar(id, cls) : ''; };
// Kleiner Foto-Stapel für Überschriften: je Person ein zufälliges Foto
const avatarStack = (cls = 'avatar-sm') => { const ids = ['mama', 'partner'].map(randomPhoto).filter(Boolean); return ids.length ? `<span class="avatar-stack">${ids.map(i => avatar(i, cls)).join('')}</span>` : ''; };
const FAMILY_CAPTIONS = ['Euer Team', 'Zwei Herzen, ein Baby', 'Die besten Eltern-to-be der Welt', 'Ihr schafft das. Hier der Beweis.', 'Wer lacht, hat schon gewonnen'];
const familyCard = () => {
  const pool = ['mama', 'partner'].flatMap(photosOf);
  return pool.length ? `<div class="card family"><img data-img="${pick(pool)}" alt=""><div class="small soft mt-2">${pick(FAMILY_CAPTIONS)}</div></div>` : '';
};
async function storeAvatar(file) { const id = uid(); await putImg(id, await shrink(file, 360)); return id; }
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
    const w = WHO[who], id = photosOf(who)[0], img = $('#' + w.navImg), icon = $('#' + w.navIcon);
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
function fillBrandBy(el, text) {
  const m = /^by\s+/i.exec(text), parts = m ? text.slice(m[0].length).split(/\s+&\s+/) : [];
  const keys = parts.length === 1 ? ['mama'] : parts.length === 2 ? ['mama', 'papa'] : parts.length === 3 ? ['mama', 'papa', 'kid'] : [];
  el.textContent = '';
  if (!keys.length) { el.append(text); return; }
  el.append(m[0]);
  parts.forEach((p, i) => {
    if (i) el.append(' & ');
    const h = document.createElement('i'); h.className = 'bi bi-heart-fill bh'; h.setAttribute('aria-hidden', 'true'); h.style.color = `var(--heart-${keys[i]})`;
    el.append(h, p);
  });
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
  const m = { name: full, short_name: name.length > 30 ? name.slice(0, 29) + '…' : name, description: 'Begleite deine Schwangerschaft mit Liebe, Humor und eigenen Bildern.', lang: 'de', id: base, start_url: base + 'index.html', scope: base, display: 'standalone', orientation: 'portrait', background_color: '#FBF6F3', theme_color: '#C97B84',
    icons: [{ src: u('icons/icon-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' }, { src: u('icons/icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' }, { src: u('icons/icon-512-maskable.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' }] };
  if (brandManifestUrl) URL.revokeObjectURL(brandManifestUrl);
  brandManifestUrl = URL.createObjectURL(new Blob([JSON.stringify(m)], { type: 'application/manifest+json' })); link.setAttribute('href', brandManifestUrl);
}
// Einstellungen ganz oben: App-Name und Text darunter, beides frei wählbar
function brandEditorHTML() {
  const s = state.settings;
  return `<div class="card brand-card" id="brandCard"><div class="hstack gap-2 mb-1">${bi('tag-fill')}<b>Name der App</b></div>
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
  const refresh = () => { applyBrand(); $('#brandPreview').textContent = brandFull(); const ver = $('#appVersion'); if (ver) ver.textContent = versionLine(); $('#brandCount').textContent = `${cleanBrandSub(t.value).length} von ${BRAND_SUB_MAX} Zeichen`; };
  const put = (key, el, clean) => { const v = clean(el.value); if (v) state.settings[key] = v; else delete state.settings[key]; save(); refresh(); };
  n.addEventListener('input', () => put('appName', n, cleanBrandName));
  t.addEventListener('input', () => put('appSub', t, cleanBrandSub));
  n.addEventListener('change', () => { n.value = state.settings.appName || ''; cheer('style'); });
  t.addEventListener('change', () => { t.value = state.settings.appSub || ''; cheer('style'); });
  $('#brandReset').onclick = () => { delete state.settings.appName; delete state.settings.appSub; n.value = ''; t.value = ''; save(); refresh(); cheer('style'); };
}const updateNavNames = () => { updateNavName(undefined, 'mama'); updateNavName(undefined, 'partner'); };
Object.assign(routes, EXTRA_ROUTES);
const SUBPAGES = new Set(['partner', 'letters', 'names', 'milestones', 'wishes', 'lists', 'planner', 'recipes', 'food', 'move', 'vits', 'water', 'contacts', 'pass', 'baby', 'tips', 'colors', 'backup']);
const SETTINGS_PAGES = new Set(['einstellungen', 'colors', 'backup', 'homeconfig', 'applock', 'quotes', 'export', 'privacy']); // eigener Bereich, ohne Tab unten
const SETTINGS_SUB = new Set(['colors', 'backup', 'homeconfig', 'applock', 'quotes', 'export', 'privacy']);
// Unterseiten mit eigener Rücksprung-Adresse und passendem Menüpunkt unten
const BACK = { diaryprint: ['#/diary', 'Tagebuch'], wishprint: ['#/wishes', 'Wunschliste'] };
const NAV_FOR = { diaryprint: 'diary', wishprint: 'more' };
let lastKey = null;
function render() {
  const name = location.hash.replace(/^#\//, '') || 'home';
  const needsSetup = !state.settings.dueDate;
  const key = needsSetup ? 'onboarding' : (routes[name] ? name : 'home');
  const navKey = NAV_FOR[key] || (SETTINGS_PAGES.has(key) ? null : SUBPAGES.has(key) ? 'more' : key);
  document.body.classList.toggle('onboarding', needsSetup);
  document.querySelectorAll('#nav a').forEach(a => a.classList.toggle('active', a.dataset.route === navKey));
  // Mehr und Einstellungen stehen oben rechts: dort zeigt sich, wo man gerade ist
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
  if (h1 && au) h1.insertAdjacentHTML('afterend', `<div class="aud-row">${audBadge(au)}${key === 'home' ? '' : namesTag()}</div>`);
  // Immer gleiche Orientierung: Häuschen mit Herz (Startseite) und ein Schritt zurück in den Bereich
  const backTo = BACK[key] ? BACK[key] : SETTINGS_SUB.has(key) ? ['#/einstellungen', 'Einstellungen'] : SUBPAGES.has(key) ? ['#/more', 'Mehr'] : null;
  if (backTo) view.insertAdjacentHTML('afterbegin', `<div class="back-row no-print"><a href="#/" class="back-home" aria-label="Zur Startseite">${bi('house-heart-fill')}</a><a href="${backTo[0]}" class="back">${bi('chevron-left')} ${backTo[1]}</a></div>`);
  view.insertAdjacentHTML('beforeend', `<div class="brand-foot"><span data-brand-name>${esc(brandName())}</span> <i data-brand-by>${esc(brandSub())}</i></div>`);
  enhance(view);
  hydrateImages();
  if (key !== lastKey) window.scrollTo(0, 0);
  lastKey = key;
}
window.addEventListener('hashchange', () => { closeSheet(); render(); });

if (!state.settings.firstUse) { state.settings.firstUse = iso(today()); save(); }
migratePhotos();
migrateDiaries();
$('#topShare').onclick = shareApp;
applyTheme();
render();
appStart();
setTimeout(maybeAskBackup, 800);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') maybeAskBackup(); });
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
