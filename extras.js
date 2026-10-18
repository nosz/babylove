'use strict';
/* BABYLOVE by Sarah: Kochrezepte, App-Sperre, Begrüßung.
   Wird nach features.js und vor app.js geladen. Helfer aus app.js (state, view, esc, save, render ...) werden erst zur Laufzeit genutzt. */

/* ==================== Kochrezepte ==================== */
// Eigene, einfache Rezeptideen für 2 Portionen, inspiriert von den Ratgebern der Techniker Krankenkasse, von Utopia, familie.de und der Uni Wien.
// Hinweise zur Sicherheit (Durcherhitzen, pasteurisierte Milchprodukte) folgen dem BLE-Infoblatt zu Listeriose und Toxoplasmose.
const RECIPE_CATS = ['Frühstück', 'Hauptgerichte', 'Suppen', 'Snacks'];
const RECIPES = [
  { id: 'hirsebrei', cat: 'Frühstück', title: 'Hirse-Hafer-Brei mit Beeren', time: 15, tags: ['Eisen', 'Folsäure'],
    ing: ['40 g Hirseflocken', '30 g Haferflocken', '250 ml pasteurisierte Milch oder Hafergetränk', '1 Handvoll Beeren', '1 TL Leinsamen', '1 Prise Zimt'],
    steps: ['Hirse- und Haferflocken mit der Milch in einem Topf aufkochen.', 'Bei kleiner Hitze 5 Minuten quellen lassen und dabei rühren.', 'Beeren und Leinsamen darübergeben.'],
    tip: 'Ein Glas Orangensaft oder frisches Obst dazu hilft dem Körper, das Eisen aus dem Getreide aufzunehmen. Tiefkühlbeeren vorher kurz aufkochen.' },
  { id: 'oats', cat: 'Frühstück', title: 'Overnight Oats mit Apfel und Nüssen', time: 5, tags: ['Ballaststoffe', 'Calcium'],
    ing: ['60 g Haferflocken', '150 g pasteurisierter Joghurt', '100 ml Milch oder Pflanzendrink', '1 Apfel, gerieben', '1 EL gehackte Nüsse', '1 Prise Zimt'],
    steps: ['Haferflocken, Joghurt und Milch am Abend in einem Glas verrühren.', 'Den geriebenen Apfel unterheben und über Nacht in den Kühlschrank stellen.', 'Morgens mit Nüssen und Zimt toppen.'],
    tip: 'Nur pasteurisierten Joghurt verwenden. Das steht auf der Packung.' },
  { id: 'avocadobrot', cat: 'Frühstück', title: 'Avocado-Vollkornbrot mit hartem Ei', time: 15, tags: ['Eisen', 'Gute Fette'],
    ing: ['2 Scheiben Vollkornbrot', '1 reife Avocado', '2 Eier', '1 Spritzer Zitronensaft', 'Jodsalz und Pfeffer'],
    steps: ['Eier 8 bis 10 Minuten hart kochen und pellen.', 'Avocado mit Zitronensaft, Jodsalz und Pfeffer zerdrücken.', 'Auf das Brot streichen und die Eierscheiben darauflegen.'],
    tip: 'Eier immer komplett durchgaren, bis Eiweiß und Eigelb fest sind. Kein weiches oder pochiertes Ei.' },
  { id: 'linsenpfanne', cat: 'Hauptgerichte', title: 'Spinat-Linsen-Pfanne mit Paprika', time: 30, tags: ['Eisen', 'Folsäure'],
    ing: ['150 g rote Linsen', '1 Zwiebel', '1 Knoblauchzehe', '200 g Blattspinat (frisch gewaschen oder Tiefkühl)', '1 Paprika', '400 ml Gemüsebrühe', 'Zitronensaft', '1 EL Öl'],
    steps: ['Zwiebel und Knoblauch im Öl glasig anbraten.', 'Linsen und Brühe zugeben und etwa 12 Minuten garen.', 'Spinat und gewürfelte Paprika unterrühren und 5 Minuten mitgaren.', 'Mit Zitronensaft abschmecken.'],
    tip: 'Zitrone und Paprika liefern Vitamin C, das die Eisenaufnahme aus den Linsen unterstützt.' },
  { id: 'ofenlachs', cat: 'Hauptgerichte', title: 'Ofenlachs mit Kartoffeln und Brokkoli', time: 40, tags: ['Omega-3', 'Jod'],
    ing: ['2 Lachsfilets (je ca. 125 g)', '400 g Kartoffeln', '1 Brokkoli', '1 Zitrone', '2 EL Olivenöl', 'Jodsalz, Pfeffer, Dill'],
    steps: ['Ofen auf 200 °C vorheizen. Kartoffelspalten mit Öl und Salz 15 Minuten backen.', 'Brokkoliröschen dazugeben, Lachs mit Zitrone und Dill darauflegen.', 'Weitere 15 bis 18 Minuten garen, bis der Lachs durch ist.'],
    tip: 'Lachs komplett durchgaren: Der Kern soll mindestens 2 Minuten über 70 °C heiß sein. Räucherlachs ist tabu.' },
  { id: 'quinoa', cat: 'Hauptgerichte', title: 'Quinoa-Salat mit Feta und Gemüse', time: 25, tags: ['Eisen', 'Folsäure', 'Calcium'],
    ing: ['100 g Quinoa', '1 Gurke', '1 Paprika', '2 Tomaten', '80 g pasteurisierter Feta', '2 EL Olivenöl', '1 Zitrone', 'Petersilie'],
    steps: ['Quinoa heiß abspülen und in doppelter Menge Wasser 12 Minuten kochen. Abkühlen lassen.', 'Gemüse gründlich waschen und würfeln.', 'Alles mit Olivenöl und Zitronensaft mischen, Feta darüberbröseln.'],
    tip: 'Feta nur aus pasteurisierter Milch. Gemüse gründlich waschen und den Salat frisch essen, nicht lange stehen lassen.' },
  { id: 'tofupfanne', cat: 'Hauptgerichte', title: 'Gemüse-Reispfanne mit Tofu', time: 30, tags: ['Eisen', 'Jod'],
    ing: ['150 g Naturreis', '200 g Tofu', '1 Zucchini', '1 Möhre', '1 Paprika', '1 EL Sojasauce', '1 EL Öl', 'Jodsalz'],
    steps: ['Reis nach Packung kochen.', 'Tofu würfeln und im Öl knusprig braten, herausnehmen.', 'Gemüse in Streifen braten, Reis und Tofu zugeben und mit Sojasauce und Jodsalz würzen.'],
    tip: 'Mit jodiertem Salz würzt du und deckst nebenbei einen Teil deines Jodbedarfs.' },
  { id: 'curry', cat: 'Hauptgerichte', title: 'Hähnchen-Gemüse-Curry', time: 35, tags: ['Eiweiß'],
    ing: ['250 g Hähnchenbrust', '1 Zwiebel', '1 Paprika', '1 Zucchini', '200 ml Kokosmilch', '1 EL Currypaste', '150 g Reis'],
    steps: ['Reis nach Packung kochen.', 'Hähnchenwürfel und Zwiebel anbraten, Currypaste kurz mitrösten.', 'Gemüse und Kokosmilch zugeben und 12 bis 15 Minuten köcheln lassen.'],
    tip: 'Hähnchen vollständig durchgaren, innen darf nichts rosa sein. Brett und Messer danach heiß abspülen.' },
  { id: 'linsensuppe', cat: 'Suppen', title: 'Rote-Linsen-Möhrensuppe', time: 25, tags: ['Eisen', 'Ballaststoffe'],
    ing: ['150 g rote Linsen', '3 Möhren', '1 Zwiebel', '1 l Gemüsebrühe', '1 TL Kreuzkümmel', 'Zitronensaft'],
    steps: ['Zwiebel und Möhren würfeln und kurz anbraten.', 'Linsen, Kreuzkümmel und Brühe zugeben und 15 Minuten kochen.', 'Pürieren und mit Zitronensaft abschmecken.'],
    tip: 'Reste schnell abkühlen lassen, im Kühlschrank lagern und vor dem Essen wieder kräftig durcherhitzen.' },
  { id: 'kuerbissuppe', cat: 'Suppen', title: 'Hokkaido-Kürbissuppe mit Ingwer', time: 30, tags: ['Gemüse'],
    ing: ['1 Hokkaido (ca. 500 g)', '1 Zwiebel', '1 Stück Ingwer', '600 ml Gemüsebrühe', '100 ml Hafer- oder Kochsahne', 'Kürbiskerne'],
    steps: ['Kürbis würfeln (die Schale vom Hokkaido kann mitgegessen werden), Zwiebel und Ingwer hacken.', 'Alles anbraten, mit Brühe ablöschen und 15 Minuten weich kochen.', 'Pürieren, Sahne einrühren und mit Kürbiskernen servieren.'],
    tip: 'Die Suppe bis zum Servieren heiß halten.' },
  { id: 'hummus', cat: 'Snacks', title: 'Hummus mit Gemüsesticks', time: 10, tags: ['Eisen', 'Eiweiß'],
    ing: ['1 Dose Kichererbsen', '2 EL Tahini', '1 Zitrone', '1 Knoblauchzehe', '3 EL Olivenöl', 'Möhren und Gurke als Sticks'],
    steps: ['Kichererbsen abspülen und mit Tahini, Zitronensaft, Knoblauch und Öl fein pürieren.', 'Mit etwas Wasser cremig rühren und abschmecken.', 'Mit gewaschenen Gemüsesticks servieren.'],
    tip: 'Selbstgemacht hast du alles im Griff. Frisch essen und Reste nach ein bis zwei Tagen wegwerfen.' },
  { id: 'kekse', cat: 'Snacks', title: 'Bananen-Haferkekse', time: 25, tags: ['Snack'],
    ing: ['2 reife Bananen', '150 g Haferflocken', '1 Handvoll gehackte Nüsse', '1 TL Zimt'],
    steps: ['Bananen zerdrücken und mit Haferflocken, Nüssen und Zimt mischen.', 'Kleine Häufchen auf ein Blech mit Backpapier setzen.', 'Bei 180 °C etwa 15 Minuten goldbraun backen.'],
    tip: 'Ohne rohe Eier darfst du den Teig ruhig probieren.' }
];
const RECIPE_SOURCES = [
  ['Techniker Krankenkasse: Rezepte in der Schwangerschaft', 'https://www.tk.de/techniker/gesundheit-foerdern/schwangerschaft-und-geburt/rezepte-in-der-schwangerschaft-2044718'],
  ['Utopia: Rezepte für Schwangere', 'https://utopia.de/ratgeber/rezepte-fuer-schwangere-ideen-und-was-du-wissen-solltest/'],
  ['familie.de: 10 Rezepte', 'https://www.familie.de/schwangerschaft/10-leckere-und-gesunde-rezepte-fuer-die-schwangerschaft--01J214535JJW1QFEHKDDP18WHH'],
  ['BLE: Listeriose und Toxoplasmose', 'https://www.ble-medienservice.de/simpledownloadable/freedownload/link/hash/32bb846d20fa5bd7017fbddbbf357401']
];
let recipeCat = 'Alle';
EXTRA_ROUTES.recipes = () => {
  const favs = state.recipeFav = state.recipeFav || [];
  const cats = ['Alle', ...RECIPE_CATS, 'Favoriten'];
  const list = RECIPES.filter(r => recipeCat === 'Alle' || (recipeCat === 'Favoriten' ? favs.includes(r.id) : r.cat === recipeCat));
  view.innerHTML = `${intro('Kochrezepte', 'Gesund, lecker und mit gutem Gewissen. Auch wenn um 22 Uhr plötzlich der Heißhunger anklopft.')}
    <div class="card info hstack gap-3">${bi('shield-check')}<div><b>Sicher kochen:</b> Fleisch, Fisch und Eier immer ganz durchgaren (innen mindestens 2 Minuten über 70 °C), nur pasteurisierte Milchprodukte, Obst und Gemüse gründlich waschen.</div></div>
    <div class="chip-row">${cats.map(c => `<button class="chip-btn ${c === recipeCat ? 'on' : ''}" data-cat="${c}">${c}${c === 'Favoriten' ? ` (${favs.length})` : ''}</button>`).join('')}</div>
    ${list.length ? list.map(r => `<button class="card recipe w-100" data-r="${r.id}"><div class="hstack gap-2"><b class="flex-grow-1 text-start">${esc(r.title)}</b>${favs.includes(r.id) ? bi('heart-fill') : ''}</div>
      <div class="small soft text-start mt-1">${bi('clock')} ${r.time} Min. · ${esc(r.cat)}</div><div class="text-start mt-1">${r.tags.map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div></button>`).join('')
      : empty('heart', 'Noch keine Favoriten. Tippe bei einem Rezept auf das Herz.')}
    <p class="small soft">Eigene Rezeptideen für 2 Portionen, inspiriert von den genannten Quellen. Nährstoff-Hinweise sind allgemein gehalten.</p>
    ${sources(RECIPE_SOURCES)}`;
  view.querySelectorAll('[data-cat]').forEach(b => b.onclick = () => { recipeCat = b.dataset.cat; render(); });
  view.querySelectorAll('[data-r]').forEach(b => b.onclick = () => recipeSheet(b.dataset.r));
};
function recipeSheet(id) {
  const r = RECIPES.find(x => x.id === id); if (!r) return;
  const fav = (state.recipeFav = state.recipeFav || []).includes(id);
  openSheet(`<h2 style="margin-top:0;font-size:1.3rem;text-transform:none;letter-spacing:0;color:var(--text)">${esc(r.title)}</h2>
    <p class="small soft">${bi('clock')} ${r.time} Min. · 2 Portionen</p>
    <b>Zutaten</b><ul class="ps-3 mt-1">${r.ing.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
    <b>Zubereitung</b><ol class="ps-3 mt-1">${r.steps.map(s => `<li class="mb-1">${esc(s)}</li>`).join('')}</ol>
    <div class="card info hstack gap-3">${bi('lightbulb')}<div><b>Schwangerschafts-Tipp:</b> ${esc(r.tip)}</div></div>
    <div class="hstack gap-2 flex-wrap"><button class="btn btn-subtle theme-secondary" id="rfav" type="button">${bi(fav ? 'heart-fill' : 'heart')} ${fav ? 'Gemerkt' : 'Merken'}</button>
      <button class="btn btn-subtle theme-secondary" id="rshop" type="button">${bi('cart-plus')} Auf Einkaufsliste</button><span class="flex-grow-1"></span>
      <button class="btn btn-solid theme-primary" id="rclose" type="button">Schließen</button></div>`, el => {
    $('#rclose', el).onclick = closeSheet;
    $('#rfav', el).onclick = () => { const f = state.recipeFav; const i = f.indexOf(id); i >= 0 ? f.splice(i, 1) : f.push(id); save(); closeSheet(); render(); if (i < 0) cheer('fav'); };
    $('#rshop', el).onclick = () => {
      state.lists = state.lists || {};
      const L = state.lists.einkauf = state.lists.einkauf || [];
      let n = 0; for (const t of r.ing) if (!L.some(x => x.text === t)) { L.push({ id: uid(), text: t, done: false }); n++; }
      save(); toast(n ? `${n} Zutaten auf der Einkaufsliste` : 'Alles schon auf der Liste');
    };
  });
}

/* ==================== App-Sperre ==================== */
// Schützt vor neugierigen Blicken am entsperrten Handy. Die Daten selbst werden dadurch nicht verschlüsselt.
const LOCK_AUTO = { now: ['Sofort beim Verlassen', 0], m1: ['Nach 1 Minute', 60e3], m5: ['Nach 5 Minuten', 300e3], start: ['Nur beim Start', Infinity] };
const b64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
const cryptoOk = () => !!(window.crypto && crypto.subtle);
async function pinHash(pin, saltB64, iter) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits']);
  return b64(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: unb64(saltB64), iterations: iter }, key, 256));
}
const lockOn = () => !!(state.settings.lock && state.settings.lock.hash);
let appLocked = false, hiddenAt = 0;
const FAILKEY = 'babylove:lockfail';
const getFail = () => { try { return JSON.parse(localStorage.getItem(FAILKEY)) || { n: 0, until: 0 }; } catch { return { n: 0, until: 0 }; } };
const setFail = f => { try { localStorage.setItem(FAILKEY, JSON.stringify(f)); } catch { /* ignorieren */ } };
async function checkPin(pin) { const L = state.settings.lock; return L && (await pinHash(pin, L.salt, L.iter)) === L.hash; }
async function setPin(pin, auto) {
  const salt = b64(crypto.getRandomValues(new Uint8Array(16))), iter = 150000;
  state.settings.lock = { salt, iter, hash: await pinHash(pin, salt, iter), len: pin.length, auto: auto || (state.settings.lock && state.settings.lock.auto) || 'now' };
  save(); setFail({ n: 0, until: 0 });
}

function showLock(after) {
  if (!lockOn()) return;
  appLocked = true; document.body.classList.add('is-locked');
  let el = $('#lock'); if (!el) { el = document.createElement('div'); el.id = 'lock'; document.body.appendChild(el); }
  const len = state.settings.lock.len; let entered = '', busy = false;
  const draw = msg => {
    el.innerHTML = `<div class="lock-box" role="dialog" aria-modal="true" aria-label="App entsperren">
      <div class="lock-brand"><span class="tb-name" data-brand-name>${esc(brandName())}</span><span class="tb-by" data-brand-by>${esc(brandSub())}</span></div>
      <div class="lock-badge">${bi('lock-fill')}</div><p class="lock-title">PIN eingeben</p>
      <div class="lock-dots" aria-label="${entered.length} von ${len} Ziffern">${Array.from({ length: len }, (_, i) => `<i class="${i < entered.length ? 'on' : ''}"></i>`).join('')}</div>
      <p class="lock-msg" role="status">${msg || ''}</p>
      <div class="keypad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'back'].map(k => k === '' ? '<span></span>' : `<button type="button" class="key" data-k="${k}" aria-label="${k === 'back' ? 'Löschen' : k}">${k === 'back' ? bi('backspace') : k}</button>`).join('')}</div>
      <button type="button" class="lock-forgot" id="forgot">PIN vergessen?</button></div>`;
    el.querySelectorAll('.key').forEach(b => b.onclick = () => press(b.dataset.k));
    $('#forgot', el).onclick = forgot;
  };
  const press = async k => {
    if (busy) return;
    const f = getFail(); if (f.until > Date.now()) return draw(`Zu viele Versuche. Bitte warte ${Math.ceil((f.until - Date.now()) / 1000)} Sekunden.`);
    entered = k === 'back' ? entered.slice(0, -1) : (entered + k).slice(0, len); draw();
    if (entered.length < len) return;
    busy = true;
    if (await checkPin(entered)) { setFail({ n: 0, until: 0 }); unlock(); }
    else {
      const n = f.n + 1, until = n >= 5 ? Date.now() + Math.min(600, 30 * 2 ** (n - 5)) * 1000 : 0; setFail({ n, until });
      entered = ''; draw(until ? 'Zu viele Versuche. Bitte kurz warten.' : 'Das war nicht die richtige PIN.');
      el.querySelector('.lock-dots').classList.add('shake'); busy = false;
    }
  };
  const unlock = () => { appLocked = false; document.body.classList.remove('is-locked'); el.remove(); document.removeEventListener('keydown', onKey); if (typeof after === 'function') after(); };
  const forgot = () => {
    if (!confirm('Ohne PIN lässt sich die App nur zurücksetzen. Dabei werden ALLE Daten von diesem Gerät gelöscht. Wirklich zurücksetzen?')) return;
    try { localStorage.clear(); indexedDB.deleteDatabase('babylove'); } catch { /* ignorieren */ }
    location.hash = '#/'; reloadApp();
  };
  const onKey = e => { if (/^\d$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') press('back'); };
  document.addEventListener('keydown', onKey);
  draw();
}

EXTRA_ROUTES.applock = () => {
  const s = state.settings, on = lockOn(), L = s.lock || {};
  view.innerHTML = `${intro('App-Sperre', 'Mit einer PIN bleiben eure Erinnerungen privat, auch wenn jemand dein Handy in die Hand nimmt.')}
    ${cryptoOk() ? '' : `<div class="card info hstack gap-3">${bi('exclamation-triangle')}<div>Die Sperre braucht eine sichere Verbindung (https oder localhost).</div></div>`}
    ${on ? `<div class="card hstack gap-3">${bi('shield-lock-fill')}<div class="flex-grow-1"><b>Die Sperre ist aktiv</b><div class="small soft">PIN mit ${L.len} Ziffern</div></div></div>
      <h2>Wann sperren?</h2><div class="card"><div class="seg" style="margin:0;flex-wrap:wrap">${Object.entries(LOCK_AUTO).map(([k, v]) => `<button data-auto="${k}" class="${(L.auto || 'now') === k ? 'on' : ''}">${v[0]}</button>`).join('')}</div></div>
      <h2>PIN ändern</h2><form class="card" id="chg"><label for="p0">Aktuelle PIN</label><input id="p0" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="off" required>
        <label for="p1">Neue PIN (4 bis 6 Ziffern)</label><input id="p1" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="new-password" required>
        <label for="p2">Neue PIN wiederholen</label><input id="p2" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="new-password" required>
        <button class="btn btn-solid theme-primary w-100 mt-3">PIN ändern</button></form>
      <h2>Sperre ausschalten</h2><form class="card" id="off"><label for="po">Aktuelle PIN</label><input id="po" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="off" required>
        <button class="btn btn-text theme-danger mt-2">Sperre ausschalten</button></form>`
    : `<h2>PIN festlegen</h2><form class="card" id="set"><label for="p1">PIN (4 bis 6 Ziffern)</label><input id="p1" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="new-password" required>
        <label for="p2">PIN wiederholen</label><input id="p2" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="new-password" required>
        <button class="btn btn-solid theme-primary w-100 mt-3" ${cryptoOk() ? '' : 'disabled'}>Sperre einschalten</button></form>`}
    <p class="small soft">Gut zu wissen: Die Sperre schützt vor neugierigen Blicken. Die Daten auf dem Gerät werden dadurch nicht verschlüsselt. Wer die PIN vergisst, kann die App nur zurücksetzen, dabei gehen alle Daten verloren. Mach deshalb regelmäßig ein Backup.</p>`;
  const valid = (a, b) => /^\d{4,6}$/.test(a) ? (a === b ? '' : 'Die beiden PINs sind nicht gleich.') : 'Die PIN muss aus 4 bis 6 Ziffern bestehen.';
  const f = id => $(id) && $(id).value;
  const set = $('#set'), chg = $('#chg'), off = $('#off');
  if (set) set.onsubmit = async e => { e.preventDefault(); const err = valid(f('#p1'), f('#p2')); if (err) return toast(err); await setPin(f('#p1')); toast('App-Sperre ist an.'); render(); };
  if (chg) chg.onsubmit = async e => { e.preventDefault(); if (!(await checkPin(f('#p0')))) return toast('Die aktuelle PIN stimmt nicht.'); const err = valid(f('#p1'), f('#p2')); if (err) return toast(err); await setPin(f('#p1')); toast('PIN geändert.'); render(); };
  if (off) off.onsubmit = async e => { e.preventDefault(); if (!(await checkPin(f('#po')))) return toast('Die PIN stimmt nicht.'); delete state.settings.lock; save(); toast('App-Sperre ist aus.'); render(); };
  view.querySelectorAll('[data-auto]').forEach(b => b.onclick = () => { state.settings.lock.auto = b.dataset.auto; save(); render(); });
};

/* ==================== Begrüßung beim Start ==================== */
const SPLASH_LINES = [
  'Du trägst gerade das größte Wunder der Welt. Und du machst das großartig.',
  'Du wächst über dich hinaus, Tag für Tag. Wir sind stolz auf dich.',
  'Atme tief durch. Dein Baby wächst in seinem Tempo, und du in deinem.',
  'Du darfst müde sein, du darfst zweifeln und du darfst dich feiern. Alles davon ist richtig.',
  'Du bist stärker, als du denkst, und weicher, als du zeigst. Beides macht dich zur besten Mama.',
  'Heute zählt nur eines: gut auf dich aufzupassen. Der Rest findet sich.',
  'Eine Schwangerschaft ist ein Abenteuer. Schön, dass du uns mitnimmst.',
  'Du bist nicht allein auf dieser Reise. Hier ist alles, was dich begleitet.'
];
// Begrüßung abhängig von der Uhrzeit (für Startseite und Willkommensbild)
const TOD_LINES = {
  morgen: ['Ein neuer Tag, ein bisschen näher am Wunder. Frühstück nicht vergessen!', 'Guten Start! Ein Glas Wasser und ein tiefer Atemzug, dann kann der Tag kommen.', 'Das Baby ist auch schon wach und übt Purzelbäume.'],
  tag: ['Halbzeit am Tag: Beine hoch, trinken und kurz durchatmen.', 'Zeit für eine kleine Pause. Das Baby wächst, auch wenn ihr nur sitzt.', 'Ein Snack und ein Lächeln machen den Nachmittag gleich leichter.'],
  abend: ['Der Tag war lang genug. Jetzt gehört der Abend euch beiden.', 'Zeit zum Runterkommen: Tee, Sofa und die Hand auf dem Bauch.', 'Ein Abend zu zweit, plus Baby. Besser geht es kaum.'],
  nacht: ['Noch wach? Das Baby sicher auch. Gönnt euch bald Ruhe.', 'Nachts darf man ruhig mal das Handy weglegen und kuscheln.', 'Schlaf ist jetzt Gold wert. Gute Nacht, ihr Lieben.']
};
function todPeriod(h = new Date().getHours()) { return h >= 5 && h < 11 ? 'morgen' : h >= 11 && h < 17 ? 'tag' : h >= 17 && h < 22 ? 'abend' : 'nacht'; }
function todGreeting(h) { return { morgen: 'Guten Morgen', tag: 'Guten Tag', abend: 'Guten Abend', nacht: 'Hallo Nachteule' }[todPeriod(h)]; }
function showSplash() {
  try { if (sessionStorage.getItem('bl-splash')) return; sessionStorage.setItem('bl-splash', '1'); } catch { /* ohne Speicher trotzdem zeigen */ }
  if ($('#splash')) return;
  const s = state.settings, p = s.dueDate ? pregnancy() : null, h = new Date().getHours();
  const tod = todGreeting(h);
  const el = document.createElement('div'); el.id = 'splash'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Willkommen bei ' + brandFull());
  const photo = randomPhoto('mama');
  el.innerHTML = `<div class="splash-in">
    ${photo ? avatar(photo, 'avatar-lg splash-photo') : `<div class="splash-badge">${bi('heart-fill')}</div>`}
    <div class="splash-brand"><span class="sb-name" data-brand-name>${esc(brandName())}</span><span class="sb-by" data-brand-by>${esc(brandSub())}</span></div>
    <h2 class="splash-hello">${tod}${s.mama ? ', ' + esc(s.mama) : ''}</h2>
    <p class="splash-line">${s.dueDate ? pick(TOD_LINES[todPeriod(h)].concat(SPLASH_LINES)) : 'Schön, dass du da bist. Gemeinsam begleiten wir deine Schwangerschaft mit Liebe, Humor und ganz viel Zuversicht.'}</p>
    ${p ? `<div class="splash-week">${p.weeks}. Schwangerschaftswoche${p.left > 0 ? ` · noch ${p.left} Tage` : ''}</div>` : ''}
    <button class="btn splash-go" id="splashGo" type="button">Los geht’s</button></div>`;
  document.body.appendChild(el); hydrateImages(el);
  let done = false;
  const close = () => { if (done) return; done = true; el.classList.add('out'); setTimeout(() => { el.remove(); maybeGuide(); }, 350); };
  $('#splashGo', el).onclick = close; el.onclick = e => { if (e.target === el) close(); };
  setTimeout(close, 7000); $('#splashGo', el).focus();
}

function appStart() {
  const go = () => { showSplash(); setTimeout(maybeGuide, 500); };
  if (lockOn() && cryptoOk()) showLock(go); else go();
}
document.addEventListener('visibilitychange', () => {
  if (!lockOn() || !cryptoOk()) return;
  if (document.visibilityState === 'hidden') { hiddenAt = Date.now(); return; }
  if (appLocked) return;
  const limit = (LOCK_AUTO[state.settings.lock.auto] || LOCK_AUTO.now)[1];
  if (hiddenAt && Date.now() - hiddenAt >= limit) showLock();
});

/* ==================== Eigene Sprüche importieren (Einstellungen) ==================== */
// Fünf Spruch-Arten. Eigene Sprüche werden zu den eingebauten gemischt oder (Schalter) allein verwendet.
const QUOTE_KINDS = {
  hero: { label: 'Mama: Wochenkarte', desc: 'Der Spruch auf der Wochenkarte der Startseite, wechselt täglich', base: () => HERO_QUOTES },
  daily: { label: 'Tagesimpuls', desc: 'Der Spruch des Tages auf der Startseite', base: () => DAILY },
  papa: { label: 'Papa: Motivationsschub', desc: 'Der Spruch für den Papa auf der Startseite und der Papa-Seite', base: () => DAILY_PARTNER },
  papaRank: { label: 'Papa: Rang-Text', desc: 'Der Text unter dem Papa-Rang auf der Papa-Seite', base: tri => [...(PAPA_RANK_TEXTS[tri] || PAPA_RANK_TEXTS[1]), ...PAPA_GENERAL] },
  missions: { label: 'Papa: Mission des Tages', desc: 'Die Aufgabe des Tages auf der Papa-Seite', base: () => PARTNER_MISSIONS },
  papaTips: { label: 'Papa: Tipp des Tages', desc: 'Der Tipp auf der Papa-Seite und im Partner-Modus', base: tri => PARTNER_TIPS[tri] || PARTNER_TIPS[1] }
};
const QUOTE_MAX = 500, QUOTE_MIN = 12, QUOTE_LEN = 240, QUOTE_FILE_MAX = 512 * 1024;
const customQuotes = kind => { state.customQuotes = state.customQuotes || {}; return (state.customQuotes[kind] = state.customQuotes[kind] || []); };
// Mundart: Hessisch, Bayrisch, Schwäbisch oder bunt gemischt. Die Sprüche mischen sich "ab und zu" (etwa jeder fünfte) oder "oft" (etwa jeder zweite) unter die normalen.
const dialectKeys = () => { const v = state.settings.dialect; return v === 'alle' ? Object.keys(DIALECTS) : DIALECTS[v] ? [v] : []; };
const dialectLines = kind => { const who = kind === 'hero' || kind === 'daily' ? 'mama' : kind === 'papa' || kind === 'papaRank' ? 'papa' : null; return who ? dialectKeys().flatMap(k => DIALECT_QUOTES[k][who]) : []; };
// Alle möglichen Sprüche ohne Doppelte (für Anzeige und Zählung)
function quotePoolUnique(kind, tri) {
  const base = QUOTE_KINDS[kind].base(tri), own = (state.customQuotes || {})[kind] || [], only = (state.settings.quoteOnly || {})[kind];
  return only && own.length ? [...own] : [...new Set([...base, ...dialectLines(kind), ...own])];
}
// Auswahl mit Gewichtung: Mundart "ab und zu" bzw. "oft", eigene Sprüche werden bevorzugt (sie stellen etwa die Hälfte aller Tage)
function quotePool(kind, tri) {
  const base = QUOTE_KINDS[kind].base(tri), own = (state.customQuotes || {})[kind] || [], only = (state.settings.quoteOnly || {})[kind];
  if (only && own.length) return [...own];
  const fresh = own.filter(q => !base.includes(q)), dia = dialectLines(kind).filter(q => !base.includes(q));
  let mix = [...base];
  if (dia.length) { const share = state.settings.dialectFreq === 'often' ? .5 : .2, r = Math.max(1, Math.round(share / (1 - share) * base.length / dia.length)); for (let i = 0; i < r; i++) mix.push(...dia); }
  if (!fresh.length) return mix;
  const reps = Math.min(40, Math.max(1, Math.ceil(mix.length / fresh.length)));
  for (let i = 0; i < reps; i++) mix.push(...fresh);
  return mix;
}const EMOJI_STRIP = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2B55}\u{2B05}-\u{2B07}\u{2194}-\u{2199}\u{21A9}\u{21AA}\u{231A}\u{231B}\u{23E9}-\u{23FA}\u{25B6}\u{25C0}\u{200D}\u{FE0F}\u{20E3}]/gu;
// Liest Text (eine Zeile pro Spruch, auch Aufzählung, CSV-artig oder JSON-Liste) und prüft jeden Spruch
function parseQuotes(raw, kind) {
  const text = String(raw || '').replace(/^\uFEFF/, '').trim(); let lines = null;
  if (text.startsWith('[')) { try { const j = JSON.parse(text); if (Array.isArray(j)) lines = j.map(x => typeof x === 'string' ? x : (x && x.text) || ''); } catch { /* als Text weiter */ } }
  if (!lines) lines = text.split(/\r?\n/);
  const res = { added: [], tooShort: 0, tooLong: 0, duplicate: 0, emoji: 0, limit: 0 }, own = customQuotes(kind);
  const known = new Set([1, 2, 3].flatMap(t => QUOTE_KINDS[kind].base(t)).concat(own).map(s => s.toLowerCase()));
  for (let line of lines) {
    line = String(line).trim(); if (!line) continue;
    line = line.replace(/^(?:[-*\u2022]|\d+[.)])\s+/, '').replace(/^"(.*)"$/, '$1');
    const plain = line.replace(EMOJI_STRIP, ''); if (plain !== line) { res.emoji++; line = plain; }
    line = line.replace(/\s+/g, ' ').trim();
    if (line.length < QUOTE_MIN) { res.tooShort++; continue; }
    if (line.length > QUOTE_LEN) { res.tooLong++; continue; }
    if (known.has(line.toLowerCase())) { res.duplicate++; continue; }
    if (own.length + res.added.length >= QUOTE_MAX) { res.limit++; continue; }
    known.add(line.toLowerCase()); res.added.push(line);
  }
  return res;
}
const quoteSummary = r => [`${r.added.length} neue ${r.added.length === 1 ? 'Spruch' : 'Sprüche'} hinzugefügt`, r.duplicate && `${r.duplicate} doppelt`, r.tooShort && `${r.tooShort} zu kurz (unter ${QUOTE_MIN} Zeichen)`, r.tooLong && `${r.tooLong} zu lang (über ${QUOTE_LEN} Zeichen)`, r.emoji && `bei ${r.emoji} wurden Emojis entfernt`, r.limit && `${r.limit} über dem Limit von ${QUOTE_MAX}`].filter(Boolean).join(', ');

let quoteKind = 'hero';
EXTRA_ROUTES.quotes = () => {
  const K = QUOTE_KINDS[quoteKind], own = customQuotes(quoteKind), only = !!(state.settings.quoteOnly || {})[quoteKind], base = [1, 2, 3].flatMap(t => K.base(t)).length ? K.base(2) : [];
  view.innerHTML = `${intro('Eigene Sprüche', 'Bring deine Lieblingssprüche mit. Sie mischen sich unter die eingebauten und erscheinen jeden Tag neu.')}
    <div class="card" id="dialectCard"><b>${bi('chat-heart')} Mundart</b><p class="small soft mb-2">Die App darf auch Spaß machen: Ab und zu kommen die Motivationssprüche auf Hessisch, Bayrisch, Schwäbisch, Sächsisch oder Ostfriesisch. Eigene Sprüche werden immer bevorzugt.</p>
      <div class="seg" role="group" aria-label="Mundart" style="margin:0">${[['off', 'Aus'], ...Object.entries(DIALECTS), ['alle', 'Bunt gemischt']].map(([k, l]) => `<button type="button" data-dia="${k}" class="${(state.settings.dialect || 'off') === k ? 'on' : ''}" aria-pressed="${(state.settings.dialect || 'off') === k}">${l}</button>`).join('')}</div>
      ${state.settings.dialect ? `<p class="small mt-2 mb-1"><b>Wie oft?</b></p><div class="seg" role="group" aria-label="Wie oft" style="margin:0">${[['sometimes', 'Ab und zu'], ['often', 'Oft']].map(([k, l]) => `<button type="button" data-diafreq="${k}" class="${(state.settings.dialectFreq || 'sometimes') === k ? 'on' : ''}" aria-pressed="${(state.settings.dialectFreq || 'sometimes') === k}">${l}</button>`).join('')}</div>
      <p class="small soft mt-2 mb-0" id="dialectEx">${esc(pick(dialectKeys().flatMap(k => DIALECT_QUOTES[k].mama)))}</p>` : ''}</div>
    <div class="chip-row">${Object.entries(QUOTE_KINDS).map(([k, v]) => `<button class="chip-btn ${k === quoteKind ? 'on' : ''}" data-qk="${k}">${v.label}</button>`).join('')}</div>
    <div class="card"><b>${esc(K.label)}</b><p class="small soft mb-2">${esc(K.desc)}</p>
      <div class="hstack gap-2 flex-wrap"><span class="chip">${bi('collection')} Eingebaut: ${base.length}</span><span class="chip">${bi('plus-circle')} Eigene: ${own.length}</span><span class="chip">${bi('shuffle')} Zur Auswahl: ${quotePoolUnique(quoteKind, 2).length}</span></div></div>
    <h2>Sprüche importieren</h2>
    <div class="card"><label for="q-text">Sprüche einfügen (ein Spruch pro Zeile)</label>
      <textarea id="q-text" style="min-height:130px" placeholder="Du machst das großartig, Mama.&#10;Jeder Tag bringt euch näher zusammen."></textarea>
      <label for="q-file">Oder Datei wählen (.txt, .csv oder .json)</label><input id="q-file" type="file" accept=".txt,.csv,.json,text/plain,text/csv,application/json">
      <button class="btn btn-solid theme-primary w-100 mt-3" id="q-import">${bi('upload')} Importieren</button>
      <p class="small soft mt-2 mb-0">Mindestens ${QUOTE_MIN}, höchstens ${QUOTE_LEN} Zeichen pro Spruch, bis zu ${QUOTE_MAX} eigene je Art. Doppelte werden übersprungen, Emojis entfernt. Die Texte bleiben auf diesem Gerät.</p>
      <div id="q-result" class="small mt-2" role="status"></div></div>
    <div class="card"><label for="q-one">Einzelnen Spruch hinzufügen</label><div class="hstack gap-2"><input id="q-one" maxlength="${QUOTE_LEN}" placeholder="Dein eigener Spruch"><button class="btn btn-subtle theme-secondary" id="q-add" aria-label="Spruch hinzufügen">${bi('plus-lg')}</button></div></div>
    <div class="card"><div class="todo" style="border:0;padding:0"><input type="checkbox" id="q-only" ${only ? 'checked' : ''} ${own.length ? '' : 'disabled'}><label for="q-only" class="keep" style="margin:0;font-weight:400;flex:1"><b>Nur meine eigenen Sprüche verwenden</b><div class="small soft">${own.length ? 'Die eingebauten Sprüche werden dann nicht mehr gezeigt.' : 'Erst eigene Sprüche importieren.'}</div></label></div></div>
    <h2>Meine Sprüche (${own.length})</h2>
    ${own.length ? `<div class="card" id="q-list">${own.slice(0, 60).map((q, i) => `<div class="todo"><span class="flex-grow-1">${esc(q)}</span><button class="btn btn-text theme-danger btn-sm" data-qdel="${i}" aria-label="Spruch löschen">${bi('x-lg')}</button></div>`).join('')}${own.length > 60 ? `<p class="small soft mt-2 mb-0">… und ${own.length - 60} weitere</p>` : ''}</div>
      <div class="hstack gap-2 flex-wrap"><button class="btn btn-subtle theme-secondary" id="q-export">${bi('download')} Als Textdatei sichern</button><button class="btn btn-text theme-danger" id="q-clear">${bi('trash')} Alle eigenen löschen</button></div>`
      : empty('chat-quote', 'Noch keine eigenen Sprüche. Füg oben welche ein, es lohnt sich.')}`;
  view.querySelectorAll('[data-qk]').forEach(b => b.onclick = () => { quoteKind = b.dataset.qk; render(); });
  const finish = r => { save(); const msg = quoteSummary(r); render(); const box = $('#q-result'); if (box) box.textContent = msg; r.added.length ? cheer('add') : toast(msg); };
  $('#q-import').onclick = () => { const r = parseQuotes($('#q-text').value, quoteKind); if (!r.added.length && !$('#q-text').value.trim()) return toast('Bitte erst Sprüche einfügen oder eine Datei wählen'); customQuotes(quoteKind).push(...r.added); finish(r); };
  $('#q-file').onchange = async e => {
    const file = e.target.files[0]; if (!file) return; e.target.value = '';
    if (file.size > QUOTE_FILE_MAX) return toast('Die Datei ist zu groß (höchstens 500 KB)');
    const r = parseQuotes(await file.text(), quoteKind); customQuotes(quoteKind).push(...r.added); finish(r);
  };
  $('#q-add').onclick = () => { const v = $('#q-one').value; const r = parseQuotes(v, quoteKind); if (!v.trim()) return; customQuotes(quoteKind).push(...r.added); finish(r); };
  view.querySelectorAll('[data-dia]').forEach(b => b.onclick = () => { const k = b.dataset.dia; if (k === 'off') { delete state.settings.dialect; delete state.settings.dialectFreq; } else state.settings.dialect = k; save(); render(); toast(k === 'off' ? 'Mundart ist aus. Hochdeutsch bleibt.' : `Mundart: ${k === 'alle' ? 'bunt gemischt' : DIALECTS[k]}. Ab und zu gibt es jetzt Sprüche auf Mundart!`); });
  view.querySelectorAll('[data-diafreq]').forEach(b => b.onclick = () => { state.settings.dialectFreq = b.dataset.diafreq; save(); render(); });  $('#q-only').onchange = e => { state.settings.quoteOnly = { ...(state.settings.quoteOnly || {}), [quoteKind]: e.target.checked }; save(); render(); toast(e.target.checked ? 'Es erscheinen nur noch deine eigenen Sprüche.' : 'Eingebaute und eigene Sprüche werden gemischt.'); };
  view.querySelectorAll('[data-qdel]').forEach(b => b.onclick = () => { customQuotes(quoteKind).splice(+b.dataset.qdel, 1); if (!customQuotes(quoteKind).length) { const o = { ...(state.settings.quoteOnly || {}) }; delete o[quoteKind]; state.settings.quoteOnly = o; } save(); render(); });
  const ex = $('#q-export'); if (ex) ex.onclick = () => { downloadFile(`eigene-sprueche-${quoteKind}-${iso(today())}.txt`, own.join('\n') + '\n', 'text/plain;charset=utf-8'); };
  const cl = $('#q-clear'); if (cl) cl.onclick = () => { if (!confirm(`Alle ${own.length} eigenen Sprüche dieser Art löschen?`)) return; state.customQuotes[quoteKind] = []; const o = { ...(state.settings.quoteOnly || {}) }; delete o[quoteKind]; state.settings.quoteOnly = o; save(); render(); };
};
/* ==================== Datenschutz und Sicherheit: Vertrauen schaffen ==================== */
const versionLine = () => `${brandFull()} · Version ${APP_VERSION.number} · Stand ${fmtDate(APP_VERSION.date)}`;
EXTRA_ROUTES.privacy = () => {
  const approx = Math.round(((localStorage.getItem('babylove:v1') || '').length * 2) / 1024);
  const counts = [['Tagebucheinträge', state.diary.length], ['Fotos im Album', state.photos.length], ['Briefe ans Baby', state.letters.length], ['Profilfotos', photosOf('mama').length + photosOf('partner').length + photosOf('kid').length], ['Wünsche', state.wishes.length], ['Termine', state.appts.length]];
  const item = (title, text) => `<li>${bi('check-circle-fill')}<div><b>${title}</b><div class="small soft">${text}</div></div></li>`;
  view.innerHTML = `${intro('Datenschutz und Sicherheit', 'Deine Schwangerschaft gehört dir. Hier steht offen und verständlich, was die App mit deinen Daten macht.')}
    <div class="card"><ul class="trust-list">
      ${item('Alles bleibt auf diesem Gerät.', 'Einträge, Fotos und Einstellungen liegen im Speicher deines Browsers. Es gibt keinen Server, kein Konto und keine Cloud.')}
      ${item('Kein Tracking, keine Werbung.', 'Die App enthält keine Analyse- und keine Werbedienste und sammelt nichts über dich.')}
      ${item('Keine fremden Server im Betrieb.', 'Design, Schrift und Symbole sind in der App enthalten (Bootstrap 6.0.0-alpha.1 und Bootstrap Icons 1.11.3). Nur Links zu Quellen und Anlaufstellen öffnen externe Seiten, und nur wenn du sie antippst.')}
      ${item('Du hast die Kontrolle.', 'Backup, lesbarer Datenexport und das Löschen aller Daten findest du direkt in den Einstellungen.')}
      ${item('Die PIN schützt vor neugierigen Blicken.', 'Eine PIN sperrt die ganze App. Sie verschlüsselt die Daten nicht. Mach deshalb regelmäßig ein Backup.')}
      ${item('Teilen ist freiwillig.', 'Der Teilen-Knopf verschickt nur den Link zur App. Wunschzettel, Tagebuch und Exporte gibst du selbst weiter, wenn du möchtest.')}
      ${item('Gesundheitsdaten sind besonders sensibel.', 'Sie verlassen dein Gerät nur, wenn du selbst ein Backup oder einen Export weitergibst.')}
    </ul></div>
    <h2>Was gerade gespeichert ist</h2>
    <div class="card"><div class="hstack gap-2 flex-wrap">${counts.map(([l, n]) => `<span class="chip">${esc(l)}: ${n}</span>`).join('')}</div><p class="small soft mt-2 mb-0">Ungefähre Größe der Daten ohne Fotos: ${approx} KB. Fotos liegen zusätzlich im Gerätespeicher.</p></div>
    <h2>Deine Möglichkeiten</h2>
    <a class="card link-card" href="#/backup"><div class="hstack gap-3">${bi('shield-lock')}<div class="flex-grow-1"><b>Datensicherung</b><div class="small soft">Backup speichern, laden oder alles löschen</div></div>${bi('chevron-right')}</div></a>
    <a class="card link-card" href="#/export"><div class="hstack gap-3">${bi('box-arrow-up')}<div class="flex-grow-1"><b>Datenexport</b><div class="small soft">Alles lesbar mitnehmen</div></div>${bi('chevron-right')}</div></a>
    <a class="card link-card" href="#/applock"><div class="hstack gap-3">${bi('shield-lock-fill')}<div class="flex-grow-1"><b>App-Sperre</b><div class="small soft">Eine PIN für die ganze App</div></div>${bi('chevron-right')}</div></a>
    <p class="small soft">BABYLOVE ersetzt keine ärztliche oder Hebammen-Beratung. Bei Beschwerden: Frauenarzt oder Hebamme fragen, im Notfall 112.</p>
    <p class="version" id="appVersion">${esc(versionLine())}</p>`;
};
/* ==================== App installieren (PWA) ==================== */
// Fragt einmal freundlich nach, ob BABYLOVE als App auf den Startbildschirm soll. Nur im Browser, nie wenn schon installiert, höchstens dreimal im Abstand von 7 Tagen, jederzeit wieder in den Einstellungen.
let installEvt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; });
window.addEventListener('appinstalled', () => { installEvt = null; document.getElementById('installCta')?.remove(); if (typeof state !== 'undefined') { state.settings.installAsk = { ...(state.settings.installAsk || {}), done: true }; save(); } });
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const installPlatform = () => { const ua = navigator.userAgent || ''; if (/iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios'; return /Android/.test(ua) ? 'android' : 'desktop'; };
const INSTALL_BENEFITS = [
  ['lightning-charge-fill', 'Ein Tipp, und ihr seid drin', 'Das Symbol liegt auf dem Startbildschirm, wie bei jeder anderen App.'],
  ['wifi-off', 'Funktioniert auch ohne Internet', 'Perfekt für Funklöcher im Wartezimmer oder im Kreißsaal.'],
  ['phone', 'Mehr Platz, keine Browserleiste', 'Die App füllt den ganzen Bildschirm und fühlt sich richtig gut an.'],
  ['shield-check', 'Eure Daten bleiben bei euch', 'Die Installation ändert daran nichts. Alles bleibt auf diesem Gerät.']
];
const INSTALL_STEPS = {
  ios: ['Tippe unten in Safari auf das Teilen-Symbol, das Quadrat mit dem Pfeil nach oben.', 'Scrolle ein Stück und wähle „Zum Home-Bildschirm“.', 'Tippe oben rechts auf „Hinzufügen“. Fertig.'],
  android: ['Tippe oben rechts im Browser auf die drei Punkte.', 'Wähle „App installieren“ oder „Zum Startbildschirm hinzufügen“.', 'Bestätige mit „Installieren“. Fertig.'],
  desktop: ['Suche in der Adressleiste das Installieren-Symbol, einen Monitor mit Pfeil, oder öffne das Browser-Menü.', 'Wähle „BABYLOVE installieren“ oder „Seite als App installieren“.', 'Bestätige mit „Installieren“. Fertig.']
};
function showInstall(manual) {
  if (sheet.open) return;
  const plat = installPlatform(), s = state.settings, who = [s.mama, s.partner].filter(Boolean).map(esc).join(' &amp; ') || 'ihr zwei', can = !!installEvt;
  openSheet(`<div class="guide-head"><div class="guide-heart">${duoHearts()}</div><div class="guide-brand"><span data-brand-name>${esc(brandName())}</span> <i data-brand-by>${esc(brandSub())}</i></div>
    <h2>${manual ? 'App installieren' : `${who}, soll BABYLOVE auf euren Startbildschirm?`}</h2><p class="soft mb-0">Macht aus eurer Seite eine richtige App. Kostenlos, ohne App-Store und jederzeit wieder entfernbar.</p></div>
    <ol class="guide-list">${INSTALL_BENEFITS.map(([icon, title, text]) => `<li><div class="guide-ico">${bi(icon)}</div><div><b>${esc(title)}</b><p class="small soft mb-0">${esc(text)}</p></div></li>`).join('')}</ol>
    ${can ? '' : `<div class="install-steps"><b>So geht’s auf ${plat === 'ios' ? 'dem iPhone oder iPad' : plat === 'android' ? 'Android' : 'dem Computer'}</b><ol class="small mb-0">${INSTALL_STEPS[plat].map(t => `<li>${esc(t)}</li>`).join('')}</ol></div>`}
    ${can ? `<button class="btn btn-solid theme-primary w-100 mt-2" id="instGo" type="button">${bi('download')} Jetzt installieren</button>` : ''}
    ${manual ? `<button class="btn ${can ? 'btn-text' : 'btn-solid theme-primary'} w-100 mt-2" id="instClose" type="button">Schließen</button>`
      : `<div class="hstack gap-2 mt-2"><button class="btn btn-subtle theme-secondary flex-grow-1" id="instLater" type="button">Später erinnern</button><button class="btn btn-text flex-grow-1" id="instNever" type="button">Nicht mehr fragen</button></div>`}`, el => {
    const ask = () => state.settings.installAsk || {};
    $('#instGo', el)?.addEventListener('click', async () => { const ev = installEvt; installEvt = null; closeSheet(); try { await ev.prompt(); const r = await ev.userChoice; if (r && r.outcome === 'accepted') toast('BABYLOVE ist installiert. Viel Freude damit!'); } catch { /* Abbruch */ } });
    $('#instClose', el)?.addEventListener('click', closeSheet);
    $('#instLater', el)?.addEventListener('click', closeSheet); $('#instNever', el)?.addEventListener('click', () => { state.settings.installAsk = { ...ask(), never: true }; save(); closeSheet(); toast('Alles klar, wir fragen nicht mehr. In den Einstellungen findet ihr „App installieren“ jederzeit.'); });
  });
  if (!manual) { const a = state.settings.installAsk || {}; state.settings.installAsk = { ...a, at: iso(today()), n: (a.n || 0) + 1 }; save(); }
}
function maybeInstall() {
  const s = state.settings, a = s.installAsk || {};
  if (!s.dueDate || !s.guideSeen || a.never || a.done || (a.n || 0) >= 3 || isStandalone() || !window.isSecureContext || appLocked || $('#splash') || sheet.open) return;
  if (a.at && daysSince(a.at) < 7) return;
  try { if (sessionStorage.getItem('bl-install')) return; sessionStorage.setItem('bl-install', '1'); } catch { /* ohne Speicher trotzdem fragen */ }
  showInstall(false);
}
// Startseite: dauerhafter, ruhiger Hinweis zum Installieren, solange die App nicht installiert ist (viele suchen in den Einstellungen nie danach)
const installNeeded = () => !isStandalone() && !(state.settings.installAsk || {}).done;
const installCtaHTML = () => installNeeded() ? `<button type="button" class="install-cta" id="installCta" aria-haspopup="dialog"><span class="ic-ico" aria-hidden="true">${bi('download')}</span><span class="ic-text"><b>Mir gefällt die App, ich möchte sie installieren</b><small>Ein Tipp, und BABYLOVE liegt auf eurem Startbildschirm. Kostenlos, auch ohne Internet.</small></span><i class="bi bi-chevron-right ic-go" aria-hidden="true"></i></button>` : '';
const bindInstallCta = () => { const b = document.getElementById('installCta'); if (b) b.onclick = () => showInstall(true); };
/* ==================== Kurzanleitung: sofort verstehen ==================== */
// Erscheint einmal nach dem Einrichten, ist jederzeit in den Einstellungen wieder erreichbar.
// Seite neu laden (als eigene Funktion, damit Tests das Neuladen abfangen können)
function reloadApp() { location.reload(); }
const GUIDE_STEPS = [
  ['house-heart-fill', 'Unten wohnt das Wichtigste', 'Heute ist euer Überblick, dazu das gemeinsame Tagebuch und das Fotoalbum. Daneben hat jede und jeder ein eigenes Plätzchen mit Namen und Foto.'],
  ['grid-fill', 'Oben rechts wartet alles Weitere', 'Teilen, die Schatzkiste mit allen Funktionen und die Einstellungen, dort auch Farben, Schrift und Hell oder Dunkel. Und wenn ihr euch mal verlauft: Das Häuschen mit Herz bringt euch immer nach Hause.'],
  ['people-fill', 'Jeder weiß, was für ihn ist', 'Jede Seite trägt ein kleines Schild: Mama, Papa oder Gemeinsam. Gemeinsam erkennt ihr an den zwei Herzen in euren Lieblingsfarben.'],
  ['shield-check', 'Alles bleibt bei euch', 'Eure Erinnerungen liegen nur auf diesem Gerät. Mit der PIN schützt ihr sie, mit dem Backup sichert ihr sie.'],
  ['stars', 'Jeden Tag ein Lächeln', 'Täglich neue Sprüche, Ideen und kleine Aufgaben machen Mut. Schaut gemeinsam rein: Zu zweit macht es doppelt Freude.']
];
function showGuide() {
  if (sheet.open) return;
  const s = state.settings, who = [s.mama, s.partner].filter(Boolean).map(esc).join(' &amp; ') || 'ihr zwei';
  openSheet(`<div class="guide-head"><div class="guide-heart">${duoHearts()}</div><div class="guide-brand"><span data-brand-name>${esc(brandName())}</span> <i data-brand-by>${esc(brandSub())}</i></div><h2>Willkommen, ${who}!</h2><p class="soft mb-0">Schön, dass ihr da seid. Hier ist euer kleiner Wegweiser: In einer Minute wisst ihr, wo alles wohnt.</p></div>
    <ol class="guide-list">${GUIDE_STEPS.map(([icon, title, text]) => `<li><div class="guide-ico">${bi(icon)}</div><div><b>${esc(title)}</b><p class="small soft mb-0">${esc(text)}</p></div></li>`).join('')}</ol>
    <p class="guide-cheer">Ihr macht das schon jetzt wunderbar. Wir begleiten euch Schritt für Schritt.</p>
    <button class="btn btn-solid theme-primary w-100 mt-2" id="guideOk" type="button">Los geht’s, wir freuen uns!</button>`, el => {
    $('#guideOk', el).onclick = () => { state.settings.guideSeen = true; save(); closeSheet(); cheer('save'); };
  });
  sheet.addEventListener('close', () => { if (!state.settings.guideSeen) { state.settings.guideSeen = true; save(); } }, { once: true });
}function maybeGuide() { if (state.settings.dueDate && !state.settings.guideSeen && !appLocked && !$('#splash') && !sheet.open) showGuide(); }