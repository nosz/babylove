'use strict';
/* Zusatz-Funktionen. Wird vor app.js geladen; app.js übernimmt EXTRA_ROUTES.
   Nutzt Helfer aus app.js (state, view, esc, save, render, openSheet, ...) erst zur Laufzeit. */
const EXTRA_ROUTES = {};
const X = EXTRA_ROUTES;

const bi = n => `<i class="bi bi-${n}" aria-hidden="true"></i>`;
// Kennzeichnung: für wen ist etwas? Mama (rosé), Papa (blau) oder gemeinsam (immer zwei Herzen)
const duoHearts = () => '<span class="duo" aria-hidden="true"><i class="bi bi-heart-fill"></i><i class="bi bi-heart-fill"></i></span>';
const AUD = { mama: { label: 'Für Mama', icon: () => bi('person-heart') }, papa: { label: 'Für Papa', icon: () => bi('person-fill') }, together: { label: 'Gemeinsam', icon: duoHearts } };
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
  ['letters', 'envelope-heart', 'Briefe ans Baby', 'Text oder Sprachnachricht für später'],
  ['names', 'tags', 'Namensfinder', 'Favoriten, gemeinsam abstimmen'],
  ['milestones', 'stars', 'Meilensteine', 'Mit Foto, zum Teilen'],
  ['wishes', 'gift', 'Wunschliste', 'Damit Oma nicht dreimal Söckchen schenkt'],
  ['lists', 'bag-heart', 'Checklisten', 'Kliniktasche, Erstausstattung, Behörden'],
  ['food', 'egg-fried', 'Ernährung', 'Erlaubt, verboten, Hinweise'],
  ['recipes', 'cookie', 'Kochrezepte', 'Gesund, lecker, mit Einkaufsliste'],
  ['move', 'bicycle', 'Bewegung', 'Pro Trimester, Beckenboden, Yoga'],
  ['vits', 'capsule', 'Vitamine', 'Tägliche Erinnerung'],
  ['water', 'droplet-half', 'Wasser-Tracker', 'Gläser pro Tag'],
  ['contacts', 'telephone-fill', 'Kontakte & Notfall', 'Hebamme, Arzt, wichtige Nummern'],
  ['pass', 'journal-medical', 'Mutterpass digital', 'Werte und Fotos'],
  ['baby', 'moon-stars', 'Baby-Tracker', 'Für danach: Stillen, Windeln, Schlaf'],
  ['tips', 'geo-alt-fill', 'Frankfurt', 'Anlaufstellen und Tipps'],
  ['planner', 'check2-square', 'Planer', 'To-dos und Termine'],
  ['einstellungen', 'gear-fill', 'Einstellungen', 'Farben, Schrift, Datensicherung']
];
X.more = () => {
  view.innerHTML = `${intro('Mehr', 'Alles, was eine Schwangerschaft so braucht. Und ein bisschen mehr.')}
    <div class="grid">${HUB.map(([k, i, t, d]) => `<a class="card link-card hub" href="#/${k}">${bi(i)}<b>${t}</b><span class="small soft">${d}</span>${audBadge(PAGE_AUDIENCE[k] || 'together', 'sm')}</a>`).join('')}</div>
    <button class="btn btn-solid theme-primary w-100" id="shareApp">${bi('share-fill')} BABYLOVE teilen</button>
    <p class="small soft center" style="margin-top:8px">Teilt nur den Link zur App, keine deiner Daten.</p>`;
  $('#shareApp').onclick = shareApp;
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
const papaRow = (icon, label, id, text, btn, aria) => `<div class="pd-row"><div class="pd-ico">${bi(icon)}</div><div class="flex-grow-1"><div class="pd-label">${label} ${papaFor()}</div><p class="mb-0" id="${id}">${esc(papaName(text))}</p></div>
  <button class="btn btn-subtle theme-secondary btn-sm" id="${btn}" aria-label="${aria}">${bi('arrow-repeat')}</button></div>`;
const papaDailyCard = tri => `<div class="card papa-daily">${papaRow('bullseye', 'Mission des Tages', 'papaMission', dailyPick(quotePool('missions'), 'mission'), 'newMission', 'Neue Mission')}
  ${papaRow('lightbulb', `Tipp für das ${tri}. Trimester`, 'papaTip', dailyPick(quotePool('papaTips', tri), 'tip' + tri), 'newPapaTip', 'Neuer Tipp')}
  ${papaRow('chat-quote', 'Motivation', 'papaMsg', partnerMsgToday(), 'newPapaMsg', 'Neuer Spruch')}</div>`;
const bindTip = tri => {
  const b = $('#newPapaTip'); if (b) b.onclick = () => { $('#papaTip').textContent = papaName(nextPapaTip(tri)); };
  const m = $('#newMission'); if (m) m.onclick = () => { const pool = quotePool('missions'), cur = $('#papaMission').textContent; let q, g = 0; do { q = pick(pool); } while (q === cur && pool.length > 1 && ++g < 20); $('#papaMission').textContent = papaName(q); };
  const s = $('#newPapaMsg'); if (s) s.onclick = () => { $('#papaMsg').textContent = papaName(partnerMsg()); };
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
      <label for="w${x.id}" class="keep" style="margin:0;font-weight:400;flex:1"><span>${esc(x.text)}</span>${x.assigned ? ` <span class="chip">${bi('person-check')} bei ${esc(x.assigned)}</span>` : ''}${isUrl(x.link) ? ` <a href="${esc(x.link)}" target="_blank" rel="noopener noreferrer">${bi('box-arrow-up-right')}</a>` : ''}</label>
      <button class="btn btn-text theme-danger btn-sm" data-d="${x.id}" aria-label="Entfernen">${bi('x-lg')}</button></div>`).join('')}</div>` : empty('gift', 'Noch leer. Ein Kinderwagen mit Getränkehalter? Nur zu!')}
    <form id="wf" class="mt-3"><input id="wt" placeholder="Wunsch, z. B. Tragetuch" aria-label="Wunsch" maxlength="80" required><input id="wl" type="url" placeholder="Link (optional)" aria-label="Link zum Wunsch (optional)" style="margin-top:8px"><button class="btn btn-solid theme-primary w-100 mt-2">Hinzufügen</button></form>
    <div class="hstack gap-2 flex-wrap mt-2"><a class="btn btn-solid theme-primary flex-grow-1" href="#/wishprint">${bi('printer')} Wunschzettel drucken</a>${w.length ? `<button class="btn btn-subtle theme-secondary flex-grow-1" id="shw">${bi('share')} Liste teilen</button>` : ''}</div>`;
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

/* ---------- Wasser ---------- */
X.water = () => {
  const d = iso(today()), n = state.water[d] || 0, goal = state.waterGoal || 8;
  const msgs = n === 0 ? 'Noch trocken wie die Wüste. Auf geht’s!' : n < goal ? 'Weiter so, das Baby schwimmt sich gerade warm.' : 'Ziel erreicht! Du bist ein Wasserfall der Motivation.';
  view.innerHTML = `${intro('Wasser-Tracker', 'Dein Körper besteht zu großen Teilen aus Wasser. Und gerade baust du noch einen dazu.')}
    <div class="card center"><div style="font-size:3rem;font-weight:800">${n} <span class="soft" style="font-size:1.2rem">/ ${goal} Gläser</span></div>
      <div class="progress my-3" role="progressbar" aria-label="Wasserziel" aria-valuenow="${n}" aria-valuemin="0" aria-valuemax="${goal}"><div class="progress-bar" style="width:${Math.min(100, n / goal * 100)}%"></div></div>
      <p class="soft">${n * 250} ml · ${msgs}</p>
      <div class="hstack gap-2 justify-content-center"><button class="btn btn-subtle theme-secondary" id="minus" aria-label="Ein Glas weniger">${bi('dash-lg')}</button><button class="btn btn-solid theme-primary" id="plus" style="min-width:140px">${bi('droplet-fill')} Glas getrunken</button></div></div>
    <div class="card"><label for="goal" class="form-label">Tagesziel (Gläser à 250 ml)</label><input id="goal" type="number" min="1" max="20" value="${goal}"><p class="small soft mt-2 mb-0">Wie viel für dich passt, klärst du mit Arzt oder Hebamme.</p></div>`;
  $('#plus').onclick = () => { state.water[d] = n + 1; save(); render(); if (n + 1 === goal) toast('Wasserziel geschafft. Du bist ein Wasserfall der Motivation!'); else cheer('water'); };
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
  const person = who => `<button class="tg-btn ${t[who] ? 'on' : ''}" data-tg="${who}" aria-pressed="${!!t[who]}">${personAvatar(who, 'avatar-sm') || bi('person-fill')}<span data-name="${who}" data-fallback="${who === 'mama' ? 'Mama' : 'Papa'}">${esc(names[who])}</span>${bi(t[who] ? 'check-circle-fill' : 'circle')}</button>`;
  return `<div class="card together ${both ? 'done' : ''}">
    <div class="hstack gap-2"><b class="flex-grow-1">${duoHearts()} Gemeinsam heute</b><span class="chip">${bi('fire')} Serie: ${n} ${n === 1 ? 'Tag' : 'Tage'}</span></div>
    <p class="mt-2 mb-2">${esc(idea[0])}</p>
    ${idea[1] ? `<a class="tg-go" href="#/${idea[1]}">Los geht’s ${bi('arrow-right')}</a>` : ''}
    <div class="hstack gap-2">${person('mama')}${person('partner')}</div>
    <div class="small soft mt-2">${msg}</div><div class="tg-dots mt-2" aria-label="Letzte 7 Tage">${dots}</div></div>`;
}
function bindTogether() {
  view.querySelectorAll('[data-tg]').forEach(b => b.onclick = () => {
    const day = iso(today()); state.together = state.together || {};
    const t = state.together[day] = state.together[day] || {}, who = b.dataset.tg, was = togetherDone(day);
    t[who] = !t[who]; save(); render();
    if (!was && togetherDone(day)) toast(pick(TOGETHER_DONE));
  });
}
