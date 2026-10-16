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
const MOOD_LABEL = { love: 'verliebt', happy: 'gut', tired: 'mÃ¼de', sad: 'sensibel', sick: 'Ã¼bel', angry: 'genervt' };

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
const FONT_SIZES = { s: { label: 'Klein', pct: '90%' }, m: { label: 'Normal', pct: '100%' }, l: { label: 'Groß', pct: '112.5%' }, xl: { label: 'Sehr groß', pct: '125%' } };
// Seiten-Icons für die Überschriften
const PAGE_ICON = { diary: 'journal-text', photos: 'images', planner: 'check2-square', more: 'grid-fill', partner: 'people-fill', letters: 'envelope-heart',
  names: 'tags', milestones: 'stars', wishes: 'gift', lists: 'bag-heart', food: 'egg-fried', move: 'bicycle', vits: 'capsule', water: 'droplet-half',
  contacts: 'telephone-fill', pass: 'journal-medical', baby: 'moon-stars', tips: 'geo-alt-fill', colors: 'palette2', backup: 'shield-lock',
  einstellungen: 'gear-fill', homeconfig: 'sliders', applock: 'shield-lock-fill', recipes: 'cookie', settings: 'person-heart', papa: 'person-fill' };
