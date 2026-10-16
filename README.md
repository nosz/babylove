# BABYLOVE

Schwangerschaftsbegleiter als installierbare Web-App (PWA). Ohne Build, ohne Server, ohne Konto. Alle Daten bleiben auf dem Gerät.

Adresse nach der Veröffentlichung: <https://nosz.github.io/babylove/>

## Veröffentlichen auf GitHub Pages

Voraussetzung: GitHub-Konto `nosz`. Anmelden nur im Browser oder über den Git Credential Manager, niemals Passwörter oder Tokens in Chats, Tickets oder Dateien ablegen.

1. Auf GitHub ein neues Repository mit dem Namen **`babylove`** anlegen (Konto `nosz`, öffentlich, ohne README).
   Der Name bestimmt den Pfad: `nosz.github.io/babylove/`.
2. Den **Inhalt** dieses Ordners ins Hauptverzeichnis des Repositories legen (nicht den Ordner `BABYLOVE` selbst).
   Dazu gehören `index.html`, `sw.js`, `manifest.webmanifest`, `styles.css`, die vier Skripte, `icons/`, `vendor/` und `.nojekyll`.
   Der Ordner `tests/` darf mit, ist aber nicht nötig (er enthält nur Beispielnamen).
3. Im Repository: **Settings → Pages → Build and deployment**: Source *Deploy from a branch*, Branch `main`, Ordner `/ (root)`, speichern.
4. Ein bis zwei Minuten warten, dann <https://nosz.github.io/babylove/> öffnen.
5. Prüfen (siehe Checkliste unten).

## Checkliste nach dem Veröffentlichen

- Seite lädt ohne Fehler, Symbole und Schrift erscheinen (keine Pfade mit `/` am Anfang, alles ist relativ).
- Handy (Android/Chrome): beim ersten Start erscheint nach der Kurzanleitung die Frage nach der Installation.
- iPhone (Safari): Teilen-Symbol, dann „Zum Home-Bildschirm“. Die App erklärt das selbst.
- Flugmodus einschalten und App öffnen: sie muss offline starten.
- Link-Vorschau: Adresse in WhatsApp oder Teams senden. Bei alten Vorschauen den Cache der Plattform leeren (z. B. Facebook Sharing Debugger).
- Die Link-Vorschau zeigt immer „BABYLOVE by Sarah“. Der eigene App-Name gilt nur in der App selbst, weil die Vorschau statisch ist.

## Mehrere Apps unter nosz.github.io

Jede App bekommt ein eigenes Repository und damit einen eigenen Pfad (`/app1/`, `/app2/`, `/babylove/`). BABYLOVE ist darauf vorbereitet:

- Der Service Worker gilt nur für `/babylove/` und löscht ausschließlich eigene Caches (Präfix `babylove-`).
- Manifest, Startadresse und App-Kennung sind relativ und zeigen auf den eigenen Ordner. Jede App wird getrennt installiert.
- Browser-Speicher (localStorage, IndexedDB) gehört zur Domain, nicht zum Pfad. BABYLOVE nutzt deshalb eindeutige Namen (`babylove:v1`, Datenbank `babylove`). Andere Apps auf derselben Domain sollten eigene Präfixe verwenden und nie fremde Schlüssel lesen.
- Wichtig: Die Daten einer App sind für andere Apps derselben Domain technisch lesbar. Keine fremden Skripte in den Ordner einbinden.

## Neue Version ausliefern

1. Versionsnummer an drei Stellen gleich ändern: `APP_VERSION` in `content.js`, `VERSION` in `sw.js`, `application-version` in `index.html`.
2. Änderungen ins Repository pushen.
3. Geräte holen die neue Version beim nächsten Öffnen im Hintergrund, beim zweiten Öffnen ist sie aktiv.

## Tests lokal ausführen

Ordner über einen beliebigen lokalen Webserver bereitstellen (zum Beispiel `http://localhost:8080/`) und `tests/index.html` öffnen. Alle Tests laufen im Browser, es wird nichts installiert.

## Hinweise

- Inhalte zu Gesundheit und Ernährung stammen aus allgemeinen Quellen und ersetzen keine ärztliche oder Hebammen-Beratung.
- Notrufnummern und Anlaufstellen ohne Gewähr, bitte vor Veröffentlichung für eure Region prüfen.
