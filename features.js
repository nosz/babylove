'use strict';
/* Zusatz-Funktionen. Wird vor app.js geladen; app.js übernimmt EXTRA_ROUTES.
   Nutzt Helfer aus app.js (state, view, esc, save, render, openSheet, ...) erst zur Laufzeit. */
const EXTRA_ROUTES = {};
const X = EXTRA_ROUTES;

const bi = n => `<i class="bi bi-${n}" aria-hidden="true"></i>`;
// Kennzeichnung: für wen ist etwas? Mama (rosé), Papa (blau) oder gemeinsam (immer zwei Herzen)
const duoHearts = () => '<span class="duo" aria-hidden="true"><i class="bi bi-heart-fill"></i><i class="bi bi-heart-fill"></i></span>';
// Ist ein Profilfoto hinterlegt, steht in der Kennzeichnung das Foto statt des Symbols
// (ohne Foto: Herz in der Lieblingsfarbe der Person)
const heartOf = k => `<i class="bi bi-heart-fill" style="color:var(--heart-${k})" aria-hidden="true"></i>`;
const audIcon = (who, k) => { const id = typeof randomPhoto === 'function' ? randomPhoto(who) : null; return id ? `<img class="aud-av" data-img="${id}" alt="">` : heartOf(k); };
const AUD = { mama: { label: 'Mama', icon: () => audIcon('mama', 'mama') }, papa: { label: 'Papa', icon: () => audIcon('partner', 'papa') }, together: { label: 'Gemeinsam', icon: duoHearts } };
const audBadge = (kind, size = '') => { const a = AUD[kind] || AUD.together; return `<span class="aud aud-${kind} ${size ? 'aud-' + size : ''}" data-aud="${kind}">${a.icon()}<span>${a.label}</span></span>`; };
const hm = ts => new Date(ts).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
const isUrl = u => /^https?:\/\//i.test(u || '');
const telHref = p => 'tel:' + String(p).replace(/[^\d+]/g, '');
const intro = (title, text) => `<h1>${title}</h1><p class="soft">${text}</p>`;
const sources = list => `<p class="small soft">Quellen: ${list.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${esc(t)}</a>`).join(' · ')}. Allgemeine Hinweise, sie ersetzen keine ärztliche Beratung.</p>`;
const empty = (icon, text) => `<div class="card center"><div class="empty-ico">${bi(icon)}</div><p class="mb-0">${text}</p></div>`;
const fabBtn = (id, icon, label) => `<button class="btn btn-solid theme-primary fab" id="${id}" aria-label="${label}">${bi(icon)}</button>`;
const stdFooter = (okLabel = 'Speichern') => `<div class="hstack gap-2" style="margin-top:18px"><span class="flex-grow-1"></span><button class="btn btn-subtle theme-secondary" id="cancel" type="button">Abbrechen</button><button class="btn btn-solid theme-primary" id="ok" type="button">${okLabel}</button></div>`;

async function shareThing({ title, text, url, files }) {
  title = retitleStr(title); text = retitleStr(text);
  try {
    if (files && files.length && navigator.canShare && navigator.canShare({ files })) await navigator.share({ title, text, files });
    else if (navigator.share) await navigator.share(url ? { title, text, url } : { title, text });
    else { await navigator.clipboard.writeText([text, url].filter(Boolean).join('\n')); toast('In die Zwischenablage kopiert'); }
  } catch (e) { if (e.name !== 'AbortError') toast('Teilen klappt hier leider nicht'); }
}

const shareApp = () => shareThing({
  title: brandFull(),
  text: brandFull() + ': die liebevolle, humorvolle Schwangerschafts-App. Offline nutzbar, deine Daten bleiben auf deinem Gerät.',
  url: location.href.split('#')[0]
});

/* ---------- Hub ---------- */
const HUB = [
  ['partner', 'people-fill', 'Partner-Modus', 'Wochenstand und wie du richtig gut unterstützt'],
  ['diary', 'journal-text', 'Tagebuch', 'Euer gemeinsames Tagebuch'],
  ['photos', 'images', 'Fotoalbum', 'Bilder mit Woche und Beschriftung'],
  ['letters', 'envelope-heart', 'Briefe ans Baby', 'Text oder Sprachnachricht für später'],
  ['milestones', 'stars', 'Meilensteine', 'Mit Foto, zum Teilen'],
  ['move', 'bicycle', 'Bewegung', 'Pro Trimester, Beckenboden, Yoga'],
  ['yoga', 'flower2', 'Yoga für Schwangere', 'Sanfte Übungen für Rücken und Becken'],
  ['breathing', 'wind', 'Atemübungen', 'Ruhig atmen, Kraft sammeln'],
  ['food', 'egg-fried', 'Ernährung', 'Erlaubt, verboten, Hinweise'],
  ['recipes', 'cookie', 'Kochrezepte', 'Gesund, lecker, mit Einkaufsliste'],
  ['vits', 'capsule', 'Vitamine', 'Tägliche Erinnerung'],
  ['water', 'droplet-half', 'Wasser-Tracker', 'Gläser pro Tag'],
  ['lists', 'bag-heart', 'Checklisten', 'Kliniktasche, Erstausstattung, Behörden'],
  ['wishes', 'gift', 'Wunschliste', 'Damit Oma nicht dreimal Söckchen schenkt'],
  ['names', 'tags', 'Namensfinder', 'Favoriten, gemeinsam abstimmen'],
  ['planner', 'check2-square', 'Planer', 'To-dos und Termine'],
  ['contacts', 'telephone-fill', 'Kontakte & Notfall', 'Hebamme, Arzt, wichtige Nummern'],
  ['pass', 'journal-medical', 'Mutterpass digital', 'Werte und Fotos'],
  ['tips', 'geo-alt-fill', () => tipsCity(), 'Anlaufstellen und Tipps vor Ort'],
  ['weekstory', 'stars', 'Wochen-Story', 'Die Entwicklung deines Babys schön teilen'],
  ['jokes', 'balloon-heart-fill', 'Babywitze', 'Zum Schmunzeln und Mutmachen'],
  ['baby', 'moon-stars', 'Baby-Tracker', 'Für danach: Stillen, Windeln, Schlaf'],
  ['einstellungen', 'gear-fill', 'Einstellungen', 'Farben, Schrift, Datensicherung']
];
// Themen, die zusammengehören, stehen untereinander: Überschrift erscheint vor der ersten Kachel der Gruppe
const HUB_GROUPS = { partner: 'Gemeinsam erinnern', move: 'Körper und Wohlbefinden', lists: 'Vorbereiten und organisieren', weekstory: 'Teilen, lachen, später', einstellungen: 'App' };
// Empfehlungen außerhalb der App (öffnen im Browser, brauchen Internet). Ein Schalter blendet sie aus.
const HUB_EXTERNAL = [
  ['https://nosz.github.io/energietankstelle/', 'fuel-heart', 'Energietankstelle', 'Kleine Klick-App zum Auftanken zwischendurch, mit euren eigenen Bildern und Texten.'],
  ['https://nosz.github.io/challenge-app/', 'trophy-fill', 'Challenge-App', 'Kleine Challenges für zwischendurch, passend zur Energietankstelle.'],
  ['https://www.mutige-kinderherzen.de/', 'shield-fill-check', 'Mutige Kinderherzen', 'Selbstbehauptungstraining für Kinder: Kurse, Ratgeber und App.']
];
X.more = () => {
  const showExt = state.settings.hideExt !== true;
  const tile = ([k, i, t, d]) => `<a class="card link-card hub" href="#/${k}">${bi(i)}<b>${labelOf(t)}</b><span class="small soft">${d}</span>${audBadge(PAGE_AUDIENCE[k] || 'together', 'sm')}</a>`;
  const out = []; let open = false;
  HUB.forEach(h => { if (HUB_GROUPS[h[0]]) { if (open) out.push('</div>'); out.push(`<h2 class="hub-group">${HUB_GROUPS[h[0]]}</h2><div class="grid">`); open = true; } out.push(tile(h)); });
  if (open) out.push('</div>');
  view.innerHTML = `${intro('Mehr', 'Alles, was eine Schwangerschaft so braucht. Und ein bisschen mehr.')}
    ${out.join('')}
    <h2 class="hub-group">Empfehlungen</h2>
    <div class="card hub-ext-sw"><div class="hm-row" style="border:0;padding:0"><label class="keep hm-text" for="extSw"><b>Empfehlungen anzeigen</b><span class="small soft">Weitere Angebote, die in einem neuen Tab im Browser öffnen</span></label><input type="checkbox" role="switch" id="extSw" ${showExt ? 'checked' : ''} aria-label="Empfehlungen anzeigen"></div></div>
    ${showExt ? `<div class="grid" id="extGrid">${HUB_EXTERNAL.map(([u, i, t, d]) => `<a class="card link-card hub hub-ext" href="${u}" target="_blank" rel="noopener noreferrer">${i === 'fuel-heart' ? `<span class="fuel-heart" aria-hidden="true"><svg viewBox="0 0 48 48" width="44" height="44" focusable="false"><rect x="6" y="40" width="28" height="4" rx="2" fill="currentColor"/><rect x="8" y="5" width="24" height="36" rx="5" fill="currentColor"/><rect x="12" y="10" width="16" height="14" rx="3" fill="#fff"/><path d="M20 21.6C14.6 18.2 14.2 14.6 16.6 13.4c1.7-.8 2.9 0 3.4 1 .5-1 1.7-1.8 3.4-1 2.4 1.2 2 4.8-3.4 8.2z" fill="var(--heart-mama,#c4566a)"/><rect x="12" y="29" width="16" height="3" rx="1.5" fill="#fff" opacity=".55"/><path d="M32 15h3.5a3 3 0 0 1 3 3v15a2.5 2.5 0 0 0 5 0V20l-3-4" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></span>` : bi(i)}<b>${t}</b><span class="small soft">${d}</span><span class="small soft hub-ext-note">${bi('box-arrow-up-right')} Öffnet im Browser, Internet nötig</span></a>`).join('')}</div>` : ''}`;
  $('#extSw').onchange = e => { state.settings.hideExt = !e.target.checked; save(); render(); };
};

/* ---------- Partner-Modus ---------- */
// Immer nur ein Tipp, zufällig aus einem "Beutel" je Trimester: erst wenn alle dran waren, wird neu gemischt
const tipBags = {}, lastTip = {};
const nextPapaTip = tri => {
  const all = quotePool('papaTips', tri), sig = tri + ':' + all.length;
  let bag = tipBags[tri] = tipBags[tri] || [];
  if (!bag.length || tipBags[tri + 'sig'] !== sig) { tipBags[tri + 'sig'] = sig; bag = tipBags[tri] = all.map((_, i) => i).sort(() => Math.random() - .5); if (bag.length > 1 && bag[bag.length - 1] === lastTip[tri]) bag.unshift(bag.pop()); }
  lastTip[tri] = bag.pop(); return all[lastTip[tri]];
};
// Beim Öffnen: Tipp des Tages (wechselt täglich); das Icon würfelt zufällig einen neuen
// Alles Tägliche für den Papa in EINER Karte: Mission, Tipp und Motivation. Alles wechselt täglich, die Icons würfeln neu.
const papaFor = () => `<span class="pd-for-name">für <span data-name="partner" data-fallback="Papa">${esc((state.settings.partner || '').trim() || 'Papa')}</span></span>`;
const papaRow = (icon, label, id, text, btn, aria) => `<div class="pd-row"><div class="pd-ico">${bi(icon)}</div><div class="flex-grow-1"><div class="pd-label">${label}</div><p class="mb-0" id="${id}">${esc(papaName(text))}</p></div>
  <button class="btn btn-subtle theme-secondary btn-sm" id="${btn}" aria-label="${aria}">${bi('arrow-repeat')}</button></div>`;
const papaDailyCard = tri => `<div class="card papa-daily">${papaRow('bullseye', 'Mission des Tages', 'papaMission', dailyPick(quotePool('missions'), 'mission'), 'newMission', 'Neue Mission')}
  ${papaRow('lightbulb', `Tipp für das ${tri}. Trimester`, 'papaTip', dailyPick(quotePool('papaTips', tri), 'tip' + tri), 'newPapaTip', 'Neuer Tipp')}
  ${papaRow('chat-quote', 'Motivation', 'papaMsg', partnerMsgToday(), 'newPapaMsg', 'Neuer Spruch')}</div>`;
const bindTip = tri => {
  const b = $('#newPapaTip'); if (b) b.onclick = () => { const cur = $('#papaTip').textContent; let q, g = 0; do { q = papaName(nextPapaTip(tri)); } while (q === cur && ++g < 20); $('#papaTip').textContent = q; };
  const m = $('#newMission'); if (m) m.onclick = () => { const pool = quotePool('missions'), cur = $('#papaMission').textContent; let q, g = 0; do { q = pick(pool); } while (q === cur && pool.length > 1 && ++g < 20); $('#papaMission').textContent = papaName(q); };
  const s = $('#newPapaMsg'); if (s) s.onclick = () => { const cur = $('#papaMsg').textContent; let q, g = 0; do { q = papaName(partnerMsg()); } while (q === cur && ++g < 20); $('#papaMsg').textContent = q; };
};
X.partner = () => {
  const p = pregnancy(), s = state.settings;
  const [emo, name] = fruitFor(p.weeks), tri = trimester(p.weeks);
  const who = s.partner ? esc(s.partner) : 'Papa / Partner';
  view.innerHTML = `${intro(`Partner-Modus`, `${who}, hier ist dein Briefing. Du bist die wichtigste Nebenfigur der Geschichte.`)}
    <div class="card hero"><div class="hero-top"><span class="fruit" aria-hidden="true">${bi('balloon-heart-fill')}</span><div><div class="big">${p.weeks}. SSW</div><div class="hero-sub">${p.left > 0 ? `Noch ${daysTxt(p.left)} bis ${nick()}` : `${nick()} darf jeden Tag kommen`}</div></div></div>
      <p class="hero-days">${esc(papaName(dayLine('papa', p)))}</p>
      <div class="small" style="margin-top:6px">${nick()} ist jetzt etwa so groß wie: <b>${name}</b></div></div>
    ${papaDailyCard(tri)}`;
  bindTip(tri);
};

/* ---------- Briefe ans Baby ---------- */
X.letters = () => {
  const l = state.letters;
  view.innerHTML = `${intro('Briefe ans Baby', `${nick()} kann noch nicht lesen, aber in 18 Jahren wird es heulen vor Rührung (und vor Peinlichkeit).`)}
    ${l.length ? l.map(x => `<article class="card entry"><div class="meta"><b>${fmtDate(x.date)}</b><button class="btn btn-text theme-danger btn-sm" data-del="${x.id}" aria-label="Brief löschen">${bi('trash')}</button></div>
      ${x.text ? `<p style="margin-top:10px;white-space:pre-wrap">${esc(x.text)}</p>` : ''}${x.audioId ? `<audio controls preload="none" data-aud="${x.audioId}" style="width:100%;margin-top:8px"></audio>` : ''}</article>`).join('')
      : empty('envelope-heart', 'Der erste Brief wartet. „Liebes Baby, wir haben gerade Pizza gegessen …“ ist völlig okay.')}
    <a class="btn btn-subtle theme-secondary w-100 mt-2" href="#/lettersprint">${bi('book-half')} Als Erinnerungsbuch exportieren</a>
    ${fabBtn('add', 'pencil-fill', 'Neuen Brief schreiben')}`;
  $('#add').onclick = letterForm;
  view.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => {
    if (!confirm('Diesen Brief löschen?')) return;
    const x = l.find(i => i.id === b.dataset.del); if (x && x.audioId) await delImg(x.audioId).catch(() => {});
    state.letters = l.filter(i => i.id !== b.dataset.del); save(); render();
  });
};
function letterForm() {
  let audioId = null, rec = null, chunks = [];
  openSheet(`<h2 style="margin-top:0">Neuer Brief</h2>
    <label for="lt">Liebes ${nick()}, …</label><textarea id="lt" placeholder="Schreib, was dir auf dem Herzen liegt."></textarea>
    <label>Oder sprich es auf</label>
    <button class="btn btn-subtle theme-secondary" id="rec" type="button">${bi('mic-fill')} Aufnahme starten</button>
    <div id="aprev"></div>${stdFooter('Brief speichern')}`, el => {
    const btn = $('#rec', el);
    btn.onclick = async () => {
      if (rec && rec.state === 'recording') { rec.stop(); return; }
      if (!window.MediaRecorder || !navigator.mediaDevices) return toast('Aufnahme wird auf diesem Gerät nicht unterstützt');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        chunks = []; rec = new MediaRecorder(stream);
        rec.ondataavailable = e => chunks.push(e.data);
        rec.onstop = async () => {
          stream.getTracks().forEach(t => t.stop());
          const id = uid(); await putImg(id, new Blob(chunks, { type: rec.mimeType || 'audio/webm' })); audioId = id;
          $('#aprev', el).innerHTML = `<audio controls data-aud="${id}" style="width:100%;margin-top:8px"></audio>`; hydrateImages(el);
          btn.innerHTML = `${bi('mic-fill')} Neu aufnehmen`;
        };
        rec.start(); btn.innerHTML = `${bi('stop-circle-fill')} Stopp (läuft …)`;
      } catch { toast('Mikrofon nicht freigegeben'); }
    };
    $('#cancel', el).onclick = () => { if (rec && rec.state === 'recording') rec.stop(); closeSheet(); };
    $('#ok', el).onclick = () => {
      const text = $('#lt', el).value.trim(); if (!text && !audioId) return toast('Ein Brief ohne Inhalt? Das kann nur Papa.');
      state.letters.unshift({ id: uid(), date: iso(today()), text, audioId }); save(); closeSheet(); render(); cheer();
    };
  });
}

/* ---------- Namensfinder ---------- */
let namesShown = false;
X.names = () => {
  const s = state.settings, a = esc(s.mama || 'Mama'), b = esc(s.partner || 'Papa');
  const list = [...state.names].sort((x, y) => (y.m + y.p) - (x.m + x.p));
  view.innerHTML = `${intro('Namensfinder', 'Jeder hat eine Meinung, nur ihr zwei zählt. Und bitte: nicht verraten!')}
    <div class="hstack gap-2 mb-3"><button class="btn btn-subtle theme-secondary flex-grow-1" id="tog">${bi(namesShown ? 'eye-slash' : 'eye')} ${namesShown ? 'Namen verdecken' : 'Namen anzeigen'}</button></div>
    <form class="hstack gap-2 mb-3" id="nf"><input id="nn" placeholder="Neuer Namensvorschlag" aria-label="Neuer Namensvorschlag" maxlength="30" required><button class="btn btn-solid theme-primary" aria-label="Namensvorschlag hinzufügen">${bi('plus-lg')}</button></form>
    ${list.length ? list.map(n => `<div class="card"><div class="hstack gap-2"><b class="flex-grow-1 ${namesShown ? '' : 'secret'}">${esc(n.name)}</b>
      ${n.m && n.p ? `<span class="chip">${bi('suit-heart-fill')} Match!</span>` : ''}<button class="btn btn-text theme-danger btn-sm" data-d="${n.id}" aria-label="Löschen">${bi('x-lg')}</button></div>
      <div class="hstack gap-2 mt-2"><button class="btn btn-sm ${n.m ? 'btn-solid theme-primary' : 'btn-subtle theme-secondary'}" data-v="m:${n.id}" aria-pressed="${n.m}">${bi(n.m ? 'heart-fill' : 'heart')} ${a}</button>
      <button class="btn btn-sm ${n.p ? 'btn-solid theme-primary' : 'btn-subtle theme-secondary'}" data-v="p:${n.id}" aria-pressed="${n.p}">${bi(n.p ? 'heart-fill' : 'heart')} ${b}</button></div></div>`).join('')
      : empty('tags', 'Noch keine Vorschläge. „Cheeseburger“ gilt leider nicht. Meistens.')}`;
  $('#tog').onclick = () => { namesShown = !namesShown; render(); };
  $('#nf').onsubmit = e => { e.preventDefault(); state.names.push({ id: uid(), name: $('#nn').value.trim(), m: false, p: false }); save(); render(); cheer('add'); };
  view.querySelectorAll('[data-v]').forEach(btn => btn.onclick = () => { const [k, id] = btn.dataset.v.split(':'); const n = state.names.find(x => x.id === id); n[k] = !n[k]; save(); render(); });
  view.querySelectorAll('[data-d]').forEach(btn => btn.onclick = () => { state.names = state.names.filter(x => x.id !== btn.dataset.d); save(); render(); });
};

/* ---------- Meilensteine ---------- */
X.milestones = () => {
  const done = state.milestones.filter(m => m.date).length;
  view.innerHTML = `${intro('Meilensteine', `${done} von ${state.milestones.length} geschafft. Ihr seid schon jetzt Eltern-Profis.`)}
    ${state.milestones.map(m => `<button class="card w-100 text-start milestone ${m.date ? 'done' : ''}" data-m="${m.id}" style="border:1px solid var(--line);display:block">
      <div class="hstack gap-3">${bi(m.date ? 'check-circle-fill' : (m.icon || 'star'))}<div class="flex-grow-1"><b>${esc(m.title)}</b>
      <div class="small soft">${m.date ? fmtDate(m.date) + (weekFor(m.date) !== null ? ' · ' + weekFor(m.date) + '. SSW' : '') : 'Noch offen. Das kommt!'}</div></div>${m.photoId ? bi('image') : ''}</div></button>`).join('')}
    <form class="hstack gap-2" id="mf"><input id="mn" placeholder="Eigener Meilenstein" aria-label="Eigener Meilenstein" maxlength="50" required><button class="btn btn-solid theme-primary" aria-label="Meilenstein hinzufügen">${bi('plus-lg')}</button></form>`;
  $('#mf').onsubmit = e => { e.preventDefault(); state.milestones.push({ id: uid(), title: $('#mn').value.trim(), icon: 'star', date: '', note: '', photoId: null }); save(); render(); cheer('add'); };
  view.querySelectorAll('[data-m]').forEach(b => b.onclick = () => milestoneForm(b.dataset.m));
};
function milestoneForm(id) {
  const m = state.milestones.find(x => x.id === id); let photoId = m.photoId;
  openSheet(`<h2 style="margin-top:0">${esc(m.title)}</h2>
    <label for="md">Wann war das?</label><input id="md" type="date" value="${m.date || iso(today())}">
    <label for="mt">Notiz</label><textarea id="mt" placeholder="Wie hat sich das angefühlt?">${esc(m.note)}</textarea>
    <label for="mf2">Foto</label><input id="mf2" type="file" accept="image/*"><div id="prev">${photoId ? `<img data-img="${photoId}" alt="" style="width:100%;border-radius:14px;margin-top:10px">` : ''}</div>
    <div class="hstack gap-2 flex-wrap" style="margin-top:18px">
      ${m.date ? '<button class="btn btn-text theme-danger" id="reset" type="button">Zurücksetzen</button>' : ''}<span class="flex-grow-1"></span>
      <button class="btn btn-subtle theme-secondary" id="share" type="button">${bi('share')} Teilen</button><button class="btn btn-solid theme-primary" id="ok" type="button">Speichern</button></div>`, el => {
    $('#mf2', el).onchange = async e => { const f = e.target.files[0]; if (!f) return; try { photoId = await storeFile(f); $('#prev', el).innerHTML = `<img data-img="${photoId}" alt="" style="width:100%;border-radius:14px;margin-top:10px">`; hydrateImages(el); } catch { toast('Bild konnte nicht gelesen werden'); } };
    $('#ok', el).onclick = () => { Object.assign(m, { date: $('#md', el).value || iso(today()), note: $('#mt', el).value.trim(), photoId }); save(); closeSheet(); render(); toast(pick(['Meilenstein geknackt!', 'Stark! Wieder ein Haken im Lebenslauf.', 'Das feiern wir!'])); };
    $('#share', el).onclick = async () => {
      const text = `${m.title} (${fmtDate($('#md', el).value || iso(today()))})${$('#mt', el).value.trim() ? '\n' + $('#mt', el).value.trim() : ''}`;
      let files; if (photoId) { const b = await getImg(photoId); if (b) files = [new File([b], 'meilenstein.jpg', { type: b.type || 'image/jpeg' })]; }
      shareThing({ title: m.title, text, files });
    };
    const r = $('#reset', el); if (r) r.onclick = () => { Object.assign(m, { date: '', note: '', photoId: null }); save(); closeSheet(); render(); };
  });
}

/* ---------- Wunschliste ---------- */
X.wishes = () => {
  const w = state.wishes;
  view.innerHTML = `${intro('Wunschliste', 'Sag es lieber vorher, sonst gibt es 14 Mützen in Größe 50.')}
    ${w.length ? `<div class="card">${w.map(x => `<div class="todo ${x.got ? 'done' : ''}"><input type="checkbox" id="w${x.id}" data-g="${x.id}" ${x.got ? 'checked' : ''}>
      <label for="w${x.id}" class="keep" style="margin:0;font-weight:400;flex:1"><span>${esc(x.text)}</span>${x.assigned ? ` <span class="chip">${bi('person-check')} bei ${esc(x.assigned)}</span>` : x.got ? '' : ` <span class="chip chip-free">${bi('person-dash')} Noch niemand zugewiesen</span>`}${isUrl(x.link) ? ` <a href="${esc(x.link)}" target="_blank" rel="noopener noreferrer">${bi('box-arrow-up-right')}</a>` : ''}</label>
      <button class="btn btn-text theme-danger btn-sm" data-d="${x.id}" aria-label="Entfernen">${bi('x-lg')}</button></div>`).join('')}</div>` : empty('gift', 'Noch leer. Ein Kinderwagen mit Getränkehalter? Nur zu!')}
    <form id="wf" class="mt-3"><input id="wt" placeholder="Wunsch, z. B. Tragetuch" aria-label="Wunsch" maxlength="80" required><input id="wl" type="url" placeholder="Link (optional)" aria-label="Link zum Wunsch (optional)" style="margin-top:8px"><button class="btn btn-solid theme-primary w-100 mt-2">Hinzufügen</button></form>
    <div class="hstack gap-2 flex-wrap mt-2"><a class="btn btn-solid theme-primary flex-grow-1" href="#/wishprint">${bi('printer')} Wunschzettel drucken</a><a class="btn btn-subtle theme-secondary flex-grow-1" href="#/wishlistprint">${bi('file-earmark-richtext')} Vorschau und Export</a>${w.length ? `<button class="btn btn-subtle theme-secondary flex-grow-1" id="shw">${bi('share')} Liste teilen</button>` : ''}</div>`;
  $('#wf').onsubmit = e => { e.preventDefault(); state.wishes.push({ id: uid(), text: $('#wt').value.trim(), link: $('#wl').value.trim(), got: false }); save(); render(); cheer('add'); };
  view.querySelectorAll('[data-g]').forEach(c => c.onchange = () => { state.wishes.find(x => x.id === c.dataset.g).got = c.checked; save(); render(); });
  view.querySelectorAll('[data-d]').forEach(b => b.onclick = () => { state.wishes = state.wishes.filter(x => x.id !== b.dataset.d); save(); render(); });
  const sh = $('#shw'); if (sh) sh.onclick = () => shareThing({ title: 'Unsere Wunschliste', text: 'Unsere Wunschliste:\n' + w.filter(x => !x.got).map(x => `• ${x.text}${x.link ? ' ' + x.link : ''}`).join('\n') });
};

/* ---------- Checklisten ---------- */
let listTab = 'tasche';
X.lists = () => {
  state.lists = state.lists || {};
  if (!state.lists[listTab]) state.lists[listTab] = CHECKLISTS[listTab].items.map(text => ({ id: uid(), text, done: false }));
  const items = state.lists[listTab], done = items.filter(i => i.done).length;
  view.innerHTML = `${intro('Checklisten', 'Abhaken macht glücklich. Wissenschaftlich nicht bewiesen, aber gefühlt wahr.')}
    <div class="seg">${Object.entries(CHECKLISTS).map(([k, v]) => `<button data-t="${k}" class="${listTab === k ? 'on' : ''}">${v.title.split(' ')[0]}</button>`).join('')}</div>
    <p class="soft">${CHECKLISTS[listTab].title}: ${done} von ${items.length} erledigt${done === items.length && done ? '. Bereit für alles!' : ''}</p>
    <div class="card">${items.map(t => `<div class="todo ${t.done ? 'done' : ''}"><input type="checkbox" id="l${t.id}" data-c="${t.id}" ${t.done ? 'checked' : ''}><label for="l${t.id}" class="keep" style="margin:0;font-weight:400;flex:1"><span>${esc(t.text)}</span></label>
      <button class="btn btn-text theme-danger btn-sm" data-d="${t.id}" aria-label="Entfernen">${bi('x-lg')}</button></div>`).join('')}</div>
    <form class="hstack gap-2" id="lf"><input id="ln" placeholder="Eigener Punkt …" aria-label="Eigener Punkt" required><button class="btn btn-solid theme-primary" aria-label="Punkt hinzufügen">${bi('plus-lg')}</button></form>
    ${listTab === 'behoerden' ? '<p class="small soft mt-2">Fristen und Ansprüche klärst du am besten mit Krankenkasse, Arbeitgeber (HR) und Elterngeldstelle. Hier geht’s nur ums Nicht-Vergessen.</p>' : ''}`;
  view.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { listTab = b.dataset.t; render(); });
  view.querySelectorAll('[data-c]').forEach(c => c.onchange = () => { items.find(t => t.id === c.dataset.c).done = c.checked; save(); render(); if (c.checked) toast(pick(TODO_CHEERS)); });
  view.querySelectorAll('[data-d]').forEach(b => b.onclick = () => { state.lists[listTab] = items.filter(t => t.id !== b.dataset.d); save(); render(); });
  $('#lf').onsubmit = e => { e.preventDefault(); items.push({ id: uid(), text: $('#ln').value.trim(), done: false }); save(); render(); cheer('add'); };
};

/* ---------- Ernährung ---------- */
X.food = () => {
  const row = ([t, d], icon, color) => `<div class="hstack gap-2 align-items-start mb-3"><i class="bi bi-${icon} ico" style="color:${color}"></i><div><b>${esc(t)}</b><div class="small soft">${esc(d)}</div></div></div>`;
  view.innerHTML = `${intro('Ernährung', 'Du isst für zwei, aber nicht für zwölf. Trotzdem: Du darfst Hunger haben.')}
    <h2>Besser meiden</h2><div class="card pb-0">${FOOD.avoid.map(r => row(r, 'x-circle-fill', '#C0504D')).join('')}</div>
    <h2>Das darf auf den Teller</h2><div class="card pb-0">${FOOD.good.map(r => row(r, 'check-circle-fill', 'var(--ok)')).join('')}</div>
    <div class="card info">${esc(FOOD.hygiene)}</div>
    <h2>Rezeptideen</h2>${FOOD.recipes.map(([t, d]) => `<div class="card"><b>${esc(t)}</b><p class="small soft mb-0">${esc(d)}</p></div>`).join('')}
    ${sources([['BLE: Listeriose & Toxoplasmose', 'https://www.ble-medienservice.de/simpledownloadable/freedownload/link/hash/32bb846d20fa5bd7017fbddbbf357401'], ['DGE', 'https://www.dge.de/fileadmin/dok/presse/meldungen/2011-2018/DGE-Pressemeldung-aktuell-11-2013-schwangerschaft.pdf'], ['Gesund ins Leben', 'https://www.gesund-ins-leben.de']])}`;
};

/* ---------- Bewegung ---------- */
X.move = () => {
  const p = pregnancy(), tri = trimester(p.weeks);
  view.innerHTML = `${intro('Bewegung', 'Das Sofa liebt dich. Aber ein bisschen Bewegung auch. Kein Leistungssport, nur Wohlfühlen.')}
    <div class="card info">${esc(MOVE.general)}</div>
    <h2>Das tut gut</h2><div class="card"><ul class="mb-0 ps-3">${MOVE.good.map(g => `<li class="mb-1">${esc(g)}</li>`).join('')}</ul></div>
    ${[1, 2, 3].map(t => `<h2>${t}. Trimester${t === tri ? ' (jetzt)' : ''}</h2><div class="card ${t === tri ? '' : 'opacity-75'}"><ul class="mb-0 ps-3">${MOVE.tri[t].map(x => `<li class="mb-1">${esc(x)}</li>`).join('')}</ul></div>`).join('')}
    <h2>Beckenboden & Yoga</h2><div class="card"><p class="mb-2">${esc(MOVE.pelvic)}</p><p class="mb-0">Sanftes Yoga oder Pilates für Schwangere nennt der Berufsverband der Frauenärzte als geeignet. Achte auf Kurse speziell für Schwangere.</p></div>
    <p class="small soft">Bei Schmerzen, Blutungen, Schwindel oder Wehen: sofort aufhören und ärztlich abklären lassen.</p>
    ${sources([['Aponet: Sport mit Babybauch', 'https://www.aponet.de/artikel/fit-durch-die-schwangerschaft-7-tipps-fuer-sport-mit-babybauch-33066'], ['Gesund ins Leben: Bewegung', 'https://www.gesund-ins-Leben.de/fileadmin/resources/files/PDFs/fortbildung_schwangere_4_bewegung.pdf']])}`;
};

/* ---------- Vitamine ---------- */
X.vits = () => {
  const d = iso(today()), log = (state.vitLog[d] = state.vitLog[d] || []), v = state.vits;
  const taken = v.filter(x => log.includes(x.id)).length;
  const presets = ['Folsäure', 'Jod', 'Vitamin D', 'Eisen', 'Omega-3 (DHA)'].filter(n => !v.some(x => x.name === n));
  view.innerHTML = `${intro('Vitamine', 'Dein täglicher Mini-Erfolg: einmal schlucken, einmal stolz sein.')}
    <div class="card info">Nimm nur, was Frauenarzt oder Hebamme dir empfehlen, und stimm die Dosierung mit ihnen ab. Laut Verbraucherzentrale gelten Folsäure und Jod als die einzigen generell empfohlenen Ergänzungen. Eisen nur bei nachgewiesenem Mangel.</div>
    ${v.length ? `<p class="soft">${taken} von ${v.length} heute genommen${taken === v.length ? '. Perfekt!' : ''}</p><div class="card">${v.map(x => `<div class="todo ${log.includes(x.id) ? 'done' : ''}"><input type="checkbox" id="v${x.id}" data-t="${x.id}" ${log.includes(x.id) ? 'checked' : ''}>
      <label for="v${x.id}" class="keep" style="margin:0;font-weight:400;flex:1"><span>${esc(x.name)}</span></label><button class="btn btn-text theme-danger btn-sm" data-d="${x.id}" aria-label="Entfernen">${bi('x-lg')}</button></div>`).join('')}</div>`
      : empty('capsule', 'Noch nichts eingetragen. Füge hinzu, was ihr mit eurem Arzt besprochen habt.')}
    ${presets.length ? `<p class="small soft mt-3 mb-1">Schnell hinzufügen:</p><div>${presets.map(n => `<button class="chip" style="border:0" data-p="${esc(n)}">+ ${esc(n)}</button>`).join('')}</div>` : ''}
    <form class="hstack gap-2 mt-3" id="vf"><input id="vn" placeholder="Eigenes Präparat" aria-label="Eigenes Präparat" maxlength="40" required><button class="btn btn-solid theme-primary" aria-label="Präparat hinzufügen">${bi('plus-lg')}</button></form>
    <p class="small soft mt-2">Die App erinnert dich, sobald du sie öffnest. Eine Push-Erinnerung gibt es nicht. Tipp: Stell dir zusätzlich einen Handy-Wecker.</p>
    ${sources([['Verbraucherzentrale', 'https://www.verbraucherzentrale.de/wissen/lebensmittel/nahrungsergaenzungsmittel/jod-folsaeure-eisen-welche-nahrungsergaenzungen-brauchen-schwangere-13324'], ['BfR via Aponet', 'https://www.aponet.de/artikel/nahrungsergaenzung-schwangerschaft-bfr-raet-zu-folsaeure-und-jod-32797']])}`;
  view.querySelectorAll('[data-t]').forEach(c => c.onchange = () => { const i = log.indexOf(c.dataset.t); if (c.checked && i < 0) log.push(c.dataset.t); if (!c.checked && i >= 0) log.splice(i, 1); save(); render(); if (c.checked) toast(pick(TODO_CHEERS)); });
  view.querySelectorAll('[data-d]').forEach(b => b.onclick = () => { state.vits = v.filter(x => x.id !== b.dataset.d); save(); render(); });
  view.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { v.push({ id: uid(), name: b.dataset.p }); save(); render(); cheer('add'); });
  $('#vf').onsubmit = e => { e.preventDefault(); v.push({ id: uid(), name: $('#vn').value.trim() }); save(); render(); cheer('add'); };
};

/* ---------- Konfetti und Erfolgsmeldung, wenn ein Tagesziel erreicht ist ---------- */
// Konfetti regnet kurz über den Bildschirm (nicht bei "Bewegung reduzieren"), liefert die Zahl der Teilchen zurück
function confetti(n = 220) {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches; // Bei "Bewegung reduzieren" bleibt das Konfetti stehen und blendet nur sanft ein und aus
  document.querySelectorAll('.confetti').forEach(c => c.remove());
  const root = getComputedStyle(document.documentElement), cols = ['--primary', '--accent', '--heart-mama', '--heart-papa', '--heart-kid', '--ok'].map(v => root.getPropertyValue(v).trim()).filter(Boolean).concat(['#ffd45a', '#ff8fb1', '#7ed6df']);
  const box = document.createElement('div'); box.className = 'confetti' + (still ? ' still' : ''); box.setAttribute('aria-hidden', 'true');
  const rain = Math.round(n * .55);
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i'), r = Math.random, size = 7 + Math.round(r() * 8), cannon = i >= rain, left = cannon && i % 2 === 0;
    p.style.cssText = cannon
      ? `left:${left ? 2 : 98}%;background:${cols[i % cols.length]};--bx:${(left ? 1 : -1) * Math.round(80 + r() * 260)}px;--by:${-Math.round(260 + r() * 360)}px;--r:${Math.round(r() * 1080 - 540)}deg;--d:${(2.6 + r() * 1.8).toFixed(2)}s;--delay:${(r() * .5).toFixed(2)}s;width:${size}px;height:${size + 5}px`
      : `left:${(r() * 100).toFixed(1)}%;background:${cols[i % cols.length]};--x:${Math.round((r() - .5) * 200)}px;--r:${Math.round(r() * 1080 - 540)}deg;--d:${(2.8 + r() * 2.2).toFixed(2)}s;--delay:${(r() * 1.4).toFixed(2)}s;width:${size}px;height:${size + 5}px`;
    if (still) { p.style.cssText = `left:${(4 + r() * 92).toFixed(1)}%;top:${(4 + r() * 86).toFixed(1)}%;background:${cols[i % cols.length]};--delay:${(r() * .8).toFixed(2)}s;width:${size}px;height:${size + 5}px;transform:rotate(${Math.round(r() * 360)}deg)`; }
    else if (cannon) p.className = 'b';
    if (i % 4 === 0) p.style.borderRadius = '50%'; else if (i % 7 === 0) p.style.clipPath = 'polygon(50% 0, 100% 100%, 0 100%)';
    box.appendChild(p);
  }
  document.body.appendChild(box); setTimeout(() => box.remove(), 6200); return n;
}
// Super-Lob: große Karte in der Mitte mit Pokal, Lob und Konfetti, schließt sich von selbst oder per Tipp
// Lob-Texte: Hochdeutsch, bei gewählter Mundart (Einstellungen: Sprüche und Mundart) in dieser Mundart. "Oft" nur Mundart, "Ab und zu" mit Hochdeutsch gemischt.
function praisePool(kind = 'mama') {
  const key = kind === 'together' ? 'together' : 'mama', base = kind === 'water' ? [...PRAISE_BASE.mama, ...PRAISE_BASE.water] : PRAISE_BASE[key];
  const dia = dialectKeys().flatMap(k => (PRAISE_DIALECT[k] || {})[key] || []);
  if (!dia.length) return base;
  return state.settings.dialectFreq === 'often' ? dia : [...dia, ...dia, ...base.slice(0, Math.max(2, Math.round(dia.length * .6)))];
}
const praiseLine = kind => pick(praisePool(kind));function celebrate(kind = 'water') {
  confetti(220);
  const st = state.settings, who = kind === 'together' ? [st.mama, st.partner].map(v => String(v || '').trim()).filter(Boolean).join(' und ') : String(st.mama || '').trim();
  const old = document.getElementById('praisePop'); if (old) old.remove();
  const el = document.createElement('div'); el.id = 'praisePop'; el.className = 'praise-pop'; el.setAttribute('role', 'status');
  el.innerHTML = `<div class="pp-card"><span class="pp-ico">${bi('trophy-fill')}</span><b>Tagesziel erreicht!</b>${who ? `<span class="pp-name">Bravo, ${esc(who)}!</span>` : ''}<p>${esc(praiseLine(kind === 'together' ? 'together' : 'water'))}</p><span class="pp-stars" aria-hidden="true">${bi('stars')}</span><button type="button" class="btn btn-solid theme-primary">Danke, das tut gut!</button></div>`;
  document.body.appendChild(el);
  const close = () => { el.classList.add('out'); setTimeout(() => el.remove(), 300); };
  el.onclick = close; setTimeout(() => { if (el.isConnected) close(); }, 6500);
  return el;
}const goalBanner = (text, title = 'Tagesziel erreicht!') => `<div class="goal-win" role="status">${bi('trophy-fill')}<div><b>${esc(title)}</b><span>${esc(personalize(text))}</span></div></div>`;
/* ---------- Wasser ---------- */
X.water = () => {
  const d = iso(today()), n = state.water[d] || 0, goal = state.waterGoal || 8;
  const msgs = n === 0 ? 'Noch trocken wie die Wüste. Auf geht’s!' : n < goal ? 'Weiter so, das Baby schwimmt sich gerade warm.' : 'Ziel erreicht! Du bist ein Wasserfall der Motivation.';
  view.innerHTML = `${intro('Wasser-Tracker', 'Dein Körper besteht zu großen Teilen aus Wasser. Und gerade baust du noch einen dazu.')}
    <div class="card center ${n >= goal ? 'goal-card' : ''}"><div style="font-size:3rem;font-weight:800">${n} <span class="soft" style="font-size:1.2rem">/ ${goal} Gläser</span></div>
      <div class="progress my-3" role="progressbar" aria-label="Wasserziel" aria-valuenow="${n}" aria-valuemin="0" aria-valuemax="${goal}"><div class="progress-bar" style="width:${Math.min(100, n / goal * 100)}%"></div></div>
      ${n >= goal ? `<p class="soft mb-2">${n * 250} ml</p>${goalBanner(dailyPick(praisePool('water'), 'praise-water'))}` : `<p class="soft">${n * 250} ml · ${msgs}</p>`}
      <div class="hstack gap-2 justify-content-center"><button class="btn btn-subtle theme-secondary" id="minus" aria-label="Ein Glas weniger">${bi('dash-lg')}</button><button class="btn btn-solid theme-primary" id="plus" style="min-width:140px">${bi('droplet-fill')} Glas getrunken</button></div></div>
    <div class="card"><label for="goal" class="form-label">Tagesziel (Gläser à 250 ml)</label><input id="goal" type="number" min="1" max="20" value="${goal}"><p class="small soft mt-2 mb-0">Wie viel für dich passt, klärst du mit Arzt oder Hebamme.</p></div>`;
  $('#plus').onclick = () => { state.water[d] = n + 1; save(); render(); if (n + 1 === goal && state.waterWin !== d) { state.waterWin = d; save(); celebrate('water'); toast('Tagesziel erreicht! ' + praiseLine('water')); } else cheer('water'); };
  $('#minus').onclick = () => { state.water[d] = Math.max(0, n - 1); save(); render(); };
  $('#goal').onchange = e => { state.waterGoal = Math.min(20, Math.max(1, +e.target.value || 8)); save(); render(); };
};

/* ---------- Kontakte & Notfall ---------- */
const ROLES = ['Hebamme', 'Frauenarzt/-ärztin', 'Geburtsklinik', 'Familie', 'Sonstiges'];
X.contacts = () => {
  const c = state.contacts;
  view.innerHTML = `${intro('Kontakte & Notfall', 'Alles Wichtige an einem Ort, damit du im Ernstfall nicht im Handy wühlen musst.')}
    <h2 style="margin-top:6px">Notfallnummern</h2>
    <div class="card">${EMERGENCY.map(([n, t]) => `<a class="hstack gap-3 mb-2" href="${telHref(n)}" style="text-decoration:none"><i class="bi bi-telephone-fill ico"></i><div><b>${esc(n)}</b><div class="small soft">${esc(t)}</div></div></a>`).join('')}</div>
    <p class="small soft">Bei akuten Beschwerden, Blutungen, Wehen oder verminderten Kindsbewegungen: Klinik, Frauenarzt oder 112. Nummern bei Bedarf kurz gegenprüfen.</p>
    <h2>Meine Kontakte</h2>
    ${c.length ? c.map(x => `<div class="card hstack gap-3"><i class="bi bi-person-heart ico"></i><div class="flex-grow-1"><b>${esc(x.name)}</b> <span class="chip">${esc(x.role)}</span>
      <div><a href="${telHref(x.phone)}">${esc(x.phone)}</a></div>${x.note ? `<div class="small soft">${esc(x.note)}</div>` : ''}</div>
      <button class="btn btn-text theme-danger btn-sm" data-d="${x.id}" aria-label="Kontakt löschen">${bi('trash')}</button></div>`).join('') : empty('person-lines-fill', 'Noch niemand eingetragen. Deine Hebamme verdient einen Ehrenplatz.')}
    ${fabBtn('add', 'person-plus-fill', 'Kontakt hinzufügen')}`;
  $('#add').onclick = () => openSheet(`<h2 style="margin-top:0">Neuer Kontakt</h2>
    <label for="cn">Name</label><input id="cn" maxlength="50"><label for="cr">Rolle</label><select id="cr">${ROLES.map(r => `<option>${r}</option>`).join('')}</select>
    <label for="cp">Telefon</label><input id="cp" type="tel" inputmode="tel"><label for="cno">Notiz (z. B. Sprechzeiten)</label><input id="cno" maxlength="80">${stdFooter()}`, el => {
    $('#cancel', el).onclick = closeSheet;
    $('#ok', el).onclick = () => { const name = $('#cn', el).value.trim(), phone = $('#cp', el).value.trim(); if (!name || !phone) return toast('Name und Telefon bitte');
      state.contacts.push({ id: uid(), name, role: $('#cr', el).value, phone, note: $('#cno', el).value.trim() }); save(); closeSheet(); render(); cheer(); };
  });
  view.querySelectorAll('[data-d]').forEach(b => b.onclick = () => { if (confirm('Kontakt löschen?')) { state.contacts = c.filter(x => x.id !== b.dataset.d); save(); render(); } });
};

/* ---------- Mutterpass digital ---------- */
X.pass = () => {
  const rows = [...state.pass].sort((a, b) => a.date.localeCompare(b.date)), pts = rows.filter(r => r.weight);
  let chart = '';
  if (pts.length > 1) {
    const ws = pts.map(r => +r.weight), min = Math.min(...ws) - 1, max = Math.max(...ws) + 1, W = 300, H = 110;
    const xy = pts.map((r, i) => [10 + i * (W - 20) / (pts.length - 1), H - 10 - (r.weight - min) / (max - min) * (H - 20)]);
    chart = `<div class="card"><b>Gewichtsverlauf</b><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Gewichtsverlauf" style="width:100%"><polyline fill="none" stroke="var(--primary)" stroke-width="3" points="${xy.map(p => p.join(',')).join(' ')}"/>${xy.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="var(--primary-strong)"/>`).join('')}</svg>
      <div class="small soft">${pts[0].weight} kg → ${pts[pts.length - 1].weight} kg</div></div>`;
  }
  view.innerHTML = `${intro('Mutterpass digital', 'Zettelwirtschaft ade. Tipp die Werte ab oder fotografiere die Seite, dann hast du alles dabei.')}
    ${chart}
    ${rows.length ? [...rows].reverse().map(r => `<article class="card entry"><div class="meta"><div><b>${fmtDate(r.date)}</b>${weekFor(r.date) !== null ? `<div class="small soft">${weekFor(r.date)}. SSW</div>` : ''}</div>
      <button class="btn btn-text theme-danger btn-sm" data-d="${r.id}" aria-label="Eintrag löschen">${bi('trash')}</button></div>
      <div class="mt-2">${r.weight ? `<span class="chip">${bi('speedometer2')} ${esc(r.weight)} kg</span>` : ''}${r.sys ? `<span class="chip">${bi('heart-pulse')} ${esc(r.sys)}/${esc(r.dia || '–')} mmHg</span>` : ''}${r.hb ? `<span class="chip">Hb ${esc(r.hb)}</span>` : ''}</div>
      ${r.note ? `<p class="mt-2 mb-0" style="white-space:pre-wrap">${esc(r.note)}</p>` : ''}${r.photoId ? `<img class="photo" data-img="${r.photoId}" alt="Mutterpass-Foto">` : ''}</article>`).join('') : empty('journal-medical', 'Noch keine Einträge. Beim nächsten Termin: Mutterpass zücken, Werte tippen, Stolz spüren.')}
    <p class="small soft">Deine Werte bleiben auf deinem Gerät. Die App wertet sie nicht medizinisch aus. Das macht dein Frauenarzt.</p>
    ${fabBtn('add', 'plus-lg', 'Eintrag hinzufügen')}`;
  $('#add').onclick = () => { let photoId = null;
    openSheet(`<h2 style="margin-top:0">Neuer Eintrag</h2><label for="pd">Datum</label><input id="pd" type="date" value="${iso(today())}">
      <div class="hstack gap-2"><div class="flex-grow-1"><label for="pw">Gewicht (kg)</label><input id="pw" type="number" step="0.1" inputmode="decimal"></div><div class="flex-grow-1"><label for="ph">Hb</label><input id="ph" type="number" step="0.1" inputmode="decimal"></div></div>
      <div class="hstack gap-2"><div class="flex-grow-1"><label for="ps">Blutdruck oben</label><input id="ps" type="number" inputmode="numeric"></div><div class="flex-grow-1"><label for="pi">unten</label><input id="pi" type="number" inputmode="numeric"></div></div>
      <label for="pn">Notiz</label><textarea id="pn" style="min-height:70px"></textarea><label for="pf">Foto vom Mutterpass</label><input id="pf" type="file" accept="image/*"><div id="prev"></div>${stdFooter()}`, el => {
      $('#pf', el).onchange = async e => { const f = e.target.files[0]; if (!f) return; try { photoId = await storeFile(f); $('#prev', el).innerHTML = `<img data-img="${photoId}" alt="" style="width:100%;border-radius:14px;margin-top:10px">`; hydrateImages(el); } catch { toast('Bild konnte nicht gelesen werden'); } };
      $('#cancel', el).onclick = closeSheet;
      $('#ok', el).onclick = () => { const g = i => $(i, el).value.trim(); const e = { id: uid(), date: g('#pd') || iso(today()), weight: g('#pw'), hb: g('#ph'), sys: g('#ps'), dia: g('#pi'), note: g('#pn'), photoId };
        if (!e.weight && !e.hb && !e.sys && !e.note && !photoId) return toast('Bitte mindestens einen Wert eintragen'); state.pass.push(e); save(); closeSheet(); render(); cheer(); };
    }); };
  view.querySelectorAll('[data-d]').forEach(b => b.onclick = async () => { if (!confirm('Eintrag löschen?')) return; const r = state.pass.find(x => x.id === b.dataset.d); if (r && r.photoId) await delImg(r.photoId).catch(() => {}); state.pass = state.pass.filter(x => x.id !== b.dataset.d); save(); render(); });
};

/* ---------- Baby-Tracker (Erweiterung für danach) ---------- */
X.baby = () => {
  const day = iso(today()), isToday = e => iso(new Date(e.ts)) === day, list = state.baby.filter(isToday);
  const cnt = t => list.filter(e => e.type === t).length;
  const sleepMin = list.filter(e => e.type === 'sleep' && e.end).reduce((s, e) => s + (e.end - e.ts) / 60000, 0);
  const sleeping = state.sleepStart;
  const add = (type, detail) => { state.baby.unshift({ id: uid(), ts: Date.now(), type, detail }); save(); render(); toast(pick(['Notiert. Du machst das großartig!', 'Drin. Eltern-Level steigt.', 'Gespeichert. Kaffee verdient?'])); };
  const icon = { feed: 'cup-straw', diaper: 'emoji-neutral', sleep: 'moon-stars' }, label = { feed: 'Stillen / Trinken', diaper: 'Windel', sleep: 'Schlaf' };
  view.innerHTML = `${intro('Baby-Tracker', `Für später: Wenn ${nick()} da ist, zählt jede Windel. Ihr werdet Statistik-Profis.`)}
    <div class="grid" style="grid-template-columns:repeat(3,1fr)"><div class="card center mb-0"><b style="font-size:1.6rem">${cnt('feed')}</b><div class="small soft">Mahlzeiten</div></div>
      <div class="card center mb-0"><b style="font-size:1.6rem">${cnt('diaper')}</b><div class="small soft">Windeln</div></div>
      <div class="card center mb-0"><b style="font-size:1.6rem">${Math.floor(sleepMin / 60)}h ${Math.round(sleepMin % 60)}m</b><div class="small soft">Schlaf</div></div></div>
    <h2>Stillen / Trinken</h2><div class="hstack gap-2 flex-wrap"><button class="btn btn-solid theme-primary" data-f="links">Links</button><button class="btn btn-solid theme-primary" data-f="rechts">Rechts</button><button class="btn btn-subtle theme-secondary" data-f="Flasche">Flasche</button></div>
    <h2>Windel</h2><div class="hstack gap-2 flex-wrap"><button class="btn btn-subtle theme-secondary" data-w="nass">Nass</button><button class="btn btn-subtle theme-secondary" data-w="groß">Groß</button><button class="btn btn-subtle theme-secondary" data-w="beides">Beides</button></div>
    <h2>Schlaf</h2><button class="btn btn-solid theme-primary w-100" id="sleep">${sleeping ? `${bi('sun-fill')} Aufgewacht (seit ${hm(sleeping)})` : `${bi('moon-stars-fill')} Schläft jetzt`}</button>
    <h2>Heute</h2>${list.length ? `<div class="card">${list.map(e => `<div class="todo"><i class="bi bi-${icon[e.type]} ico"></i><span>${hm(e.ts)} · ${label[e.type]}${e.detail ? ' (' + esc(e.detail) + ')' : ''}${e.end ? ` · ${Math.round((e.end - e.ts) / 60000)} min` : ''}</span>
      <button class="btn btn-text theme-danger btn-sm" data-d="${e.id}" aria-label="Löschen">${bi('x-lg')}</button></div>`).join('')}</div>` : empty('cup-straw', 'Noch ruhig hier. Genieß die Stille, solange sie währt.')}`;
  view.querySelectorAll('[data-f]').forEach(b => b.onclick = () => add('feed', b.dataset.f));
  view.querySelectorAll('[data-w]').forEach(b => b.onclick = () => add('diaper', b.dataset.w));
  view.querySelectorAll('[data-d]').forEach(b => b.onclick = () => { state.baby = state.baby.filter(x => x.id !== b.dataset.d); save(); render(); });
  $('#sleep').onclick = () => {
    if (state.sleepStart) { state.baby.unshift({ id: uid(), ts: state.sleepStart, end: Date.now(), type: 'sleep', detail: '' }); state.sleepStart = null; toast('Gute Nacht-Bilanz notiert.'); }
    else { state.sleepStart = Date.now(); toast('Psssst … Schlaf läuft.'); }
    save(); render();
  };
};

/* ---------- Gemeinsam heute: Ritual, damit beide gemeinsam in die App schauen ---------- */
const TOGETHER_IDEAS = [
  ['Legt gemeinsam die Hand auf den Bauch und sagt Hallo.', null],
  ['Sucht zusammen drei Namensideen aus. Pssst, nicht weitererzählen.', 'names'],
  ['Schreibt gemeinsam einen kurzen Brief ans Baby.', 'letters'],
  ['Hakt zusammen einen Punkt auf der Checkliste ab.', 'lists'],
  ['Macht ein Foto von euch beiden mit Babybauch.', 'photos'],
  ['Plant ein Mini-Date: Spaziergang, Eis, keine Handys.', null],
  ['Lest gemeinsam die Wochen-Info und ratet, was das Baby gerade kann.', 'partner'],
  ['Überlegt zusammen, was auf die Wunschliste soll.', 'wishes'],
  ['Hört ein Lied, das ihr dem Baby später vorsingen wollt.', null],
  ['Feiert einen Meilenstein oder haltet einen neuen fest.', 'milestones'],
  ['Tauscht aus: Worauf freut ihr euch am meisten?', null],
  ['Schaut euch gemeinsam die Kliniktasche an. Fehlt etwas?', 'lists'],
  ['Notiert eine Frage für den nächsten Arzttermin.', 'pass'],
  ['Trinkt zusammen ein Glas Wasser und stoßt auf das Baby an.', 'water']
];
TOGETHER_IDEAS.push(...TOGETHER_IDEAS_MORE); // weitere Ideen aus content.js: insgesamt 50
const TOGETHER_DONE = ['Ihr seid ein Team! Das Baby spürt das.', 'Beide da, besser geht’s nicht. Gold für euch!', 'Gemeinsam stark. Das war ein guter Tag.'];
const togetherDone = d => { const t = state.together && state.together[d]; return !!(t && t.mama && t.partner); };
function togetherStreak() {
  let d = new Date(today()), n = 0;
  if (togetherDone(iso(d))) n++;
  d = new Date(d.getTime() - DAY);
  while (togetherDone(iso(d))) { n++; d = new Date(d.getTime() - DAY); }
  return n;
}
function togetherCard() {
  const s = state.settings, day = iso(today()), t = (state.together && state.together[day]) || {};
  const idea = dailyPick(TOGETHER_IDEAS, 'together');
  const names = { mama: s.mama || 'Mama', partner: s.partner || 'Papa' };
  const both = t.mama && t.partner, n = togetherStreak();
  const msg = both ? TOGETHER_DONE[Math.floor(today() / DAY) % TOGETHER_DONE.length]
    : t.mama || t.partner ? `Fehlt noch: ${esc(t.mama ? names.partner : names.mama)}. Holt euch kurz zusammen, es dauert nur eine Minute.`
    : 'Schaut heute zu zweit rein. Das ist das schönste Ritual der Schwangerschaft.';
  const dots = Array.from({ length: 7 }, (_, i) => { const d = iso(new Date(today().getTime() - (6 - i) * DAY)); return `<span class="tg-dot ${togetherDone(d) ? 'on' : ''}" title="${d}"></span>`; }).join('');
  const person = who => `<button class="tg-btn ${t[who] ? 'on' : ''}" data-tg="${who}" aria-pressed="${!!t[who]}">${personAvatar(who, 'avatar-sm') || heartOf(who === 'mama' ? 'mama' : 'papa')}<span data-name="${who}" data-fallback="${who === 'mama' ? 'Mama' : 'Papa'}">${esc(names[who])}</span>${bi(t[who] ? 'check-circle-fill' : 'circle')}</button>`;
  return `<div class="card together ${both ? 'done' : ''}">
    <div class="hstack gap-2"><b class="flex-grow-1">${duoHearts()} Gemeinsam heute</b><span class="chip">${bi('fire')} Serie: ${n} ${n === 1 ? 'Tag' : 'Tage'}</span></div>
    <p class="mt-2 mb-2">${esc(idea[0])}</p>
    ${idea[1] ? `<a class="tg-go" href="#/${idea[1]}">Los geht’s ${bi('arrow-right')}</a>` : ''}
    <div class="hstack gap-2">${person('mama')}${person('partner')}</div>
    ${both ? goalBanner(msg) : `<div class="small soft mt-2">${msg}</div>`}<div class="tg-dots mt-2" aria-label="Letzte 7 Tage">${dots}</div></div>`;
}
function bindTogether() {
  view.querySelectorAll('[data-tg]').forEach(b => b.onclick = () => {
    const day = iso(today()); state.together = state.together || {};
    const t = state.together[day] = state.together[day] || {}, who = b.dataset.tg, was = togetherDone(day);
    t[who] = !t[who]; save(); render();
    if (!was && togetherDone(day)) { celebrate('together'); toast(pick(TOGETHER_DONE)); }
  });
}

/* ---------- Atemübungen ---------- */
let BREATH_MS = 1000, breathRun = null, breathSel = 'belly', breathMin = 3;
function stopBreath(done) {
  const run = breathRun; if (!run) return; breathRun = null; run.alive = false; clearTimeout(run.t);
  const btn = $('#bStart'), lab = $('#bLabel'), cnt = $('#bCount'), c = $('#bCircle');
  if (btn) { btn.innerHTML = `${bi('play-fill')} Start`; btn.setAttribute('aria-pressed', 'false'); }
  if (lab) lab.textContent = done ? 'Geschafft' : 'Bereit?'; if (cnt) cnt.textContent = ''; if (c) { c.style.transition = 'transform .6s ease-out'; c.style.transform = 'scale(.7)'; c.dataset.kind = ''; }
  if (done) toast(`Schön gemacht, ${run.cycles} ruhige Atemzüge. Das hat gutgetan.`);
}
function startBreath(ex, minutes) {
  stopBreath(); const circle = $('#bCircle'), label = $('#bLabel'), count = $('#bCount'), info = $('#bInfo'), btn = $('#bStart');
  const run = breathRun = { alive: true, cycles: 0, t: 0 }, startedAt = Date.now(), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  btn.innerHTML = `${bi('stop-fill')} Stopp`; btn.setAttribute('aria-pressed', 'true'); circle.style.transition = 'none'; circle.style.transform = 'scale(.55)'; void circle.offsetWidth;
  let pi = 0;
  const phase = () => {
    if (!run.alive || !document.body.contains(circle)) return stopBreath();
    if (pi === 0 && run.cycles > 0 && (Date.now() - startedAt) >= minutes * 60 * BREATH_MS) return stopBreath(true);
    const [name, secs, kind] = ex.pattern[pi]; label.textContent = name; circle.dataset.kind = kind; let left = secs; count.textContent = left;
    if (!reduce) { circle.style.transition = `transform ${secs * BREATH_MS / 1000}s ease-in-out`; if (kind === 'in') circle.style.transform = 'scale(1)'; else if (kind === 'out') circle.style.transform = 'scale(.55)'; }
    const tick = () => {
      if (!run.alive) return; left--;
      if (left > 0) { count.textContent = left; run.t = setTimeout(tick, BREATH_MS); return; }
      pi = (pi + 1) % ex.pattern.length; if (pi === 0) { run.cycles++; info.textContent = `${run.cycles} ${run.cycles === 1 ? 'Atemzug' : 'Atemzüge'} geschafft`; } phase();
    };
    run.t = setTimeout(tick, BREATH_MS);
  };
  info.textContent = 'Los geht’s. Atme im Rhythmus des Kreises.'; phase();
}
X.breathing = () => {
  stopBreath(); const ex = BREATH_EXERCISES.find(e => e.id === breathSel) || BREATH_EXERCISES[0];
  const rhythm = e => e.pattern.map(([n, s]) => `${s} s`).join(' · ');
  view.innerHTML = `${intro('Atemübungen', 'Ruhig atmen, Kraft sammeln. Hier kannst du direkt mitatmen. Der Kreis zeigt dir den Takt.')}
    <div class="card breath-card">
      <div class="breath-stage" role="img" aria-label="Atemkreis: wächst beim Einatmen und schrumpft beim Ausatmen"><div class="breath-circle" id="bCircle" aria-hidden="true"></div></div>
      <div class="breath-inner"><div class="breath-label" id="bLabel" aria-live="polite">Bereit?</div><div class="breath-count" id="bCount" aria-hidden="true"></div></div>
      <p class="small soft center mb-2" id="bInfo">${esc(ex.name)} · ${rhythm(ex)}</p>
      <div class="hstack gap-2 justify-content-center flex-wrap"><button class="btn btn-solid theme-primary" id="bStart" type="button" aria-pressed="false">${bi('play-fill')} Start</button>
        <div class="seg" role="group" aria-label="Dauer" style="margin:0">${[1, 3, 5].map(m => `<button type="button" data-bmin="${m}" class="${breathMin === m ? 'on' : ''}" aria-pressed="${breathMin === m}">${m} Min.</button>`).join('')}</div></div>
    </div>
    <h2>Übung wählen</h2>
    <div class="breath-list" role="radiogroup" aria-label="Atemübung">${BREATH_EXERCISES.map(e => `<button type="button" class="breath-opt ${e.id === ex.id ? 'on' : ''}" role="radio" aria-checked="${e.id === ex.id}" data-bex="${e.id}"><span class="bo-name">${e.name}</span><span class="small soft">${e.tag} · ${rhythm(e)}</span></button>`).join('')}</div>
    <div class="card breath-howto"><b>${esc(ex.name)}</b><p class="soft mt-1">${esc(ex.intro)}</p><ol class="mb-2">${ex.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>${ex.fun ? `<p class="small soft mb-0">${esc(ex.fun)}</p>` : ''}</div>
    <div class="card"><b>${bi('shield-check')} Sicher atmen</b><ul class="small mt-2 mb-0">${BREATH_SAFETY.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div>
    <p class="small soft">Anregungen aus: ${BREATH_SOURCES.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${esc(t)}</a>`).join(', ')}. Diese Übungen ersetzen keinen Geburtsvorbereitungskurs und keine Beratung durch Hebamme oder Frauenarzt.</p>`;
  $('#bStart').onclick = () => breathRun ? stopBreath() : startBreath(ex, breathMin);
  view.querySelectorAll('[data-bmin]').forEach(b => b.onclick = () => { breathMin = +b.dataset.bmin; view.querySelectorAll('[data-bmin]').forEach(x => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); }); });
  view.querySelectorAll('[data-bex]').forEach(b => b.onclick = () => { breathSel = b.dataset.bex; render(); });
};

/* ---------- Yoga für Schwangere ---------- */
let yogaTri = 'alle', yogaOpen = null;
X.yoga = () => {
  const list = YOGA_POSES.filter(p => yogaTri === 'alle' || p.tri.includes(+yogaTri));
  const whoLbl = { mama: 'Mama', together: 'Gemeinsam' };
  view.innerHTML = `${intro('Yoga für Schwangere', 'Sanfte Übungen für Rücken, Becken und gute Laune. Langsam, im Atemtakt und ohne Leistungsdruck.')}
    <div class="chip-row" role="group" aria-label="Trimester">${[['alle', 'Alle'], ...Object.entries(YOGA_TRI)].map(([k, l]) => `<button type="button" class="chip-btn ${yogaTri === String(k) ? 'on' : ''}" data-ytri="${k}" aria-pressed="${yogaTri === String(k)}">${l}</button>`).join('')}</div>
    <div class="card"><b>${bi('shield-check')} Vorher kurz lesen</b><ul class="small mt-2 mb-0">${YOGA_SAFETY.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div>
    ${list.map(p => `<details class="card yoga-card" data-yoga="${p.id}" ${yogaOpen === p.id ? 'open' : ''}><summary><span class="acc-ico">${bi(p.icon)}</span><span class="acc-text"><b>${esc(p.name)}</b><span class="small soft">${esc(p.area)} · ${p.breaths} Atemzüge · ${p.tri.map(t => t + '.').join(' ')} Trimester</span></span></summary>
      <div class="yoga-body"><p class="soft">${esc(p.intro)}</p><ol class="mb-2">${p.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol><p class="small soft mb-1">${bi('lightbulb')} ${esc(p.tip)}</p><span class="chip">${whoLbl[p.who]}</span></div></details>`).join('') || '<div class="card center soft">Für dieses Trimester ist gerade nichts dabei.</div>'}
    <p class="small soft">Die Übungen sind allgemeine, vorsichtige Anregungen und selbst formuliert. Sie ersetzen keinen Yogakurs für Schwangere und keine Beratung durch Hebamme oder Frauenarzt. Am besten probiert ihr sie zuerst unter Anleitung aus.</p>`;
  view.querySelectorAll('[data-ytri]').forEach(b => b.onclick = () => { yogaTri = b.dataset.ytri; render(); });
  view.querySelectorAll('details[data-yoga]').forEach(d => d.addEventListener('toggle', () => { if (d.open) yogaOpen = d.dataset.yoga; else if (yogaOpen === d.dataset.yoga) yogaOpen = null; }));
};
/* ---------- Babywitze ---------- */
let jokeCat = 'alle';
const jokeFavs = () => (state.jokeFav = state.jokeFav || []);
X.jokes = () => {
  const fav = jokeFavs(), all = JOKES.map(([c, t]) => ({ c, t })), list = all.filter(j => jokeCat === 'alle' ? true : jokeCat === 'fav' ? fav.includes(j.t) : j.c === jokeCat);
  const today = dailyPick(all.map(j => j.t), 'joke');
  const card = j => `<article class="card joke"><p class="joke-t">${esc(j.t)}</p><div class="hstack gap-2 justify-content-between"><span class="chip">${esc(JOKE_CATS[j.c])}</span><span class="hstack gap-1"><button type="button" class="btn btn-text btn-sm joke-btn ${fav.includes(j.t) ? 'on' : ''}" data-jfav="${esc(j.t)}" aria-pressed="${fav.includes(j.t)}" aria-label="${fav.includes(j.t) ? 'Nicht mehr merken' : 'Merken'}">${bi(fav.includes(j.t) ? 'heart-fill' : 'heart')}</button><button type="button" class="btn btn-text btn-sm joke-btn" data-jshare="${esc(j.t)}" aria-label="Witz teilen">${bi('share')}</button></span></div></article>`;
  view.innerHTML = `${intro('Babywitze', 'Lachen ist die beste Vorbereitung. Schwangerschaftswitze mit Niveau, zum Schmunzeln, Teilen und Mutmachen.')}
    <div class="card joke-day"><div class="small soft mb-1">${bi('stars')} Witz des Tages</div><p class="joke-t big-joke" id="jokeToday">${esc(today)}</p>
      <div class="hstack gap-2 flex-wrap"><button type="button" class="btn btn-solid theme-primary" id="jokeNew">${bi('arrow-repeat')} Noch einer</button><button type="button" class="btn btn-subtle theme-secondary" id="jokeShare">${bi('share')} Teilen</button></div></div>
    <div class="chip-row" role="group" aria-label="Kategorie">${[['alle', 'Alle'], ...Object.entries(JOKE_CATS), ['fav', `Gemerkt (${fav.length})`]].map(([k, l]) => `<button type="button" class="chip-btn ${jokeCat === k ? 'on' : ''}" data-jcat="${k}" aria-pressed="${jokeCat === k}">${l}</button>`).join('')}</div>
    ${list.length ? list.map(card).join('') : '<div class="card center soft">Noch nichts gemerkt. Tippe bei einem Witz auf das Herz.</div>'}
    <p class="small soft center">Alle Witze sind selbst geschrieben und für alle Ohren geeignet. Lachen tut gut, euch und dem Baby.</p>`;
  const cur = () => $('#jokeToday').textContent;
  $('#jokeNew').onclick = () => { const pool = all.map(j => j.t); let q, g = 0; do { q = pick(pool); } while (q === cur() && ++g < 20); $('#jokeToday').textContent = q; };
  $('#jokeShare').onclick = () => shareThing({ title: 'Babywitz', text: `${cur()}\n\n${brandFull()}` });
  view.querySelectorAll('[data-jcat]').forEach(b => b.onclick = () => { jokeCat = b.dataset.jcat; render(); });
  view.querySelectorAll('[data-jshare]').forEach(b => b.onclick = () => shareThing({ title: 'Babywitz', text: `${b.dataset.jshare}\n\n${brandFull()}` }));
  view.querySelectorAll('[data-jfav]').forEach(b => b.onclick = () => { const t = b.dataset.jfav; state.jokeFav = fav.includes(t) ? fav.filter(x => x !== t) : [...fav, t]; save(); render(); });
};

/* ---------- Wochen-Story: die aktuelle Entwicklung des Babys schön teilen (drei Bilder im Hochformat) ---------- */
let storyIdx = 0;
// Eigene Messwerte (z. B. vom Ultraschall oder aus dem Mutterpass): ersetzen in der Wochen-Story die Durchschnittswerte der jeweiligen Woche
const fetalList = () => (state.fetal = state.fetal || []);
const fetalFor = week => fetalList().filter(e => weekFor(e.date) === week).sort((a, b) => b.date.localeCompare(a.date))[0] || null;
function bodyFor(p) { const w = Math.max(4, Math.min(42, p.weeks)), avg = weekBody(w), e = fetalFor(p.weeks); return { mm: e && e.mm ? e.mm : avg.mm, g: e && e.g ? e.g : avg.g, mmM: !!(e && e.mm), gM: !!(e && e.g), date: e ? e.date : '' }; }
const parseNum = v => parseFloat(String(v || '').trim().replace(',', '.'));
// Prüft eine Eingabe: liefert { err } oder { mm, g }
function fetalCheck(date, sizeCm, weightG) {
  const mm = sizeCm === '' ? 0 : Math.round(parseNum(sizeCm) * 10), g = weightG === '' ? 0 : Math.round(parseNum(weightG));
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return { err: 'Bitte ein Datum wählen.' };
  if (date > iso(today())) return { err: 'Das Datum darf nicht in der Zukunft liegen.' };
  const wk = weekFor(date); if (wk === null || wk > 42) return { err: 'Das Datum passt nicht zur Schwangerschaft.' };
  if (!mm && !g) return { err: 'Bitte Größe oder Gewicht eintragen.' };
  if (sizeCm !== '' && !(mm >= 10 && mm <= 700)) return { err: 'Die Größe muss zwischen 1 und 70 cm liegen.' };
  if (weightG !== '' && !(g >= 1 && g <= 6000)) return { err: 'Das Gewicht muss zwischen 1 und 6000 g liegen.' };
  const avg = weekBody(Math.max(4, Math.min(42, wk))), far = (mm && (mm > avg.mm * 1.6 || mm < avg.mm / 1.6)) || (g && avg.g > 20 && (g > avg.g * 2 || g < avg.g / 2));
  return { mm, g, week: wk, far: !!far };
}
const weekBody = w => {
  w = Math.max(4, Math.min(42, w)); let lo = WEEK_BODY[0], hi = WEEK_BODY[WEEK_BODY.length - 1];
  for (let i = 0; i < WEEK_BODY.length - 1; i++) if (w >= WEEK_BODY[i][0] && w <= WEEK_BODY[i + 1][0]) { lo = WEEK_BODY[i]; hi = WEEK_BODY[i + 1]; break; }
  const t = hi[0] === lo[0] ? 0 : (w - lo[0]) / (hi[0] - lo[0]);
  return { mm: Math.round(lo[1] + (hi[1] - lo[1]) * t), g: Math.round(lo[2] + (hi[2] - lo[2]) * t) };
};
const fmtMM = mm => mm < 100 ? `${mm} mm` : `${(mm / 10).toFixed(1).replace('.', ',').replace(/,0$/, '')} cm`;
const fmtG = g => g < 1 ? 'unter 1 g' : g < 1000 ? `${g} g` : `${(g / 1000).toFixed(1).replace('.', ',')} kg`;
function weekRange(p) {
  const lmp = new Date(state.settings.dueDate + 'T00:00'); lmp.setDate(lmp.getDate() - 280);
  const s = new Date(lmp); s.setDate(lmp.getDate() + p.weeks * 7); const e = new Date(s); e.setDate(s.getDate() + 6);
  const mon = d => d.toLocaleDateString('de-DE', { month: 'long' }), short = d => d.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' });
  return s.getMonth() === e.getMonth() ? `${s.getDate()}.–${e.getDate()}. ${mon(e)}` : `${short(s)}–${short(e)}`;
}
function storyData() {
  const p = pregnancy(), s = state.settings, kid = (s.nick || '').trim() || 'Dein Baby', w = Math.max(4, Math.min(42, p.weeks)), [, fruit] = fruitFor(p.weeks), body = bodyFor(p), art = FRUIT_ART[fruit] || 'ein';
  // Ist eine Mundart eingestellt, steht die Überschrift in Mundart (bei "bunt gemischt" wechselt sie täglich)
  const dk = dialectKeys(), dia = dk.length ? dk[Math.floor(today() / DAY) % dk.length] : null, tpl = dia ? dailyPick(STORY_DIALECT[dia], 'story-' + dia) : null;
  const sizeTitle = tpl ? tpl.replace('{kid}', kid).replace(/\{a\}/g, DIA_ART[dia] || 'a').replace('{fruit}', fruit) : `${kid} ist so groß wie ${art} ${fruit}`;
  const due = new Date(s.dueDate + 'T00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
  return { p, week: p.weeks, range: weekRange(p), fruit, kid, body, slides: [
    { id: 'size', title: sizeTitle, dia, lines: [`${body.mmM ? '' : 'ca. '}${fmtMM(body.mm)}`, `${body.gM ? '' : 'ca. '}${fmtG(body.g)}`, ...(body.date ? [`gemessen am ${fmtDate(body.date)}`] : [])] },
    { id: 'dev', title: WEEK_DEV[w], dia, quote: dia ? dailyPick(DIALECT_QUOTES[dia].mama, 'storyq-' + dia) : '' },
    { id: 'sum', title: 'Unsere Zusammenfassung', rows: [['SSW', `${p.weeks}+${p.days}`], ['Errechneter Termin', due], [body.mmM ? 'Größe (gemessen)' : 'Größe (Richtwert)', `${body.mmM ? '' : 'ca. '}${fmtMM(body.mm)}`], [body.gM ? 'Gewicht (gemessen)' : 'Gewicht (Richtwert)', `${body.gM ? '' : 'ca. '}${fmtG(body.g)}`], ['Schon geschafft', `${Math.max(0, p.elapsed)} Tage`], ['Noch ca.', `${Math.max(0, p.left)} Tage`]] }
  ] };
}
const fruitHue = name => [...name].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7);
const storyColors = () => { const cs = getComputedStyle(document.documentElement); return { strong: cs.getPropertyValue('--primary-strong').trim() || '#0d3b24', text: cs.getPropertyValue('--text').trim() || '#1d3b2e' }; };
function storySlideHTML(S, i) {
  const sl = S.slides[i], col = storyColors();
  const art = sl.id === 'size' ? `<div class="st-circle" aria-hidden="true">${fruitSVG(S.fruit)}</div><p class="st-cap">${sl.lines.map(esc).join(' · ')}</p>`
    : sl.id === 'dev' ? `<div class="st-baby" aria-hidden="true">${babySVG(col.text, '#ffffff', col.strong, S.week, S.fruit)}</div><p class="st-cap ${sl.quote ? 'st-quote' : ''}">${esc(sl.quote || 'Woche ' + S.week)}</p>`
    : `<div class="st-pair" aria-hidden="true"><span class="st-bub">${babySVG(col.text, '#ffffff', col.strong, S.week, S.fruit)}</span><span class="st-bub st-bub-w">${fruitSVG(S.fruit)}</span></div><dl class="st-grid">${sl.rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl><div class="st-prog" role="img" aria-label="Fortschritt der Schwangerschaft"><i style="width:${S.p.pct}%"></i></div>`;
  return `<article class="story-slide story-${sl.id}"><div class="st-top">Woche ${S.week} · ${esc(S.range)}</div><h2 class="st-title">${esc(sl.title)}</h2>${art}<div class="st-foot"><span class="st-hearts">${duoHearts()}</span> ${esc(brandName())} <i>${esc(brandSub())}</i></div></article>`;
}// Bild zum Teilen (1080 x 1920) mit den Farben der gewählten Farbwelt
function drawStory(S, i, imgs = {}) {
  const W = 1080, H = 1920, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'), cs = getComputedStyle(document.documentElement), v = n => cs.getPropertyValue(n).trim();
  const bg = v('--bg') || '#fbf4f2', s2 = v('--surface-2') || '#f4e6e3', pri = v('--primary') || '#ae5f6a', strong = v('--primary-strong') || '#8b4752', text = v('--text') || '#3a2c2d', soft = v('--text-soft') || '#6e5a59', fam = (v('--font') || 'sans-serif'), sl = S.slides[i];
  const hm = v('--heart-mama') || pri, hp = v('--heart-papa') || strong;
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, s2); g.addColorStop(1, bg); x.fillStyle = g; x.fillRect(0, 0, W, H);
  const wrap = (t, mw, size, weight) => { x.font = `${weight} ${size}px ${fam}`; const out = []; let line = ''; for (const w of String(t).split(' ')) { const test = line ? line + ' ' + w : w; if (x.measureText(test).width > mw && line) { out.push(line); line = w; } else line = test; } if (line) out.push(line); return out; };
  const heart = (cx, cy, s, col, a = 1) => { x.save(); x.globalAlpha = a; x.translate(cx, cy); x.scale(s, s); x.beginPath(); x.moveTo(0, 30); x.bezierCurveTo(-90, -30, -50, -90, 0, -40); x.bezierCurveTo(50, -90, 90, -30, 0, 30); x.fillStyle = col; x.fill(); x.restore(); };
  const star = (cx, cy, r, a = .8) => { x.save(); x.globalAlpha = a; x.fillStyle = '#FFFFFF'; x.beginPath(); for (let k = 0; k < 8; k++) { const rr = k % 2 ? r * .28 : r, an = k * Math.PI / 4 - Math.PI / 2; x.lineTo(cx + rr * Math.cos(an), cy + rr * Math.sin(an)); } x.closePath(); x.fill(); x.restore(); };
  const card = (cx, cy, r) => { x.save(); x.shadowColor = 'rgba(80,30,40,.18)'; x.shadowBlur = 60; x.shadowOffsetY = 24; x.fillStyle = '#FFFFFF'; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); x.restore(); x.strokeStyle = pri; x.globalAlpha = .25; x.lineWidth = 6; x.beginPath(); x.arc(cx, cy, r + 18, 0, 7); x.stroke(); x.globalAlpha = 1; };
  // zarte Dekoration: große weiche Kreise, kleine Herzen und Funkelsterne
  x.save(); x.globalAlpha = .35; x.fillStyle = '#FFFFFF'; x.beginPath(); x.arc(940, 220, 260, 0, 7); x.fill(); x.beginPath(); x.arc(110, 1640, 300, 0, 7); x.fill(); x.restore();
  heart(70, 1700, .5, hm, .5); heart(1010, 1700, .5, hp, .5); heart(80, 110, .3, pri, .35); heart(1000, 110, .3, pri, .35); heart(62, 1480, .28, pri, .3); star(890, 250, 30); star(190, 250, 22); star(1010, 1560, 26); star(55, 1280, 20);
  x.textBaseline = 'alphabetic'; x.textAlign = 'center'; x.fillStyle = pri; x.font = `700 40px ${fam}`; x.fillText(`WOCHE ${S.week}  ·  ${S.range}`, W / 2, 150);
  x.strokeStyle = pri; x.globalAlpha = .35; x.lineWidth = 4; x.beginPath(); x.moveTo(W / 2 - 90, 190); x.lineTo(W / 2 + 90, 190); x.stroke(); x.globalAlpha = 1;
  x.fillStyle = text; const ts = sl.id === 'dev' ? 68 : 80, tl = wrap(sl.title, 900, ts, 800); x.font = `800 ${ts}px ${fam}`; tl.slice(0, 4).forEach((l, k) => x.fillText(l, W / 2, 340 + k * (ts + 22)));
  const titleEnd = 340 + Math.min(tl.length, 4) * (ts + 22);
  if (sl.id === 'size') {
    const cy = Math.max(titleEnd + 380, 1000); card(W / 2, cy, 330);
    if (imgs.fruit) x.drawImage(imgs.fruit, W / 2 - 280, cy - 285, 560, 560); else { const hue = fruitHue(S.fruit), gr = x.createRadialGradient(W / 2 - 70, cy - 60, 20, W / 2, cy, 250); gr.addColorStop(0, `hsl(${hue} 80% 70%)`); gr.addColorStop(1, `hsl(${hue} 70% 45%)`); x.fillStyle = gr; x.beginPath(); x.arc(W / 2, cy + 10, 240, 0, 7); x.fill(); }
    x.fillStyle = strong; { const cl = wrap(sl.lines.join(' · '), 900, 64, 800); x.font = `800 64px ${fam}`; cl.slice(0, 3).forEach((l, k) => x.fillText(l, W / 2, cy + 470 + k * 80)); }
  } else if (sl.id === 'dev') {
    const cy = Math.max(titleEnd + 380, 1000); card(W / 2, cy, 330);
    if (imgs.baby) x.drawImage(imgs.baby, W / 2 - 300, cy - 300, 600, 600); else { x.fillStyle = strong; x.beginPath(); x.arc(W / 2, cy, 280, 0, 7); x.fill(); heart(W / 2, cy + 10, 4.2, '#FFFFFF'); }
    if (sl.quote) { x.fillStyle = text; let qs = 54, ql = wrap(sl.quote, 900, qs, 700); if (ql.length > 3) { qs = 48; ql = wrap(sl.quote, 900, qs, 700); } ql.slice(0, 4).forEach((l, k) => { x.font = `italic 700 ${qs}px ${fam}`; x.fillText(l, W / 2, cy + 470 + k * (qs + 18)); }); } else { x.fillStyle = soft; x.font = `700 56px ${fam}`; x.fillText(`Woche ${S.week}`, W / 2, cy + 480); }
  } else {
    const top = Math.max(titleEnd + 40, 560);
    if (imgs.baby && imgs.fruit) { [[300, imgs.baby], [780, imgs.fruit]].forEach(([cx, im]) => { card(cx, top + 210, 200); x.drawImage(im, cx - 165, top + 45, 330, 330); }); }
    const gy = imgs.baby ? top + 500 : top + 160, rs = 185;
    sl.rows.forEach(([k, val], n) => { const cx = n % 2 ? 790 : 290, cy = gy + Math.floor(n / 2) * rs; x.fillStyle = soft; x.font = `700 40px ${fam}`; x.fillText(k, cx, cy); x.fillStyle = text; x.font = `800 72px ${fam}`; x.fillText(val, cx, cy + 82); });
    const by = gy + Math.ceil(sl.rows.length / 2) * rs - 10;
    x.fillStyle = 'rgba(255,255,255,.7)'; x.beginPath(); x.roundRect ? x.roundRect(120, by, 840, 36, 18) : x.rect(120, by, 840, 36); x.fill(); x.fillStyle = strong; x.beginPath(); x.roundRect ? x.roundRect(120, by, Math.max(36, 840 * S.p.pct / 100), 36, 18) : x.rect(120, by, Math.max(36, 840 * S.p.pct / 100), 36); x.fill();
  }
  // Fußzeile: zwei verschmolzene Herzen und der App-Name, zusammen mittig
  x.textAlign = 'left'; x.font = `800 46px ${fam}`; const label = `${brandName()}  ${brandSub()}`, tw = x.measureText(label).width, gw = 92, gx = (W - (gw + 24 + tw)) / 2, fy = H - 120;
  heart(gx + 30, fy - 16, .5, hm); heart(gx + 62, fy - 16, .5, hp); x.fillStyle = strong; x.fillText(label, gx + gw + 24, fy);
  return c;
}// SVG-Zeichnung als Bild laden (für das Bild zum Teilen)
const svgImage = svg => new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); });
async function storyImages(S, i) { const col = storyColors(), id = S.slides[i].id, out = {}; try { if (id !== 'dev') out.fruit = await svgImage(fruitSVG(S.fruit)); if (id !== 'size') out.baby = await svgImage(babySVG(col.text, '#ffffff', col.strong, S.week, S.fruit)); } catch { /* Ersatzzeichnung */ } return out; }
const storyFile = async (S, i) => { const blob = await new Promise(async r => drawStory(S, i, await storyImages(S, i)).toBlob(r, 'image/png')); return new File([blob], `${fileSafe(S.kid)}-woche-${S.week}-${S.slides[i].id}.png`, { type: 'image/png' }); };
function saveFileBlob(f) { const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(f), download: f.name }); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); }
async function shareImages(files, S) {
  const text = retitleStr(`${S.kid} in Woche ${S.week}: so groß wie ${FRUIT_ART[S.fruit] || 'ein'} ${S.fruit}. ${brandFull()}`);
  try { if (navigator.canShare && navigator.canShare({ files })) await navigator.share({ files, title: `${S.kid}: Woche ${S.week}`, text }); else { files.forEach(saveFileBlob); toast(files.length > 1 ? 'Bilder gespeichert. Jetzt in jeder App teilbar.' : 'Bild gespeichert. Jetzt in jeder App teilbar.'); } }
  catch (e) { if (e.name !== 'AbortError') toast('Teilen klappt hier leider nicht'); }
}
let fetalOpen = false;
function fetalCard(S) {
  const list = [...fetalList()].sort((a, b) => b.date.localeCompare(a.date)), lmp = new Date(state.settings.dueDate + 'T00:00'); lmp.setDate(lmp.getDate() - 280);
  const row = e => `<li class="fetal-row"><div class="flex-grow-1"><b>${esc(fmtDate(e.date))}</b> <span class="chip">${weekFor(e.date)}. SSW</span><div class="small soft">${[e.mm ? `Größe ${fmtMM(e.mm)}` : '', e.g ? `Gewicht ${fmtG(e.g)}` : '', e.note ? esc(e.note) : ''].filter(Boolean).join(' · ')}</div></div><button type="button" class="btn btn-text theme-danger btn-sm" data-fdel="${e.id}" aria-label="Messwert vom ${esc(fmtDate(e.date))} löschen">${bi('trash')}</button></li>`;
  return `<details class="card fetal-card mt-3" id="fetalCard" ${fetalOpen ? 'open' : ''}><summary>${bi('rulers')} Eigene Messwerte eintragen <span class="chip">${list.length}</span></summary>
    <p class="small soft mt-2">Habt ihr beim Ultraschall oder im Mutterpass Größe und Gewicht notiert? Dann erscheinen sie in der Story der jeweiligen Woche statt der Durchschnittswerte.</p>
    <form id="fetalForm" novalidate><label for="fdate">Datum der Messung</label><input id="fdate" type="date" value="${iso(today())}" max="${iso(today())}" min="${iso(lmp)}">
      <div class="hstack gap-2"><div class="flex-grow-1"><label for="fsize">Größe in cm</label><input id="fsize" inputmode="decimal" autocomplete="off" placeholder="z. B. 37,6"></div><div class="flex-grow-1"><label for="fweight">Gewicht in g</label><input id="fweight" inputmode="numeric" autocomplete="off" placeholder="z. B. 1100"></div></div>
      <label for="fnote">Notiz (optional)</label><input id="fnote" maxlength="80" autocomplete="off" placeholder="z. B. Ultraschall bei Dr. Muster">
      <p class="small ob-err" id="fetalErr" role="alert" hidden></p><button class="btn btn-solid theme-primary w-100 mt-2" type="submit">${bi('plus-lg')} Messwert speichern</button></form>
    ${list.length ? `<h3 class="small mt-3 mb-1">Gespeicherte Messwerte</h3><ul class="fetal-list">${list.map(row).join('')}</ul>` : ''}</details>`;
}
X.weekstory = () => {
  const S = storyData(), n = S.slides.length; storyIdx = Math.max(0, Math.min(n - 1, storyIdx));
  view.innerHTML = `${intro('Wochen-Story', `Die aktuelle Entwicklung von ${esc(S.kid)} als drei schöne Bilder zum Teilen: mit Größenvergleich, Entwicklung und Zusammenfassung.`)}
    <div class="story-wrap" id="storyWrap"><button type="button" class="st-nav st-prev" id="stPrev" aria-label="Voriges Bild">${bi('chevron-left')}</button><div id="storyBox">${storySlideHTML(S, storyIdx)}</div><button type="button" class="st-nav st-next" id="stNext" aria-label="Nächstes Bild">${bi('chevron-right')}</button></div>
    <div class="st-dots" role="group" aria-label="Bild wählen">${S.slides.map((s, i) => `<button type="button" class="st-dot ${i === storyIdx ? 'on' : ''}" data-st="${i}" aria-label="Bild ${i + 1} von ${n}" aria-pressed="${i === storyIdx}"></button>`).join('')}</div>
    <div class="hstack gap-2 flex-wrap mt-3"><button type="button" class="btn btn-solid theme-primary flex-grow-1" id="stShare">${bi('share-fill')} Dieses Bild teilen</button><button type="button" class="btn btn-subtle theme-secondary flex-grow-1" id="stAll">${bi('images')} Alle drei teilen</button></div>
    ${fetalCard(S)}
    <p class="small soft mt-2" id="stNote">${S.body.mmM || S.body.gM ? `Größe und Gewicht dieser Woche sind eure eigenen Messwerte vom ${esc(fmtDate(S.body.date))}. Fehlende Werte sind Durchschnittswerte (Richtwerte).` : 'Größe und Gewicht sind Durchschnittswerte (Richtwerte). Eigene Messwerte könnt ihr oben eintragen.'} Beides ersetzt keine ärztliche Beratung. Auf dem Handy öffnet sich direkt das Teilen-Menü, am Computer werden die Bilder gespeichert.</p>`;
  const go = i => { storyIdx = (i + n) % n; render(); };
  $('#stPrev').onclick = () => go(storyIdx - 1); $('#stNext').onclick = () => go(storyIdx + 1);
  view.querySelectorAll('[data-st]').forEach(b => b.onclick = () => go(+b.dataset.st));
  $('#stShare').onclick = async () => shareImages([await storyFile(S, storyIdx)], S);
  $('#stAll').onclick = async () => shareImages(await Promise.all(S.slides.map((_, i) => storyFile(S, i))), S);
  const fc = $('#fetalCard'); fc.addEventListener('toggle', () => { fetalOpen = fc.open; });
  $('#fetalForm').onsubmit = e => {
    e.preventDefault(); const r = fetalCheck($('#fdate').value, $('#fsize').value.trim(), $('#fweight').value.trim()), box = $('#fetalErr');
    box.hidden = !r.err; box.textContent = r.err || ''; if (r.err) return;
    fetalList().push({ id: uid(), date: $('#fdate').value, mm: r.mm || 0, g: r.g || 0, note: $('#fnote').value.trim() }); save(); fetalOpen = true; render();
    toast(r.far ? `Gespeichert. Der Wert liegt weit vom Durchschnitt, bitte kurz noch einmal prüfen.` : `Gespeichert. ${S.kid} wächst und gedeiht!`);
  };
  view.querySelectorAll('[data-fdel]').forEach(b => b.onclick = () => { if (!confirm('Diesen Messwert löschen?')) return; state.fetal = fetalList().filter(x => x.id !== b.dataset.fdel); save(); fetalOpen = true; render(); });
  let x0 = null; const box = $('#storyBox');
  box.addEventListener('pointerdown', e => { x0 = e.clientX; }); box.addEventListener('pointerup', e => { if (x0 === null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 50) go(storyIdx + (dx < 0 ? 1 : -1)); });
  view.onkeydown = e => { if (e.key === 'ArrowLeft') go(storyIdx - 1); if (e.key === 'ArrowRight') go(storyIdx + 1); };
};