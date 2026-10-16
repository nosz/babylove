'use strict';
/* BABYLOVE by Sarah: Drucken und Exportieren (Wunschzettel, Tagebuch).
   Wird nach extras.js und vor app.js geladen. Helfer aus app.js werden erst zur Laufzeit genutzt. */

const downloadFile = (name, text, type) => {
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([/json/.test(type || '') ? text : retitleStr(text, /html|word|xml/.test(type || ''))], { type })), download: name });
  a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};
const fileSafe = s => String(s || '').normalize('NFKD').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-').toLowerCase() || 'datei';
const fmtLong = d => new Date(d + 'T00:00').toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
const namesLine = () => [state.settings.mama, state.settings.partner].filter(Boolean).join(' & ');

/* ==================== Wunschzettel ==================== */
const WISH_TONES = {
  humor: { label: 'Humorvoll', lines: [
    'Bevor du wieder 14 Strampler in Größe 50 kaufst: Hier stehen die Dinge, die wir wirklich brauchen. Mit Liebe, Dankbarkeit und einem Augenzwinkern.',
    'Du wurdest offiziell zur Wunscherfüllungs-Zentrale ernannt. Deine Mission, falls du sie annimmst, steht unten. Sie zerstört sich nach dem Einkauf leider nicht von selbst.',
    'Wir haben lange überlegt, was wir uns wünschen. Ergebnis: das hier. Und Schlaf. Aber den kann man leider nicht einpacken.',
    'Diese Liste ist bewusst kurz, damit der Einkauf nicht in einem Kinderwagen-Marathon endet. Wir lieben dich dafür, dass du dir die Mühe machst.'] },
  herzlich: { label: 'Herzlich', lines: [
    'Wir freuen uns so sehr auf unser Baby und danken dir von Herzen, dass du uns dabei begleitest. Diese Wünsche liegen uns besonders am Herzen.',
    'Mit dir an unserer Seite fühlt sich alles leichter an. Wenn du uns eine Freude machen möchtest, sind das die Dinge, die wir gerade am meisten brauchen.',
    'Danke, dass du Teil dieser besonderen Zeit bist. Aus unserer Wunschliste haben wir drei Dinge für dich herausgesucht.'] },
  kurz: { label: 'Kurz', lines: ['Diese Dinge brauchen wir gerade besonders. Vielen Dank!'] }
};
const WISH_FOOT = {
  humor: 'Bitte gib kurz Bescheid, welchen Wunsch du erfüllst, damit nichts doppelt im Kinderzimmer landet. Danke, dass es dich gibt.',
  herzlich: 'Sag uns einfach kurz, welchen Wunsch du dir ausgesucht hast, damit wir uns doppelt freuen können. Danke von Herzen.',
  kurz: 'Bitte kurz Bescheid geben, welchen Wunsch du übernimmst.'
};
const WISH_DEFAULT = { to: '', count: 3, tone: 'humor', child: 'nick', message: '', sel: [] };
const wishCfg = () => Object.assign({}, WISH_DEFAULT, state.settings.wishPrint || {});
const saveWishCfg = c => { state.settings.wishPrint = c; save(); };
const childLabel = c => c.child === 'secret' && state.settings.secretName ? state.settings.secretName : c.child === 'nick' ? (state.settings.nick || '') : '';

// Nachricht zum Versenden (Text für Teilen, E-Mail, WhatsApp): gleicher Inhalt wie der Zettel, mit Humor und klarer Bitte
function wishMessage(cfg) {
  const to = (cfg.to || '').trim(), chosen = cfg.sel.map(id => state.wishes.find(w => w.id === id)).filter(Boolean).slice(0, cfg.count);
  const lines = (WISH_TONES[cfg.tone] || WISH_TONES.humor).lines, intro = lines[(cfg.to.length + chosen.length) % lines.length], from = namesLine(), kid = childLabel(cfg);
  const list = chosen.map((w, i) => `${i + 1}. ${w.text}${isUrl(w.link) ? `\n   ${w.link}` : ''}`).join('\n');
  const subject = `${to ? to + ', ' : ''}ein Wunschzettel von ${from || 'uns'}${kid ? ' für ' + kid : ''}`;
  const text = [`${to ? `Hallo ${to},` : 'Hallo,'}`, '', intro, '', 'Unsere Wünsche an dich:', list, '', cfg.message.trim(), cfg.message.trim() ? '' : null, WISH_FOOT[cfg.tone] || WISH_FOOT.humor, '', `Alles Liebe${from ? ', ' + from : ''}`, brandFull()].filter(x => x !== null).join('\n');
  return { subject: retitleStr(subject), text: retitleStr(text), count: chosen.length };
}

function wishSheetHTML(cfg) {
  const to = (cfg.to || '').trim(), chosen = cfg.sel.map(id => state.wishes.find(w => w.id === id)).filter(Boolean).slice(0, cfg.count);
  const lines = (WISH_TONES[cfg.tone] || WISH_TONES.humor).lines, intro = lines[(cfg.to.length + chosen.length) % lines.length];
  const kid = childLabel(cfg), from = namesLine();
  return `<article class="print-doc wish-doc">
    <header class="pd-head wd-head"><div class="pd-brand">${esc(brandName())} <i>${esc(brandSub())}</i></div><div class="wd-hearts">${printHearts()}</div><h2>Wunschzettel</h2><p class="pd-for">${to ? `für ${esc(to)}` : 'für dich'}</p></header>
    <p class="pd-from">${from ? `Von ${esc(from)}` : 'Von uns'}${kid ? `, für unser Baby ${esc(kid)}` : ', für unser Baby'}</p>
    <p class="pd-intro">${to ? `Hallo ${esc(to)}, ` : ''}${esc(intro)}</p>
    ${chosen.length ? `<ol class="pd-wishes">${chosen.map(w => `<li><span class="pd-gift" aria-hidden="true">${bi('gift-fill')}</span><div class="pd-wish"><b>${esc(w.text)}</b>${isUrl(w.link) ? `<span class="pd-link">${esc(w.link.replace(/^https?:\/\/(www\.)?/, '').slice(0, 70))}</span>` : ''}<span class="pd-done">Erledigt von: <i></i></span></div></li>`).join('')}</ol>`
      : '<p class="pd-empty">Wähle oben bis zu drei Wünsche aus, dann erscheinen sie hier.</p>'}
    ${cfg.message.trim() ? `<p class="pd-note">${esc(cfg.message.trim()).replace(/\n/g, '<br>')}</p>` : ''}
    <footer class="pd-foot"><p>${esc(WISH_FOOT[cfg.tone] || WISH_FOOT.humor)}</p><div class="pd-sign">${esc(brandName())} <i>${esc(brandSub())}</i> · ${fmtDate(iso(today()))}</div></footer></article>`;
}

EXTRA_ROUTES.wishprint = () => {
  const cfg = wishCfg(), open = state.wishes.filter(w => !w.got);
  cfg.sel = cfg.sel.filter(id => open.some(w => w.id === id));
  const contacts = (state.contacts || []).map(c => c.name);
  view.innerHTML = `<div class="no-print">${intro('Wunschzettel drucken', 'Such dir bis zu drei Wünsche aus, gib den Zettel einer Person und lass sie die Wünsche erfüllen. Mit Humor und in professionellem Layout.')}
    <div class="card">
      <label for="wp-to">Für wen ist der Zettel?</label><input id="wp-to" list="wp-people" value="${esc(cfg.to)}" maxlength="40" placeholder="z. B. Oma Ulla" autocomplete="off">
      <datalist id="wp-people">${[...contacts, 'Oma', 'Opa', 'Tante', 'Onkel', 'Patentante', 'Patenonkel', 'Freundin', 'Freund'].map(n => `<option value="${esc(n)}">`).join('')}</datalist>
      <label for="wp-count">Wie viele Wünsche soll sie oder er erfüllen?</label>
      <select id="wp-count">${[1, 2, 3, 4, 5].map(n => `<option value="${n}" ${cfg.count === n ? 'selected' : ''}>${n}${n === 3 ? ' (empfohlen)' : ''}</option>`).join('')}</select>
      <label class="keep form-label">Tonfall</label>
      <div class="seg" style="margin:0">${Object.entries(WISH_TONES).map(([k, t]) => `<button data-tone="${k}" class="${cfg.tone === k ? 'on' : ''}">${t.label}</button>`).join('')}</div>
      <label class="keep form-label">Name des Kindes auf dem Zettel</label>
      <div class="seg" style="margin:0"><button data-child="none" class="${cfg.child === 'none' ? 'on' : ''}">Kein Name</button><button data-child="nick" class="${cfg.child === 'nick' ? 'on' : ''}">Kosename${state.settings.nick ? ' (' + esc(state.settings.nick) + ')' : ''}</button>${state.settings.secretName ? `<button data-child="secret" class="${cfg.child === 'secret' ? 'on' : ''}">Echter Name</button>` : ''}</div>
      ${cfg.child === 'secret' ? '<p class="small soft mt-2 mb-0">Achtung: Der geheime Name wird dann gedruckt.</p>' : ''}
      <label for="wp-msg">Persönliche Zeile (optional)</label><textarea id="wp-msg" maxlength="240" style="min-height:70px" placeholder="z. B. Wir freuen uns auf Sonntag bei euch!">${esc(cfg.message)}</textarea>
    </div>
    <h2>Wünsche auswählen <span class="chip" id="wp-counter"></span></h2>
    ${open.length ? `<div class="card" id="wp-list">${open.map(w => `<div class="todo"><input type="checkbox" id="wsel_${w.id}" data-ws="${w.id}"><label for="wsel_${w.id}" class="keep" style="margin:0;font-weight:400;flex:1"><span>${esc(w.text)}</span>${w.assigned ? ` <span class="chip">bei ${esc(w.assigned)}</span>` : ''}</label></div>`).join('')}</div>`
      : `<div class="card center"><p class="mb-0">Noch keine offenen Wünsche. <a href="#/wishes">Zur Wunschliste</a></p></div>`}
    <h2>Senden</h2>
    <div class="card wish-send"><p class="small soft mb-2">Schickt den Wunschzettel direkt als Nachricht. Der Text enthält die ausgewählten Wünsche mit Links, eine liebe Bitte und einen Gruß. Gleichzeitig wird alles der Person zugewiesen, damit nichts doppelt gekauft wird.</p>
      <div class="hstack gap-2 flex-wrap"><button type="button" class="btn btn-solid theme-primary" id="wsShare">${bi('send-fill')} Teilen oder senden</button><a class="btn btn-subtle theme-secondary" id="wsMail" href="#" rel="noopener">${bi('envelope-heart')} E-Mail</a><a class="btn btn-subtle theme-secondary" id="wsWa" href="#" target="_blank" rel="noopener noreferrer">${bi('chat-heart')} WhatsApp</a><button type="button" class="btn btn-subtle theme-secondary" id="wsCopy">${bi('clipboard-heart')} Text kopieren</button></div></div>
    <div class="hstack gap-2 flex-wrap mb-3"><button class="btn btn-solid theme-primary" id="doPrint">${bi('printer')} Drucken oder als PDF speichern</button>
      <button class="btn btn-subtle theme-secondary" id="doAssign">${bi('person-check')} Wünsche der Person zuweisen</button></div>
    <h2>Vorschau</h2></div>
    <div class="print-sheet" id="printArea">${wishSheetHTML(cfg)}</div>`;
  const get = () => { const c = wishCfg(); return Object.assign(c, cfg); };
  const refresh = () => {
    cfg.sel = cfg.sel.slice(0, cfg.count);
    view.querySelectorAll('[data-ws]').forEach(i => { i.checked = cfg.sel.includes(i.dataset.ws); i.disabled = !i.checked && cfg.sel.length >= cfg.count; });
    const cnt = $('#wp-counter'); if (cnt) cnt.textContent = `${cfg.sel.length} von ${cfg.count}`;
    $('#printArea').innerHTML = wishSheetHTML(cfg); saveWishCfg({ ...cfg }); if (typeof wsUpdate === 'function') wsUpdate();
  };
  $('#wp-to').addEventListener('input', e => { cfg.to = e.target.value; refresh(); });
  $('#wp-msg').addEventListener('input', e => { cfg.message = e.target.value; refresh(); });
  $('#wp-count').onchange = e => { cfg.count = +e.target.value; refresh(); };
  view.querySelectorAll('[data-tone]').forEach(b => b.onclick = () => { cfg.tone = b.dataset.tone; saveWishCfg({ ...cfg }); render(); });
  view.querySelectorAll('[data-child]').forEach(b => b.onclick = () => { cfg.child = b.dataset.child; saveWishCfg({ ...cfg }); render(); });
  view.querySelectorAll('[data-ws]').forEach(i => i.onchange = () => { cfg.sel = i.checked ? [...cfg.sel, i.dataset.ws] : cfg.sel.filter(x => x !== i.dataset.ws); refresh(); });
  const assign = () => {
    const to = cfg.to.trim(); if (!to) { toast('Bitte erst eintragen, für wen der Zettel ist'); return false; }
    if (!cfg.sel.length) { toast('Bitte mindestens einen Wunsch auswählen'); return false; }
    cfg.sel.forEach(id => { const w = state.wishes.find(x => x.id === id); if (w) w.assigned = to; }); save(); return true;
  };
  $('#doAssign').onclick = () => { if (assign()) { toast(`${cfg.sel.length} Wünsche sind jetzt bei ${cfg.to.trim()}. Nichts wird doppelt gekauft.`); render(); } };
  $('#doPrint').onclick = () => { if (!cfg.sel.length) return toast('Bitte mindestens einen Wunsch auswählen'); if (cfg.to.trim()) assign(); window.print(); };
  const wsReady = () => { if (!cfg.sel.length) { toast('Bitte erst mindestens einen Wunsch auswählen'); return false; } if (cfg.to.trim()) assign(); return true; };
  const wsUpdate = () => { const m = wishMessage(cfg), q = encodeURIComponent; const mail = $('#wsMail'), wa = $('#wsWa'); if (mail) mail.href = `mailto:?subject=${q(m.subject)}&body=${q(m.text)}`; if (wa) wa.href = `https://wa.me/?text=${q(m.text)}`; [$('#wsShare'), mail, wa, $('#wsCopy')].forEach(e => e && e.setAttribute('aria-disabled', !cfg.sel.length)); };
  $('#wsShare').onclick = async () => { if (!wsReady()) return; const m = wishMessage(cfg); await shareThing({ title: m.subject, text: m.text }); render(); };
  $('#wsCopy').onclick = async () => { if (!wsReady()) return; try { await navigator.clipboard.writeText(wishMessage(cfg).text); toast('Wunschzettel-Text kopiert. Jetzt nur noch einfügen und abschicken.'); } catch { toast('Kopieren klappt hier leider nicht'); } };
  [$('#wsMail'), $('#wsWa')].forEach(a => a.addEventListener('click', e => { if (!wsReady()) e.preventDefault(); }));
  refresh();
};

/* ==================== Tagebuch drucken und exportieren ==================== */
const DIARY_DEFAULT = { title: 'Unser Schwangerschaftstagebuch', from: '', to: '', photos: true, mood: true, names: true, kid: true, cover: true, toc: true };
const diaryCfg = who => Object.assign({}, DIARY_DEFAULT, { who }, (state.settings.diaryPrint || {})[who] || {});
const diarySelection = cfg => [...state.diary].filter(d => (!cfg.from || d.date >= cfg.from) && (!cfg.to || d.date <= cfg.to)).sort((a, b) => a.date.localeCompare(b.date));
const diaryNames = cfg => cfg.names ? namesLine() : '';
const diaryKid = cfg => cfg.kid && state.settings.nick ? state.settings.nick : '';
const moodLabel = m => MOOD_LABEL[m] || '';
const monthKey = d => d.date.slice(0, 7);
const monthLabel = k => new Date(k + '-01T00:00').toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
const diaryMonths = list => [...new Set(list.map(monthKey))];
const entryMeta = (d, cfg) => [weekFor(d.date) !== null ? weekFor(d.date) + '. SSW' : '', cfg.mood && moodLabel(d.mood) ? 'Stimmung: ' + moodLabel(d.mood) : '', d.by ? 'von ' + authorName(d.by) : ''].filter(Boolean);
// Herzen in den Lieblingsfarben (fest hell, damit der Druck immer gleich aussieht)
const printHearts = () => `<span class="pd-hearts" aria-hidden="true"><i class="bi bi-heart-fill" style="color:${heartHex('mama')}"></i><i class="bi bi-heart-fill" style="color:${heartHex('partner')}"></i></span>`;

function diaryDocHTML(cfg, { embed = null } = {}) {
  const list = diarySelection(cfg), names = diaryNames(cfg), kid = diaryKid(cfg), months = diaryMonths(list);
  const period = list.length ? `${fmtDate(list[0].date)} bis ${fmtDate(list[list.length - 1].date)}` : '';
  const img = d => d.photoId && cfg.photos ? (embed && embed[d.photoId] ? `<img src="${embed[d.photoId]}" alt="Foto vom ${fmtDate(d.date)}">` : `<img data-img="${d.photoId}" alt="Foto vom ${fmtDate(d.date)}">`) : '';
  const cover = cfg.cover
    ? `<section class="pd-cover"><div class="pd-brand">${esc(brandName())} <i>${esc(brandSub())}</i></div><div class="pd-cover-mid">${printHearts()}<h2>${esc(cfg.title || 'Tagebuch')}</h2>
        <p class="pd-cover-names">${esc(names)}${names && kid ? ' · ' : ''}${kid ? 'für ' + esc(kid) : ''}</p><p class="pd-cover-period">${esc(period)}</p></div>
        <p class="pd-cover-foot">${list.length} ${list.length === 1 ? 'Eintrag' : 'Einträge'} · erstellt am ${esc(fmtLong(iso(today())))}</p></section>`
    : `<header class="pd-head wd-head"><div class="pd-brand">${esc(brandName())} <i>${esc(brandSub())}</i></div><h2>${esc(cfg.title || 'Tagebuch')}</h2><p class="pd-for">${esc(names)}${names && kid ? ' · ' : ''}${kid ? 'für ' + esc(kid) : ''}${(names || kid) && period ? ' · ' : ''}${esc(period)}</p></header>`;
  const toc = cfg.toc && months.length > 1 ? `<nav class="pd-toc"><h3>Inhalt</h3><ol>${months.map(m => `<li><a href="#m-${m}">${esc(monthLabel(m))}</a><span>${list.filter(d => monthKey(d) === m).length} Einträge</span></li>`).join('')}</ol></nav>` : '';
  let last = '';
  const body = list.length ? list.map(d => { const head = monthKey(d) !== last ? `<h3 class="pd-month" id="m-${monthKey(d)}">${esc(monthLabel(monthKey(d)))}</h3>` : ''; last = monthKey(d); const meta = entryMeta(d, cfg);
    return `${head}<section class="pd-entry"><div class="pd-date"><b>${esc(fmtLong(d.date))}</b><span>${esc(meta.join(' · '))}</span></div>${d.text ? `<p>${esc(d.text).replace(/\n/g, '<br>')}</p>` : ''}${img(d)}</section>`; }).join('')
    : '<p class="pd-empty">In diesem Zeitraum gibt es noch keine Einträge.</p>';
  return `<article class="print-doc diary-doc">${cover}${toc}${body}<footer class="pd-foot"><div class="pd-sign">${list.length} ${list.length === 1 ? 'Eintrag' : 'Einträge'} · ${esc(brandName())} <i>${esc(brandSub())}</i> · ${fmtDate(iso(today()))}</div></footer></article>`;
}
function diaryText(cfg) {
  const list = diarySelection(cfg), kid = diaryKid(cfg), line = '='.repeat(54), out = [cfg.title, [diaryNames(cfg), kid && 'für ' + kid].filter(Boolean).join(' · '), `${list.length} Einträge`, brandFull(), line, ''].filter((x, i) => i === 0 || i >= 3 || !!x);
  list.forEach(d => out.push([fmtLong(d.date), ...entryMeta(d, cfg)].join(' · '), '-'.repeat(54), d.text || '(kein Text)', d.photoId && cfg.photos ? '[Foto]' : '', ''));
  return out.filter((l, i, a) => !(l === '' && a[i - 1] === '')).join('\n');
}
function diaryMarkdown(cfg) {
  const list = diarySelection(cfg), kid = diaryKid(cfg), sub = [diaryNames(cfg), kid && 'für ' + kid].filter(Boolean).join(' · '), out = [`# ${cfg.title}`, '', sub && `*${sub}*  `, `*${brandFull()}* · ${list.length} Einträge`, ''];
  let last = ''; list.forEach(d => { if (monthKey(d) !== last) { last = monthKey(d); out.push(`## ${monthLabel(last)}`, ''); } out.push(`### ${fmtLong(d.date)}`, '', `*${entryMeta(d, cfg).join(' · ')}*`, '', d.text || '*(kein Text)*', '', d.photoId && cfg.photos ? '*[Foto]*' : '', ''); });
  return out.filter((l, i, a) => l !== false && l !== undefined && !(l === '' && a[i - 1] === '')).join('\n') + '\n';
}
function diaryCSV(cfg) {
  const rows = [['Datum', 'SSW', 'Stimmung', 'Von', 'Text', 'Foto']]; diarySelection(cfg).forEach(d => rows.push([d.date, weekFor(d.date) ?? '', moodLabel(d.mood), d.by ? authorName(d.by) : '', d.text || '', d.photoId ? 'ja' : '']));
  return '﻿' + rows.map(r => r.map(csvCell).join(';')).join('\r\n') + '\r\n';
}
// Eigenständiges Dokument für HTML-Buch und Word: Deckblatt, Inhalt, Seitenzahlen beim Drucken
const DIARY_CSS = `@page{size:A4;margin:18mm 16mm 20mm;@bottom-center{content:"__BRAND__ · Seite " counter(page);font:9pt Segoe UI,Arial,sans-serif;color:#6e5a59}}
body{font:16px/1.65 Georgia,'Times New Roman',serif;color:#3a2c2d;max-width:780px;margin:0 auto;padding:32px 22px;background:#fff}
.pd-brand{letter-spacing:.22em;font-weight:700;color:#8b4752;font-family:Segoe UI,Arial,sans-serif;font-size:.85rem}.pd-brand i{letter-spacing:.02em;font-weight:400}
.pd-cover{min-height:92vh;display:flex;flex-direction:column;justify-content:space-between;text-align:center;border:2px solid #c97b84;border-radius:14px;padding:36px 24px;margin-bottom:34px;break-after:page}
.pd-cover-mid h2{font-size:2.6rem;line-height:1.15;color:#8b4752;margin:.3em 0}.pd-hearts{font-size:2.6rem;display:inline-flex;gap:2px}.pd-cover-names{font-size:1.2rem;margin:.2em 0}.pd-cover-period{color:#6e5a59}.pd-cover-foot{color:#6e5a59;font-size:.85rem;margin:0}
.pd-head{text-align:center;border-bottom:2px solid #c97b84;padding-bottom:16px;margin-bottom:22px}.pd-head h2{font-size:2rem;color:#8b4752;margin:.2em 0}.pd-for{color:#6e5a59;margin:0}
.pd-toc{margin:0 0 30px;break-after:page}.pd-toc h3{color:#8b4752;border-bottom:1px solid #e8d6d2;padding-bottom:6px}.pd-toc ol{list-style:none;padding:0;margin:0}.pd-toc li{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dotted #d8c4c0}.pd-toc a{color:#3a2c2d;text-decoration:none}.pd-toc span{color:#6e5a59}
.pd-month{color:#8b4752;font-size:1.4rem;margin:30px 0 12px;break-after:avoid}.pd-entry{break-inside:avoid;margin:0 0 22px}.pd-date{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;border-bottom:1px solid #e8d6d2;padding-bottom:4px;margin-bottom:8px;font-family:Segoe UI,Arial,sans-serif;font-size:.9rem}.pd-date span{color:#6e5a59}
.pd-entry p{margin:0 0 8px}img{max-width:100%;max-height:420px;border-radius:10px;margin-top:8px;display:block}.pd-foot{text-align:center;color:#6e5a59;font-size:.8rem;border-top:1px solid #e8d6d2;padding-top:14px;margin-top:34px}.pd-sign{font-family:Segoe UI,Arial,sans-serif;letter-spacing:.06em}`;
const diaryFullHTML = (cfg, embed, word = false) => `<!doctype html><html lang="de"${word ? ' xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"' : ''}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(cfg.title)}</title><style>${DIARY_CSS.replace('__BRAND__', cssStr(brandFull()))}</style></head><body>${diaryDocHTML(cfg, { embed })}</body></html>`;

function diaryPrintPage(who) {
  const cfg = diaryCfg(who);
  const check = (id, label, on) => `<div class="todo"><input type="checkbox" id="${id}" ${on ? 'checked' : ''}><label for="${id}" class="keep" style="margin:0;font-weight:400;flex:1">${label}</label></div>`;
  view.innerHTML = `<div class="no-print">${intro('Tagebuch drucken und exportieren', 'Mach aus eurem Tagebuch ein Erinnerungsbuch: mit Deckblatt, Inhaltsverzeichnis und Seitenzahlen. Drucken, als PDF speichern oder in andere Formate exportieren.')}
    <div class="card">
      <label for="dp-title">Titel</label><input id="dp-title" value="${esc(cfg.title)}" maxlength="60">
      <div class="hstack gap-2"><div class="flex-grow-1"><label for="dp-from">Von</label><input id="dp-from" type="date" value="${cfg.from}"></div><div class="flex-grow-1"><label for="dp-to">Bis</label><input id="dp-to" type="date" value="${cfg.to}"></div></div>
      ${check('dp-cover', 'Deckblatt', cfg.cover)}${check('dp-toc', 'Inhaltsverzeichnis (ab zwei Monaten)', cfg.toc)}${check('dp-photos', 'Fotos mit drucken', cfg.photos)}${check('dp-mood', 'Stimmung anzeigen', cfg.mood)}${check('dp-names', 'Namen von Mama und Papa nennen', cfg.names)}${check('dp-kid', 'Namen des Kindes nennen (Kosename)', cfg.kid)}
      <p class="small soft mt-2 mb-0" id="dp-count"></p></div>
    <h2>Drucken</h2>
    <div class="hstack gap-2 flex-wrap mb-2"><button class="btn btn-solid theme-primary" id="dp-print">${bi('printer')} Drucken oder als PDF speichern</button></div>
    <h2>Exportieren</h2>
    <div class="hstack gap-2 flex-wrap mb-2"><button class="btn btn-subtle theme-secondary" id="dp-html">${bi('filetype-html')} Buch (HTML mit Fotos)</button><button class="btn btn-subtle theme-secondary" id="dp-doc">${bi('file-earmark-word')} Word (.doc)</button>
      <button class="btn btn-subtle theme-secondary" id="dp-md">${bi('markdown')} Markdown</button><button class="btn btn-subtle theme-secondary" id="dp-csv">${bi('filetype-csv')} CSV (Excel)</button><button class="btn btn-subtle theme-secondary" id="dp-txt">${bi('file-earmark-text')} Text</button></div>
    <p class="small soft">Die Dateien enthalten persönliche Einträge. Bewahre sie sicher auf und gib sie nur an Menschen, denen du vertraust.</p><h2>Vorschau</h2></div>
    <div class="print-sheet" id="printArea">${diaryDocHTML(cfg)}</div>`;
  const refresh = () => { $('#printArea').innerHTML = diaryDocHTML(cfg); hydrateImages($('#printArea')); $('#dp-count').textContent = `${diarySelection(cfg).length} von ${state.diary.length} Einträgen ausgewählt`; state.settings.diaryPrint = { ...(state.settings.diaryPrint || {}), [who]: { ...cfg } }; save(); };
  const bindT = (id, key) => $(id).addEventListener('input', e => { cfg[key] = e.target.value; refresh(); });
  const bindC = (id, key) => $(id).onchange = e => { cfg[key] = e.target.checked; refresh(); };
  bindT('#dp-title', 'title'); bindT('#dp-from', 'from'); bindT('#dp-to', 'to');
  for (const [id, k] of [['#dp-cover', 'cover'], ['#dp-toc', 'toc'], ['#dp-photos', 'photos'], ['#dp-mood', 'mood'], ['#dp-names', 'names'], ['#dp-kid', 'kid']]) bindC(id, k);
  const guard = () => { if (!diarySelection(cfg).length) { toast('In diesem Zeitraum gibt es keine Einträge'); return false; } return true; };
  const name = ext => `${fileSafe(cfg.title)}-${iso(today())}.${ext}`;
  const embedAll = async () => { const m = {}; if (cfg.photos) for (const d of diarySelection(cfg)) if (d.photoId) { const b = await getImg(d.photoId); if (b) m[d.photoId] = await blobToData(b); } return m; };
  $('#dp-print').onclick = () => { if (guard()) window.print(); };
  $('#dp-txt').onclick = () => { if (guard()) { downloadFile(name('txt'), diaryText(cfg), 'text/plain;charset=utf-8'); cheer('save'); } };
  $('#dp-md').onclick = () => { if (guard()) { downloadFile(name('md'), diaryMarkdown(cfg), 'text/markdown;charset=utf-8'); cheer('save'); } };
  $('#dp-csv').onclick = () => { if (guard()) { downloadFile(name('csv'), diaryCSV(cfg), 'text/csv;charset=utf-8'); cheer('save'); } };
  $('#dp-html').onclick = async () => { if (!guard()) return; downloadFile(name('html'), diaryFullHTML(cfg, await embedAll()), 'text/html;charset=utf-8'); cheer('save'); };
  $('#dp-doc').onclick = async () => { if (!guard()) return; downloadFile(name('doc'), diaryFullHTML(cfg, await embedAll(), true), 'application/msword;charset=utf-8'); cheer('save'); };
  refresh();
}
EXTRA_ROUTES.diaryprint = () => diaryPrintPage('mama');


/* ==================== Briefe ans Baby: als Erinnerungsbuch exportieren ==================== */
// Deckblatt, jeder Brief als eigene Seite im Buchstil, optional mit Sprachnachrichten (nur im HTML-Buch abspielbar)
const LETTERS_DEFAULT = { title: '', from: '', to: '', cover: true, toc: true, names: true, kid: true, week: true, audio: true, newest: false };
const lettersCfg = () => Object.assign({}, LETTERS_DEFAULT, state.settings.lettersPrint || {});
const lettersTitle = cfg => cfg.title.trim() || ('Briefe an ' + (state.settings.nick || 'unser Baby'));
const lettersSelection = cfg => { const l = [...state.letters].filter(x => (!cfg.from || x.date >= cfg.from) && (!cfg.to || x.date <= cfg.to)).sort((a, b) => a.date.localeCompare(b.date)); return cfg.newest ? l.reverse() : l; };
const letterMeta = (x, cfg) => [cfg.week && weekFor(x.date) !== null ? weekFor(x.date) + '. SSW' : '', x.audioId && cfg.audio ? 'mit Sprachnachricht' : ''].filter(Boolean);
function lettersDocHTML(cfg, { embed = null } = {}) {
  const list = lettersSelection(cfg), names = cfg.names ? namesLine() : '', kid = cfg.kid && state.settings.nick ? state.settings.nick : '', title = lettersTitle(cfg);
  const period = list.length ? `${fmtDate([...list].sort((a, b) => a.date.localeCompare(b.date))[0].date)} bis ${fmtDate([...list].sort((a, b) => b.date.localeCompare(a.date))[0].date)}` : '';
  const sub = [names && 'von ' + names, kid && 'für ' + kid].filter(Boolean).join(' ');
  const cover = cfg.cover
    ? `<section class="pd-cover"><div class="pd-brand">${esc(brandName())} <i>${esc(brandSub())}</i></div><div class="pd-cover-mid">${printHearts()}<h2>${esc(title)}</h2>
        <p class="pd-cover-names">${esc(sub)}</p><p class="pd-cover-period">${esc(period)}</p><p class="pd-quote">„Eines Tages wirst du das lesen. Wir haben dich schon jetzt sehr lieb.“</p></div>
        <p class="pd-cover-foot">${list.length} ${list.length === 1 ? 'Brief' : 'Briefe'} · erstellt am ${esc(fmtLong(iso(today())))}</p></section>`
    : `<header class="pd-head wd-head"><div class="pd-brand">${esc(brandName())} <i>${esc(brandSub())}</i></div><h2>${esc(title)}</h2><p class="pd-for">${esc(sub)}${sub && period ? ' · ' : ''}${esc(period)}</p></header>`;
  const toc = cfg.toc && list.length > 3 ? `<nav class="pd-toc"><h3>Inhalt</h3><ol>${list.map((x, i) => `<li><a href="#l-${i + 1}">Brief ${i + 1}</a><span>${esc(fmtDate(x.date))}</span></li>`).join('')}</ol></nav>` : '';
  const body = list.length ? list.map((x, i) => { const meta = letterMeta(x, cfg);
    const aud = x.audioId && cfg.audio ? (embed && embed[x.audioId] ? `<audio controls preload="none" src="${embed[x.audioId]}"></audio>` : '<p class="pd-audio">Dazu gibt es eine Sprachnachricht, die in der App abspielbar ist.</p>') : '';
    return `<section class="pd-entry pd-letter" id="l-${i + 1}"><div class="pd-date"><b>Brief ${i + 1} · ${esc(fmtLong(x.date))}</b><span>${esc(meta.join(' · '))}</span></div>${x.text ? `<p>${esc(x.text).replace(/\n/g, '<br>')}</p>` : '<p class="pd-audio">(Nur Sprachnachricht)</p>'}${aud}</section>`; }).join('')
    : '<p class="pd-empty">In diesem Zeitraum gibt es noch keine Briefe.</p>';
  return `<article class="print-doc diary-doc letters-doc">${cover}${toc}${body}<footer class="pd-foot"><div class="pd-sign">${list.length} ${list.length === 1 ? 'Brief' : 'Briefe'} · ${esc(brandName())} <i>${esc(brandSub())}</i> · ${fmtDate(iso(today()))}</div></footer></article>`;
}
function lettersText(cfg) {
  const list = lettersSelection(cfg), line = '='.repeat(54), out = [lettersTitle(cfg), [cfg.names && namesLine() && 'von ' + namesLine(), cfg.kid && state.settings.nick && 'für ' + state.settings.nick].filter(Boolean).join(' '), `${list.length} Briefe`, brandFull(), line, ''];
  list.forEach((x, i) => out.push([`Brief ${i + 1}`, fmtLong(x.date), ...letterMeta(x, cfg)].join(' · '), '-'.repeat(54), x.text || '(nur Sprachnachricht)', ''));
  return out.filter((l, i, a) => !(l === '' && a[i - 1] === '') && (i === 0 || l !== '' || a[i - 1] !== undefined)).join('\n');
}
function lettersMarkdown(cfg) {
  const list = lettersSelection(cfg), sub = [cfg.names && namesLine() && 'von ' + namesLine(), cfg.kid && state.settings.nick && 'für ' + state.settings.nick].filter(Boolean).join(' '), out = [`# ${lettersTitle(cfg)}`, '', sub && `*${sub}*  `, `*${brandFull()}* · ${list.length} Briefe`, ''];
  list.forEach((x, i) => out.push(`## Brief ${i + 1} · ${fmtLong(x.date)}`, '', `*${letterMeta(x, cfg).join(' · ')}*`, '', x.text || '*(nur Sprachnachricht)*', ''));
  return out.filter((l, i, a) => l !== false && l !== undefined && !(l === '' && a[i - 1] === '')).join('\n') + '\n';
}
const LETTERS_CSS = DIARY_CSS + `.pd-letter p{font-style:italic;font-size:1.08rem}.pd-letter .pd-date{font-style:normal}.pd-audio{font-family:Segoe UI,Arial,sans-serif;font-size:.85rem;color:#6e5a59;font-style:normal!important}audio{width:100%;margin-top:8px}.pd-quote{font-style:italic;color:#8b4752;margin:22px auto 0;max-width:30em}`;
const lettersFullHTML = (cfg, embed, word = false) => `<!doctype html><html lang="de"${word ? ' xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"' : ''}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(lettersTitle(cfg))}</title><style>${LETTERS_CSS.replace('__BRAND__', cssStr(brandFull()))}</style></head><body>${lettersDocHTML(cfg, { embed })}</body></html>`;
EXTRA_ROUTES.lettersprint = () => {
  const cfg = lettersCfg(), check = (id, label, on) => `<div class="todo"><input type="checkbox" id="${id}" ${on ? 'checked' : ''}><label for="${id}" class="keep" style="margin:0;font-weight:400;flex:1">${label}</label></div>`;
  view.innerHTML = `<div class="no-print">${intro('Briefe als Buch', 'Macht aus euren Briefen ans Baby ein Erinnerungsbuch zum Verschenken, Ausdrucken oder Aufbewahren: mit Deckblatt, Inhalt und Seitenzahlen. Später sieht das richtig toll aus.')}
    <div class="card">
      <label for="lp-title">Titel</label><input id="lp-title" value="${esc(cfg.title)}" maxlength="60" placeholder="${esc(lettersTitle({ title: '' }))}">
      <div class="hstack gap-2"><div class="flex-grow-1"><label for="lp-from">Von</label><input id="lp-from" type="date" value="${cfg.from}"></div><div class="flex-grow-1"><label for="lp-to">Bis</label><input id="lp-to" type="date" value="${cfg.to}"></div></div>
      ${check('lp-cover', 'Deckblatt', cfg.cover)}${check('lp-toc', 'Inhaltsverzeichnis (ab vier Briefen)', cfg.toc)}${check('lp-week', 'Schwangerschaftswoche anzeigen', cfg.week)}${check('lp-names', 'Namen von Mama und Papa nennen', cfg.names)}${check('lp-kid', 'Namen des Kindes nennen (Kosename)', cfg.kid)}${check('lp-audio', 'Sprachnachrichten berücksichtigen', cfg.audio)}${check('lp-newest', 'Neueste Briefe zuerst', cfg.newest)}
      <p class="small soft mt-2 mb-0" id="lp-count"></p></div>
    <h2>Drucken</h2>
    <div class="hstack gap-2 flex-wrap mb-2"><button class="btn btn-solid theme-primary" id="lp-print">${bi('printer')} Drucken oder als PDF speichern</button></div>
    <h2>Exportieren</h2>
    <div class="hstack gap-2 flex-wrap mb-2"><button class="btn btn-subtle theme-secondary" id="lp-html">${bi('filetype-html')} Buch (HTML, mit Sprachnachrichten)</button><button class="btn btn-subtle theme-secondary" id="lp-doc">${bi('file-earmark-word')} Word (.doc)</button>
      <button class="btn btn-subtle theme-secondary" id="lp-md">${bi('markdown')} Markdown</button><button class="btn btn-subtle theme-secondary" id="lp-txt">${bi('file-earmark-text')} Text</button></div>
    <p class="small soft">Sprachnachrichten lassen sich nur im HTML-Buch abspielen. Gedruckt und in Word steht ein Hinweis. Die Dateien enthalten persönliche Briefe: sicher aufbewahren und nur an vertraute Menschen weitergeben.</p><h2>Vorschau</h2></div>
    <div class="print-sheet" id="printArea">${lettersDocHTML(cfg)}</div>`;
  const refresh = () => { $('#printArea').innerHTML = lettersDocHTML(cfg); $('#lp-count').textContent = `${lettersSelection(cfg).length} von ${state.letters.length} Briefen ausgewählt`; state.settings.lettersPrint = { ...cfg }; save(); };
  const bindT = (id, key) => $(id).addEventListener('input', e => { cfg[key] = e.target.value; refresh(); }), bindC = (id, key) => $(id).onchange = e => { cfg[key] = e.target.checked; refresh(); };
  bindT('#lp-title', 'title'); bindT('#lp-from', 'from'); bindT('#lp-to', 'to');
  for (const [id, k] of [['#lp-cover', 'cover'], ['#lp-toc', 'toc'], ['#lp-week', 'week'], ['#lp-names', 'names'], ['#lp-kid', 'kid'], ['#lp-audio', 'audio'], ['#lp-newest', 'newest']]) bindC(id, k);
  const guard = () => { if (!lettersSelection(cfg).length) { toast('In diesem Zeitraum gibt es keine Briefe'); return false; } return true; }, name = ext => `${fileSafe(lettersTitle(cfg))}-${iso(today())}.${ext}`;
  const embedAudio = async () => { const m = {}; if (cfg.audio) for (const x of lettersSelection(cfg)) if (x.audioId) { const b = await getImg(x.audioId); if (b) m[x.audioId] = await blobToData(b); } return m; };
  $('#lp-print').onclick = () => { if (guard()) window.print(); };
  $('#lp-txt').onclick = () => { if (guard()) { downloadFile(name('txt'), lettersText(cfg), 'text/plain;charset=utf-8'); cheer('save'); } };
  $('#lp-md').onclick = () => { if (guard()) { downloadFile(name('md'), lettersMarkdown(cfg), 'text/markdown;charset=utf-8'); cheer('save'); } };
  $('#lp-html').onclick = async () => { if (!guard()) return; downloadFile(name('html'), lettersFullHTML(cfg, await embedAudio()), 'text/html;charset=utf-8'); cheer('save'); };
  $('#lp-doc').onclick = () => { if (!guard()) return; downloadFile(name('doc'), lettersFullHTML(cfg, null, true), 'application/msword;charset=utf-8'); cheer('save'); };
  refresh();
};
/* ==================== Wunschliste: Vorschau, Druck und Export (ähnlich wie beim Tagebuch) ==================== */
const WISHLIST_DEFAULT = { title: '', cover: true, links: true, got: true, group: false, names: true, kid: true };
const wishlistCfg = () => Object.assign({}, WISHLIST_DEFAULT, state.settings.wishlistPrint || {});
const wishlistTitle = cfg => cfg.title.trim() || 'Unsere Wunschliste';
const wishlistItems = cfg => state.wishes.filter(w => cfg.got || !w.got);
function wishlistGroups(cfg) {
  const list = wishlistItems(cfg); if (!cfg.group) return [{ title: '', items: list }];
  const open = list.filter(w => !w.got), people = [...new Set(open.map(w => w.assigned).filter(Boolean))], free = open.filter(w => !w.assigned), done = list.filter(w => w.got);
  return [...(free.length ? [{ title: 'Noch frei', items: free }] : []), ...people.map(p => ({ title: `Bei ${p}`, items: open.filter(w => w.assigned === p) })), ...(done.length ? [{ title: 'Schon erfüllt', items: done }] : [])];
}
const wishState = w => [w.assigned ? 'bei ' + w.assigned : '', w.got ? 'erfüllt' : ''].filter(Boolean).join(' · ');
function wishlistDocHTML(cfg, { plain = false } = {}) {
  const list = wishlistItems(cfg), open = list.filter(w => !w.got).length, done = list.length - open, names = cfg.names ? namesLine() : '', kid = cfg.kid && state.settings.nick ? state.settings.nick : '', title = wishlistTitle(cfg);
  const sub = [names && 'von ' + names, kid && 'für ' + kid].filter(Boolean).join(' '), count = `${list.length} ${list.length === 1 ? 'Wunsch' : 'Wünsche'}${done ? ` · ${done} erfüllt` : ''}`;
  const cover = cfg.cover
    ? `<section class="pd-cover"><div class="pd-brand">${esc(brandName())} <i>${esc(brandSub())}</i></div><div class="pd-cover-mid">${printHearts()}<h2>${esc(title)}</h2><p class="pd-cover-names">${esc(sub)}</p><p class="pd-cover-period">${esc(count)}</p><p class="pd-quote">„Sag es lieber vorher, sonst gibt es 14 Mützen in Größe 50.“</p></div>
        <p class="pd-cover-foot">erstellt am ${esc(fmtLong(iso(today())))}</p></section>`
    : `<header class="pd-head wd-head"><div class="pd-brand">${esc(brandName())} <i>${esc(brandSub())}</i></div><div class="wd-hearts">${printHearts()}</div><h2>${esc(title)}</h2><p class="pd-for">${esc(sub)}${sub ? ' · ' : ''}${esc(count)}</p></header>`;
  let n = 0;
  const row = w => { n++; return `<li class="${w.got ? 'got' : ''}"><span class="pd-gift" aria-hidden="true">${plain ? (w.got ? 'ok' : n) : bi(w.got ? 'check-lg' : 'gift-fill')}</span><div class="pd-wish"><b>${esc(w.text)}</b>${cfg.links && isUrl(w.link) ? `<span class="pd-link">${esc(w.link.replace(/^https?:\/\/(www\.)?/, '').slice(0, 70))}</span>` : ''}${wishState(w) ? `<span class="pd-state">${esc(wishState(w))}</span>` : ''}</div></li>`; };
  const body = list.length ? wishlistGroups(cfg).map(g => `${g.title ? `<h3 class="pd-month">${esc(g.title)}</h3>` : ''}<ol class="pd-wishes">${g.items.map(row).join('')}</ol>`).join('') : '<p class="pd-empty">Noch keine Wünsche. Tragt sie auf der Wunschliste ein, dann erscheinen sie hier.</p>';
  return `<article class="print-doc wish-doc wishlist-doc">${cover}${body}<footer class="pd-foot"><p>Bitte kurz Bescheid geben, welchen Wunsch du erfüllst, damit nichts doppelt im Kinderzimmer landet.</p><div class="pd-sign">${esc(brandName())} <i>${esc(brandSub())}</i> · ${fmtDate(iso(today()))}</div></footer></article>`;
}
function wishlistText(cfg) {
  const out = [wishlistTitle(cfg), [cfg.names && namesLine() && 'von ' + namesLine(), cfg.kid && state.settings.nick && 'für ' + state.settings.nick].filter(Boolean).join(' '), brandFull(), '='.repeat(54), ''];
  wishlistGroups(cfg).forEach(g => { if (g.title) out.push(g.title.toUpperCase(), ''); g.items.forEach(w => out.push(`[${w.got ? 'x' : ' '}] ${w.text}${cfg.links && isUrl(w.link) ? ' (' + w.link + ')' : ''}${w.assigned ? ' - bei ' + w.assigned : ''}`)); out.push(''); });
  return out.filter((l, i, a) => !(l === '' && a[i - 1] === '') && (l !== '' || i > 0)).join('\n');
}
function wishlistMarkdown(cfg) {
  const sub = [cfg.names && namesLine() && 'von ' + namesLine(), cfg.kid && state.settings.nick && 'für ' + state.settings.nick].filter(Boolean).join(' '), out = [`# ${wishlistTitle(cfg)}`, '', sub && `*${sub}*  `, `*${brandFull()}*`, ''];
  wishlistGroups(cfg).forEach(g => { if (g.title) out.push(`## ${g.title}`, ''); g.items.forEach(w => out.push(`- [${w.got ? 'x' : ' '}] ${w.text}${cfg.links && isUrl(w.link) ? ` ([Link](${w.link}))` : ''}${w.assigned ? ` *(bei ${w.assigned})*` : ''}`)); out.push(''); });
  return out.filter((l, i, a) => l !== false && l !== undefined && !(l === '' && a[i - 1] === '')).join('\n') + '\n';
}
const wishlistCSV = cfg => '\uFEFF' + [['Wunsch', 'Link', 'Erfüllt', 'Bei Person'], ...wishlistItems(cfg).map(w => [w.text, cfg.links ? (w.link || '') : '', yn(w.got), w.assigned || ''])].map(r => r.map(csvCell).join(';')).join('\r\n') + '\r\n';
const WISHLIST_CSS = DIARY_CSS + `.wishlist-doc{counter-reset:w}.pd-wishes{list-style:none;padding:0;margin:0 0 18px;display:grid;gap:12px}.pd-wishes li{counter-increment:w;display:flex;gap:14px;align-items:center;border:1.5px dashed #d9a1a9;border-radius:16px;padding:12px 14px;break-inside:avoid}.pd-wishes li.got{opacity:.65}.pd-gift{flex:none;width:40px;height:40px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:#8b4752;color:#fff;font:700 .9rem Segoe UI,Arial,sans-serif}.pd-wish b{display:block;font-size:1.1rem}.pd-link,.pd-state{display:block;font:.85rem Segoe UI,Arial,sans-serif;color:#6e5a59}.pd-quote{font-style:italic;color:#8b4752;margin:22px auto 0;max-width:30em}`;
const wishlistFullHTML = (cfg, word = false) => `<!doctype html><html lang="de"${word ? ' xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"' : ''}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(wishlistTitle(cfg))}</title><style>${WISHLIST_CSS.replace('__BRAND__', cssStr(brandFull()))}</style></head><body>${wishlistDocHTML(cfg, { plain: true })}</body></html>`;
EXTRA_ROUTES.wishlistprint = () => {
  const cfg = wishlistCfg(), check = (id, label, on) => `<div class="todo"><input type="checkbox" id="${id}" ${on ? 'checked' : ''}><label for="${id}" class="keep" style="margin:0;font-weight:400;flex:1">${label}</label></div>`;
  view.innerHTML = `<div class="no-print">${intro('Wunschliste als Vorschau und Export', 'Eure ganze Wunschliste als schönes Dokument: mit Deckblatt, Nummern und Hinweisen, wer was übernimmt. Drucken, als PDF speichern oder verschicken. Für den kleinen Zettel an eine Person gibt es den Wunschzettel.')}
    <div class="card">
      <label for="wl-title">Titel</label><input id="wl-title" value="${esc(cfg.title)}" maxlength="60" placeholder="Unsere Wunschliste">
      ${check('wl-cover', 'Deckblatt', cfg.cover)}${check('wl-links', 'Links anzeigen', cfg.links)}${check('wl-got', 'Erfüllte Wünsche anzeigen', cfg.got)}${check('wl-group', 'Nach Personen sortieren (wer übernimmt was)', cfg.group)}${check('wl-names', 'Namen von Mama und Papa nennen', cfg.names)}${check('wl-kid', 'Namen des Kindes nennen (Kosename)', cfg.kid)}
      <p class="small soft mt-2 mb-0" id="wl-count"></p></div>
    <h2>Drucken</h2>
    <div class="hstack gap-2 flex-wrap mb-2"><button class="btn btn-solid theme-primary" id="wl-print">${bi('printer')} Drucken oder als PDF speichern</button><a class="btn btn-subtle theme-secondary" href="#/wishprint">${bi('gift')} Wunschzettel für eine Person</a></div>
    <h2>Exportieren</h2>
    <div class="hstack gap-2 flex-wrap mb-2"><button class="btn btn-subtle theme-secondary" id="wl-html">${bi('filetype-html')} Seite (HTML)</button><button class="btn btn-subtle theme-secondary" id="wl-doc">${bi('file-earmark-word')} Word (.doc)</button>
      <button class="btn btn-subtle theme-secondary" id="wl-md">${bi('markdown')} Markdown</button><button class="btn btn-subtle theme-secondary" id="wl-csv">${bi('filetype-csv')} CSV (Excel)</button><button class="btn btn-subtle theme-secondary" id="wl-txt">${bi('file-earmark-text')} Text</button></div><h2>Vorschau</h2></div>
    <div class="print-sheet" id="printArea">${wishlistDocHTML(cfg)}</div>`;
  const refresh = () => { $('#printArea').innerHTML = wishlistDocHTML(cfg); const l = wishlistItems(cfg); $('#wl-count').textContent = `${l.length} von ${state.wishes.length} Wünschen angezeigt`; state.settings.wishlistPrint = { ...cfg }; save(); };
  $('#wl-title').addEventListener('input', e => { cfg.title = e.target.value; refresh(); });
  for (const [id, k] of [['#wl-cover', 'cover'], ['#wl-links', 'links'], ['#wl-got', 'got'], ['#wl-group', 'group'], ['#wl-names', 'names'], ['#wl-kid', 'kid']]) $(id).onchange = e => { cfg[k] = e.target.checked; refresh(); };
  const guard = () => { if (!wishlistItems(cfg).length) { toast('Es gibt noch keine Wünsche zum Exportieren'); return false; } return true; }, name = ext => `${fileSafe(wishlistTitle(cfg))}-${iso(today())}.${ext}`;
  $('#wl-print').onclick = () => { if (guard()) window.print(); };
  $('#wl-txt').onclick = () => { if (guard()) { downloadFile(name('txt'), wishlistText(cfg), 'text/plain;charset=utf-8'); cheer('save'); } };
  $('#wl-md').onclick = () => { if (guard()) { downloadFile(name('md'), wishlistMarkdown(cfg), 'text/markdown;charset=utf-8'); cheer('save'); } };
  $('#wl-csv').onclick = () => { if (guard()) { downloadFile(name('csv'), wishlistCSV(cfg), 'text/csv;charset=utf-8'); cheer('save'); } };
  $('#wl-html').onclick = () => { if (guard()) { downloadFile(name('html'), wishlistFullHTML(cfg), 'text/html;charset=utf-8'); cheer('save'); } };
  $('#wl-doc').onclick = () => { if (guard()) { downloadFile(name('doc'), wishlistFullHTML(cfg, true), 'application/msword;charset=utf-8'); cheer('save'); } };
  refresh();
};
/* ==================== Allgemeiner Datenexport (lesbar und portabel) ==================== */
// Anders als das Backup (zum Wiederherstellen) ist dieser Export zum Lesen, Archivieren und Mitnehmen gedacht: JSON, CSV oder HTML.
// PIN-Daten werden nie exportiert. Der geheime Name nur auf ausdrücklichen Wunsch.
const EXPORT_AREAS = [['profil', 'Profil und Namen'], ['diary', 'Tagebuch'], ['photos', 'Fotoalbum'], ['letters', 'Briefe ans Baby'], ['pass', 'Mutterpass'], ['fetal', 'Messwerte des Babys'],
  ['water', 'Wasser'], ['baby', 'Baby-Tracker'], ['wishes', 'Wunschliste'], ['lists', 'Checklisten und To-dos'], ['appts', 'Termine'], ['names', 'Namensfinder'], ['milestones', 'Meilensteine'], ['contacts', 'Kontakte'], ['vits', 'Vitamine']];
const EXPORT_DEFAULT = { areas: EXPORT_AREAS.map(a => a[0]), media: false, secret: false };
const byDate = list => [...list].sort((a, b) => String(a.date || a.ts).localeCompare(String(b.date || b.ts)));
const yn = v => v ? 'ja' : 'nein';
// Liefert { head, rows, imgs } je Bereich; imgs (optional) hält pro Zeile die Bild-ID
function exportTable(area, opt = {}) {
  const s = state.settings, ssw = d => { const w = weekFor(d); return w === null ? '' : w; };
  switch (area) {
    case 'profil': { const rows = [['Mama', s.mama || ''], ['Papa', s.partner || ''], ['Kosename des Kindes', s.nick || ''], ['Errechneter Termin', s.dueDate || '']]; if (opt.secret) rows.push(['Geheimer Name', s.secretName || '']); return { head: ['Feld', 'Wert'], rows }; }
    case 'diary': { const l = byDate(state.diary); return { head: ['Datum', 'SSW', 'Stimmung', 'Von', 'Text'], rows: l.map(d => [d.date, ssw(d.date), MOOD_LABEL[d.mood] || '', d.by ? authorName(d.by) : '', d.text || '']), imgs: l.map(d => d.photoId || null) }; }
    case 'photos': { const l = byDate(state.photos); return { head: ['Datum', 'SSW', 'Beschriftung'], rows: l.map(p => [p.date, ssw(p.date), p.caption || '']), imgs: l.map(p => p.photoId || null) }; }
    case 'letters': return { head: ['Datum', 'Text', 'Sprachnachricht'], rows: byDate(state.letters).map(l => [l.date, l.text || '', yn(l.audioId)]) };
    case 'fetal': return { head: ['Datum', 'SSW', 'Größe (cm)', 'Gewicht (g)', 'Notiz'], rows: byDate(state.fetal || []).map(e => [e.date, ssw(e.date), e.mm ? (e.mm / 10).toFixed(1).replace('.', ',') : '', e.g || '', e.note || '']) };
    case 'pass': return { head: ['Datum', 'SSW', 'Gewicht (kg)', 'Blutdruck', 'Hb', 'Notiz'], rows: byDate(state.pass).map(p => [p.date, ssw(p.date), p.weight || '', p.sys ? `${p.sys}/${p.dia || ''}` : '', p.hb || '', p.note || '']) };
    case 'water': return { head: ['Datum', 'Gläser (250 ml)'], rows: Object.entries(state.water || {}).sort(([a], [b]) => a.localeCompare(b)).map(([d, n]) => [d, n]) };
    case 'baby': return { head: ['Zeitpunkt', 'Art', 'Detail', 'Dauer (Minuten)'], rows: byDate(state.baby).map(e => [new Date(e.ts).toLocaleString('de-DE'), { feed: 'Stillen/Trinken', diaper: 'Windel', sleep: 'Schlaf' }[e.type] || e.type, e.detail || '', e.end ? Math.round((e.end - e.ts) / 60000) : '']) };
    case 'wishes': return { head: ['Wunsch', 'Link', 'Erfüllt', 'Bei Person'], rows: state.wishes.map(w => [w.text, w.link || '', yn(w.got), w.assigned || '']) };
    case 'lists': return { head: ['Liste', 'Eintrag', 'Erledigt'], rows: [...state.todos.map(t => ['To-dos', t.text, yn(t.done)]), ...Object.entries(state.lists || {}).flatMap(([k, items]) => (items || []).map(t => [(CHECKLISTS[k] || {}).title || k, t.text, yn(t.done)]))] };
    case 'appts': return { head: ['Datum', 'Uhrzeit', 'Termin'], rows: byDate(state.appts).map(a => [a.date, a.time || '', a.title]) };
    case 'names': return { head: ['Name', 'Mama mag', 'Papa mag'], rows: state.names.map(n => [n.name, yn(n.m), yn(n.p)]) };
    case 'milestones': return { head: ['Meilenstein', 'Datum', 'SSW', 'Notiz'], rows: state.milestones.map(m => [m.title, m.date || '', m.date ? ssw(m.date) : '', m.note || '']) };
    case 'contacts': return { head: ['Name', 'Rolle', 'Telefon', 'Notiz'], rows: state.contacts.map(c => [c.name, c.role, c.phone, c.note || '']) };
    case 'vits': return { head: ['Präparat', 'Tage mit Einnahme'], rows: state.vits.map(v => [v.name, Object.values(state.vitLog || {}).filter(ids => ids.includes(v.id)).length]) };
  }
  return { head: [], rows: [] };
}
const exportCfg = () => Object.assign({}, EXPORT_DEFAULT, state.settings.exportCfg || {});
const exportLabel = a => (EXPORT_AREAS.find(x => x[0] === a) || [a, a])[1];
const csvCell = v => { const s = String(v ?? ''); return /[";\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const exportStamp = () => `${fileSafe('babylove by sarah export')}-${iso(today())}`;
function buildExportJSON(cfg, media) {
  const out = { anwendung: brandFull(), exportiert_am: new Date().toISOString(), hinweis: 'Allgemeiner Datenexport. PIN-Daten sind nicht enthalten.', bereiche: {} };
  for (const a of cfg.areas) { const t = exportTable(a, cfg); out.bereiche[exportLabel(a)] = t.rows.map((r, i) => Object.fromEntries([...t.head.map((h, j) => [h, r[j]]), ...(t.imgs && t.imgs[i] && media ? [['Bild', media[t.imgs[i]] || null]] : [])])); }
  return JSON.stringify(out, null, 2);
}
function buildExportCSV(cfg) {
  const lines = [['Bereich', 'Feld1', 'Feld2', 'Feld3', 'Feld4', 'Feld5', 'Feld6'].map(csvCell).join(';')];
  for (const a of cfg.areas) { const t = exportTable(a, cfg); lines.push([exportLabel(a), ...t.head].map(csvCell).join(';')); t.rows.forEach(r => lines.push([exportLabel(a), ...r].map(csvCell).join(';'))); lines.push(''); }
  return '\uFEFF' + lines.join('\r\n');
}
function buildExportHTML(cfg, media) {
  const secs = cfg.areas.map(a => { const t = exportTable(a, cfg); if (!t.rows.length) return `<section><h2>${esc(exportLabel(a))}</h2><p class="n">Keine Einträge.</p></section>`;
    return `<section><h2>${esc(exportLabel(a))}</h2><table><thead><tr>${t.head.map(h => `<th>${esc(h)}</th>`).join('')}${t.imgs && media ? '<th>Bild</th>' : ''}</tr></thead><tbody>${t.rows.map((r, i) => `<tr>${r.map(c => `<td>${esc(c).replace(/\n/g, '<br>')}</td>`).join('')}${t.imgs && media ? `<td>${t.imgs[i] && media[t.imgs[i]] ? `<img src="${media[t.imgs[i]]}" alt="">` : ''}</td>` : ''}</tr>`).join('')}</tbody></table></section>`; }).join('');
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(brandFull())}: Datenexport</title><style>body{font:15px/1.55 Segoe UI,Arial,sans-serif;color:#3a2c2d;max-width:980px;margin:0 auto;padding:28px 18px}h1{color:#8b4752;margin:0}.sub{color:#6e5a59;margin:4px 0 24px}h2{color:#8b4752;border-bottom:2px solid #c97b84;padding-bottom:4px;margin-top:30px}table{width:100%;border-collapse:collapse;font-size:.92rem}th,td{border:1px solid #e8d6d2;padding:6px 8px;text-align:left;vertical-align:top}th{background:#f4e6e3}img{max-width:160px;max-height:120px;border-radius:6px}.n{color:#6e5a59}footer{margin-top:36px;color:#6e5a59;font-size:.8rem;text-align:center}@media print{section{break-inside:avoid-page}}</style></head><body><h1>${esc(brandName())} <i>${esc(brandSub())}</i></h1><p class="sub">Datenexport vom ${esc(fmtLong(iso(today())))}${namesLine() ? ' für ' + esc(namesLine()) : ''}</p>${secs}<footer>Erstellt mit ${esc(brandFull())}. PIN-Daten sind nicht enthalten.</footer></body></html>`;
}
async function collectMedia(cfg) {
  const media = {};
  for (const a of cfg.areas) { const t = exportTable(a, cfg); for (const id of (t.imgs || []).filter(Boolean)) if (!media[id]) { const b = await getImg(id); if (b) media[id] = await blobToData(b); } }
  return media;
}
EXTRA_ROUTES.export = () => {
  const cfg = exportCfg(), count = a => exportTable(a, cfg).rows.length, total = cfg.areas.reduce((n, a) => n + count(a), 0);
  view.innerHTML = `${intro('Datenexport', 'Nimm deine Daten mit: lesbar, sortiert und in gängigen Formaten. Etwas anderes als das Backup, das nur zum Wiederherstellen dient.')}
    <h2>Was soll in den Export?</h2>
    <div class="card">${EXPORT_AREAS.map(([k, label]) => `<div class="todo"><input type="checkbox" id="ex_${k}" data-ex="${k}" ${cfg.areas.includes(k) ? 'checked' : ''}><label for="ex_${k}" class="keep" style="margin:0;font-weight:400;flex:1"><span>${esc(label)}</span></label><span class="chip">${count(k)}</span></div>`).join('')}
      <div class="hstack gap-2 mt-3"><button class="btn btn-subtle theme-secondary btn-sm" id="ex-all">Alle</button><button class="btn btn-subtle theme-secondary btn-sm" id="ex-none">Keine</button></div></div>
    <h2>Optionen</h2>
    <div class="card"><div class="todo"><input type="checkbox" id="ex-media" ${cfg.media ? 'checked' : ''}><label for="ex-media" class="keep" style="margin:0;font-weight:400;flex:1"><b>Fotos einbetten</b><div class="small soft">Macht die Datei deutlich größer.</div></label></div>
      <div class="todo"><input type="checkbox" id="ex-secret" ${cfg.secret ? 'checked' : ''}><label for="ex-secret" class="keep" style="margin:0;font-weight:400;flex:1"><b>Geheimen Namen des Kindes einschließen</b><div class="small soft">Standard: nein. Dein Geheimnis bleibt geheim.</div></label></div></div>
    <h2>Format</h2>
    <div class="hstack gap-2 flex-wrap mb-2"><button class="btn btn-solid theme-primary" id="ex-json">${bi('filetype-json')} JSON</button><button class="btn btn-solid theme-primary" id="ex-csv">${bi('filetype-csv')} CSV (Excel)</button><button class="btn btn-solid theme-primary" id="ex-html">${bi('filetype-html')} HTML (lesbar, druckbar)</button></div>
    <p class="small soft" id="ex-sum">${cfg.areas.length} Bereiche, ${total} Einträge ausgewählt. PIN-Daten werden nie exportiert. Die Dateien enthalten persönliche Daten, bewahre sie sicher auf.</p>`;
  const upd = () => { state.settings.exportCfg = { ...cfg }; save(); };
  view.querySelectorAll('[data-ex]').forEach(c => c.onchange = () => { cfg.areas = c.checked ? [...cfg.areas, c.dataset.ex] : cfg.areas.filter(x => x !== c.dataset.ex); upd(); render(); });
  $('#ex-all').onclick = () => { cfg.areas = EXPORT_AREAS.map(a => a[0]); upd(); render(); };
  $('#ex-none').onclick = () => { cfg.areas = []; upd(); render(); };
  $('#ex-media').onchange = e => { cfg.media = e.target.checked; upd(); };
  $('#ex-secret').onchange = e => { cfg.secret = e.target.checked; upd(); };
  const run = async (kind) => {
    if (!cfg.areas.length) return toast('Bitte mindestens einen Bereich auswählen');
    const media = cfg.media ? await collectMedia(cfg) : null, name = exportStamp();
    if (kind === 'json') downloadFile(`${name}.json`, buildExportJSON(cfg, media), 'application/json;charset=utf-8');
    if (kind === 'csv') downloadFile(`${name}.csv`, buildExportCSV(cfg), 'text/csv;charset=utf-8');
    if (kind === 'html') downloadFile(`${name}.html`, buildExportHTML(cfg, media), 'text/html;charset=utf-8');
    cheer('save');
  };
  $('#ex-json').onclick = () => run('json'); $('#ex-csv').onclick = () => run('csv'); $('#ex-html').onclick = () => run('html');
};