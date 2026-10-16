'use strict';
/* BABYLOVE by Sarah: Suche über alle Bereiche.
   Ab 2 Buchstaben, ohne Rücksicht auf Groß- und Kleinschreibung und Umlaute ("wunsch" findet "Wünsche").
   Treffer sind markiert, nach dem Öffnen einer Seite sind die Fundstellen dort ebenfalls markiert.
   Die letzten 10 Suchbegriffe bleiben auf dem Gerät gespeichert und lassen sich löschen. */
const SEARCH_MIN = 2, SEARCH_RECENT = 10, SEARCH_PER_GROUP = 5, SEARCH_TOTAL = 24;
const searchFoldCh = ch => ch === 'ß' ? 's' : ((ch.toLowerCase().normalize('NFD')[0]) || ch);
const searchFold = s => Array.from(String(s == null ? '' : s), searchFoldCh).join('');
// Suchwörter: so getippt und mit "ss" wie "ß" ("gross" findet "groß")
const searchNeedles = q => { const f = searchFold(q).trim(); return [...new Set([f, f.replace(/ss/g, 's')])].filter(Boolean); };
const searchHas = (text, q) => { const f = searchFold(text); return searchNeedles(q).some(n => f.includes(n)); };

// Text mit markierten Fundstellen (HTML, alles sicher maskiert)
function searchHL(text, q) {
  const t = String(text == null ? '' : text), ft = searchFold(t), fq = searchNeedles(q).find(n => ft.includes(n));
  if (!fq || ft.length !== t.length) return esc(t);
  let out = '', i = 0, k;
  while ((k = ft.indexOf(fq, i)) >= 0) { out += esc(t.slice(i, k)) + '<mark>' + esc(t.slice(k, k + fq.length)) + '</mark>'; i = k + fq.length; }
  return out + esc(t.slice(i));
}
function searchSnippet(text, q, len = 96) {
  const t = String(text || '').replace(/\s+/g, ' ').trim(), ft = searchFold(t), nd = searchNeedles(q).find(n => ft.includes(n)), k = nd ? ft.indexOf(nd) : -1;
  if (k < 0 || t.length <= len) return t.slice(0, len) + (t.length > len ? '…' : '');
  const from = Math.max(0, k - 28), to = Math.min(t.length, from + len);
  return (from > 0 ? '…' : '') + t.slice(from, to) + (to < t.length ? '…' : '');
}

const SEARCH_SETTINGS = [
  ['brand', 'Name der App', 'Titel Untertitel Marke by'], ['install', 'App installieren', 'Startbildschirm Installation'],
  ['home', 'Startseite einrichten', 'Bausteine Reihenfolge Vorlage Favoriten'], ['nav', 'Menü unten', 'Symbole Reihenfolge Profilfoto Herz'],
  ['colors', 'Farben', 'Farbwelt Lieblingsfarbe Design'], ['banner', 'Banner der Startseite', 'Hintergrund Foto'],
  ['mode', 'Darstellung', 'Hell Dunkel Modus'], ['font', 'Schrift', 'Größe Schriftart lesbar'],
  ['hints', 'Hinweise nach dem Speichern', 'Bestätigungen Meldungen'], ['quotes', 'Eigene Sprüche und Mundart', 'Sprüche Sprache Hessisch Bayrisch Schwäbisch Sächsisch Ostfriesisch'],
  ['city', 'Ort für Tipps', 'Stadt Region'], ['lock', 'App-Sperre', 'PIN Passwort Schutz'], ['backup', 'Datensicherung', 'Backup sichern laden Import Export Gerätewechsel neues Handy Daten übernehmen'],
  ['storage', 'Speicherplatz', 'Datenspeicher Bilder Größe'], ['export', 'Datenexport', 'JSON CSV Daten mitnehmen'], ['privacy', 'Datenschutz und Sicherheit', 'Privatsphäre'],
  ['guide', 'Kurzanleitung', 'Hilfe erklärt'], ['update', 'Version und Updates', 'Neue Version aktualisieren']
];
const SEARCH_SKIP = new Set(['id', 'photoId', 'audioId', 'date', 'mood', 'icon', 'color', 'time', 'by', 'link']);
const searchStrings = o => Object.entries(o || {}).filter(([k, v]) => typeof v === 'string' && v.trim() && !SEARCH_SKIP.has(k) && !/^https?:/.test(v)).map(([, v]) => v.trim());

// Alle durchsuchbaren Stellen der App (Bereiche, Einstellungen und eure eigenen Einträge)
function buildSearchIndex() {
  const out = [], add = (group, icon, route, title, text = '', extra = {}) => { if (title || text) out.push({ group, icon, route, title: String(title || ''), text: String(text || ''), ...extra }); };
  HUB.forEach(([k, i, t, d]) => { if (k !== 'einstellungen') add('Bereiche', i, k, labelOf(t), d); });
  add('Bereiche', 'heart-fill', 'settings', navLabel('mama'), 'Foto, Titel und Lieblingsfarbe'); add('Bereiche', 'heart-fill', 'papa', navLabel('papa'), 'Foto, Titel und Lieblingsfarbe');
  SEARCH_SETTINGS.forEach(([id, t, kw]) => add('Einstellungen', 'gear-fill', 'einstellungen', t, kw, { open: id }));
  (state.wishes || []).forEach(w => add('Wunschliste', 'gift', 'wishes', w.text, [w.assigned ? 'bei ' + w.assigned : '', w.link || ''].join(' ')));
  (state.diary || []).forEach(d => add('Tagebuch', 'journal-text', 'diary', (d.date ? fmtDate(d.date) + ': ' : '') + String(d.text || '').slice(0, 60), d.text));
  (state.todos || []).forEach(x => add('Aufgaben', 'check2-square', 'planner', x.text));
  (state.appts || []).forEach(x => add('Termine', 'calendar-heart', 'planner', x.title || x.text, x.date ? fmtDate(x.date) : ''));
  (state.names || []).forEach(x => add('Namen', 'tags', 'names', x.name));
  (state.letters || []).forEach(x => add('Briefe ans Baby', 'envelope-heart', 'letters', x.title || String(x.text || '').slice(0, 50), x.text));
  (state.milestones || []).forEach(x => add('Meilensteine', 'stars', 'milestones', x.title, x.note));
  (state.contacts || []).forEach(x => add('Kontakte', 'telephone-fill', 'contacts', x.name, [x.role, x.phone, x.note].filter(Boolean).join(' · ')));
  Object.values(state.lists || {}).forEach(arr => (Array.isArray(arr) ? arr : []).forEach(x => add('Checklisten', 'bag-heart', 'lists', x.text)));
  if (typeof CHECKLISTS !== 'undefined') Object.values(CHECKLISTS).forEach(c => add('Checklisten', 'bag-heart', 'lists', c.title || c.name || '', (c.items || []).join(' · ')));
  if (typeof YOGA_POSES !== 'undefined') YOGA_POSES.forEach(p => add('Yoga', 'flower2', 'yoga', p.name, p.area + ' ' + p.intro));
  if (typeof BREATH_EXERCISES !== 'undefined') BREATH_EXERCISES.forEach(e => add('Atemübungen', 'wind', 'breathing', e.name, e.tag + ' ' + e.intro));
  return out;
}

function runSearch(q) {
  const fq = searchFold(q).trim(); if (fq.length < SEARCH_MIN) return null;
  const rank = it => { const t = searchFold(it.title), nd = searchNeedles(q); return nd.some(n => t.startsWith(n)) ? 0 : nd.some(n => t.includes(n)) ? 1 : 2; };
  const hits = buildSearchIndex().filter(it => searchHas(it.title, q) || searchHas(it.text, q)).map(it => ({ ...it, r: rank(it) })).sort((a, b) => a.r - b.r);
  const groups = new Map(); let total = 0;
  for (const h of hits) { if (total >= SEARCH_TOTAL) break; const g = groups.get(h.group) || []; if (g.length >= SEARCH_PER_GROUP) continue; g.push(h); groups.set(h.group, g); total++; }
  return { groups: [...groups.entries()].sort((a, b) => Math.min(...a[1].map(x => x.r)) - Math.min(...b[1].map(x => x.r))), total, all: hits.length };
}

const searchRecent = () => (Array.isArray(state.settings.recentSearches) ? state.settings.recentSearches : []).slice(0, SEARCH_RECENT);
function searchRemember(q) {
  const t = String(q || '').trim(); if (searchFold(t).length < SEARCH_MIN) return;
  state.settings.recentSearches = [t, ...searchRecent().filter(x => searchFold(x) !== searchFold(t))].slice(0, SEARCH_RECENT); save();
}

const searchBoxHTML = () => `<div class="search-box" id="searchBox" role="search"><i class="bi bi-search" aria-hidden="true"></i>
  <input id="sq" type="search" inputmode="search" enterkeyhint="search" autocomplete="off" placeholder="Suchen: Wünsche, Tagebuch, Yoga …" aria-label="Suche in der ganzen App" role="combobox" aria-expanded="false" aria-controls="searchPanel" aria-autocomplete="list" maxlength="60">
  <button type="button" class="sq-clear" id="sqClear" aria-label="Suche leeren" hidden>${bi('x-lg')}</button>
  <div class="search-panel" id="searchPanel" role="listbox" aria-label="Suchergebnisse" hidden></div></div>`;

let searchMark = null; // { term, route, open, seen }: Begriff, der auf der Zielseite markiert wird

function searchPanelHTML(q) {
  const res = runSearch(q);
  if (!res) {
    const rec = searchRecent();
    return `<div class="sr-head small soft">${q.trim().length ? 'Tippe mindestens 2 Buchstaben ein.' : 'Suche in Wunschliste, Tagebuch, Aufgaben, Namen, Briefen, Kontakten, Einstellungen und mehr.'}</div>`
      + (rec.length ? `<div class="sr-group"><div class="sr-title">Zuletzt gesucht <button type="button" class="sr-clear" id="srClearRecent">Verlauf löschen</button></div><div class="sr-recent">${rec.map((r, i) => `<button type="button" class="sr-chip" data-sr-recent="${i}">${bi('clock-history')} ${esc(r)}</button>`).join('')}</div></div>` : '');
  }
  if (!res.total) return `<div class="sr-empty"><b>Nichts gefunden für „${esc(q.trim())}“.</b><span class="small soft">Probiere ein kürzeres Wort oder einen anderen Begriff, zum Beispiel „Wunsch“ oder „Wasser“.</span></div>`;
  let n = 0;
  return `<div class="sr-head small soft" aria-live="polite">${res.all} ${res.all === 1 ? 'Treffer' : 'Treffer'}${res.all > res.total ? `, die besten ${res.total} sind zu sehen` : ''}</div>`
    + res.groups.map(([g, items]) => `<div class="sr-group"><div class="sr-title">${esc(g)}</div>${items.map(it => { const id = n++; return `<a class="sr-item" role="option" id="sr_${id}" data-sr="${id}" href="#/${it.route}">${bi(it.icon)}<span class="sr-text"><b>${searchHL(it.title, q)}</b>${it.text ? `<small>${searchHL(searchSnippet(it.text, q), q)}</small>` : ''}</span><i class="bi bi-chevron-right sr-go" aria-hidden="true"></i></a>`; }).join('')}</div>`).join('');
}

function bindSearch() {
  const box = document.getElementById('searchBox'); if (!box) return;
  const input = box.querySelector('#sq'), panel = box.querySelector('#searchPanel'), clear = box.querySelector('#sqClear');
  let active = -1, last = [];
  const items = () => [...panel.querySelectorAll('.sr-item')];
  const open = on => { panel.hidden = !on; input.setAttribute('aria-expanded', String(on)); if (!on) { active = -1; input.removeAttribute('aria-activedescendant'); } };
  const paint = () => { panel.innerHTML = searchPanelHTML(input.value); clear.hidden = !input.value; last = runSearch(input.value) ? [...runSearch(input.value).groups.flatMap(([, g]) => g)] : []; active = -1; open(true); };
  const go = it => { if (!it) return; searchRemember(input.value); searchMark = { term: input.value.trim(), route: it.route, open: it.open || null, seen: false }; if (it.open) settingsOpen = it.open; open(false); input.blur(); const target = '#/' + it.route; if (location.hash === target) render(); else location.hash = target; };
  const setActive = i => { const els = items(); if (!els.length) return; active = (i + els.length) % els.length; els.forEach((e, k) => { e.classList.toggle('on', k === active); e.setAttribute('aria-selected', String(k === active)); }); input.setAttribute('aria-activedescendant', els[active].id); els[active].scrollIntoView({ block: 'nearest' }); };
  input.addEventListener('focus', paint);
  input.addEventListener('input', paint);
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); const it = last[active >= 0 ? active : 0]; if (it) go(it); }
    else if (e.key === 'Escape') { open(false); input.blur(); }
  });
  clear.onclick = () => { input.value = ''; paint(); input.focus(); };
  panel.addEventListener('mousedown', e => e.preventDefault()); // Feld behält den Fokus beim Antippen
  panel.addEventListener('click', e => {
    const a = e.target.closest('.sr-item'); if (a) { e.preventDefault(); go(last[+a.dataset.sr]); return; }
    const chip = e.target.closest('[data-sr-recent]'); if (chip) { input.value = searchRecent()[+chip.dataset.srRecent] || ''; paint(); input.focus(); return; }
    if (e.target.closest('#srClearRecent')) { state.settings.recentSearches = []; save(); paint(); }
  });
  if (!window.__searchDocBound) { window.__searchDocBound = true; document.addEventListener('click', e => { const b = document.getElementById('searchBox'); if (b && !b.contains(e.target)) { const p = b.querySelector('#searchPanel'), i = b.querySelector('#sq'); if (p) p.hidden = true; if (i) i.setAttribute('aria-expanded', 'false'); } }); }
}

// Nach dem Öffnen: Fundstellen auf der Zielseite markieren, Hinweisleiste zum Entfernen anzeigen, zur ersten Fundstelle scrollen
function applySearchMark(key) {
  if (!searchMark) return;
  if (searchMark.route !== key) { if (searchMark.seen) searchMark = null; return; }
  searchMark.seen = true;
  const fq = searchFold(searchMark.term).trim(); if (fq.length < SEARCH_MIN) { searchMark = null; return; }
  const walker = document.createTreeWalker(view, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement && !n.parentElement.closest('script,style,textarea,input,select,mark,.search-box,.search-banner,.brand-foot') && searchHas(n.nodeValue, searchMark.term) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT });
  const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
  // Ein einziges Hüllelement pro Textstück, damit Überschriften mit flex-Layout keine Lücken um die Markierung bekommen
  nodes.forEach(n => { const span = document.createElement('span'); span.className = 'sr-wrap'; span.innerHTML = searchHL(n.nodeValue, searchMark.term); n.replaceWith(span); });
  const hits = view.querySelectorAll('mark').length;
  view.insertAdjacentHTML('afterbegin', `<div class="search-banner no-print" role="status">${bi('search')}<span>Gesucht: <b>${esc(searchMark.term)}</b> · ${hits ? `${hits} ${hits === 1 ? 'Fundstelle' : 'Fundstellen'} markiert` : 'keine Fundstelle auf dieser Seite'}</span><button type="button" id="srBannerX" class="btn btn-text btn-sm" aria-label="Markierung entfernen">${bi('x-lg')}</button></div>`);
  const x = document.getElementById('srBannerX'); if (x) x.onclick = () => { searchMark = null; render(); };
  const first = view.querySelector('mark'); if (first) first.scrollIntoView({ block: 'center', behavior: 'smooth' });
}
