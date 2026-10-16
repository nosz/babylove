// Inhalte: Größenvergleiche sind grobe Richtwerte und ersetzen keine ärztliche Beratung.
const FRUITS = {
  4: ['', 'Mohnsamen'], 5: ['', 'Sesamkorn'], 6: ['', 'Linse'], 7: ['', 'Heidelbeere'],
  8: ['', 'Himbeere'], 9: ['', 'Kirsche'], 10: ['', 'Kumquat'], 11: ['', 'Feige'],
  12: ['', 'Limette'], 13: ['', 'Zitrone'], 14: ['', 'Pfirsich'], 15: ['', 'Apfel'],
  16: ['', 'Avocado'], 17: ['', 'Birne'], 18: ['', 'Paprika'], 19: ['', 'Mango'],
  20: ['', 'Banane'], 21: ['', 'Karotte'], 22: ['', 'Papaya'], 23: ['', 'Grapefruit'],
  24: ['', 'Maiskolben'], 25: ['', 'Blumenkohl'], 26: ['', 'Salatkopf'], 27: ['', 'Brokkoli'],
  28: ['', 'Aubergine'], 29: ['', 'Butternusskürbis'], 30: ['', 'Kohlkopf'], 31: ['', 'Kokosnuss'],
  32: ['', 'Ananas'], 33: ['', 'große Ananas'], 34: ['', 'Honigmelone'], 35: ['', 'Honigmelone'],
  36: ['', 'Romanasalat'], 37: ['', 'Mangold'], 38: ['', 'Lauchstange'], 39: ['', 'Mini-Wassermelone'],
  40: ['', 'Wassermelone'], 41: ['', 'kleiner Kürbis'], 42: ['', 'kleiner Kürbis']
};

const DAILY = [
  'Du erschaffst gerade ein Menschlein. Dein Tagesziel „Wäsche falten“ darf warten.',
  'Heute schon gelobt worden? Hiermit: Du machst das großartig.',
  'Dein Körper leistet Schwerstarbeit – und sieht dabei auch noch göttlich aus.',
  'Drei Dinge für heute: Wasser trinken, Füße hochlegen, Schokolade nicht bereuen.',
  'Das Baby hört schon zu. Erzähl ihm ruhig, wie dein Tag war – es urteilt nicht.',
  'Einatmen, ausatmen. Ihr seid ein Team, auch wenn eins von euch gerade Schluckauf hat.',
  'Ein Mittagsschlaf ist keine Faulheit, sondern Bauprojekt-Management.',
  'Du musst nicht alles wissen. Niemand hat beim ersten Mal ein Handbuch bekommen.',
  'Heute ein Foto vom Bauch? Die Zukunft lacht dich später dankbar an.',
  'Kleine Schritte zählen. Auch der Weg zum Kühlschrank. Besonders der.',
  'Dein Baby kennt schon deine Stimme. Kein Druck, aber sing doch mal falsch – es liebt es.',
  'Heute ist ein guter Tag, um Papa zu sagen, wo es juckt. Er will helfen!',
  'Müde? Normal. Emotional? Normal. Heißhunger auf Gurken mit Honig? Auch normal.',
  'Du wächst über dich hinaus. Wortwörtlich.',
  'Ein kleiner Spaziergang tut Kopf und Kreislauf gut. Eis danach ist Pflicht.'
];

const MILESTONES = [
  [12, 'Das erste Drittel ist geschafft – das Risiko sinkt, die Vorfreude steigt!'],
  [20, 'Halbzeit! Ab jetzt zählt jeder Tag rückwärts.'],
  [28, 'Das dritte Trimester beginnt. Jetzt wird es richtig kuschelig.'],
  [37, 'Das Baby gilt ab jetzt als reif. Es darf kommen, wann es will – es hat bloß noch keinen Termin im Kalender.'],
  [40, 'Der Termin ist da! Das Baby liest aber keine Kalender. Geduld, Heldin.']
];

const MOODS = ['love', 'happy', 'tired', 'sad', 'sick', 'angry'];
const MOOD_LABEL = { love: 'verliebt', happy: 'gut', tired: 'müde', sad: 'sensibel', sick: 'übel', angry: 'genervt' };

const DEFAULT_TODOS = [
  'Frauenarzttermin vereinbaren', 'Folsäure / Vitamine nehmen', 'Hebamme suchen',
  'Geburtsvorbereitungskurs anmelden', 'Mutterschutz beim Arbeitgeber melden',
  'Kliniktasche packen', 'Babyzimmer / Schlafplatz vorbereiten', 'Autositz besorgen',
  'Elterngeld und Elternzeit beantragen', 'Krankenhaus oder Geburtshaus anmelden',
  'Geburtsplan schreiben', 'Namen aussuchen (und geheim halten)'
];

// Frankfurt: Einträge aus dem Wegweiser „Frühe Hilfen“ der Stadt Frankfurt (frankfurt.de), Stand der Recherche Okt. 2026.
// Kurstermine, Kosten und Öffnungszeiten ändern sich – bitte beim jeweiligen Träger prüfen.
const FFM_BASE = 'https://frankfurt.de/de-de/themen/soziales-und-gesellschaft/eltern-sein-in-frankfurt/fruehe-hilfen/wegweiser-fruehe-hilfen/fruehe-hilfen/angebote/';
const FFM_WEGWEISER = 'https://frankfurt.de/themen/soziales-und-gesellschaft/eltern-sein-in-frankfurt/fruehe-hilfen/wegweiser-fruehe-hilfen';
const FFM = [
  { icon: 'heart-pulse', title: 'Hebammenambulanz (SkF, Gallus)', url: FFM_BASE + 'h/2643',
    text: 'Kostenfreie Angebote laut Verzeichnis: Kurse zu Geburtsvorbereitung, Rückbildung und Babypflege sowie Hebammensprechstunde nach Terminvereinbarung. Dienstags ohne Termin im MoniKaffee.' },
  { icon: 'chat-heart', title: 'Schwangerschaftsberatung (SkF)', url: FFM_BASE + 's/2237',
    text: 'Beratung zu Schwangerschaft und Geburt, Pränataldiagnostik, vertraulicher Geburt. Auch in mehreren Sprachen, u. a. Spanisch, Russisch, Arabisch.' },
  { icon: 'cash-coin', title: 'Beratung zu Geld & Anträgen (SkF Gallus)', url: FFM_BASE + 's/2082',
    text: 'Hilfe zu Kindergeld, Kinderzuschlag, Elterngeld und Vermittlung finanzieller Beihilfe.' },
  { icon: 'chat-heart', title: 'Frauen- & Schwangerschaftsberatung (Caritas)', url: FFM_BASE + 'f/2432',
    text: 'Psychosoziale und sozialrechtliche Beratung in der Schwangerschaft und nach der Geburt bis zum 3. Lebensjahr des Kindes.' },
  { icon: 'people', title: 'Beratung in der Schwangerschaft (FamilienGesundheitsZentrum)', url: FFM_BASE + 'b/2412',
    text: 'Für alle Schwangeren, auch gemeinsam mit Partnerin oder Partner. Themen u. a. Frühgeburt, Kaiserschnitt, Fehlgeburt.' },
  { icon: 'moon-stars', title: 'Geburtsvorbereitung am Abend (FamilienGesundheitsZentrum, GfG)', url: FFM_BASE + 'g/2379',
    text: 'Kurs für Paare am Abend.' },
  { icon: 'sun', title: 'Geburtsvorbereitung am Wochenende (FamilienGesundheitsZentrum, GfG)', url: FFM_BASE + 'g/2377',
    text: 'Für Paare und alleinstehende Frauen, laut Verzeichnis auch bei geplantem Kaiserschnitt geeignet.' },
  { icon: 'house-heart', title: 'Infoabende zur Geburtshilfe (Geburtshaus Frankfurt)', url: FFM_BASE + 'i/2127',
    text: 'Jeden 2. und 4. Mittwoch im Monat, 20:00 bis ca. 22:00 Uhr. Laut Verzeichnis ohne Anmeldung.' },
  { icon: 'balloon-heart', title: 'Babylotse (Kinderschutzbund)', url: FFM_BASE + 'b/2482',
    text: 'Auf den Entbindungsstationen aller Frankfurter Geburtskliniken erreichbar; informiert über Angebote für Eltern Neugeborener.' },
  { icon: 'rainbow', title: 'Frühförderung & Frühberatung (Lebenshilfe)', url: FFM_BASE + 'f/2435',
    text: 'Begleitung von Familien ab Geburt bis zum Schuleintritt, z. B. bei Frühgeburt oder Entwicklungsverzögerung.' }
];

const FFM_TIPS = [
  'Hebamme früh suchen: Laut Presseberichten ist es in Frankfurt schwierig, eine Hebamme zu finden. Fang direkt nach dem positiven Test an.',
  'Kurse nicht auf die lange Bank schieben: Beliebte Geburtsvorbereitungskurse sind oft früh ausgebucht. Anmeldung am besten im 1. Trimester anfragen.',
  'Geburtsklinik ansehen: Frag bei den Kliniken deiner Wahl nach Infoabenden, Kreißsaalführungen und Anmeldung zur Geburt. Die Regeln unterscheiden sich je Klinik.',
  'Beratung ist vertraulich: Schwangerenberatungen sind in der Regel kostenfrei und eine gute erste Anlaufstelle für Anträge (Elterngeld, Mutterschaftsgeld).',
  'Nach der Geburt: Der Babylotse auf der Station kennt Frankfurter Angebote für die erste Zeit zu Hause.'
];

// Für den Partner: motivierend und mit einem Augenzwinkern
const DAILY_PARTNER = [
  'Heute ungefragt Füße massieren. Kein Kommentar, keine Bedingung. Du bist der MVP.',
  'Frag nicht „Was kann ich tun?“, sondern mach einfach: Abendessen kochen, Wäsche waschen, Held sein.',
  'Sie hat Heißhunger auf etwas Seltsames? Du bist jetzt offiziell Lieferdienst. Stolz drauf sein!',
  'Sprich heute mit dem Bauch. Das Baby kennt deine Stimme bald besser als deine Witze.',
  'Lob wirkt Wunder. Sag ihr heute, dass sie großartig aussieht. Ehrlich gemeint, bitte.',
  'Übe schon mal Windeln wechseln. Eine Puppe beschwert sich wenigstens nicht.',
  'Geh mit zum Termin, auch wenn es nur „nichts Neues“ gibt. Dabeisein zählt.',
  'Hormone sind keine Launen, sondern Wetterlagen. Du hast Regenschirm und Schokolade dabei.',
  'Wann hast du zuletzt gesagt: „Ich freu mich auf euch“? Heute wäre ein guter Tag.',
  'Bau etwas zusammen, das keine Anleitung hat. Oder doch: Die Wiege hat eine. Lies sie diesmal.',
  'Papa-Training: Ruhe bewahren, Lächeln, Kaffee. Du schaffst das.',
  'Nimm ihr heute eine Aufgabe ab, die sie nicht erwähnt hat. Extrapunkte!'
];

const CHEERS = [
  'Gespeichert! Du rockst das.', 'Notiert. Deine Zukunft sagt danke.', 'Gespeichert, Heldin!',
  'Erledigt – und das mit einem Baby an Bord.', 'Wunderbar. Weiter so!', 'Drin. Dein Baby wäre stolz auf dich.'
];
const TODO_CHEERS = [
  'Abgehakt! Du bist eine Maschine.', 'Check! Das Baby klatscht (innerlich).', 'Wieder einer weniger. Wahnsinn!',
  'Erledigt. Zeit für einen Keks?', 'Läuft bei euch!'
];

// Meilensteine zum Abhaken, mit Datum, Notiz und Foto
const MEILENSTEINE = [
  ['test', 'Positiver Test', 'emoji-smile'], ['herz', 'Herzschlag gehört', 'heart-pulse'],
  ['us1', 'Erster Ultraschall', 'camera-video'], ['familie', 'Familie & Freunde eingeweiht', 'people'],
  ['bauch', 'Babybauch wird sichtbar', 'balloon-heart'], ['tritt', 'Erster Tritt gespürt', 'lightning-charge'],
  ['geschlecht', 'Geschlecht oder Überraschung geklärt', 'gift'], ['zimmer', 'Babyzimmer fertig', 'house-heart'],
  ['tasche', 'Kliniktasche gepackt', 'bag-heart'], ['mutterschutz', 'Mutterschutz beginnt', 'cup-hot']
];

// Partner-Modus
const PARTNER_TIPS = {
  1: ['Übelkeit ist real. Halte Zwieback, Ingwertee und Verständnis bereit.', 'Übernimm Gerüche: Mülleimer, Katzenklo und Fischgerichte sind jetzt dein Revier.', 'Geh zu Terminen mit. Der erste Herzschlag ist ein Moment für euch beide.', 'Hör zu, ohne Lösungen zu liefern. Manchmal reicht ein „Ich bin da“.'],
  2: ['Jetzt geht’s oft besser: Plant ein Date, bevor die Nächte kurz werden.', 'Sprich mit dem Bauch. Ab ca. der 20. Woche hört das Baby dich.', 'Fang mit dem Kinderzimmer an, aber nur mit ihr abgestimmt. Farben sind Verhandlungssache.', 'Macht zusammen einen Geburtsvorbereitungskurs. Atmen üben ist peinlich, aber hilfreich.'],
  3: ['Kliniktasche mitprüfen und Route zur Klinik einmal testfahren. Mit Parkplatz.', 'Rückenmassage ist jetzt Gold wert. Handy weg, Hände ran.', 'Halte Telefon und Auto bereit. Das Baby kennt deinen Terminkalender nicht.', 'Lerne die Wehenzeichen, damit du nicht „Alles gut?“ fragst, sondern „Wohin?“.']
};
const PARTNER_MISSIONS = [
  'Koche heute Abend, ohne gefragt zu werden.', 'Schreib ihr einen Zettel mit drei Dingen, die du an ihr bewunderst.',
  'Mach ein Foto vom Bauch mit euch beiden.', 'Lies in einem Ratgeber ein Kapitel, das sie noch nicht gelesen hat.',
  'Plane einen Abend nur für euch: Film, Snacks, Füße hoch.', 'Räum die Wohnung auf, bevor sie es bemerkt.',
  'Nimm dir 10 Minuten, um dem Baby etwas vorzulesen.', 'Frag: „Was brauchst du heute am meisten?“ und mach genau das.'
];

// Checklisten (Vorlagen). Fristen und Ansprüche bei Behörden: bitte bei Krankenkasse, Arbeitgeber/HR und Elterngeldstelle klären.
const CHECKLISTS = {
  tasche: { title: 'Kliniktasche', icon: 'bag-heart', items: [
    'Mutterpass', 'Versichertenkarte und Personalausweis', 'Geburtsplan (falls vorhanden)', 'Bequeme Kleidung / Nachthemd',
    'Dicke Socken und Hausschuhe', 'Stillbüstenhalter und Stilleinlagen', 'Kulturbeutel und Haargummis', 'Handy und Ladekabel',
    'Snacks und Getränke', 'Babykleidung: Body, Mütze, Strampler, Decke', 'Autositz fürs Heimfahren', 'Für den Partner: Wechselkleidung, Snacks, Ladekabel'] },
  ausstattung: { title: 'Erstausstattung', icon: 'basket2', items: [
    'Schlafplatz (Beistellbett oder Babybett) mit Matratze', 'Schlafsack', 'Wickelauflage und Wickelplatz', 'Windeln und Feuchttücher',
    'Bodys und Strampler', 'Mützchen und Söckchen', 'Kinderwagen oder Tragetuch', 'Babyautositz', 'Babybadewanne und Handtuch',
    'Spucktücher', 'Fieberthermometer', 'Babyphone'] },
  behoerden: { title: 'Behörden & Anträge', icon: 'file-earmark-text', items: [
    'Schwangerschaft dem Arbeitgeber mitteilen', 'Mutterschutz mit Arbeitgeber / HR und Krankenkasse klären',
    'Mutterschaftsgeld bei der Krankenkasse beantragen', 'Elternzeit beim Arbeitgeber anmelden', 'Elterngeld beantragen',
    'Geburtsurkunde beim Standesamt beantragen', 'Kindergeld beantragen', 'Baby bei der Krankenkasse anmelden',
    'Falls zutreffend: Vaterschaftsanerkennung / Sorgeerklärung'] }
};

const EMERGENCY = [
  ['112', 'Notruf (Rettungsdienst, Feuerwehr)'], ['116117', 'Ärztlicher Bereitschaftsdienst (außerhalb der Sprechzeiten)'],
  ['0800 4040020', 'Hilfetelefon „Schwangere in Not“ (kostenfrei, anonym)'], ['116016', 'Hilfetelefon „Gewalt gegen Frauen“']
];

const FOOD = {
  avoid: [
    ['Alkohol', 'Es gibt keine sichere Menge. Am besten ganz weglassen.'],
    ['Rohmilch und Rohmilchprodukte', 'Auch Weichkäse mit Rotschmiere oder Schimmel sowie Rohmilchkäse meiden (Listerien).'],
    ['Rohes oder nicht durchgegartes Fleisch', 'Hackfleisch, Mett, Rohwurst, Carpaccio (Toxoplasmose, Listerien).'],
    ['Roher, geräucherter oder gebeizter Fisch', 'Sushi, Räucherlachs, Graved Lachs (Listerien). Durchgegarter Fisch ist okay.'],
    ['Rohe Eier', 'Zum Beispiel in selbstgemachter Mayonnaise oder Tiramisu (Salmonellen).'],
    ['Viel Koffein und Energydrinks', 'Kaffee in Maßen, Energydrinks besser meiden. Konkrete Menge mit Frauenarzt oder Hebamme besprechen.'],
    ['Leber', 'Nur selten und in kleinen Mengen, wegen viel Vitamin A.']
  ],
  good: [
    ['Gut durcherhitzte Speisen', 'Kochen, Braten und Backen töten Keime ab, wenn der Kern mindestens 2 Minuten über 70 °C erreicht.'],
    ['Pasteurisierte Milchprodukte', 'Joghurt, Quark, Frischkäse, Hartkäse aus pasteurisierter Milch.'],
    ['Obst und Gemüse, gründlich gewaschen', 'Besonders bodennah Gewachsenes gut waschen (Toxoplasmose).'],
    ['Vollkorn, Hülsenfrüchte, Nüsse', 'Sättigend und nährstoffreich.'],
    ['Durchgegarter Fisch', 'Liefert Jod und Omega-3. Frag nach Fischarten, die für Schwangere geeignet sind.'],
    ['Wasser und ungesüßte Getränke', 'Bei Kräutertees kurz bei Hebamme oder Frauenarzt nachfragen.']
  ],
  hygiene: 'Katzenkot meiden (Katzenklo lieber den Partner übernehmen lassen), Hände vor dem Essen und nach der Gartenarbeit waschen.',
  recipes: [
    ['Overnight Oats mit Beeren', 'Haferflocken, pasteurisierter Joghurt oder Milch, gewaschene Beeren, ein Löffel Nussmus. Über Nacht quellen lassen.'],
    ['Linsensuppe', 'Rote Linsen mit Möhre, Zwiebel und Gemüsebrühe gut durchkochen. Zitrone und Petersilie zum Schluss.'],
    ['Ofengemüse mit Feta aus pasteurisierter Milch', 'Süßkartoffel, Paprika, Zucchini im Ofen rösten, Feta (pasteurisiert) darüber, kurz überbacken.'],
    ['Lachs aus dem Ofen', 'Lachsfilet durchgegart (Kern über 70 °C) mit Zitrone, dazu Kartoffeln und Brokkoli.'],
    ['Guacamole-Brot', 'Reife Avocado zerdrücken, Limette, Salz, auf Vollkornbrot. Schnell, sättigend, ohne Kochen.']
  ]
};

const MOVE = {
  general: 'Als Richtwert nennt der Berufsverband der Frauenärzte etwa 150 Minuten moderate Bewegung pro Woche, „Gesund ins Leben“ mindestens 30 Minuten an möglichst vielen Tagen. Das gilt für gesunde Schwangere ohne Komplikationen. Sprich vorher mit Frauenarzt oder Hebamme.',
  good: ['Spazierengehen', 'Schwimmen und Aquafitness', 'Radfahren (entspannt)', 'Sanftes Yoga oder Pilates für Schwangere'],
  tri: {
    1: ['Fast alle Sportarten sind möglich, außer Extrem- und Kampfsport.', 'Hohe Stoßbelastung und ruckartige Bauchbewegungen vermeiden.', 'Müde? Dann zählt der kurze Spaziergang als Erfolg.'],
    2: ['Rückenlage vermeiden.', 'Ab der 20. SSW keine Sit-ups, Crunches und Drehbewegungen.', 'Schwimmen und Yoga fühlen sich jetzt oft besonders gut an.'],
    3: ['Intensität deutlich senken.', 'Übungen im Vierfüßlerstand, in Seitenlage, im Stehen oder Sitzen sind angenehmer.', 'Auf den Kreislauf achten, langsam aufstehen.']
  },
  pelvic: 'Beckenbodentraining: Lass dir die Technik am besten von Hebamme oder Physiotherapie zeigen. Eine gute Anlaufstelle sind Geburtsvorbereitungs- und Rückbildungskurse.'
};

// Farbwelten: zarte Pastellflächen, aber ausreichend dunkle Primärfarben (Weiß auf Primär >= 4,5:1).
// Dunkelmodus wird in app.js aus dem Farbton der Primärfarbe abgeleitet.
const THEME_DEFS = {
  rose:     { name: 'Altrosa',      bg: '#FBF4F2', s2: '#F4E6E3', line: '#E8D6D2', text: '#3A2C2D', soft: '#6E5A59', primary: '#AE5F6A', strong: '#8B4752', accent: '#E3B27A' },
  coral:    { name: 'Koralle',      bg: '#FFF5F2', s2: '#FBE5DF', line: '#F1D0C8', text: '#3D2B28', soft: '#74574F', primary: '#B9553F', strong: '#963F2C', accent: '#8FB3A0' },
  peach:    { name: 'Pfirsich',     bg: '#FFF6EF', s2: '#FBE9DC', line: '#F0D9C8', text: '#3B2E27', soft: '#6F5A4E', primary: '#AC5C38', strong: '#8A4526', accent: '#9DB8A8' },
  mauve:    { name: 'Malve',        bg: '#FAF3F6', s2: '#F1E3EA', line: '#E5D2DB', text: '#35272F', soft: '#6A5463', primary: '#A0537A', strong: '#7F3D5E', accent: '#D9B67C' },
  lavender: { name: 'Lavendel',     bg: '#F7F4FB', s2: '#ECE6F5', line: '#DFD6EC', text: '#2E2837', soft: '#625872', primary: '#7660A0', strong: '#5B4780', accent: '#E8B97A' },
  sky:      { name: 'Himmelblau',   bg: '#F2F7FB', s2: '#E3EDF6', line: '#D3E1EE', text: '#232F3B', soft: '#536475', primary: '#4A7AA8', strong: '#365F87', accent: '#EDBF7D' },
  sage:     { name: 'Salbei',       bg: '#F4F7F2', s2: '#E6EDE2', line: '#D6E0D1', text: '#263026', soft: '#556556', primary: '#4F7659', strong: '#3A5C44', accent: '#E0B574' },
  sand:     { name: 'Sand & Creme', bg: '#FAF6EE', s2: '#F1E8D6', line: '#E6DAC1', text: '#38301F', soft: '#665B40', primary: '#85693A', strong: '#665027', accent: '#8FB3A0' }
};

// Weitere Sprüche für den Partner (zufällig, ohne Wiederholung)
DAILY_PARTNER.push(
  'Du bist nicht „der Mann an ihrer Seite“, du bist Co-Pilot. Und der Co-Pilot bringt Snacks.',
  'Heute schon gefragt, wie es dem Rücken geht? Die ehrliche Antwort ist ein Gespräch wert.',
  'Windeln, Schlafmangel, Dauerliebe: Das Training hat begonnen. Du bist jetzt schon besser als gestern.',
  'Wenn sie sagt „Ich brauche nichts“, meint sie meistens Eis. Frag nach der Sorte.',
  'Zwei Menschen, ein Baby, null Anleitung. Das wird großartig und ein bisschen chaotisch.',
  'Räum die Spülmaschine ein, bevor jemand bittet. Das ist die romantischste Geste des Tages.',
  'Mach ein Foto vom Bauch. In 20 Jahren lachen alle darüber, wie klein er noch war.',
  'Du musst nicht alles können. Du musst nur da sein und wissen, wo die Notfall-Schokolade liegt.',
  'Dein Beitrag zählt: Händchen halten, Tasche tragen, Nerven behalten. Heldenarbeit!',
  'Lern jetzt, wie der Kinderwagen zusammenklappt. In der Praxis hast du dafür genau 4 Sekunden und 3 Zuschauer.',
  'Bring ihr heute ein Glas Wasser, bevor sie fragt. Bonuspunkte gibt es für eine Zitronenscheibe.',
  'Heute ein kleines Kompliment? „Du leuchtest“ gewinnt gegen „Du siehst müde aus“. Immer.',
  'Das Baby tritt? Leg die Hand auf den Bauch und sag Hallo. Es hat deine Stimme schon gespeichert.',
  'Hormonachterbahn ahoi! Du musst nicht lenken, nur festhalten und Ruhe ausstrahlen.',
  'Plane den Weg zur Klinik so, dass du ihn blind fährst. Navi ausgefallen? Egal, du hast geübt.',
  'Lächeln, Zuhören, Zwieback reichen. Mehr braucht es manchmal nicht.',
  'Dein Kind bekommt gerade den besten Papa, den es sich wünschen kann. Zeit, das auch zu glauben.',
  'Mach heute eine Sache, auf die du später stolz erzählen kannst: Spaziergang zu zweit, Kochen, Bauchmusik.',
  'Sag ihr heute: „Ich bin stolz auf dich.“ Kein „aber“, kein „und“. Einfach so.',
  'Schlafen ist der neue Luxus. Genieß die Nacht, solange sie dir noch gehört.',
  'Wer morgens Brötchen holt, ohne dass jemand fragt, hat schon halb gewonnen.',
  'Frag nicht nur nach dem Baby. Frag auch: „Und wie geht es dir?“'
);

// Stimmungs-Emojis (gespeichert) -> Icons (angezeigt)
const MOOD_ICON = { love: 'emoji-heart-eyes', happy: 'emoji-smile', tired: 'moon-stars', sad: 'emoji-frown', sick: 'emoji-dizzy', angry: 'emoji-angry' };
// Schriftgröße der App (Prozent der Basisschrift)
// Schriftarten: nur Systemschriften, die auf Windows, macOS, iOS, Android und Linux schon vorhanden sind (kein Download, funktioniert offline, nichts wird übertragen)
const FONT_FAMILIES = {
  soft:     { label: 'Weich', note: 'Standard der App', stack: 'ui-rounded, "Nunito", "Segoe UI", system-ui, -apple-system, sans-serif' },
  clear:    { label: 'Klar', note: 'Schlicht und modern', stack: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
  friendly: { label: 'Freundlich', note: 'Offen und warm', stack: '"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", Tahoma, sans-serif' },
  readable: { label: 'Gut lesbar', note: 'Große Buchstaben, weiter Abstand', stack: 'Verdana, Geneva, "DejaVu Sans", sans-serif' },
  book:     { label: 'Buch', note: 'Klassisch mit Serifen', stack: 'Georgia, "Times New Roman", Times, serif' },
  classic:  { label: 'Elegant', note: 'Feine Serifenschrift', stack: '"Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif' }
};
const FONT_SCALE = { min: 85, max: 140, step: 5, def: 100 };const FONT_SIZES = { s: { label: 'Klein', pct: '90%' }, m: { label: 'Normal', pct: '100%' }, l: { label: 'Groß', pct: '112.5%' }, xl: { label: 'Sehr groß', pct: '125%' } };
// Seiten-Icons für die Überschriften
const PAGE_ICON = { diary: 'journal-text', photos: 'images', planner: 'check2-square', more: 'grid-fill', partner: 'people-fill', letters: 'envelope-heart',
  names: 'tags', milestones: 'stars', wishes: 'gift', lists: 'bag-heart', food: 'egg-fried', move: 'bicycle', vits: 'capsule', water: 'droplet-half',
  contacts: 'telephone-fill', pass: 'journal-medical', baby: 'moon-stars', tips: 'geo-alt-fill', colors: 'palette2', backup: 'shield-lock',
  einstellungen: 'gear-fill', homeconfig: 'sliders', applock: 'shield-lock-fill', recipes: 'cookie', settings: 'person-heart', papa: 'person-fill' };


// Einkaufsliste (wird aus den Rezepten befüllt)
CHECKLISTS.einkauf = { title: 'Einkauf', icon: 'cart', items: [] };

// Motivierende Toasts je Situation
CHEERS.push('Gespeichert. Du machst das richtig gut.', 'Sicher verwahrt. Dein zukünftiges Ich sagt danke.', 'Das sitzt. Stark gemacht!', 'Notiert. Eine Sorge weniger im Kopf.');
const CHEER_POOLS = {
  save: CHEERS,
  add: ['Hinzugefügt. Gut mitgedacht!', 'Schon drin. Du bist organisiert wie ein Profi.', 'Notiert, damit du es nicht im Kopf tragen musst.', 'Neu dabei. Das sieht schon richtig gut aus.', 'Aufgenommen. Weiter so, ihr zwei!'],
  done: TODO_CHEERS,
  water: ['Schluck für Schluck: Dein Baby sagt Danke.', 'Frisch und klar. Weiter so!', 'Noch ein Glas, noch ein Pluspunkt.', 'Gut hydriert ist halb gewonnen.'],
  style: ['Sieht richtig schön aus.', 'Gute Wahl. Das passt zu euch.', 'Gefällt uns auch sehr gut.', 'Genau so fühlt es sich richtig an.'],
  fav: ['Gemerkt. Das schmeckt bestimmt.', 'Guter Geschmack! Kommt auf die Liste.', 'Lieblingsrezept in Sicht.'],
  photo: ['Schönes Foto! Das wird mal eine kostbare Erinnerung.', 'Im Kasten. Der Bauch sagt Cheese.', 'Dein Album wächst, genau wie dein Baby.', 'Foto gespeichert. Das sieht richtig gut aus.']
};
// Mehr humorvolle, motivierende Papa-Tipps (je Trimester, es wird immer nur einer gezeigt)
PARTNER_TIPS[1].push(
  'Dein Job im ersten Trimester: Zwieback anreichen, Gerüche ertragen, Held sein. Du bist schon jetzt im Dauereinsatz und das macht dich großartig.',
  'Wenn sie sagt „Alles riecht schlimm“, ist das kein Rätsel, sondern Schwangerschaft. Nicken, Fenster auf, Tee kochen.',
  'Du darfst auch aufgeregt sein. Gib es zu, sie weiß es sowieso. Gemeinsam zittern ist besser als allein cool tun.',
  'Lerne die Wörter „Pause“, „Wasser“ und „Ich mach das“. Mehr Wortschatz brauchst du die nächsten Wochen kaum.',
  'Bring ihr heute Obst in mundgerechten Stücken, ohne zu fragen. Das ist Romantik auf Papa-Niveau.',
  'Dein Baby ist gerade winzig, verändert aber schon euer ganzes Leben. Und du bist mittendrin. Mehr Motivation geht kaum.'
);
PARTNER_TIPS[2].push(
  'Jetzt ist die gute Phase: Nutzt sie für Pläne, Kurse und das Kinderzimmer. Du bist der Bauleiter, sie die Bauherrin.',
  'Bei der Möbelmontage gilt: Die Anleitung zu lesen ist keine Schwäche, sondern Beziehungsrettung.',
  'Fühle den ersten Tritt mit. Dieser Moment gehört nur euch und ist besser als jeder Pokal.',
  'Plant ein Babymoon: ein Wochenende zu zweit, bevor die Nächte kurz werden. Dein späteres Ich dankt dir.',
  'Nehmt euch einen Abend, um gemeinsam Namen zu sammeln. Veto-Recht gibt es nur bei „Cheeseburger“.',
  'Frag sie, was sie sich für die Geburt wünscht, und hör einfach zu. Das ist schon die halbe Vorbereitung.'
);
PARTNER_TIPS[3].push(
  'Jetzt zählt Verlässlichkeit: Handy laut, Tank voll, Tasche im Flur. Du bist der ruhige Pol im Sturm.',
  'Wenn sie nachts nicht schlafen kann, bleib einfach wach neben ihr. Das ist Papa-Training für die Zeit danach.',
  'Übe schon mal, mit einer Hand zu kochen. Bald hältst du dabei ein Baby.',
  'Die letzten Wochen sind anstrengend und wunderschön. Sei nett zu ihr, zu dir und zu den Nerven aller Beteiligten.',
  'Nimm ihr alles ab, was schwer ist, und lerne, wie man den Autositz wirklich einbaut. Mit Anleitung, bitte.',
  'Du wirst nicht perfekt sein, und das ist völlig okay. Da sein, geduldig sein und lieben reicht dem Baby vollkommen.'
);
// Druck- und Papa-Seiten
Object.assign(PAGE_ICON, { wishprint: 'printer', diaryprint: 'printer' });

// Täglich wechselnde Rang-Texte für den Papa (je Trimester, stabil pro Tag, nie zweimal derselbe in Folge)
const PAPA_RANK_TEXTS = {
  1: [
    'Du lernst gerade den Job. Kaffee kochen und Zuhören zählen schon als Überstunden.',
    'Dein Praktikum läuft hervorragend. Die Chefin ist zufrieden, das Baby ist begeistert.',
    'Heute auf dem Stundenplan: Zwieback reichen, Mut machen, Held sein.',
    'Jeder Profi hat mal klein angefangen. Du fängst gerade ziemlich groß an.',
    'Dein Gehalt: ein Lächeln, eine Umarmung und die ewige Dankbarkeit einer Schwangeren.',
    'Neue Aufgabe freigeschaltet: Gerüche ertragen, ohne das Gesicht zu verziehen. Du schaffst das.',
    'Du musst noch nichts können. Du musst nur da sein. Das machst du schon richtig gut.',
    'Das Baby hat noch keine Meinung zu dir. Aber es wird dich lieben. Versprochen.'
  ],
  2: [
    'Jetzt wird’s ernst und schön: Kinderzimmer, Kurse, erste Tritte. Du machst das stark.',
    'Dein Lehrjahr läuft: Möbel zusammenbauen, Namen sammeln, Nerven bewahren.',
    'Du bist offiziell nicht mehr Praktikant. Die Beförderung hast du dir verdient.',
    'Heute übst du: Windeln falten, Händchen halten und den Satz „Das schaffen wir“.',
    'Der erste Tritt ist deine Prüfung in Staunen. Bestanden mit Auszeichnung.',
    'Du wächst gerade mit: Aus Mann wird Papa, Schritt für Schritt.',
    'Wer jetzt Pläne schmiedet, hat später weniger Panik. Weiter so!',
    'Zwischenzeugnis: Einsatz sehr gut, Humor sehr gut, Geduld ausbaufähig. Das kommt noch.'
  ],
  3: [
    'Die Zielgerade! Tasche gepackt, Route getestet, Nerven wie Drahtseile. Du bist bereit.',
    'Kapitän an Deck: Das Schiff ist startklar, die Crew ist aufgeregt, der Hafen ist nah.',
    'Noch ein bisschen Geduld. Gleich gibt es den schönsten Passagier der Welt.',
    'Heute: Handy laut, Tank voll, Ruhe bewahren. Du bist der Fels in der Brandung.',
    'Du hast den Autositz eingebaut, ohne zu fluchen? Das ist Kapitänsniveau.',
    'Wenn es losgeht, atmest du tief durch, lächelst und fährst. Mehr musst du nicht können.',
    'Du bist bereit, auch wenn es sich nicht so anfühlt. Niemand fühlt sich bereit, und alle schaffen es.',
    'Gleich bist du Papa. Und das Baby bekommt genau den, den es braucht: dich.'
  ]
};
// Wer ist gemeint? Jede Seite ist für Mama, Papa oder gemeinsam (zwei Herzen) gekennzeichnet.
const PAGE_AUDIENCE = {
  home: 'together', photos: 'together', planner: 'together', more: 'together', letters: 'together', names: 'together', milestones: 'together', wishes: 'together', wishprint: 'together',
  lists: 'together', contacts: 'together', baby: 'together', tips: 'together', einstellungen: 'together', colors: 'together', backup: 'together', homeconfig: 'together', applock: 'together',
  diary: 'together', diaryprint: 'together', settings: 'mama', vits: 'mama', pass: 'mama', water: 'mama', food: 'mama', move: 'mama', recipes: 'mama',
  papa: 'papa', partner: 'papa'
};

// Motivierende und humorvolle Sprüche für die Wochenkarte (Mama), einer pro Tag, per Icon erneuerbar
const HERO_QUOTES = [
  'Du trägst gerade ein ganzes Universum. Natürlich darfst du müde sein.',
  'Jeder Tag bringt dich und dein Baby ein Stück näher zusammen.',
  'Du bist stärker, als du denkst, und weicher, als du zeigst.',
  'Heute reicht es, wenn du einfach du bist. Dein Baby liebt dich schon.',
  'Dein Körper leistet Höchstleistung. Gönn ihm eine Pause, er hat sie verdient.',
  'Atme tief ein, atme aus. Alles, was du gerade fühlst, ist völlig in Ordnung.',
  'Du musst nicht perfekt sein, um eine wunderbare Mama zu werden.',
  'Kleine Schritte zählen. Auch der Weg zum Sofa.',
  'Dein Baby hört dich. Sprich ruhig mit ihm, es findet dich großartig.',
  'Du wächst über dich hinaus, im besten Sinne.',
  'Heute ist ein guter Tag, um stolz auf dich zu sein.',
  'Schwangersein ist Teamarbeit: du, dein Baby und ganz viel Geduld.',
  'Wenn du heute Wasser trinkst und lächelst, hast du schon gewonnen.',
  'Deine Intuition weiß oft mehr als jedes Buch. Vertrau ihr.',
  'Du bist nicht müde, du baust gerade einen Menschen. Das ist Schwerstarbeit.',
  'Vergleiche dich nicht. Deine Schwangerschaft ist einzigartig, genau wie dein Baby.',
  'Freu dich auf alles, was kommt, und lach über alles, was schiefgeht.',
  'Jeden Tag wächst deine Mama-Superkraft ein kleines Stück.',
  'Auch Mamas in spe dürfen Hilfe annehmen. Besonders beim Schuheanziehen.',
  'Dein Baby kennt deinen Herzschlag. Er ist sein Lieblingslied.',
  'Heute schon gelacht? Dein Baby spürt, wenn du glücklich bist.',
  'Du hast schon so viel geschafft. Der Rest ist nur noch eine Frage der Zeit.',
  'Schlaf, wenn du kannst. Genieße, wenn du magst. Sei lieb zu dir.',
  'Es ist völlig okay, wenn heute nichts klappt außer dem Atmen.',
  'Dein Bauch ist keine Wölbung, er ist ein Wunder in Arbeit.',
  'Mit jedem Tritt sagt dein Baby: Ich bin da, Mama.',
  'Du darfst Heißhunger auf Gurke mit Honig haben. Wir urteilen nicht.',
  'Die schönsten Dinge brauchen Zeit. Auch Babys.',
  'Du machst das nicht allein. Dein Baby ist immer dabei.',
  'Heute darfst du alles und musst nichts.',
  'Dein Mut wächst mit deinem Bauch. Beides ist beeindruckend.',
  'Jeder Tag deiner Schwangerschaft ist ein Geschenk, auch die mit Rückenschmerzen.',
  'Vertrau deinem Körper. Er weiß seit Jahrtausenden, wie das geht.',
  'Du bist die erste Heimat deines Babys. Was für eine Aufgabe, was für eine Ehre.',
  'Wenn die Hormone Achterbahn fahren, halte dich fest und genieße die Aussicht.',
  'Dein Lächeln ist heute das beste Vitamin für dich und dein Baby.',
  'Du wirst eine Mama, die ihr Kind liebt und dabei auch mal über das Chaos lacht.',
  'Schritt für Schritt, Tag für Tag, Tritt für Tritt.',
  'Was auch kommt, du wirst daran wachsen. Du wächst ja ohnehin gerade.',
  'Gönn dir heute etwas Schönes. Dein Baby profitiert mit.',
  'Dein Baby braucht keine perfekte Mama, sondern eine liebevolle. Und die bist du.',
  'Du bist gerade das Zuhause für ein ganzes Leben. Atme das mal ein.',
  'Manche Tage sind schwer, manche leicht. Alle bringen dich ans Ziel.',
  'Du fühlst dich unbeholfen? Natürlich, du trägst einen kleinen Menschen vor dir her.',
  'Bald hältst du ihn oder sie im Arm. Bis dahin: ausruhen, lachen, staunen.',
  'Eure Geschichte hat gerade ihr schönstes Kapitel aufgeschlagen.',
  'Du bist mutig, du bist liebevoll, und du bist genau richtig.',
  'Heute: Füße hoch, Herz auf, Humor an.',
  'Dein Körper erschafft gerade ein Wunder. Sei geduldig und nett zu ihm.',
  'Du bist wunderschön. Mit Bauch, mit Heißhunger und mit allem dazu.',
  'Lass dir nicht einreden, wie Schwangersein auszusehen hat. Du machst es auf deine Art.',
  'Zwischen Vorfreude und Aufregung ist Platz für alle Gefühle. Alle dürfen da sein.',
  'Das größte Abenteuer deines Lebens läuft gerade. Und du bist die Heldin.',
  'Heute kein Druck. Nur Liebe, Wasser und ein bequemer Platz.',
  'Du bist schon eine tolle Mama, noch bevor dein Baby da ist.',
  'Jeder Tag, an dem du auf dich achtest, ist ein Geschenk an dein Baby.',
  'Lächle in den Spiegel: Da steht die Frau, die gerade ein Wunder vollbringt.',
  'Was heute zählt: Du bist da, du bist liebevoll, und du bist genug.',
  'Dein Baby tritt? Dann hat es gute Laune. Du bald auch.',
  'Du hast das Herz einer Löwin und den Humor einer Schwangeren. Gefährlich gut.'
];
// Weitere Papa-Sprüche (jetzt mindestens 50 im Motivationsschub)
DAILY_PARTNER.push(
  'Heute ein Kompliment mehr als gestern. So wächst die Beziehung mit dem Bauch.',
  'Sei der Papa, den du dir als Kind gewünscht hättest. Du schaffst das.',
  'Rückenmassage um 20 Uhr? Gold wert. Handy dabei bitte weg.',
  'Halte heute einmal inne und freu dich einfach. Es lohnt sich.',
  'Dein Baby hört deine Stimme, auch wenn es mit Tritten antwortet. Rede ruhig weiter.',
  'Frag nicht „Geht’s dir gut?“, sondern „Was brauchst du heute?“ Das ist Papa-Niveau.',
  'Aufbauen, einräumen, vorbereiten: Du bist der Projektleiter des Kinderzimmers. Mit Pausen!',
  'Auch der ruhigste Papa darf sich freuen wie ein Kind. Lass es raus.',
  'Dein Humor ist heute die beste Medizin für euch beide.',
  'Das Baby kommt, wenn es kommt. Bis dahin: Hand halten, Eis holen, tief atmen.',
  'Du hast heute schon mehr geleistet, als du merkst. Danke dir, Papa.',
  'Plane etwas Schönes fürs Wochenende. Kein Programm, nur Zeit füreinander.',
  'Ein Papa, der zuhört, ist Gold. Hör heute einmal besonders gut zu.',
  'Wenn dir etwas Sorgen macht, sprich darüber. Gemeinsam ist alles leichter.',
  'Dein Baby wird dein Lachen lieben. Übe schon mal die schönsten Grimassen.',
  'Du bist stark, auch wenn du dich gerade überfordert fühlst. Beides darf sein.',
  'Backe, koche oder bestelle: Hauptsache, sie muss heute nicht überlegen, was es gibt.',
  'Schön, dass es dich gibt. Dem Baby wird das bald auch auffallen.',
  'Stell den Wecker heute Abend auf „Zeit für uns“. Ohne Bildschirme.',
  'Du bist nicht nur Zuschauer. Du gestaltest diese Geschichte mit, und zwar richtig gut.'
);

// Allgemeine Papa-Rang-Texte: kommen zu den trimesterspezifischen dazu, so gibt es mehr als 50 verschiedene
const PAPA_GENERAL = [
  'Du bist nicht nur dabei, du bist mittendrin. Genau so soll ein Papa sein.',
  'Heute schon gesagt, dass du dich freust? Sag es. Es wirkt Wunder.',
  'Dein Baby braucht keinen perfekten Papa, sondern einen liebevollen. Du hast das Zeug dazu.',
  'Ein Papa bewahrt Ruhe, wenn alle anderen aufgeregt sind. Du übst das gerade, und das klappt gut.',
  'Heute ist ein guter Tag, um etwas Liebes zu tun, ohne dass jemand fragen muss.',
  'Windeln, Schlafmangel, Dauerliebe: Du bist startklar, auch wenn es sich nicht so anfühlt.',
  'Du darfst Fragen haben. Papa werden lernt man nicht aus dem Handbuch, sondern im Tun.',
  'Wer heute den Müll runterbringt, ohne gebeten zu werden, hat den Papa-Führerschein fast in der Tasche.',
  'Dein Baby kennt deine Stimme bald schon. Sprich ruhig mit ihm, es hört gern zu.',
  'Du hast jetzt zwei Jobs: ruhig bleiben und Händchen halten. Beide beherrschst du.',
  'Wenn es heute chaotisch war: Das ist Training. Später heißt es Alltag.',
  'Der beste Papa-Tipp: da sein. Der zweitbeste: Snacks bereithalten.',
  'Du wirst nie wieder einkaufen gehen, ohne an Strampler zu denken. Willkommen im Club.',
  'Auch Helden dürfen mal weinen. Besonders beim ersten Ultraschallbild.',
  'Mach heute ein Foto von euch beiden. Das Baby fehlt zwar noch, aber es ist schon dabei.',
  'Du bist der Fels in der Brandung und der Clown im Kinderzimmer. Beides ist wichtig.',
  'Deine Hand auf ihrem Bauch sagt dem Baby mehr als tausend Worte.',
  'Sei geduldig mit ihr, sei geduldig mit dir. Dann klappt auch alles andere.',
  'Wenn du nicht weißt, was du tun sollst: Frag sie, was sie braucht, und mach genau das.',
  'Ein Lächeln am Morgen ist das beste Frühstück für eine Schwangere. Zwieback hilft zusätzlich.',
  'Du übst gerade für den schönsten Job der Welt. Dein Praktikum läuft hervorragend.',
  'Dein Baby wird einmal sagen: Mein Papa hat sich richtig Mühe gegeben. Und das stimmt.',
  'Heute: Zuhören ohne Lösungen. Das ist die Superkraft aller Papas.',
  'Die Nächte werden kurz, die Liebe wird groß. Der Tausch lohnt sich.',
  'Du musst nicht alles wissen. Du musst nur bleiben, wenn es schwierig wird.',
  'Lass dich überraschen: Schon die ersten Tritte werden dein Herz erweichen.',
  'Papa-Wissen Stufe 1: Das Baby ist immer größer als der Strampler, den du gekauft hast.',
  'Sei stolz auf dich. Dass du hier liest, zeigt, wie ernst du es meinst.',
  'Ein Kompliment am Tag hält die Schwangere gesund. Und den Papa auch.',
  'Wenn die Welt kopfsteht, hältst du einfach ihre Hand und das Baby tritt mit.',
  'Du bist gerade dabei, ein Vorbild zu werden, ohne es zu merken.',
  'Wer heute Abend kocht, hat morgen mehr Rückenwind. So funktioniert Teamarbeit.',
  'Das größte Abenteuer deines Lebens startet bald. Pack Humor und Geduld ein.',
  'Du darfst dich freuen, du darfst aufgeregt sein, du darfst Angst haben. Alles zusammen heißt: Du liebst schon.',
  'Heute reicht es, wenn du ihr ein Glas Wasser und ein Lächeln bringst.',
  'Kleine Gesten, große Wirkung: Eine Umarmung ohne Grund wirkt Wunder.',
  'Dein Baby hat sich den besten Papa ausgesucht. Das sagt schon alles.',
  'Auch das Kinderzimmer wächst mit der Zeit. Genau wie dein Papa-Gefühl.',
  'Heute übst du Geduld. Morgen übst du Wickeln. Du lernst schnell.',
  'Du brauchst keine Superkräfte. Ein offenes Ohr und warme Hände reichen völlig.',
  'Wenn du dich fragst, ob du bereit bist: Du wirst es mit jedem Tag mehr.',
  'Wer sein Baby liebt, kann nichts falsch machen. Der Rest ist Übungssache.',
  'Dieses Abenteuer macht dich zum Papa. Und Papas sind unfassbar wichtig.',
  'Nimm dir heute fünf Minuten, um dir vorzustellen, wie es sein wird. Das Lächeln kommt von allein.',
  'Bring ihr heute etwas Kleines mit. Eine Blume, ein Eis, ein Kompliment. Alles zählt.',
  'Du bist stark, du bist lieb, du bist bereit. Und im Zweifel gibt es immer noch Kaffee.'
];
Object.assign(PAGE_ICON, { quotes: 'chat-quote' });
Object.assign(PAGE_AUDIENCE, { quotes: 'together' });

Object.assign(PAGE_ICON, { export: 'box-arrow-up' });
Object.assign(PAGE_AUDIENCE, { export: 'together' });

// Mission des Tages für den Papa: jetzt 52 Ideen, täglich wechselnd
PARTNER_MISSIONS.push(
  'Massiere ihr fünf Minuten lang die Füße, ganz ohne Gegenleistung.',
  'Bring ihr ein Glas Wasser mit Zitrone, ohne dass sie fragt.',
  'Prüfe heute, ob die Kliniktasche vollständig ist.',
  'Fahre die Route zur Klinik einmal zur Probe, inklusive Parkplatz.',
  'Sing dem Baby ein Lied vor. Falsche Töne sind erlaubt.',
  'Backe oder bestelle etwas Leckeres, das sie gerade mag.',
  'Lege die Hand auf den Bauch und sag dem Baby, worauf du dich freust.',
  'Wasche die Babywäsche vor und falte sie ordentlich.',
  'Schreibe einen Brief ans Baby. Er muss nicht lang sein, nur echt.',
  'Mach einen Spaziergang zu zweit, ohne Handy.',
  'Lerne, wie der Kinderwagen zusammenklappt. Üben bis zum Reflex.',
  'Frag sie, wie sie sich die Geburt vorstellt, und hör einfach zu.',
  'Sag ihr heute dreimal, dass du stolz auf sie bist.',
  'Bring das Altglas weg, bevor sie es sieht. Heldenarbeit im Verborgenen.',
  'Such mit ihr zusammen drei Namensideen aus.',
  'Mach ihr einen Tee und stell ihn ihr hin, ohne ein Wort zu sagen.',
  'Räume die Spülmaschine aus, bevor jemand es merkt.',
  'Besorge eine kleine Überraschung: Blume, Schokolade oder ein Kompliment.',
  'Schau dir gemeinsam das Ultraschallbild an und rate, wem es ähnlich sieht.',
  'Recherchiere eine Geburtsvorbereitung oder einen Kurs, der euch gefällt.',
  'Hilf beim Schuheanziehen, ohne einen Kommentar zum Bauch.',
  'Bereite das Frühstück vor und serviere es im Bett.',
  'Bau ein Möbelstück fürs Kinderzimmer auf. Die Anleitung zu lesen ist erlaubt.',
  'Sprich mit deinem Arbeitgeber über Elternzeit, wenn noch nicht geschehen.',
  'Mach eine Liste: Was braucht ihr noch für das Baby? Sprecht darüber.',
  'Gönn ihr einen freien Abend, an dem du alles übernimmst.',
  'Tanze eine Runde mit ihr im Wohnzimmer. Das Baby tanzt mit.',
  'Kaufe ein Buch oder Spielzeug, das du dem Kind später schenken willst.',
  'Leg dir einen Plan B für die Fahrt zur Klinik zurecht: Taxi-Nummer parat.',
  'Lies noch einmal die Wehenzeichen und sprich mit ihr darüber.',
  'Erledige heute etwas, das du sonst aufschiebst, damit sie sich keine Sorgen machen muss.',
  'Notiere drei Fragen für den nächsten Arzttermin.',
  'Sprich mit einem anderen Papa über seine Erfahrungen. Das beruhigt.',
  'Mach ein Mini-Fotoshooting zu Hause: Bauch, Hände, ein Lächeln.',
  'Pack für euch beide Snacks für die Klinik ein.',
  'Hör bewusst zu, wenn sie von ihrem Tag erzählt, ohne aufs Handy zu schauen.',
  'Schreibe ihr mitten am Tag eine liebe Nachricht, ohne Anlass.',
  'Probiere ein neues, schwangerschaftsfreundliches Rezept aus der App.',
  'Räumt gemeinsam eine Ecke fürs Baby ein und genießt das Ergebnis.',
  'Frag sie, ob sie etwas von der Wunschliste ausgesucht hat, und kümmere dich darum.',
  'Nimm dir fünf Minuten für dich und atme tief durch. Du darfst auch aufgeregt sein.',
  'Plane ein Babymoon: ein Wochenende oder wenigstens ein langer Abend zu zweit.',
  'Mach ihr ein Kompliment, das nichts mit dem Bauch zu tun hat.',
  'Sieh dir an, wie man ein Baby sicher trägt und badet.'
);

// Paar-Ideen für "Gemeinsam heute": jetzt 50, täglich wechselnd
const TOGETHER_IDEAS_MORE = [
  ['Schreibt gemeinsam drei Dinge auf, auf die ihr euch freut.', null],
  ['Schaut gemeinsam eure Fotos an und erzählt euch die Geschichte dazu.', 'photos'],
  ['Probiert gemeinsam ein neues Rezept aus der App.', 'recipes'],
  ['Packt zusammen die Kliniktasche weiter.', 'lists'],
  ['Überlegt zusammen, wer euch bei der Geburt und danach helfen kann.', 'contacts'],
  ['Besprecht, wie ihr euch die ersten Wochen mit Baby vorstellt.', null],
  ['Schreibt eine Frage für den nächsten Arzttermin auf.', 'pass'],
  ['Erzählt euch, was ihr beim anderen gerade besonders bewundert.', null],
  ['Plant einen freien Nachmittag nur für euch.', null],
  ['Sucht ein Lied aus, das ihr dem Baby vorsingen wollt.', null],
  ['Legt zusammen die Hände auf den Bauch und wartet auf einen Tritt.', null],
  ['Vergleicht eure Namenslisten und streicht gemeinsam einen Namen.', 'names'],
  ['Schaut gemeinsam nach, was noch auf der Wunschliste fehlt.', 'wishes'],
  ['Lest euch gegenseitig einen Eintrag aus dem Tagebuch vor.', 'diary'],
  ['Macht einen kleinen Spaziergang und redet über eure Wünsche für das Baby.', null],
  ['Notiert gemeinsam, was ihr dem Baby später einmal erzählen wollt.', 'letters'],
  ['Geht eure Termine der nächsten zwei Wochen durch.', 'planner'],
  ['Schaut nach, welche Behördengänge als Nächstes anstehen.', 'lists'],
  ['Trinkt einen Tee zusammen und lasst das Handy in der Tasche.', null],
  ['Macht ein Foto von euren Händen auf dem Bauch.', 'photos'],
  ['Tauscht aus, was euch gerade Sorgen macht und was euch Mut macht.', null],
  ['Kocht zusammen etwas, das ihr beide mögt.', 'recipes'],
  ['Plant gemeinsam das Kinderzimmer: Farben, Möbel, Platz.', null],
  ['Besprecht, wer nachts was übernimmt. Humor ist ausdrücklich erlaubt.', null],
  ['Schreibt euch gegenseitig einen kurzen Liebesbrief auf einen Zettel.', null],
  ['Schaut euch gemeinsam die Frankfurter Anlaufstellen an.', 'tips'],
  ['Prüft gemeinsam, ob die Notfallnummern griffbereit sind.', 'contacts'],
  ['Feiert einen kleinen Erfolg der Woche mit einem Eis.', null],
  ['Tragt euren Wasserverbrauch zusammen ein und stoßt an.', 'water'],
  ['Besprecht, welche Traditionen ihr an euer Kind weitergeben wollt.', null],
  ['Stellt euch vor, wie das Baby in einem Jahr aussieht, und lacht darüber.', null],
  ['Lest gemeinsam die Wochen-Info und ratet, was das Baby gerade macht.', 'partner'],
  ['Räumt gemeinsam eine Ecke für das Baby auf.', null],
  ['Plant einen Besuch bei Freunden mit Kind, um zu sehen, wie es dort läuft.', null],
  ['Macht eine Mini-Massage-Runde: zehn Minuten du, zehn Minuten sie.', null],
  ['Sagt euch gegenseitig Danke für etwas Konkretes von heute.', null]
];
// Version der App. Muss mit sw.js und der Meta-Angabe in index.html uebereinstimmen (wird getestet).
const APP_VERSION = { number: '1.1.0', date: '2026-10-16', name: 'Eigene Farben, Atemübungen und mehr Ruhe' };
Object.assign(PAGE_ICON, { privacy: 'shield-check' });
Object.assign(PAGE_AUDIENCE, { privacy: 'together' });

// Weitere Mutmacher für die Wochenkarte (eigene Texte nach den Motiven: Vorfreude, Vertrauen in den Körper, Affirmationen)
HERO_QUOTES.push(
  'Du darfst dir sagen: Mein Körper weiß, was er tut, und ich vertraue ihm.',
  'Du hast schon so viele Herausforderungen gemeistert. Diese hier meisterst du mit Liebe.',
  'Du trägst eine Kraft in dir, die größer ist als jede Sorge.',
  'Jede Sorge darf kommen und wieder gehen. Dein Baby spürt vor allem deine Liebe.',
  'Das Wunder des Lebens beginnt in dir. Du darfst stolz sein.',
  'Vorfreude ist die schönste Art, schwanger zu sein.',
  'Du bist genau richtig, so wie du bist: mit Bauch, mit Zweifeln und mit großem Herz.',
  'Dein Baby braucht vor allem eines von dir: dich.',
  'Liebe wächst nicht erst bei der Geburt. Bei dir wächst sie schon jetzt.',
  'Du darfst dir Zeit nehmen. Alles Gute braucht Zeit.',
  'Du bist nicht allein: Dein Baby, dein Partner und diese App sind an deiner Seite.',
  'Sag es dir ruhig laut: Heute atme ich ruhig und fühle mich sicher.',
  'Nach jedem Regen scheint wieder die Sonne. Das gilt auch für müde Schwangerschaftstage.',
  'Dein Körper ist weise. Hör ihm zu und sei lieb zu ihm.',
  'Kleine Füße, große Wirkung: Dein Baby verändert schon jetzt eure Welt.',
  'Du darfst staunen, du darfst zweifeln und du darfst dich freuen. Alles gehört dazu.',
  'Mutig sein heißt nicht, keine Angst zu haben, sondern trotzdem weiterzugehen. Das tust du gerade.',
  'Jeder Tritt ist ein kleiner Gruß. Sag ruhig zurück: Ich bin da.',
  'Du schenkst Leben. Allein dafür verdienst du jeden Tag etwas Schönes.',
  'Dein Weg zur Mama ist deiner. Er muss sich nicht wie der von anderen anfühlen.',
  'Das Beste kommt noch, und es lächelt dich bald an.',
  'Vertrauen ist ein Muskel. Du trainierst ihn gerade jeden Tag.',
  'Die Liebe zu deinem Kind darf wachsen, in deinem eigenen Tempo.',
  'Gib dir selbst, was du deinem Baby wünschst: Zuwendung, Ruhe und Wärme.',
  'Heute darfst du langsam machen. Dein Baby wächst auch im Schlaf.',
  'Du bist schon jetzt eine Mama. Du denkst an jemanden mehr als an dich.',
  'Alles, was du bisher getan hast, hat dich bis hierher gebracht. Das ist viel.',
  'Eine Hand auf dem Bauch, ein tiefer Atemzug, ein Lächeln: Mehr braucht es gerade nicht.',
  'Dein Herz hat Platz für ein ganzes Leben mehr. Das ist wunderschön.',
  'Du bist stark, auch wenn du dich gerade weich fühlst. Beides gehört zu dir.'
);

// "Noch ca. X Tage": täglich wechselnde, freundliche Sätze statt Prozentzahlen. Platzhalter: {days} = "ca. 52 Tage", {tagen} = "ca. 52 Tagen", {kid} = Kosename
const DAYS_MAMA = [
  'Noch {days}, dann hältst du {kid} im Arm.',
  'In {tagen} lernt ihr euch kennen. Bis dahin: gut auf dich achten.',
  'Es sind noch {days}, und jeder Tag bringt euch näher zusammen.',
  'Dein Baby wächst jeden Tag ein Stück. Noch {days} bis zum großen Moment.',
  'Noch {days} voller Vorfreude, Tritte und kleiner Wunder.',
  'In {tagen} beginnt euer neues Kapitel. Das Vorwort schreibt ihr gerade.',
  'Noch {days}: genug Zeit zum Staunen und genug Zeit zum Ausruhen.',
  'Zähl nicht die Tage, genieß sie. Es sind noch {days}.',
  'Bis {kid} da ist, dauert es noch {days}. Bis dahin darfst du dich verwöhnen lassen.',
  'Noch {days}, dann bekommt dein Herz ein neues Zuhause.',
  'In {tagen} schaut dich ein kleines Gesicht an. Freu dich darauf.',
  'Noch {days} bis zum schönsten Kennenlernen deines Lebens.',
  'Du hast schon so viel geschafft. Es sind noch {days}.',
  'Noch {days}: Du machst das großartig, auch an den müden Tagen.',
  'In {tagen} ist {kid} da. Bis dahin wächst die Vorfreude mit jedem Tritt.',
  'Noch {days}, dann wird aus Warten Staunen.',
  'Ein kleines Wunder macht sich auf den Weg. Noch {days}.',
  'Noch {days}, und vieles in dir ist längst bereit.',
  'In {tagen} wird aus dem Bauchgefühl ein kleiner Mensch.',
  'Noch {days} zum Träumen, Planen und Kuscheln.',
  'Jeden Tag ein bisschen mehr Mama. Noch {days} bis zum Ziel.',
  'Noch {days}. Atme tief durch, du bist auf einem guten Weg.',
  'In {tagen} beginnt ein Abenteuer, das du schon jetzt liebst.',
  'Noch {days}, bis du {kid} die Welt zeigen darfst.',
  'Dein Baby übt schon fleißig. Noch {days} bis zur Premiere.',
  'Noch {days}: Zeit für Ruhe, Eis und liebevolle Gedanken.',
  'In {tagen} werden aus Eltern in spe echte Eltern.',
  'Noch {days}, und die Geschichte von {kid} beginnt vor deinen Augen.',
  'Du trägst {kid} schon jetzt überall hin. Noch {days}, dann siehst du das Gesicht dazu.',
  'Noch {days}: Alles darf, nichts muss, und alles wird gut.'
];
const DAYS_PAPA = [
  'Noch {days}, dann bist du Papa.',
  'In {tagen} wirst du Papa. Dein Training läuft hervorragend.',
  'Noch {days}: genug Zeit, Windeln zu üben, und genug Gründe, sich zu freuen.',
  'Noch {days}, dann hältst du {kid} zum ersten Mal im Arm.',
  'In {tagen} beginnt dein wichtigster Job. Du bist bereit.',
  'Noch {days}, bis aus dem Papa in spe ein echter Papa wird.',
  'Es sind noch {days}. Nutze sie für Zweisamkeit und gute Nerven.',
  'Noch {days} bis zum größten Moment deines Lebens.',
  'In {tagen} bist du für einen kleinen Menschen der Größte.',
  'Noch {days}: Autositz geprüft, Tasche gepackt, Herz bereit.',
  'Noch {days}, und dein Leben bekommt eine wunderbare Hauptrolle.',
  'In {tagen} lernst du {kid} kennen. Du wirst es lieben.',
  'Noch {days}. Jeder Tag macht dich ein Stück mehr zum Papa.',
  'Noch {days}, in denen du ihr den Rücken stärkst. Das zählt.',
  'In {tagen} wird es laut, bunt und wunderschön.',
  'Noch {days}: Zeit, Lieder für {kid} zu üben. Falsche Töne sind erlaubt.',
  'Noch {days}, und du bist offiziell Teil eines Dreierteams.',
  'In {tagen} beginnt die schönste Schlaflosigkeit deines Lebens.',
  'Noch {days}. Du machst das schon richtig gut.',
  'Noch {days} zum Staunen, Üben und Vorfreuen.',
  'In {tagen} wartet jemand darauf, dich zu treffen.',
  'Noch {days}, dann wird aus deinem Alltag ein Abenteuer.',
  'Noch {days}: Zeit, ihr noch viele kleine Gefallen zu tun.',
  'In {tagen} hat {kid} den besten Papa, den man sich wünschen kann.',
  'Noch {days}, und dein Herz fühlt sich größer an als je zuvor.',
  'Noch {days}. Bleib ruhig, du bist der Fels in der Brandung.',
  'In {tagen} gehst du zum ersten Mal als Papa nach Hause.',
  'Noch {days}, dann ist der Papa-Titel offiziell.',
  'Noch {days}: Zeit für gemeinsame Abende und gute Gespräche.',
  'In {tagen} wirst du jemandem die Welt erklären.'
];
// Nach dem errechneten Termin (ohne Zahl, ohne Druck)
const DAYS_AFTER_MAMA = ['Jeden Tag kann es so weit sein. {kid} lässt sich noch Zeit, und das ist völlig in Ordnung.', 'Der Termin ist da, doch Babys lesen keinen Kalender. Du machst das wunderbar.', 'Gleich ist es so weit. Atme tief durch und vertrau deinem Körper.', 'Jetzt heißt es lächeln, ausruhen und warten. {kid} kommt, wenn es so weit ist.', 'Die Vorfreude ist riesig. Es kann jeden Moment losgehen.', 'Du hast es fast geschafft. {kid} nimmt sich noch einen kleinen Moment.'];
const DAYS_AFTER_PAPA = ['Jeden Tag kann es losgehen. Handy laut, Tank voll, Ruhe bewahren.', 'Der Termin ist da, doch Babys lesen keinen Kalender. Du bist bereit.', 'Gleich wirst du Papa. Atme tief durch und halte ihre Hand.'];
// Marke: App-Name (Standard BABYLOVE) und Text darunter (Standard "by Sarah"), beides frei wählbar in den Einstellungen
const BRAND_NAME_DEFAULT = 'BABYLOVE', BRAND_SUB_DEFAULT = 'by Sarah', BRAND_NAME_MAX = 30, BRAND_SUB_MAX = 100;
const cleanText = (s, max) => String(s ?? '').replace(/[\u0000-\u001F\u007F\u200B-\u200F\u2028\u2029]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max).trim();
const cleanBrandName = s => cleanText(s, BRAND_NAME_MAX), cleanBrandSub = s => cleanText(s, BRAND_SUB_MAX);
const brandSettings = () => (typeof state !== 'undefined' && state && state.settings) || {};
const brandName = () => cleanBrandName(brandSettings().appName) || BRAND_NAME_DEFAULT;
const brandSub = () => cleanBrandSub(brandSettings().appSub) || BRAND_SUB_DEFAULT;
const brandFull = () => `${brandName()} ${brandSub()}`;
const isDefaultBrand = () => brandName() === BRAND_NAME_DEFAULT && brandSub() === BRAND_SUB_DEFAULT;
const cssStr = s => String(s).replace(/[\\"]/g, '\\$&');

/* ---------- Atemübungen für Schwangere ----------
   Inspiration: Apotheken Umschau (längere Ausatmung, Tönen mit offenen Vokalen), TK (Atmung im Geburtsvorbereitungskurs), Perimom und Calm (Bauchatmung, Lippenbremse).
   Alles sanft: keine langen Atempausen, kein schnelles oder zu tiefes Atmen. Ersetzt keinen Geburtsvorbereitungskurs und keine Hebamme. */
const BREATH_EXERCISES = [
  { id: 'belly', name: 'Bauchatmung', tag: 'Zum Runterkommen', pattern: [['Einatmen', 4, 'in'], ['Ausatmen', 6, 'out']],
    intro: 'Die Basis von allem: Der Atem wandert in den Bauch und macht Platz für Ruhe.',
    steps: ['Setz dich bequem hin oder leg dich auf die Seite. Eine Hand liegt auf dem Bauch, eine auf der Brust.', 'Atme durch die Nase ein, sodass sich vor allem die Hand auf dem Bauch hebt.', 'Atme langsam wieder aus und spüre, wie der Bauch sinkt.'],
    fun: 'Dein Baby schaukelt gemütlich mit. Besser als jede Hängematte.' },
  { id: 'long', name: 'Lange Ausatmung', tag: 'Gegen Anspannung', pattern: [['Einatmen', 4, 'in'], ['Summend ausatmen', 8, 'out']],
    intro: 'Die Ausatmung ist doppelt so lang wie die Einatmung. Das beruhigt und wird in Geburtsvorbereitungskursen oft geübt.',
    steps: ['Atme ruhig durch die Nase ein.', 'Atme summend aus, ein weiches „Mmm“, bis die Luft von selbst ausgeht.', 'Schultern und Kiefer bleiben locker.'],
    fun: 'Summen funktioniert auch im Wartezimmer. Die anderen werden sich fragen, was du weißt.' },
  { id: 'tone', name: 'Tönen mit A, O, U', tag: 'Für den Beckenboden', pattern: [['Einatmen', 4, 'in'], ['Mit „Aaa“ ausatmen', 8, 'out']],
    intro: 'Offene Vokale wie A, O und U gelten in Geburtsvorbereitungskursen als hilfreich, weil sich dabei der Beckenboden weich anfühlt.',
    steps: ['Atme tief und ruhig ein.', 'Atme mit einem tiefen, offenen „Aaa“, „Ooo“ oder „Uuu“ aus.', 'Lass die Stimme tief und weich klingen, laut muss es nicht sein.'],
    fun: 'Die Nachbarn halten dich für eine Opernsängerin. Das nennt man Karriere.' },
  { id: 'wave', name: 'Wellenatmung', tag: 'Gleichmäßig wie eine Welle', pattern: [['Einatmen', 5, 'in'], ['Ausatmen', 5, 'out']],
    intro: 'Ein- und Ausatmen sind gleich lang und gehen ohne Pause ineinander über, wie Wellen am Strand. So findest du einen ruhigen Rhythmus.',
    steps: ['Stell dir eine Welle vor, die langsam ausläuft und wieder aufbaut.', 'Atme in diesem Rhythmus, ohne zu drücken und ohne Pause.', 'Wenn der Rhythmus nicht passt, atme einfach, wie es sich gut anfühlt.'],
    fun: 'Strand-Feeling ohne Sonnenbrand. Und ohne Kinderwagen im Sand.' },
  { id: 'lips', name: 'Lippenbremse', tag: 'Wenn die Luft knapp wird', pattern: [['Einatmen', 3, 'in'], ['Ausatmen mit Lippenbremse', 6, 'out']],
    intro: 'In den späten Wochen drückt das Baby aufs Zwerchfell. Mit gespitzten Lippen atmest du langsam aus und wirst ruhiger.',
    steps: ['Atme ruhig durch die Nase ein.', 'Spitze die Lippen, als würdest du eine Kerze sanft ausblasen.', 'Puste lange und gleichmäßig aus.'],
    fun: 'Die Kerze darf nicht ausgehen. Sie soll nur ein bisschen flackern.' },
  { id: 'square', name: 'Sanftes Viereck', tag: 'Konzentration finden', pattern: [['Einatmen', 4, 'in'], ['Kurz ruhen', 2, 'hold'], ['Ausatmen', 4, 'out'], ['Kurz ruhen', 2, 'hold']],
    intro: 'Vier gleiche Seiten, nur mit ganz kurzen Pausen. Gut, wenn die Gedanken kreisen.',
    steps: ['Atme ein und zähle gedanklich bis vier.', 'Ruhe kurz, ohne die Luft festzuhalten.', 'Atme aus, ruhe kurz, und beginne von vorn.'],
    fun: 'Quadrate lieben Ordnung. Das Kinderzimmer bekommt sie leider nicht davon.' },
  { id: 'duo', name: 'Atmen zu zweit', tag: 'Mama und Papa', pattern: [['Einatmen', 4, 'in'], ['Ausatmen', 6, 'out']],
    intro: 'Papa atmet im selben Takt mit. Das beruhigt beide und wird zur kleinen Probe für die Geburt.',
    steps: ['Mama sitzt oder liegt bequem, Papa legt eine Hand auf Schulter oder Kreuzbein.', 'Beide atmen im gleichen Takt, Papa atmet hörbar mit.', 'Danach sagt Mama, was gut tat: Druck, Tempo oder Stimme.'],
    fun: 'Papa-Aufgabe: im Takt atmen, nicht seufzen. Seufzen ist ab Minute drei erlaubt.' }
];
const BREATH_SAFETY = ['Bequem sitzen oder auf der Seite liegen. Ab der Mitte der Schwangerschaft nicht lange flach auf dem Rücken.', 'Nie die Luft lange anhalten und nicht tiefer oder schneller atmen, als es angenehm ist.', 'Wird dir schwindelig oder kribbelig: Übung beenden und ruhig normal weiteratmen.', 'Anhaltende Atemnot, Schmerzen oder Unsicherheit: Frauenarzt oder Hebamme fragen, im Notfall 112.'];
const BREATH_SOURCES = [['Apotheken Umschau: Übungen, richtig atmen in der Schwangerschaft', 'https://www.apotheken-umschau.de/familie/schwangerschaft/gesunde-schwangerschaft/uebungen-richtig-atmen-in-der-schwangerschaft-795275.html'], ['Techniker Krankenkasse: Atmen gegen Schmerz', 'https://www.tk.de/techniker/magazin/familie/kinderwunsch-und-schwangerschaft/atmen-gegen-schmerz-2048352'], ['Calm: Atemübungen in Schwangerschaft und Geburt (englisch)', 'https://www.calm.com/blog/pregnancy-breathing-exercises']];
Object.assign(PAGE_AUDIENCE, { breathing: 'together' });
Object.assign(PAGE_ICON, { breathing: 'wind' });