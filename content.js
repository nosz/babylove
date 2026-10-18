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
Object.assign(PAGE_ICON, { wishprint: 'printer', diaryprint: 'printer', lettersprint: 'book-half', wishlistprint: 'file-earmark-richtext' });

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
  diary: 'together', diaryprint: 'together', lettersprint: 'together', wishlistprint: 'together', settings: 'mama', vits: 'mama', pass: 'mama', water: 'mama', food: 'mama', move: 'mama', recipes: 'mama',
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
  ['Schaut euch gemeinsam die Anlaufstellen vor Ort an.', 'tips'],
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
const APP_VERSION = { number: '2.6.1', date: '2026-10-16', name: 'Installieren-Knopf auf der Startseite und Messnotiz in der Wochen-Story' };
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

/* ---------- Mundart-Sprüche (Hessisch, Bayrisch, Schwäbisch): Spaß und Humor, kommen "ab und zu" zwischen die normalen Sprüche ---------- */
const DIALECTS = { hessisch: 'Hessisch', bayrisch: 'Bayrisch', schwaebisch: 'Schwäbisch' };
const DIALECT_QUOTES = {
  hessisch: {
    mama: ['Ei Gude! Du machst des ganz prima, des Kleine kann sich glücklich schätze.', 'Heut is e guder Dag zum Strahle, Mädsche. Du sorgst für zwei, des is aach net ohne.', 'Immer mit der Ruh: Des Baby kimmt, wenn’s kimmt, un net frieher.', 'Ei, was bist du stark! Des Kleine hat sich die allerbeste Mudder ausgesucht.', 'Net hetze, net hudele: Du bist genau do, wo du sein sollst.', 'Abbelwoi gibt’s später, jetzt gibt’s Wasser. Awwer du machst des gut!', 'Mach dei Pause, Mädsche. Des Baby hat aach Feierabend verdient.', 'Dein Bauch is e Wunderwerk. Un du bist die Chefin vom ganze Laade.', 'Heut wird nix gemuddert, heut wird gestrahlt. Des steht dir gut.', 'Hauptsach gesund un gut gelaunt, alles annere find sich.', 'Du hast des im Griff, des merkt mer. Un wenn net, gibt’s Hilfe vom Babba.', 'Gut gemacht heut! Gönn dir e Stückche Ruh, des hast du dir verdient.', 'Es Baby strampelt schun: Des heißt, es freut sich uff euch.', 'Alles kimmt, wie’s kimmt. Un es kimmt gut.'],
    papa: ['Babba, du bist net Nebensach, du bist Hauptdarsteller! Mach heut was Nettes für dei Liebste.', 'Du Held vom Alldag: E Tass Tee un e Umarmung wirke Wunder.', 'Net nervös werde, Babba. Des Köfferche is gepackt, des Herz is voll.', 'Sei dabei, hör zu un lach viel. Mehr braucht e werdender Babba net.', 'Heut gibt’s Pluspunkte: Spül ohne gefragt zu werde.', 'Du schaffst des, Babba! Un die Windel wechsele lernste schnell.', 'Dei Aufgab heut: Ruhe bewahre un Schoki bereithalte.', 'E guder Babba frogt: Wie kann ich helfe? Frog heut mal.', 'Handy laut, Tank voll, Herz uff: So werd e Babba.', 'Des Baby kennt dei Stimm schun. Quatsch ruhig e bissi mit ihm.']
  },
  bayrisch: {
    mama: ['Des schaffst du, Madl! Und des Zwergerl freut sich scho auf di.', 'Immer mit der Ruhe: Des Baby kimmt, wenn’s Zeit is, und ned früher.', 'Du bist a Wahnsinn! Zwoa Leit in oam, des is a Leistung.', 'Jetz erst amal hinsetzn, Füaß hoch und durchschnaufn. Des hast di verdient.', 'A bissl Gelassenheit, a bissl Humor, und scho passt’s.', 'Mei, wia schee: Du bist a richtige Kraftlackl, sogar mit Babybauch.', 'Gsund bleibn, lacha und guad drauf sei. Alles passt.', 'Dei Bauch is a Wunderwerk, und du die Chefin vom ganzen Laden.', 'Heid wird ned gjammert, heid wird gstrahlt.', 'Des wird scho! Und wenn ned glei, nacha halt a bissl später.', 'Brezn, Wasser, Füaß hoch: Mehr brauchst heid ned.', 'Du machst des so guad, des Zwergerl hat richtig Glück mit dir.', 'Ruhig bleibn, Madl. Du host des im Griff.', 'Heut gibt’s koan Stress, heut gibt’s a Pause. Basta.'],
    papa: ['Griaß di, Papa! Du bist ned Nebendarsteller, du bist Hauptperson.', 'Heid mochst deiner Liebsten a Freid: Tee, Decke, Umarmung.', 'Ned nervös wern, Papa. De Tasch is packt, des Herz is voll.', 'Zuahern, lacha, da sei: Mehr brauchts ned zum guadn Papa.', 'Handy laut, Tank voll, Ruhe bewahrn: So wird a Papa.', 'Des Zwergerl kennt dei Stimm scho. Verzähl eam ruhig was.', 'A guader Papa fragt: Wos braucht ihr grod? Frog heid amoi.', 'Windeln wechsln lernt ma schnell. Is alles a Frage vo da Übung.', 'Du host des, Papa! Und wenn ned, hilft a Brezn.', 'Heid gibt’s Pluspunkte: Spülmaschin ausräumen, ohne dass wer fragt.']
  },
  schwaebisch: {
    mama: ['Du schaffsch des! Des Kloine kann sich glücklich schätze.', 'Net hudle, net hetze: Des Baby kommt, wenn’s Zeit isch.', 'Des hosch guet gmacht, des muss mer mol sage.', 'Mach amol Pause, Mädle. Des hosch dir verdient, ond zwar richtig.', 'Gsond bleibe, lache, ausruhe. Mehr brauchsch heut net.', 'Dei Bauch isch a Wunderwerk. Ond du bisch die Chefin vom ganze Laada.', 'Heut wird net gschafft, heut wird gstrahlt.', 'Net schlecht, Herr Specht! Du machsch des richtig gut.', 'Wasser, Füß hoch, durchschnaufe: Des isch heut dei Programm.', 'Des Kloine strampelt scho: Des heißt, es freut sich uff euch.', 'Alles kommt, wie’s kommt, ond es kommt gut.', 'Du bisch stärker, als du denksch. Des sagt au dei Bauch.', 'Kehrwoch? Heut net. Heut wird gschont.', 'Immer mit da Ruh. Des Baby hat koin Termin im Kalender.'],
    papa: ['Babbe, du bisch net Nebesach, du bisch Hauptdarsteller!', 'E Tasse Tee ond e Umarmung: Des wirkt Wunder bei dera Liabschte.', 'Net nervös werde. Die Tasch isch packt, des Herz isch voll.', 'Zuahöre, lache, do sei: Mehr braucht e guter Babbe net.', 'Handy laut, Tank voll, ruhig bleibe: So wird mer Babbe.', 'Des Baby kennt dei Stimm scho. Schwätz ruhig a bissle mit em.', 'E guter Babbe frogt: Was brauchet ihr grad? Frog heut mol.', 'Windle wechsle lernt mer schnell. Isch alles a Frag vo dr Übung.', 'Heut gibt’s Pluspunkte: Spülmaschine ausräume, ohne dass oiner froge muss.', 'Du hosch des, Babbe! Ond wenn net, helfe Spätzle.']
  }
};

/* ---------- Babywitze: humorvoll und mutmachend, mit Niveau ---------- */
const JOKE_CATS = { schwanger: 'Schwangerschaft', papa: 'Papa', baby: 'Baby', geburt: 'Geburt', mut: 'Mutmacher' };
const JOKES = [
  ['schwanger', 'Schwangerschaft ist die einzige Zeit, in der Heißhunger als Ernährungsplan durchgeht.'],
  ['schwanger', 'Schwangere haben ein eingebautes Radar: Auf 200 Meter erkennen sie jede Toilette.'],
  ['schwanger', 'Der Bauch wächst, die Vorfreude wächst, nur die Schuhe sind plötzlich unerreichbar. Dafür gibt es Partner.'],
  ['schwanger', 'Man sagt, Schwangere strahlen. In Wahrheit ist es die Erleichterung, dass endlich jemand den Sitzplatz anbietet.'],
  ['schwanger', 'Neun Monate Training für den Marathon der nächsten achtzehn Jahre. Du bist schon jetzt auf Platz eins.'],
  ['schwanger', 'Das Gedächtnis macht Urlaub, der Hunger bleibt. Eine faire Arbeitsteilung des Körpers.'],
  ['schwanger', 'Gähnen im Sitzen, Tritte im Liegen: Dein Körper ist gerade Weltmeister im Multitasking.'],
  ['schwanger', 'Schwangerschaft ist ein Vollzeitjob mit Bonusprogramm: Tritte, Schluckauf und jede Menge Vorfreude.'],
  ['papa', 'Papa-Weisheit Nummer eins: Wer nachts den Weg zum Kühlschrank kennt, wird zum Helden.'],
  ['papa', 'Der werdende Vater liest vier Ratgeber, baut ein Bett auf und fragt dann doch: Wo ist die Anleitung für das Baby?'],
  ['papa', 'Ein guter Papa hat zwei Superkräfte: Zuhören und Windelwechseln. Das erste kann man schon heute üben.'],
  ['papa', 'Wenn sie fragt, ob der Bauch riesig ist, lautet die richtige Antwort: Er sieht aus wie ein kleines Wunder, weil er eins ist.'],
  ['papa', 'Autositz einbauen: Dauer laut Anleitung fünf Minuten, in der Realität ein Wochenende und ein Volkshochschulkurs.'],
  ['papa', 'Papa im Kreißsaal: Er hat sich auf alles vorbereitet, nur nicht darauf, dass Händchenhalten die schwerste Aufgabe ist.'],
  ['papa', 'Ein werdender Papa lernt schnell: Snacks bereithalten ist keine Nebensache, sondern Krisenmanagement.'],
  ['papa', 'Wenn Papa im Takt mitatmet, hat er die erste Runde Geburtsvorbereitung schon gewonnen.'],
  ['baby', 'Das Baby hat den Termin längst im Kalender. Es hat ihn nur nicht verraten.'],
  ['baby', 'Strampler in Größe 50: passt genau drei Wochen, wird aber fünfzehn Mal gekauft.'],
  ['baby', 'Das Baby kennt schon eure Stimmen. Es weiß also auch, wer von euch am Telefon am lautesten lacht.'],
  ['baby', 'Babys kommen ohne Gebrauchsanweisung. Dafür mit dem besten Mix aus Charme und Dickkopf.'],
  ['baby', 'Vor dem Baby: acht Stunden Schlaf. Mit dem Baby: acht Stunden Schlaf, verteilt auf drei Wochen.'],
  ['baby', 'Das Kinderzimmer ist fertig, die Wickelkommode steht, nur das Baby muss noch seinen Einzug anmelden.'],
  ['baby', 'Ein Baby braucht nur drei Dinge: Liebe, Milch und Eltern, die lachen können, wenn mal alles schiefgeht.'],
  ['baby', 'Der erste Tritt gegen die Bauchdecke heißt übersetzt: Ich bin da, und ich bin ein bisschen ungeduldig.'],
  ['geburt', 'Der Kreißsaal ist der einzige Ort, an dem Atmen Teamarbeit ist.'],
  ['geburt', 'Die Kliniktasche ist seit Woche 30 gepackt. Der Inhalt: dreimal zu viel von allem und eine Packung Traubenzucker.'],
  ['geburt', 'Hebammen sind Superheldinnen ohne Umhang. Sie erkennen Wehen am Gesichtsausdruck des Papas.'],
  ['geburt', 'Geburtsvorbereitung ist wie Kino: Man weiß nicht genau, was kommt, aber man freut sich riesig darauf.'],
  ['geburt', 'Wenn der große Moment kommt, sind alle Pläne egal. Hauptsache: atmen, Händchen halten, lächeln.'],
  ['geburt', 'Nach der Geburt verblasst die Mühe erstaunlich schnell. Die Natur versteht eben etwas von Marketing.'],
  ['mut', 'Du bist stärker als jede To-do-Liste. Und die darf heute auch mal bis morgen warten.'],
  ['mut', 'Jede Woche ein bisschen mehr Mensch, jede Woche ein bisschen mehr Familie. Das ist ein Zwischenstand, auf den man stolz sein darf.'],
  ['mut', 'Perfekte Eltern gibt es nicht. Aber es gibt Eltern, die sich Mühe geben, und das ist viel besser.'],
  ['mut', 'Wenn alles ruhig ist, genieße es. Wenn nicht, atme tief durch. In beiden Fällen: gut gemacht.'],
  ['mut', 'Ihr müsst nicht alles wissen. Ihr müsst nur gemeinsam losgehen. Den Rest lernt ihr unterwegs.'],
  ['mut', 'Das Leben wird gleich bunter, lauter und viel schöner. Und ihr seid schon jetzt bereit dafür.']
];
Object.assign(PAGE_AUDIENCE, { jokes: 'together' });
Object.assign(PAGE_ICON, { jokes: 'balloon-heart-fill' });

/* ---------- Wochen-Story: Entwicklung des Babys schön teilen ----------
   Größe und Gewicht sind grobe Durchschnittswerte (Richtwerte) und ersetzen keine ärztliche Beratung. Zwischen den Stützpunkten wird gerundet berechnet. */
const FRUIT_ART = { 'Mohnsamen': 'ein', 'Sesamkorn': 'ein', 'Linse': 'eine', 'Heidelbeere': 'eine', 'Himbeere': 'eine', 'Kirsche': 'eine', 'Kumquat': 'eine', 'Feige': 'eine', 'Limette': 'eine', 'Zitrone': 'eine', 'Pfirsich': 'ein', 'Apfel': 'ein', 'Avocado': 'eine', 'Birne': 'eine', 'Paprika': 'eine', 'Mango': 'eine', 'Banane': 'eine', 'Karotte': 'eine', 'Papaya': 'eine', 'Grapefruit': 'eine', 'Maiskolben': 'ein', 'Blumenkohl': 'ein', 'Salatkopf': 'ein', 'Brokkoli': 'ein', 'Aubergine': 'eine', 'Butternusskürbis': 'ein', 'Kohlkopf': 'ein', 'Kokosnuss': 'eine', 'Ananas': 'eine', 'große Ananas': 'eine', 'Honigmelone': 'eine', 'Romanasalat': 'ein', 'Mangold': 'ein', 'Lauchstange': 'eine', 'Mini-Wassermelone': 'eine', 'Wassermelone': 'eine', 'kleiner Kürbis': 'ein' };
const WEEK_BODY = [[4, 1, 0], [5, 2, 0], [6, 4, 0], [7, 10, 1], [8, 16, 1], [10, 31, 4], [12, 54, 14], [14, 87, 43], [16, 116, 100], [18, 142, 190], [20, 256, 300], [22, 278, 430], [24, 300, 600], [26, 350, 760], [28, 376, 1005], [30, 400, 1300], [32, 424, 1700], [34, 450, 2150], [36, 474, 2600], [38, 495, 3000], [40, 510, 3400], [42, 520, 3600]];
const WEEK_DEV = {
  4: 'Die Einnistung ist geschafft. Aus einem winzigen Zellhaufen entsteht jetzt das Fundament für alles.', 5: 'Das Herz beginnt zu schlagen. Auch Gehirn und Rückenmark legen los.', 6: 'Erste Anlagen für Arme und Beine. Das Herz schlägt schon kräftig und regelmäßig.', 7: 'Hände und Füße formen sich, das Gesicht bekommt erste Konturen.',
  8: 'Finger und Zehen werden sichtbar. Das Baby bewegt sich schon, auch wenn du es noch nicht spürst.', 9: 'Die wichtigsten Organe sind angelegt. Aus dem Embryo wird langsam ein kleiner Mensch.', 10: 'Die Gelenke entwickeln sich, kleine Zähnchen legen sich im Kiefer an.', 11: 'Der Kopf ist noch groß, der Körper holt auf. Das Baby kann schon Fäustchen machen.',
  12: 'Die Reflexe entwickeln sich. Das Baby kann den Mund öffnen und schließen.', 13: 'Die Stimmbänder entstehen, die Fingerabdrücke bilden sich aus. Ein echtes Unikat.', 14: 'Das Baby kann Grimassen schneiden und am Daumen nuckeln.', 15: 'Die Haut ist noch hauchdünn. Das Baby reagiert vielleicht schon auf Licht.',
  16: 'Die Muskeln werden kräftiger. Manche Mütter spüren jetzt die ersten sanften Bewegungen.', 17: 'Das Skelett verhärtet sich, das Baby bekommt eine schützende Schicht auf der Haut.', 18: 'Das Gehör entwickelt sich. Dein Baby kann bald deine Stimme hören.', 19: 'Die Sinne werden feiner, die Haut schützt sich mit einer cremigen Schicht.',
  20: 'Halbzeit! Das Baby schluckt Fruchtwasser und übt für das Leben draußen.', 21: 'Die Bewegungen werden deutlicher. Vielleicht spürst du jetzt Tritte und Drehungen.', 22: 'Die Sinne reifen. Das Baby reagiert auf Berührungen und Geräusche.', 23: 'Das Baby hört Geräusche von draußen. Sprich ruhig mit ihm, es kennt deine Stimme.',
  24: 'Die Lungen reifen weiter. Das Gesicht ist fast fertig ausgebildet.', 25: 'Das Baby legt an Fett zu. Die Haut wird glatter und praller.', 26: 'Die Augen können sich bald öffnen. Das Baby reagiert auf Licht und Schall.', 27: 'Das Gehirn arbeitet auf Hochtouren. Das Baby hat feste Schlaf- und Wachphasen.',
  28: 'Das dritte Trimester beginnt. Das Baby öffnet die Augen und träumt vielleicht schon.', 29: 'Die Muskeln werden stärker, die Tritte kräftiger. Das Baby übt Atembewegungen.', 30: 'Das Baby wächst und legt weiter an Gewicht zu. Es wird enger im Bauch.', 31: 'Das Baby dreht sich oft. Die Sinne funktionieren schon sehr gut.',
  32: 'Die Nägel wachsen, das Baby übt Saugen und Schlucken.', 33: 'Die Knochen härten aus, der Schädel bleibt weich und beweglich für die Geburt.', 34: 'Die Lungen sind fast reif. Viele Babys drehen sich langsam in die Kopflage.', 35: 'Das Baby nimmt kräftig zu. Nieren und Leber arbeiten schon.',
  36: 'Das Baby rutscht oft tiefer ins Becken. Bald geht es los.', 37: 'Ab jetzt gilt das Baby als reif. Es übt Atmen, Saugen und Greifen.', 38: 'Alle Organe sind bereit. Das Baby sammelt letzte Reserven.', 39: 'Das Baby ist startklar und wartet nur noch auf sein Zeichen.',
  40: 'Der Termin ist da. Dein Baby bestimmt, wann es losgeht.', 41: 'Noch ein bisschen Geduld: Dein Baby braucht noch einen Moment. Ihr schafft das.', 42: 'Wenn sich das Baby noch Zeit lässt, begleiten euch Hebamme und Frauenarzt eng.'
};
Object.assign(PAGE_AUDIENCE, { weekstory: 'together' });
Object.assign(PAGE_ICON, { weekstory: 'stars' });

/* ---------- Eigene Illustrationen für die Wochen-Story (selbst gezeichnet als SVG, keine Fremdbilder, keine Lizenzfragen, offline) ---------- */
// Weiche Randschattierung für Tiefe (alle Früchte teilen sie)
const RIMDEF = '<radialGradient id="rim" cx="50%" cy="45%" r="62%"><stop offset=".62" stop-color="#3a1020" stop-opacity="0"/><stop offset="1" stop-color="#3a1020" stop-opacity=".3"/></radialGradient>';
const OUTLINE = '<filter id="outl" x="-10%" y="-10%" width="120%" height="120%"><feMorphology in="SourceAlpha" operator="dilate" radius="1.8" result="d"/><feFlood flood-color="#5b2c1d" flood-opacity=".42"/><feComposite in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
const svgWrap = (inner, defs = '', shadow = true) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" role="img"><defs>${RIMDEF}${OUTLINE}${defs}</defs>${shadow ? '<ellipse cx="100" cy="184" rx="58" ry="8" fill="#000" opacity=".12"/>' : ''}<g filter="url(#outl)">${inner}</g></svg>`;
const rg = (id, c1, c2, cx = 35, cy = 30) => `<radialGradient id="${id}" cx="${cx}%" cy="${cy}%" r="80%"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient>`;
const lg = (id, c1, c2, x2 = 1, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`;
const shine = (x, y, rx, ry, rot = -35, o = .4) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity="${o}" transform="rotate(${rot} ${x} ${y})"/>`;
const leafSVG = (x, y, rot, col = '#4f9d52', s = 1) => `<path d="M0 0 C 16 -20 44 -20 54 -3 C 38 9 13 9 0 0 Z" fill="${col}" transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"/>`;
const stemSVG = (x, y, h = 22, col = '#6b4f2a') => `<path d="M${x} ${y} q 3 -${h / 2} 10 -${h}" stroke="${col}" stroke-width="6" stroke-linecap="round" fill="none"/>`;
const roundFruit = (id, c1, c2, o = {}) => { const r = o.r || 68, cy = o.cy || 108; return svgWrap(`<circle cx="100" cy="${cy}" r="${r}" fill="url(#${id})"/><circle cx="100" cy="${cy}" r="${r}" fill="url(#rim)"/>${o.dimple ? `<ellipse cx="100" cy="${cy - r + 8}" rx="14" ry="6" fill="${o.dimple}" opacity=".5"/>` : ''}${o.cleft ? `<path d="M100 ${cy - r + 4} C 88 ${cy - 20} 88 ${cy + 30} 100 ${cy + r - 6}" stroke="${o.cleft}" stroke-width="4" fill="none" opacity=".45"/>` : ''}${o.extra || ''}${shine(78, cy - 26, 16, 24)}${o.stem === false ? '' : stemSVG(100, cy - r + 6)}${o.leaf === false ? '' : leafSVG(106, cy - r + 2, -25, '#4f9d52', .8)}`, rg(id, c1, c2)); };
const blobFruit = (id, c1, c2, d, o = {}) => svgWrap(`<path d="${d}" fill="url(#${id})" ${o.tr ? `transform="${o.tr}"` : ''}/><path d="${d}" fill="url(#rim)" ${o.tr ? `transform="${o.tr}"` : ''}/>${o.extra || ''}${shine(o.sx || 80, o.sy || 90, 14, 26)}${o.top || ''}`, rg(id, c1, c2));
const PEAR = 'M100 28 C 119 28 122 58 130 84 C 152 104 160 132 142 156 C 126 176 74 176 58 156 C 40 132 48 104 70 84 C 78 58 81 28 100 28 Z';
const BELL = 'M100 36 C 150 30 160 70 150 104 C 146 140 138 170 100 170 C 62 170 54 140 50 104 C 40 70 50 30 100 36 Z';
const FRUIT_DRAW = {
  'Mohnsamen': () => svgWrap([[70, 120, 14], [112, 96, 16], [130, 132, 12], [92, 148, 13], [150, 100, 10], [64, 90, 9]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#2f3b52"/><circle cx="${x - r / 3}" cy="${y - r / 3}" r="${r / 3.4}" fill="#fff" opacity=".35"/>`).join('')),
  'Sesamkorn': () => svgWrap([[70, 110, -30], [114, 92, 20], [128, 138, -10], [88, 144, 35], [150, 106, 50]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="22" ry="11" fill="#e8d3a2" stroke="#c9ae77" stroke-width="2" transform="rotate(${r} ${x} ${y})"/>`).join('')),
  'Linse': () => svgWrap([[80, 104, 10], [118, 98, -12], [100, 138, 4], [140, 134, 18], [66, 138, -8]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="26" ry="20" fill="#b8793b" stroke="#8d5a26" stroke-width="2" transform="rotate(${r} ${x} ${y})"/><ellipse cx="${x - 7}" cy="${y - 6}" rx="9" ry="5" fill="#fff" opacity=".3"/>`).join('')),
  'Heidelbeere': () => roundFruit('hb', '#8a9be6', '#2f3e8f', { r: 62, cy: 112, stem: false, leaf: false, extra: '<path d="M100 56 l8 14 l16 -4 l-6 16 l-18 4 l-18 -4 l-6 -16 l16 4 z" fill="#1f2a6b" opacity=".65"/>' }),
  'Himbeere': () => svgWrap(`<path d="M100 40 C 150 40 156 100 128 164 C 116 178 84 178 72 164 C 44 100 50 40 100 40 Z" fill="#d81b4a"/>${[[78, 70], [100, 62], [122, 70], [70, 96], [92, 90], [114, 90], [136, 96], [76, 122], [98, 118], [120, 118], [92, 146], [112, 146], [100, 166]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="url(#hm)"/>`).join('')}${shine(80, 80, 10, 18)}${leafSVG(100, 42, -150, '#4f9d52', .7)}${leafSVG(100, 42, -30, '#4f9d52', .7)}`, rg('hm', '#ff6b8f', '#b3123a')),
  'Kirsche': () => svgWrap(`<path d="M72 118 C 84 80 100 50 130 34 M128 122 C 126 90 124 62 130 34" stroke="#4f7a32" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="68" cy="136" r="38" fill="url(#ki)"/><circle cx="132" cy="140" r="36" fill="url(#ki)"/>${shine(54, 122, 9, 15)}${shine(118, 126, 9, 14)}${leafSVG(128, 34, -20, '#4f9d52', .8)}`, rg('ki', '#ff6a6a', '#a50e22')),
  'Kumquat': () => blobFruit('kq', '#ffc65a', '#f08a0c', 'M100 62 C 148 62 160 100 150 128 C 140 160 60 160 50 128 C 40 100 52 62 100 62 Z', { extra: leafSVG(104, 64, -35, '#4f9d52', .8), sx: 78, sy: 100 }),
  'Feige': () => blobFruit('fe', '#a077c9', '#4a2a73', 'M100 48 C 126 48 130 74 142 98 C 160 124 150 168 100 172 C 50 168 40 124 58 98 C 70 74 74 48 100 48 Z', { extra: '<path d="M100 56 C 100 100 100 140 100 170" stroke="#3b2060" stroke-width="3" fill="none" opacity=".35"/>', top: stemSVG(100, 52, 18, '#5a7a32') }),
  'Limette': () => svgWrap(`<ellipse cx="100" cy="110" rx="70" ry="54" fill="url(#li)"/><ellipse cx="36" cy="110" rx="9" ry="12" fill="#4a8a1a"/><ellipse cx="164" cy="110" rx="9" ry="12" fill="#4a8a1a"/>${shine(76, 90, 14, 26, -60)}`, rg('li', '#c6f06a', '#5aa51e')),
  'Zitrone': () => svgWrap(`<ellipse cx="100" cy="110" rx="72" ry="56" fill="url(#zi)"/><ellipse cx="34" cy="110" rx="10" ry="13" fill="#e0b400"/><ellipse cx="166" cy="110" rx="10" ry="13" fill="#e0b400"/>${shine(76, 88, 14, 26, -60)}${leafSVG(142, 68, -35, '#4f9d52', .7)}`, rg('zi', '#fff27a', '#f2b700')),
  'Pfirsich': () => roundFruit('pf', '#ffe0b8', '#f08a5d', { cleft: '#c9532f' }),
  'Apfel': () => roundFruit('ap', '#ff8a7a', '#b71c1c', { dimple: '#7a1010' }),
  'Avocado': () => blobFruit('av', '#9ccc65', '#2e5d1e', PEAR, { extra: '<ellipse cx="100" cy="132" rx="26" ry="30" fill="#6b4a2b" opacity=".0"/>', top: stemSVG(100, 32, 16, '#3b4a1f') }),
  'Birne': () => blobFruit('bi', '#f4f08a', '#9cb62f', PEAR, { top: stemSVG(100, 32, 22) + leafSVG(106, 34, -25, '#4f9d52', .7) }),
  'Paprika': () => blobFruit('pa', '#ff6a5a', '#b3141b', BELL, { extra: '<path d="M78 60 C 70 110 76 150 92 168 M122 60 C 130 110 124 150 108 168" stroke="#7a0c12" stroke-width="3" fill="none" opacity=".25"/>', top: `<path d="M84 36 C 88 22 112 22 116 36 Z" fill="#3f8b3a"/>${stemSVG(100, 30, 18, '#3f8b3a')}` }),
  'Mango': () => svgWrap(`<path d="M50 112 C 42 68 88 42 128 54 C 168 66 174 124 140 158 C 106 188 58 162 50 112 Z" fill="url(#mg)"/><path d="M50 112 C 42 68 88 42 128 54 C 168 66 174 124 140 158 C 106 188 58 162 50 112 Z" fill="url(#rim)"/>${shine(76, 86, 12, 26, -50, .45)}${stemSVG(122, 56, 16, '#5a7a32')}${leafSVG(128, 54, -20, '#3f9a4a', .85)}`, '<linearGradient id="mg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a8d86a"/><stop offset=".42" stop-color="#ffd45a"/><stop offset="1" stop-color="#f0553a"/></linearGradient>'),
  'Banane': () => svgWrap(`<path d="M44 70 C 70 150 130 170 168 100 C 172 94 160 88 156 96 C 124 146 84 136 62 62 C 60 54 42 60 44 70 Z" fill="url(#bn)" stroke="#c9a400" stroke-width="2"/><path d="M44 66 l6 -12 l10 6 z" fill="#5a4a1a"/><path d="M164 98 l12 -4 l-2 10 z" fill="#5a4a1a"/>${shine(80, 120, 8, 26, -60, .45)}`, lg('bn', '#fff07a', '#f2c200', 1, 1)),
  'Karotte': () => svgWrap(`<path d="M70 66 C 130 56 150 70 140 84 C 120 118 78 168 42 176 C 36 150 60 100 70 66 Z" fill="url(#ka)" transform="rotate(20 100 110)"/><path d="M96 78 l14 4 M88 100 l16 4 M76 124 l12 4" stroke="#c4560a" stroke-width="3" opacity=".45" stroke-linecap="round" transform="rotate(20 100 110)"/>${leafSVG(142, 52, -80, '#4f9d52', .9)}${leafSVG(142, 52, -40, '#5fae5a', .9)}${leafSVG(142, 52, -120, '#3f8b3a', .8)}`, lg('ka', '#ffa94d', '#e8620c', 1, 1)),
  'Papaya': () => svgWrap(`<path d="M100 28 C 150 40 164 120 130 166 C 112 186 88 186 70 166 C 36 120 50 40 100 28 Z" fill="url(#py)"/><path d="M100 40 C 98 96 100 140 100 176" stroke="#c9650a" stroke-width="3" fill="none" opacity=".3"/>${shine(78, 80, 10, 26, -12)}${stemSVG(100, 32, 14, '#5a7a32')}`, lg('py', '#ffd36a', '#f08a1c', .6, 1)),
  'Grapefruit': () => roundFruit('gf', '#ffd990', '#f1832c', { r: 72, dimple: '#c8631a' }),
  'Maiskolben': () => svgWrap(`<path d="M100 22 C 126 40 132 110 118 166 C 112 182 88 182 82 166 C 68 110 74 40 100 22 Z" fill="url(#mk)"/>${[[88, 56], [112, 56], [82, 82], [100, 82], [118, 82], [80, 110], [98, 110], [118, 110], [82, 138], [100, 138], [118, 138]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#ffe27a" stroke="#d99a00" stroke-width="1.5"/>`).join('')}<path d="M100 188 C 44 170 36 110 70 78 C 70 130 86 160 100 188 Z" fill="#6bb35a"/><path d="M100 188 C 156 170 164 110 130 78 C 130 130 114 160 100 188 Z" fill="#4f9d52"/>`, lg('mk', '#ffd23a', '#e8a400', .3, 1)),
  'Blumenkohl': () => svgWrap(`<path d="M60 130 C 30 130 30 170 100 176 C 170 170 170 130 140 130 Z" fill="#6bb35a"/>${[[70, 100, 34], [112, 90, 38], [150, 104, 30], [94, 62, 34], [130, 62, 28], [60, 74, 26]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#bk)"/>`).join('')}<path d="M64 134 C 70 150 90 160 100 160 C 112 160 130 150 138 134 Z" fill="#8fd17a"/>`, rg('bk', '#fffdf2', '#e3d6a8')),
  'Brokkoli': () => svgWrap(`<path d="M86 176 L90 120 L110 120 L114 176 Z" fill="#8fc46a"/>${[[66, 96, 32], [106, 80, 38], [146, 98, 30], [88, 56, 28], [126, 56, 26], [56, 66, 22]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#bc)"/>`).join('')}`, rg('bc', '#7ccf62', '#2f7a2a')),
  'Salatkopf': () => svgWrap([[-40, '#7bc65a'], [-14, '#8fd16a'], [14, '#6bb94f'], [40, '#82cc62'], [0, '#a2dc7e']].map(([r, c]) => `<ellipse cx="100" cy="112" rx="40" ry="70" fill="${c}" stroke="#4a8a3a" stroke-width="2" transform="rotate(${r} 100 150)"/>`).join('') + '<path d="M100 60 C 98 100 100 140 100 170" stroke="#4a8a3a" stroke-width="3" fill="none" opacity=".4"/>'),
  'Romanasalat': () => svgWrap([[-24, '#6bb94f'], [24, '#6bb94f'], [-8, '#8fd16a'], [10, '#7bc65a'], [0, '#b8e68e']].map(([r, c]) => `<ellipse cx="100" cy="104" rx="30" ry="78" fill="${c}" stroke="#4a8a3a" stroke-width="2" transform="rotate(${r} 100 170)"/>`).join('') + '<path d="M100 40 C 98 90 100 140 100 176" stroke="#e9f5c8" stroke-width="4" fill="none" opacity=".7"/>'),
  'Mangold': () => svgWrap([[-26, '#3f9d4f'], [26, '#3f9d4f'], [0, '#58b563']].map(([r, c]) => `<ellipse cx="100" cy="86" rx="34" ry="66" fill="${c}" stroke="#2d7a3a" stroke-width="2" transform="rotate(${r} 100 170)"/>`).join('') + [[-26], [26], [0]].map(([r]) => `<path d="M100 170 L100 40" stroke="#d6364a" stroke-width="5" stroke-linecap="round" transform="rotate(${r} 100 170)"/>`).join('') + '<path d="M92 170 h16 v14 h-16 z" fill="#d6364a"/>'),
  'Kohlkopf': () => svgWrap(`<circle cx="100" cy="106" r="70" fill="url(#kc)"/><path d="M100 38 C 70 70 70 140 100 174 M100 38 C 130 70 130 140 100 174 M34 106 C 70 90 130 90 166 106" stroke="#4a8a3a" stroke-width="3" fill="none" opacity=".45"/>${shine(76, 78, 14, 24)}`, rg('kc', '#cdeaa2', '#6bb94f')),
  'Aubergine': () => svgWrap(`<path d="M120 36 C 160 60 168 120 130 160 C 100 190 50 180 44 140 C 40 100 90 90 100 60 C 104 48 110 40 120 36 Z" fill="url(#au)"/>${shine(112, 112, 10, 32, 40, .35)}<path d="M98 56 C 106 38 124 28 138 38 C 128 52 112 62 98 56 Z" fill="#4f8a3a"/><path d="M112 40 q 8 -14 20 -12" stroke="#4f8a3a" stroke-width="6" fill="none" stroke-linecap="round"/>`, lg('au', '#a56ad0', '#3a1560', 1, 1)),
  'Butternusskürbis': () => svgWrap(`<path d="M80 40 C 80 36 120 36 120 40 C 124 74 122 84 140 104 C 168 134 160 174 100 176 C 40 174 32 134 60 104 C 78 84 76 74 80 40 Z" fill="url(#bu)"/><path d="M100 50 C 98 100 98 140 100 172" stroke="#b86e1c" stroke-width="3" fill="none" opacity=".4"/>${shine(76, 130, 10, 26, 10, .35)}${stemSVG(100, 40, 14, '#6b5a2a')}`, lg('bu', '#ffd9a0', '#e29a45', .6, 1)),
  'Kokosnuss': () => roundFruit('ko', '#c99768', '#6b4426', { r: 70, stem: false, leaf: false, extra: '<g stroke="#4a2f1a" stroke-width="2.6" stroke-linecap="round" opacity=".38" fill="none"><path d="M52 98 l8 4 M60 126 l9 2 M70 152 l8 -3 M140 98 l-8 4 M146 128 l-9 1 M132 154 l-8 -4 M100 160 l0 8 M84 170 l3 5 M118 170 l-3 5"/></g><circle cx="90" cy="60" r="5.6" fill="#3a2412"/><circle cx="110" cy="60" r="5.6" fill="#3a2412"/><circle cx="100" cy="73" r="5.6" fill="#3a2412"/><path d="M118 52 C 128 28 142 16 156 14" stroke="#ff6f91" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M122 44 l7 -5 M130 32 l7 -5 M140 22 l7 -4" stroke="#fff" stroke-width="3" stroke-linecap="round"/><g transform="translate(80 46)"><g fill="#ff9ec2" stroke="#ff6f91" stroke-width="1.6"><circle cx="0" cy="-9" r="7"/><circle cx="9" cy="-3" r="7"/><circle cx="6" cy="8" r="7"/><circle cx="-6" cy="8" r="7"/><circle cx="-9" cy="-3" r="7"/></g><circle cx="0" cy="0" r="5" fill="#ffd45a"/></g>' }),
  'Ananas': () => svgWrap(`<path d="M52 44 C 62 54 78 64 94 78 C 74 80 54 70 52 44Z" fill="url(#anl)"/><path d="M148 44 C 138 54 122 64 106 78 C 126 80 146 70 148 44Z" fill="url(#anl)"/><path d="M72 18 C 78 40 88 58 98 78 C 80 68 62 48 72 18Z" fill="url(#anm)"/><path d="M128 18 C 122 40 112 58 102 78 C 120 68 138 48 128 18Z" fill="url(#anm)"/><path d="M100 4 C 90 30 90 56 100 80 C 110 56 110 30 100 4Z" fill="url(#anc)"/><path d="M100 14 C 97 32 97 52 100 70" stroke="#2f7a35" stroke-width="2" fill="none" opacity=".45"/><clipPath id="anclip"><ellipse cx="100" cy="128" rx="56" ry="58"/></clipPath><ellipse cx="100" cy="128" rx="56" ry="58" fill="url(#an)"/><g clip-path="url(#anclip)" stroke="#c5800f" stroke-width="2.6" opacity=".5" fill="none"><path d="M30 80 L150 200 M24 106 L130 212 M50 62 L170 182 M76 54 L186 164 M100 52 L196 148"/><path d="M170 80 L50 200 M176 106 L70 212 M150 62 L30 182 M124 54 L14 164 M100 52 L4 148"/></g><g clip-path="url(#anclip)" fill="#c5800f" opacity=".45"><circle cx="76" cy="104" r="2.6"/><circle cx="124" cy="104" r="2.6"/><circle cx="100" cy="84" r="2.6"/><circle cx="62" cy="136" r="2.6"/><circle cx="138" cy="136" r="2.6"/><circle cx="82" cy="164" r="2.6"/><circle cx="118" cy="164" r="2.6"/></g><ellipse cx="100" cy="128" rx="56" ry="58" fill="url(#rim)"/>${shine(74, 104, 9, 30, 12, .38)}${shine(68, 142, 4, 8, 12, .5)}`, rg('an', '#ffe98a', '#f0a41c') + '<linearGradient id="anl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6fcf5c"/><stop offset="1" stop-color="#2f8a3a"/></linearGradient><linearGradient id="anm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ddc66"/><stop offset="1" stop-color="#37923c"/></linearGradient><linearGradient id="anc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ae87a"/><stop offset="1" stop-color="#3fa044"/></linearGradient>'),
  'große Ananas': () => FRUIT_DRAW['Ananas'](),
  'Honigmelone': () => roundFruit('hm2', '#f4f2b8', '#b9c25a', { r: 70, stem: true, leaf: false, extra: '<path d="M44 90 C 80 80 120 130 156 112 M40 124 C 80 114 120 164 158 146 M70 52 C 80 80 70 140 84 170 M130 50 C 120 90 134 140 120 172" stroke="#8d9a2a" stroke-width="2.5" fill="none" opacity=".45"/>' }),
  'Mini-Wassermelone': () => roundFruit('wm', '#7ad06a', '#1f7a2a', { r: 66, stem: true, leaf: false, extra: '<path d="M100 44 C 70 80 70 140 100 172 M100 44 C 130 80 130 140 100 172 M70 52 C 46 96 56 140 80 168 M130 52 C 154 96 144 140 120 168" stroke="#14501a" stroke-width="6" fill="none" opacity=".55"/>' }),
  'Wassermelone': () => FRUIT_DRAW['Mini-Wassermelone'](),
  'Lauchstange': () => svgWrap(`<path d="M86 176 L86 100 L114 100 L114 176 Z" fill="url(#lw)"/><path d="M86 100 C 60 70 56 40 70 22 C 80 50 90 70 98 100 Z" fill="#4f9d52"/><path d="M114 100 C 140 70 144 40 130 22 C 120 50 110 70 102 100 Z" fill="#3f8b3a"/><path d="M98 100 C 96 70 98 40 100 12 C 104 40 106 70 102 100 Z" fill="#6bb35a"/><path d="M92 176 l-6 8 M100 176 v10 M108 176 l6 8" stroke="#c9b98a" stroke-width="3" stroke-linecap="round"/>`, lg('lw', '#fffbea', '#d8e8b0', 0, 1)),
  'kleiner Kürbis': () => svgWrap(`<ellipse cx="100" cy="112" rx="72" ry="60" fill="url(#ku)"/><path d="M100 54 C 70 80 70 142 100 172 M100 54 C 130 80 130 142 100 172 M64 66 C 40 100 52 142 76 164 M136 66 C 160 100 148 142 124 164" stroke="#b34a0c" stroke-width="3.5" fill="none" opacity=".4"/>${shine(70, 92, 12, 26, -30, .35)}${stemSVG(100, 54, 18, '#5a7a32')}${leafSVG(108, 50, -20, '#4f9d52', .7)}`, rg('ku', '#ffb35a', '#e5620c'))
};
// Süßes Gesicht für jede Frucht (Name: [x, y, Größe]); Samen und Kerne bleiben ohne Gesicht
const FACE_POS = { 'Himbeere': [100, 112, .8], 'Kirsche': [68, 140, .6], 'Heidelbeere': [100, 120, .8], 'Kumquat': [100, 112, .7], 'Feige': [100, 128, .8], 'Banane': [112, 128, .6], 'Karotte': [92, 112, .6], 'Maiskolben': [100, 98, .75], 'Blumenkohl': [100, 98, .8], 'Brokkoli': [100, 84, .8], 'Salatkopf': [100, 112, .8], 'Romanasalat': [100, 112, .7], 'Mangold': [100, 100, .75], 'Lauchstange': [100, 142, .55], 'Ananas': [100, 130, .95], 'große Ananas': [100, 130, .95], 'Papaya': [100, 110, .8], 'Aubergine': [100, 124, .75], 'Mango': [96, 116, .8], 'Butternusskürbis': [100, 134, .8], 'Paprika': [100, 108, .85], 'Avocado': [100, 122, .85], 'Birne': [100, 124, .85], 'Limette': [100, 112, .75], 'Zitrone': [100, 112, .75], 'Pfirsich': [100, 114, .85], 'Apfel': [100, 114, .85], 'Grapefruit': [100, 114, .9], 'Kohlkopf': [100, 112, .85], 'Kokosnuss': [100, 130, .85], 'Honigmelone': [100, 118, .85], 'Mini-Wassermelone': [100, 118, .85], 'Wassermelone': [100, 118, .85], 'kleiner Kürbis': [100, 116, .85] };
// Gesichter mit Charakter: smile (lieb), grin (lacht mit Zunge), wink (zwinkert), wow (staunt), cool (Sonnenbrille), giggle (kichert mit zugekniffenen Augen)
const FACE_KIND = { 'Himbeere': 'giggle', 'Kirsche': 'grin', 'Heidelbeere': 'wow', 'Kumquat': 'wink', 'Feige': 'smile', 'Banane': 'grin', 'Karotte': 'wink', 'Maiskolben': 'grin', 'Blumenkohl': 'giggle', 'Brokkoli': 'wow', 'Salatkopf': 'smile', 'Romanasalat': 'wink', 'Mangold': 'grin', 'Lauchstange': 'wow', 'Ananas': 'smile', 'große Ananas': 'smile', 'Papaya': 'giggle', 'Aubergine': 'wink', 'Mango': 'grin', 'Butternusskürbis': 'smile', 'Paprika': 'wink', 'Avocado': 'cool', 'Birne': 'giggle', 'Limette': 'cool', 'Zitrone': 'wow', 'Pfirsich': 'smile', 'Apfel': 'wink', 'Grapefruit': 'grin', 'Kohlkopf': 'giggle', 'Kokosnuss': 'grin', 'Honigmelone': 'grin', 'Mini-Wassermelone': 'wink', 'Wassermelone': 'grin', 'kleiner Kürbis': 'grin' };
const faceSVG = (x, y, s, kind = 'smile') => {
  const ink = '#2a1a1a', cheeks = '<circle cx="-29" cy="12" r="7" fill="#ff7a9a" opacity=".6"/><circle cx="29" cy="12" r="7" fill="#ff7a9a" opacity=".6"/>';
  const eye = cx => `<ellipse cx="${cx}" cy="0" rx="5.2" ry="7" fill="${ink}"/><circle cx="${cx + 1.8}" cy="-2.6" r="2" fill="#fff"/>`;
  const smile = '<path d="M-9 11 Q 0 22 9 11" stroke="#2a1a1a" stroke-width="3.4" fill="none" stroke-linecap="round"/>';
  const mouths = {
    smile: eye(-17) + eye(17) + smile,
    grin: eye(-17) + eye(17) + '<path d="M-12 9 Q 0 30 12 9 Z" fill="#7a1d2e" stroke="#2a1a1a" stroke-width="2.6" stroke-linejoin="round"/><path d="M-6 19 Q 0 14 6 19 Q 0 26 -6 19 Z" fill="#ff7a9a"/>',
    wink: eye(-17) + '<path d="M10 2 Q 17 -6 24 2" stroke="#2a1a1a" stroke-width="3.6" fill="none" stroke-linecap="round"/>' + '<path d="M-9 10 Q 0 24 11 9" stroke="#2a1a1a" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M12 -12 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 z" fill="#fff" opacity=".9" transform="translate(14 -2) scale(.8)"/>',
    wow: eye(-17) + eye(17) + '<ellipse cx="0" cy="15" rx="5.5" ry="7" fill="#7a1d2e" stroke="#2a1a1a" stroke-width="2.4"/><path d="M-26 -14 q 9 -7 17 -2 M9 -16 q 9 -5 17 2" stroke="#2a1a1a" stroke-width="2.8" fill="none" stroke-linecap="round"/>',
    giggle: '<path d="M-24 3 Q -17 -6 -10 3 M10 3 Q 17 -6 24 3" stroke="#2a1a1a" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M-11 10 Q 0 28 11 10 Z" fill="#7a1d2e" stroke="#2a1a1a" stroke-width="2.4" stroke-linejoin="round"/>',
    cool: '<path d="M-31 -5 h62 q0 14 -14 14 h-10 q-6 0 -8 -6 q-2 6 -8 6 h-10 q-14 0 -12 -14 z" fill="#1c1c28"/><path d="M-27 -2 q6 -3 12 0" stroke="#fff" stroke-width="2.4" opacity=".55" fill="none" stroke-linecap="round"/><path d="M-10 17 Q 0 27 12 15" stroke="#2a1a1a" stroke-width="3.4" fill="none" stroke-linecap="round"/>'
  };
  return `<g transform="translate(${x} ${y}) scale(${s})">${cheeks}${mouths[kind] || mouths.smile}</g>`;
};
// Funkelsterne um die Figur herum (kleine Freude)
const sparkle = (x, y, s, o = .85) => `<path d="M${x} ${y - 10 * s} L${x + 3 * s} ${y - 3 * s} L${x + 10 * s} ${y} L${x + 3 * s} ${y + 3 * s} L${x} ${y + 10 * s} L${x - 3 * s} ${y + 3 * s} L${x - 10 * s} ${y} L${x - 3 * s} ${y - 3 * s} Z" fill="#fff6c9" stroke="#f6c945" stroke-width="1.2" opacity="${o}"/>`;
const fruitSVG = name => {
  let svg = (FRUIT_DRAW[name] || FRUIT_DRAW['Apfel'])(); const p = FACE_POS[name], seeds = !p;
  const deco = seeds ? '' : sparkle(168, 44, 1) + sparkle(34, 70, .7, .7) + sparkle(160, 150, .5, .6);
  return svg.replace('</svg>', (p ? faceSVG(p[0], p[1], p[2], FACE_KIND[name] || 'smile') : '') + deco + '</svg>');
};
// Süßes Baby in der Blase (quadratisch): stroke = Farbe der Gesichtszüge, fill = Glanz, bg = Farbe der Blase
// Zehn verschiedene Baby-Bilder (je nach Woche): winkt, schläft, lutscht Daumen, Schnuller, Hasenohren, Herzballon, Teddy, Kusshand, Rassel, mit der Frucht im Arm
const BABY_VARIANTS = 10;
// Hauptfarbe jeder Frucht: Das Baby trägt eine Mütze in dieser Farbe und passt so zur Frucht der Woche
const FRUIT_COLOR = { 'Mohnsamen': '#4a5878', 'Sesamkorn': '#d8c08a', 'Linse': '#b8793b', 'Heidelbeere': '#4a5bb8', 'Himbeere': '#d81b4a', 'Kirsche': '#d12a3a', 'Kumquat': '#f5a21c', 'Feige': '#7a4aa8', 'Limette': '#7cc22e', 'Zitrone': '#f6cf1d', 'Pfirsich': '#f4a27c', 'Apfel': '#d6342f', 'Avocado': '#5f8f3a', 'Birne': '#bcd04a', 'Paprika': '#d6342f', 'Mango': '#f6a43a', 'Banane': '#f7d33a', 'Karotte': '#f08a2a', 'Papaya': '#f49a2a', 'Grapefruit': '#f4873a', 'Maiskolben': '#f2c424', 'Blumenkohl': '#e9e0bb', 'Salatkopf': '#7bc65a', 'Brokkoli': '#3f9a3a', 'Aubergine': '#6a3a8f', 'Butternusskürbis': '#e8a85a', 'Kohlkopf': '#8cc66a', 'Kokosnuss': '#7a5233', 'Ananas': '#f0b323', 'große Ananas': '#f0b323', 'Honigmelone': '#c9d36a', 'Mini-Wassermelone': '#2f8a3a', 'Wassermelone': '#2f8a3a', 'Romanasalat': '#6bb94f', 'Mangold': '#3f9d4f', 'Lauchstange': '#8fc46a', 'kleiner Kürbis': '#e8701c' };
const babySVG = (stroke = '#3a2a2a', fill = '#ffffff', bg = '#8b4752', variant = 0, fruit = '') => {
  const v = ((Math.floor(+variant) || 0) % BABY_VARIANTS + BABY_VARIANTS) % BABY_VARIANTS, skin = '#ffc7a8', hand = '#ffd6bf', fc = FRUIT_COLOR[fruit] || '';
  const beanie = fc ? `<path d="M62 72 C 62 40 138 40 138 72 Q 100 60 62 72 Z" fill="${fc}"/><path d="M62 72 C 62 40 138 40 138 72 Q 100 60 62 72 Z" fill="#fff" opacity=".18"/><path d="M58 72 Q 100 58 142 72 Q 142 80 134 80 Q 100 68 66 80 Q 58 80 58 72 Z" fill="#fff"/><path d="M100 44 C 100 36 104 31 112 29" stroke="#6b4f2a" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M110 30 C 114 18 130 18 136 24 C 128 34 116 36 110 30 Z" fill="#4f9d52"/>` : '';
  const arm = (d, hx, hy) => `<path d="${d}" stroke="${skin}" stroke-width="14" fill="none" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="10" fill="${hand}"/>`;
  const openEye = cx => `<ellipse cx="${cx}" cy="80" rx="5.4" ry="7" fill="${stroke}"/><circle cx="${cx + 1.9}" cy="77.4" r="2" fill="#fff"/>`;
  const happyEyes = `<path d="M78 80 q8 9 16 0 M106 80 q8 9 16 0" stroke="${stroke}" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M76 79 l-4 -3 M124 79 l4 -3" stroke="${stroke}" stroke-width="2.4" stroke-linecap="round"/>`;
  const sleepEyes = `<path d="M78 82 q8 6 16 0 M106 82 q8 6 16 0" stroke="${stroke}" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M76 84 l-3 3 M124 84 l3 3" stroke="${stroke}" stroke-width="2.2" stroke-linecap="round"/>`;
  const bigSmile = `<path d="M89 98 Q100 114 111 98 Z" fill="#b5364f" stroke="${stroke}" stroke-width="2.4" stroke-linejoin="round"/><path d="M95 108 Q100 103 105 108 Q100 113 95 108 Z" fill="#ff8aa6"/>`;
  const smallSmile = `<path d="M92 99 q8 8 16 0" stroke="${stroke}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  const hair = `<path d="M97 41 C 88 26 112 22 114 34 C 115 42 105 45 102 39" stroke="#9a5a3a" stroke-width="3.6" fill="none" stroke-linecap="round"/>`;
  let arms = arm('M68 132 C 52 128 46 112 52 100', 51, 97) + arm('M132 132 C 148 124 156 106 150 92', 150, 88) + `<g fill="#ffe4d4"><circle cx="143" cy="80" r="3.6"/><circle cx="150" cy="77" r="3.6"/><circle cx="157" cy="80" r="3.6"/></g>`;
  let eyes = happyEyes, mouth = bigSmile, top = beanie || hair, face = '', deco = '';
  if (v === 1) { arms = arm('M68 134 C 56 144 62 158 80 158', 82, 158) + arm('M132 134 C 144 144 138 158 120 158', 118, 158); eyes = sleepEyes; mouth = smallSmile; top = `<path d="M60 72 C 60 34 140 34 140 72 Q 100 58 60 72 Z" fill="${fc || '#8fb7e6'}"/><path d="M58 72 Q 100 56 142 72 Q 142 80 134 80 Q 100 66 66 80 Q 58 80 58 72 Z" fill="#fff"/><path d="M134 50 C 156 46 168 66 160 88" stroke="${fc || '#8fb7e6'}" stroke-width="14" fill="none" stroke-linecap="round"/><circle cx="160" cy="92" r="9" fill="#fff"/>`; deco = `<path d="M150 36 h12 l-12 12 h12 M168 22 h8 l-8 8 h8" stroke="${fill}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".95"/>`; }
  if (v === 2) { arms = arm('M68 134 C 56 144 62 158 80 158', 82, 158) + arm('M132 128 C 142 118 126 108 114 104', 112, 102); eyes = openEye(86) + openEye(114); mouth = `<path d="M96 100 q4 4 8 0" stroke="${stroke}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`; face = `<ellipse cx="108" cy="104" rx="5" ry="8" fill="${hand}" transform="rotate(-25 108 104)"/>`; }
  if (v === 3) { arms = arm('M68 132 C 52 128 46 112 52 100', 51, 97) + arm('M132 134 C 144 144 138 158 120 158', 118, 158); eyes = openEye(86) + openEye(114); mouth = ''; face = `<circle cx="100" cy="106" r="9" fill="none" stroke="#7ec8e3" stroke-width="3.4"/><ellipse cx="100" cy="100" rx="11" ry="6.5" fill="#ff9ab0" stroke="#e8708f" stroke-width="1.6"/><circle cx="100" cy="100" r="2" fill="#fff" opacity=".8"/>`; }
  if (v === 4) { arms = arm('M68 134 C 52 130 48 116 56 104', 56, 100) + arm('M132 134 C 148 130 152 116 144 104', 144, 100); top = `<ellipse cx="76" cy="26" rx="11" ry="28" fill="#fff" stroke="#ffd0c0" stroke-width="2" transform="rotate(-10 76 26)"/><ellipse cx="76" cy="26" rx="5.4" ry="21" fill="#ffb3c6" transform="rotate(-10 76 26)"/><ellipse cx="124" cy="26" rx="11" ry="28" fill="#fff" stroke="#ffd0c0" stroke-width="2" transform="rotate(10 124 26)"/><ellipse cx="124" cy="26" rx="5.4" ry="21" fill="#ffb3c6" transform="rotate(10 124 26)"/><path d="M60 72 C 62 40 138 40 140 72 Q 100 60 60 72 Z" fill="#fff" stroke="#ffd0c0" stroke-width="2"/><circle cx="100" cy="46" r="6" fill="${fc || '#ffb3c6'}"/>`; }
  if (v === 5) { arms = arm('M68 132 C 52 128 46 112 52 100', 51, 97) + arm('M132 132 C 148 124 156 106 150 92', 150, 88); deco = `<path d="M152 88 C 154 74 158 66 160 58" stroke="${fill}" stroke-width="2" fill="none"/><path d="M160 56 C 138 40 146 22 158 25 C 162 26 163 31 160 33 C 163 31 164 26 168 25 C 180 22 184 40 160 56 Z" fill="#ff6f91" stroke="#fff" stroke-width="1.6"/><path d="M152 32 c 2 -4 6 -4 8 -2" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>`; }
  const restArms = arm('M68 134 C 56 144 62 158 82 156', 84, 156) + arm('M132 134 C 144 144 138 158 118 156', 116, 156);
  if (v === 6) { arms = restArms; face = `<circle cx="100" cy="150" r="19" fill="#c58b52"/><circle cx="85" cy="136" r="7" fill="#c58b52"/><circle cx="115" cy="136" r="7" fill="#c58b52"/><circle cx="85" cy="136" r="3.4" fill="#e8b98a"/><circle cx="115" cy="136" r="3.4" fill="#e8b98a"/><ellipse cx="100" cy="156" rx="9" ry="7" fill="#f1d2a8"/><circle cx="93" cy="146" r="2.2" fill="#3a2a2a"/><circle cx="107" cy="146" r="2.2" fill="#3a2a2a"/><ellipse cx="100" cy="153" rx="3.2" ry="2.4" fill="#5a3a22"/><circle cx="82" cy="152" r="8" fill="${hand}"/><circle cx="118" cy="152" r="8" fill="${hand}"/>`; }
  if (v === 7) { arms = arm('M68 132 C 52 128 46 112 52 100', 51, 97) + arm('M132 130 C 146 124 140 108 124 108', 122, 108); mouth = `<ellipse cx="100" cy="102" rx="4.6" ry="5.4" fill="#b5364f" stroke="${stroke}" stroke-width="2.2"/>`; deco = `<path d="M146 78 C 138 70 142 62 148 64 C 150 65 150 68 150 68 C 150 68 151 65 154 64 C 160 62 162 70 150 80 Z" fill="#ff6f91"/><path d="M168 56 C 163 51 166 46 170 47 C 171 48 171 50 171 50 C 171 50 172 48 174 47 C 178 46 179 51 171 58 Z" fill="#ffa3b8"/><path d="M138 52 c 2 -3 5 -3 6 -1" stroke="#fff" stroke-width="2" fill="none" opacity=".8" stroke-linecap="round"/>`; }
  if (v === 8) { arms = arm('M68 134 C 56 144 62 158 82 156', 84, 156) + arm('M132 132 C 148 124 156 106 150 92', 150, 88); deco = `<path d="M150 88 L162 60" stroke="#ffd45a" stroke-width="5" stroke-linecap="round"/><circle cx="166" cy="50" r="12" fill="#ffd45a" stroke="#e8a400" stroke-width="2"/><circle cx="162" cy="46" r="3" fill="#fff" opacity=".7"/><circle cx="170" cy="54" r="2.6" fill="#ff6f91"/><circle cx="160" cy="56" r="2.6" fill="#7ec8e3"/><path d="M178 38 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 z" fill="#fff" opacity=".9"/>`; }
  if (v === 9) { arms = restArms; const mini = fc ? fruitSVG(fruit).replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '') : ''; face = mini ? `<svg x="64" y="104" width="72" height="72" viewBox="0 0 200 200">${mini}</svg><circle cx="76" cy="150" r="8" fill="${hand}"/><circle cx="124" cy="150" r="8" fill="${hand}"/>` : ''; }  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" role="img"><defs><radialGradient id="bb" cx="40%" cy="30%" r="85%"><stop offset="0" stop-color="${bg}" stop-opacity=".55"/><stop offset="1" stop-color="${bg}"/></radialGradient><radialGradient id="bs" cx="40%" cy="32%" r="78%"><stop offset="0" stop-color="#ffeadc"/><stop offset="1" stop-color="${skin}"/></radialGradient></defs>
<circle cx="100" cy="100" r="95" fill="url(#bb)"/><circle cx="100" cy="100" r="92" fill="none" stroke="${fill}" stroke-width="4" opacity=".85"/><ellipse cx="56" cy="44" rx="24" ry="9" fill="#fff" opacity=".3" transform="rotate(-32 56 44)"/>
<g fill="${fill}" opacity=".9"><path d="M30 92 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 z"/><path d="M168 118 l2.4 6.4 l6.4 2.4 l-6.4 2.4 l-2.4 6.4 l-2.4 -6.4 l-6.4 -2.4 l6.4 -2.4 z"/><path d="M164 160 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 z"/></g>${deco}
<path d="M36 152 c -9 -9 4 -20 11 -9 c 7 -11 20 0 11 9 l -11 11 z" fill="#ff9ab0"/><path d="M42 140 c 3 -4 7 -3 8 0" stroke="#fff" stroke-width="2.4" fill="none" opacity=".7" stroke-linecap="round"/>
${arms}
<ellipse cx="100" cy="146" rx="42" ry="34" fill="url(#bs)"/>
<ellipse cx="78" cy="177" rx="13" ry="9" fill="${skin}" transform="rotate(-14 78 177)"/><ellipse cx="122" cy="177" rx="13" ry="9" fill="${skin}" transform="rotate(14 122 177)"/><g fill="#ffe4d4"><circle cx="68" cy="173" r="3"/><circle cx="74" cy="169" r="3"/><circle cx="132" cy="173" r="3"/><circle cx="126" cy="169" r="3"/></g>
<path d="M62 152 Q100 188 138 152 Q134 168 100 172 Q66 168 62 152 Z" fill="${fill}" stroke="#ffd0c0" stroke-width="1.6"/><circle cx="100" cy="164" r="3" fill="#ff9ab0"/>
<circle cx="60" cy="86" r="8" fill="#ffd0b6"/><circle cx="140" cy="86" r="8" fill="#ffd0b6"/>
<circle cx="100" cy="82" r="42" fill="url(#bs)"/><ellipse cx="82" cy="58" rx="14" ry="7" fill="#fff" opacity=".4" transform="rotate(-25 82 58)"/>
${top}${eyes}<circle cx="74" cy="97" r="8" fill="#ff8aa6" opacity=".6"/><circle cx="126" cy="97" r="8" fill="#ff8aa6" opacity=".6"/><circle cx="100" cy="90" r="2.2" fill="#e59a80"/>${mouth}${face}</svg>`;
};
/* ---------- Mundart-Überschriften für die Wochen-Story ({kid} = Kosename, {a} = ein/eine als Mundart "a" oder "e", {fruit} = Frucht) ---------- */
const STORY_DIALECT = {
  schwaebisch: ['{kid} isch jetzt so groß wie {a} {fruit}. Net schlecht, Herr Specht!', 'Gucket mol: {kid} isch so groß wie {a} {fruit}, ond wächst weiter!', 'So groß wie {a} {fruit}: Des isch {kid}. Mir schwätzet vo eim Wunder!', 'Wer hot {a} {fruit} bstellt? {kid} isch so groß, ond no viel schöner!'],
  bayrisch: ['{kid} is jetz so groß wia {a} {fruit}. Des passt scho!', 'Mei, schau hi: {kid} is so groß wia {a} {fruit}!', '{a} {fruit} im Bauch? Naa, des is {kid}, und des wachst und wachst!', 'Griaß di, {kid}! Jetz bist so groß wia {a} {fruit}. A Wahnsinn!'],
  hessisch: ['{kid} is jetzt so groß wie {a} {fruit}. Des is ja Wahnsinn!', 'Ei guck mal: {kid} is so groß wie {a} {fruit}!', 'So groß wie {a} {fruit}: Des is {kid}. Do kann mer nur stolz sei!', 'Ei Gude, {kid}! Jetzt bist du so groß wie {a} {fruit}. Des babbelt sich leicht!']
};

/* ---------- Mehr Mundarten: Sächsisch und Ostfriesisch ---------- */
Object.assign(DIALECTS, { saechsisch: 'Sächsisch', ostfriesisch: 'Ostfriesisch' });
const DIA_ART = { hessisch: 'e', bayrisch: 'a', schwaebisch: 'a', saechsisch: 'ä', ostfriesisch: 'een' };
Object.assign(DIALECT_QUOTES, {
  saechsisch: {
    mama: ['Nu glar machst du das gut, dr Gleene kann sich glücklich schätzen!', 'Gönn dir ä Päusschen, du Gudste. Das Gleene hat ooch Feierahmd verdient.', 'Du bist ä Wunnerwerk, un dei Bauch is dr scheenste Bauch von ganz Sachsn.', 'Immer mit dr Ruhe: Das Gleene gommt, wenn’s gommt, un nich ehr.', 'Heude wird nich gemeggert, heude wird gestrahlt, nu!', 'Eierschegge gibt’s schbäder, jetzt gibt’s erscht ä Gläschen Wasser. Du machst das prima!', 'Hauptsache gesund un gudd gelaunt, alles andre gommt vonn alleene.', 'Du hast das im Griff, das siehd mor. Un wenn nich, gibt’s Hilfe vom Babba.', 'Nu schau, das Gleene schdrambeld scho: Das heißt, es freit sich uff eich!', 'Ä bissl Ruhe, ä Gaffee ohne Gaffein, un alles is gudd.', 'Du bist schdärgr, als du denksd. Das sachd ooch dei Bauch.', 'Das wird scho, mei Gudste, un wenn nich glei, dann eben ä bissl schbäder.', 'Mach dor ä scheenen Dach, du hast dor das verdiend!', 'Schaffn dusde das, un lächeln dazu: Das stehd dor gud.'],
    papa: ['Babba, du bist nich Nebensache, du bist Hauptdarsteller! Nu mach was Scheenes fürn Schadz.', 'Ä Gaffeegänndchen un ä Umarmung, das wärgd Wunder, nu glar.', 'Nich nervös wern, Babba. Dor Gofferr is gebaggd, das Herz is voll.', 'Zuhörn, lachn, da sei: Mehr brauchd ä guder Babba nich.', 'Heude gibt’s Pluspunkde: Abwaschn, ohne dass eener fragn muss.', 'Handy laud, Dangg vull, Ruhe bewahrn: So wird mor Babba.', 'Das Gleene gennd dei Schdimme scho. Quadsch ruhsch ä bissl mid ihm.', 'Windeln wechseln lernd mor fix. Das is alles ä Frache vonn dor Übung.', 'Du schaffsd das, Babba! Un wenn nich, helfn Gardoffeln.', 'Ä guder Babba fragd: Was brauchd ihr grad? Frach heude ämol.']
  },
  ostfriesisch: {
    mama: ['Moin! Du maakst dat goot, dat Lüttje hett dat good drapen.', 'Nich hasten: Dat Lüttje kummt, wenn dat kummt, un keen Minuut eer.', 'Eerst mal een Koppke Tee, denn löppt dat vun sülvst.', 'Du büst starker, as du denkst. Dat seggt ok dien Buuk.', 'Dor is nix an to maken: Du büst een Wunner.', 'Mit Kluntje un Wulkje is ok disse Dag goot.', 'Fööt hooch, Tee in de Hand un luchen: Dat schall so wesen.', 'De Wind weiht, dat Lüttje strampelt, un du büst de Chefin vun den ganzen Laden.', 'Dat ward al, un wenn nich glieks, denn eben een beten later.', 'Dat Lüttje kennt dien Stimm al. Snack ruhig een beten mit em.', 'Wat mutt, dat mutt: Un du kannst dat.', 'Op di kann sik dat Lüttje verlaten. Dat is Gold wert.', 'Teetied is ok för Mamas. Gönn di een Pause.', 'Du hest dat in de Hand, dat markt man. Un wenn nich, helpt de Papa.'],
    papa: ['Papa, du büst keen Nevenfigur, du büst Hööftdarsteller! Maak vundaag wat Nettes.', 'Een Koppke Tee un een Umarmung: Dat warkt Wunner.', 'Nich nervös warrn, Papa. De Koffer is packt, dat Hart is vull.', 'Tohören, luchen, dor wesen: Mehr bruukt een goden Papa nich.', 'Vundaag gifft dat Plus-Punkte: Afwasken, ohn dat een fraagt.', 'Handy luut, Tank vull, Roh bewahren: So warrt een Papa.', 'Dat Lüttje kennt dien Stimm al. Snack mit em, dat is good.', 'Windeln wesseln lehrt man gau. Dat is man blots Övung.', 'Du kannst dat, Papa! Un wenn nich, helpt Tee.', 'Een goden Papa fraagt: Wat bruukt ji? Fraag vundaag mal.']
  }
});
Object.assign(STORY_DIALECT, {
  saechsisch: ['{kid} is jetzt so groß wie {a} {fruit}. Nu guck ämol!', 'Nu glar: {kid} is so groß wie {a} {fruit}, un wächst weida!', 'So groß wie {a} {fruit}: Das is {kid}. Das is ä Wunnerchen!', 'Gudn Dach, {kid}! Jetz biste so groß wie {a} {fruit}. Das nenn ich Gonfidenz!'],
  ostfriesisch: ['{kid} is nu so groot as {a} {fruit}. Dor kannst nix an maken!', 'Moin, {kid}! Du büst nu so groot as {a} {fruit}. Dat löppt!', 'So groot as {a} {fruit}: Dat is {kid}. Dat schall so wesen!', 'Luurt mal: {kid} is so groot as {a} {fruit}, un wassen deit dat ok noch!']
});

/* ---------- Yoga für Schwangere: sanfte Übungen, selbst formuliert ----------
   Allgemeine, vorsichtige Hinweise nach gängiger Hebammen-Empfehlung. Keine Fremdtexte kopiert. Ersetzt keinen Kurs und keine Beratung durch Hebamme oder Frauenarzt. */
const YOGA_TRI = { 1: '1. Trimester', 2: '2. Trimester', 3: '3. Trimester' };
const YOGA_POSES = [
  { id: 'berg', name: 'Berghaltung', icon: 'person-arms-up', tri: [1, 2, 3], area: 'Haltung und Erdung', breaths: 5, who: 'together',
    intro: 'Aufrecht stehen und die eigene Mitte spüren. Perfekt zum Ankommen.',
    steps: ['Stell dich hüftbreit hin, die Füße parallel, das Gewicht gleichmäßig verteilt.', 'Richte dich auf, die Schultern sinken, der Nacken wird lang.', 'Lege die Hände auf den Bauch und atme fünfmal ruhig ein und aus.'],
    tip: 'Papa darf danebenstehen und mitatmen. Das zählt als Teamübung.' },
  { id: 'katze', name: 'Katze und Kuh', icon: 'flower2', tri: [1, 2, 3], area: 'Rücken und Becken', breaths: 6, who: 'together',
    intro: 'Entlastet den unteren Rücken und gibt dem Bauch Platz zum Schweben.',
    steps: ['Geh auf Hände und Knie, die Hände unter den Schultern, die Knie unter den Hüften.', 'Beim Einatmen senkst du den Rücken sanft und hebst den Blick leicht.', 'Beim Ausatmen machst du einen runden Katzenbuckel. Bewege dich langsam im Atemtakt.'],
    tip: 'Nur so weit bewegen, wie es angenehm ist. Wer Papa dabeihat: eine Hand locker auf das Kreuzbein legen lassen.' },
  { id: 'schmetterling', name: 'Schmetterling im Sitzen', icon: 'flower1', tri: [1, 2, 3], area: 'Hüfte und Becken', breaths: 6, who: 'mama',
    intro: 'Öffnet die Hüften und ist ein schöner Platz zum Durchatmen.',
    steps: ['Setz dich auf ein Kissen, die Fußsohlen berühren sich, die Knie fallen locker zur Seite.', 'Richte den Rücken auf und lege die Hände auf die Füße oder Knie.', 'Atme ruhig und lass die Knie ohne Druck sinken.'],
    tip: 'Die Knie dürfen oben bleiben. Kleine Kissen unter die Knie machen es bequemer. Kein Wippen und kein Drücken.' },
  { id: 'kind', name: 'Kindshaltung mit weiten Knien', icon: 'moon-stars', tri: [1, 2, 3], area: 'Entspannung und Rücken', breaths: 6, who: 'mama',
    intro: 'Eine Ruhepause für Rücken und Kopf. Die Knie sind weit, damit der Bauch Platz hat.',
    steps: ['Knie dich hin, die Knie weit auseinander, die großen Zehen berühren sich.', 'Setz dich Richtung Fersen und lege Arme und Stirn auf ein Kissen oder einen Stapel Kissen vor dir.', 'Atme in den Rücken und lass die Schultern los.'],
    tip: 'Ab dem 2. Trimester die Knie bewusst weit öffnen und viele Kissen nutzen. Wird es eng oder unangenehm, wähle eine andere Haltung.' },
  { id: 'krieger', name: 'Krieger II', icon: 'person-standing', tri: [1, 2], area: 'Beine und Standfestigkeit', breaths: 4, who: 'mama',
    intro: 'Kräftigt die Beine und macht stark. Ideal, wenn du dich wie eine Heldin fühlen willst.',
    steps: ['Stell dich mit weit gespreizten Beinen hin, der rechte Fuß zeigt nach außen, der linke leicht nach innen.', 'Beuge das rechte Knie nur so weit, dass es über dem Knöchel bleibt.', 'Strecke die Arme zur Seite und atme viermal ruhig. Dann Seite wechseln.'],
    tip: 'Eine Stuhllehne in Reichweite gibt Sicherheit. Stell die Beine nicht zu weit auseinander.' },
  { id: 'seite', name: 'Seitliche Dehnung im Sitzen', icon: 'arrows-expand', tri: [1, 2, 3], area: 'Flanken und Atemraum', breaths: 4, who: 'mama',
    intro: 'Gibt der Lunge mehr Platz, wenn das Baby nach oben drückt.',
    steps: ['Setz dich im Schneidersitz auf ein Kissen. Der rechte Arm liegt am Boden neben dir.', 'Atme ein und führe den linken Arm über den Kopf.', 'Atme aus und neige dich sanft nach rechts. Spüre die Dehnung in der linken Flanke. Dann wechseln.'],
    tip: 'Die Bewegung geht zur Seite, nicht nach vorn in den Bauch. Der Bauch bleibt frei und unverdreht.' },
  { id: 'hocke', name: 'Tiefe Hocke mit Stütze', icon: 'arrow-down-circle', tri: [2, 3], area: 'Becken und Beckenboden', breaths: 5, who: 'mama',
    intro: 'Öffnet das Becken und bereitet auf die Geburt vor. Mit Stütze geht es viel leichter.',
    steps: ['Stell dich hüftbreit hin, die Füße leicht nach außen, ein Kissen oder Yogablock steht hinter dir bereit.', 'Geh langsam in die Hocke und setze dich auf den Block. Die Hände liegen vor der Brust.', 'Atme ruhig fünfmal und richte dich dann langsam wieder auf, am besten mit einer Hand an einer Wand oder an Papa.'],
    tip: 'Bei Beckengürtelschmerzen, Wehen oder Unsicherheit weglassen und vorher die Hebamme fragen.' },
  { id: 'becken', name: 'Beckenkreisen', icon: 'arrow-repeat', tri: [1, 2, 3], area: 'Becken und unterer Rücken', breaths: 8, who: 'together',
    intro: 'Sanftes Kreisen lockert das Becken. Funktioniert auf einem Gymnastikball oder Stuhl.',
    steps: ['Setz dich aufrecht auf einen Ball oder Stuhl, die Füße stehen fest am Boden.', 'Kreise das Becken langsam in eine Richtung, als würdest du einen großen Kreis zeichnen.', 'Nach ein paar Kreisen die Richtung wechseln. Atme dabei ruhig weiter.'],
    tip: 'Papa kann hinter dir stehen und dich sichern. Der Ball darf nicht wegrollen: Rutschfeste Unterlage nutzen.' },
  { id: 'schulter', name: 'Rücken streicheln zu zweit', icon: 'people-fill', tri: [1, 2, 3], area: 'Nähe und Rücken', breaths: 6, who: 'together',
    intro: 'Eine Partnerübung: Mama im Vierfüßler, Papa bringt Ruhe in den Rücken.',
    steps: ['Mama geht auf Hände und Knie und legt den Kopf locker ab. Kissen unter den Händen oder Knien sind erlaubt.', 'Papa kniet seitlich und streicht mit der flachen Hand langsam vom Nacken zum Kreuzbein.', 'Beide atmen im gleichen Takt. Danach sagt Mama, welcher Druck gut tut.'],
    tip: 'Papa-Aufgabe: ruhige Hände, kein Zeitdruck. Kitzeln ist heute nicht erwünscht.' },
  { id: 'ruhe', name: 'Entspannung in Seitenlage', icon: 'cloud-moon', tri: [1, 2, 3], area: 'Ruhe und Erholung', breaths: 10, who: 'together',
    intro: 'Zum Abschluss: loslassen und den Tag sacken lassen.',
    steps: ['Leg dich auf die linke Seite. Ein Kissen liegt zwischen den Knien, ein weiteres stützt den Bauch.', 'Der Kopf ruht auf einem Kissen, die Arme liegen locker.', 'Atme zehnmal lang aus und lass bei jedem Ausatmen die Schultern, das Gesicht und den Kiefer weicher werden.'],
    tip: 'Nicht lange flach auf dem Rücken liegen, besonders ab dem 2. Trimester. Die Seitenlage ist hier die angenehmere Variante.' }
];
const YOGA_SAFETY = [
  'Sprich vor dem Start mit Frauenarzt oder Hebamme, besonders bei Risikoschwangerschaft, Blutungen, Wehen oder Beschwerden.',
  'Dein Körper ist in der Schwangerschaft dehnbarer. Nicht überdehnen und nie in Schmerz hineingehen.',
  'Keine tiefen Drehungen, keine Bauchlage, kein starkes Pressen und kein warmes Yoga bei Hitze.',
  'Nicht lange flach auf dem Rücken liegen. Nutze die Seitenlage oder einen Keil aus Kissen.',
  'Wird dir schwindelig, kribbelig oder übel: sofort aufhören, trinken, ruhig weiteratmen. Bei Schmerzen, Blutungen oder Atemnot Arzt kontaktieren, im Notfall 112.'
];
Object.assign(PAGE_AUDIENCE, { yoga: 'together' });
Object.assign(PAGE_ICON, { yoga: 'flower2' });

/* ---------- Super-Lob beim Tagesziel: Hochdeutsch und in jeder Mundart (kommt aus den Einstellungen unter Sprüche und Mundart) ---------- */
const PRAISE_BASE = {
  mama: ['Das hast du richtig stark gemacht!', 'Wahnsinn! Das Baby klatscht innerlich mit.', 'Du bist eine Wucht, wirklich!', 'Applaus, Applaus! Heute hast du alles gegeben.', 'Besser geht’s nicht. Gold für dich!', 'Du rockst das, und das Baby ist mächtig stolz.', 'Spitze! So sieht eine Heldin des Alltags aus.', 'Ein Hoch auf dich: konsequent, liebevoll, großartig.', 'Du schaffst Großes, auch wenn es sich ganz normal anfühlt.', 'Schau mal, wie weit du schon gekommen bist. Das ist toll!', 'Jeder Schritt zählt, und heute hast du einen richtig schönen gemacht.', 'Du gibst deinem Baby den besten Start. Danke dafür, und gönn dir ruhig eine Pause!', 'Heute ist ein guter Tag, und du bist der Grund dafür.', 'Du machst das mit so viel Herz. Das spürt man.', 'Kleine Siege, große Wirkung: Das war einer davon.', 'Du darfst richtig stolz auf dich sein.'],
  together: ['Ihr zwei seid ein Traumteam!', 'Zusammen seid ihr unschlagbar. Das Baby hat die besten Eltern der Welt!', 'Applaus für euch beide, das war richtig schön!', 'Mehr Liebe pro Tag geht kaum. Bravo, ihr zwei!', 'So wächst eine Familie: mit Zeit füreinander. Das habt ihr heute wunderbar gemacht.', 'Ihr macht das großartig, gemeinsam und mit ganz viel Herz.', 'Zwei Herzen, ein Baby, null Zweifel: Ihr schafft das!', 'Das Baby spürt jede Minute, die ihr euch nehmt. Danke, ihr zwei!'],
  water: ['Du bist ein Wasserfall der Motivation.', 'Das Baby plätschert vor Freude!', 'Gut getrunken, gut gelaunt, gut gemacht!', 'Dein Körper sagt Danke, und das Baby auch.', 'Prost! Auf dich und das Kleine.', 'Besser versorgt geht’s nicht.']
};
const PRAISE_DIALECT = {
  hessisch: { mama: ['Ei, des hast du prima gemacht! Des Kleine hubbt vor Freud.', 'Subber, Mädsche! Des war e Glanzleistung.', 'Des is aber e dolle Sach! Du bist ganz groß.', 'Guud gemacht! Gönn dir jetz e Stückche Schokolad.', 'Ei Gude, was bist du stark! Des Baby is mächtig stolz uff dich.', 'Des hast du im Griff, des merkt mer. Weiter so!'], together: ['Ihr zwaa seid e Traumpaar! Des Kleine hat’s gut getroffe.', 'Ei, ihr seid ja e Dream-Team! Weiter so!', 'Des habt ihr zwaa prima hiegekriegt!', 'Ei, wie schee! Ihr zwaa seid sauber unnerwegs.'] },
  bayrisch: { mama: ['Sauber! Des hast du fei großartig gmacht!', 'Mei, des is a Hammer! Du bist a Wahnsinn.', 'Bravo, Madl! Da kriagst glei a Bussal vom Baby.', 'Des hast du glangt, gell! Jetz derfst di fei freun.', 'Mei, bist du stark! Des Kloane is narrisch stolz auf di.', 'Respekt, Respekt! Des war wirkli a Glanzleistung.'], together: ['Ihr zwoa seid a Traumteam, wirkli wahr!', 'Mei, san des zwoa Guade! Des Kloane hat’s guad troffa.', 'Des habts ihr zwoa fei prima gmacht!', 'Ois bestens, ihr zwoa! Do kann nix schiefgehn.'] },
  schwaebisch: { mama: ['Des hosch subbr gmacht! Do dät sogar dr Dackel klatsche.', 'Mir send stolz uff di, des war a Mordsleischtung!', 'Net schlecht, Herr Specht! Du bisch a Wucht.', 'Bravo! Jetz hosch dir a Pause verdient.', 'Des hosch guat im Griff, des siehsch! Weiter so.', 'Mensch, du bisch stark! Des Kloine isch ganz stolz uff di.'], together: ['Ihr zwoi seid a Traumteam, des kasch glaube!', 'Des hen ihr subbr hiebroocht, ihr Zwoi!', 'Do kasch nix saga: Ihr zwoi machet des prima!', 'Bravo, ihr Zwoi! Des Kloine hot’s guat droffa.'] },
  saechsisch: { mama: ['Nu das hasde ganz gloorhaft gemachd! Do gannste schdolz sei.', 'Bravo, du Gudste! Das war ä Meisterleisdung.', 'Ei verbibbsch, das war ä Wucht!', 'Das gönnste dir: Du bisd ä Schadz.', 'Nu glar, du bisd schdarg! Das Gleene is gans schdolz uff dich.', 'Gudd gemachd! Jetz gönn dir ä Päusschen.'], together: ['Ihr zwee seid ä Draumdeem, nu glar!', 'Das habd ihr ganz prima hiegriegd, ihr zwee!', 'Nu guggemol, ihr zwee: Das läufd ja wie geschmierd!', 'Bravo, ihr zwee! Das Gleene hadd’s gudd drofen.'] },
  ostfriesisch: { mama: ['Dat hest du fein maakt! Dor kannst stolt op wesen.', 'Bravo, min Deern! Dat weer een Meisterstück.', 'Moin moin, du büst een Wunner! Un dat Lüttje klatscht mit.', 'Heel goot! Nu gifft dat een Koppke Tee.', 'Du büst starker, as du denkst. Dat hest du wedder wiest!', 'Dat löppt bi di! Dat Lüttje is mächtig stolt.'], together: ['Ji twee sünd een Droomteam, dat is wohr!', 'Dat hebbt ji fein maakt, ji twee!', 'Moin, ji twee! Dat löppt je as smeert.', 'Bravo, ji twee! Dat Lüttje hett dat good drapen.'] }
};

// Mehr Lob, damit es abwechslungsreich bleibt: je Sprache mindestens 30 Sprüche
PRAISE_BASE.mama.push('Du bist großartig, und das ist keine Übertreibung.', 'Das war ein richtig guter Tag für dich und dein Baby.', 'Wenn es Orden gäbe, würdest du heute einen bekommen.', 'Du hast es dir verdient, jetzt mal durchzuatmen.', 'Bravo! Du lässt es aussehen, als wäre es leicht.', 'Dein Baby hätte keine bessere Mama finden können.', 'So viel Liebe in einem Tag, das ist wunderbar.', 'Du bist ein Vorbild, auch wenn du es gerade nicht merkst.', 'Gut gemacht, Schritt für Schritt, genau richtig.', 'Das Baby sagt Danke, mit einem kleinen Tritt.', 'Du hast das Zeug zur Superheldin, und zwar jeden Tag.', 'Respekt, wie du das alles meisterst!', 'Heute hast du wieder bewiesen, wie stark du bist.', 'Ein großes Lob an dich: Du machst das wirklich schön.');
PRAISE_DIALECT.hessisch.mama.push('Ei, des is ja fei! Du bist e richtig Gude.', 'Des Baby strampelt vor Freud, so gut hast du des gemacht!', 'Hut ab, Mädsche! Des muss dir erstmal eener nachmache.', 'Ganz großes Kino heut! Du kannst stolz uff dich sei.', 'So e starke Mudder! Des Kleine hat e Glückslos gezoge.', 'Ei Gude wie, des war ja e Meisterstück!', 'Heut hast du alles gebbe. Jetz gibt’s e Pause uffm Sofa!', 'Mei Liewe, des war e Leistung! Respekt!', 'Genau so, Schätzche, immer weiter so!', 'Des is e rischtisch gudder Dag, un du bist der Grund dafür.', 'Du bist e Wucht in Tüddle!', 'Kleine Schritte, große Wirkung: Des war e dolle Sach.', 'Des Baby merkt, wie viel Lieb in dir steckt.', 'Mit so viel Herz kann nix schiefgehe.', 'Ei, was e Tag! Un du mittendrin als Heldin.', 'Des kann kaa Gewitter erschüttern: Du bist stark!', 'Geschafft! Ganz ohne Gemeckere, ganz mit Herz.', 'Net schlecht, Frau Specht! Des war Spitzeklasse.', 'Heut hast du dei Ziel geknackt wie e Nuss.', 'Ei jo, des hat gebabbelt: Du bist e Wucht.', 'Des Kleine sacht Dankeschön, un ich aach.', 'Immer weiter so, du Gude: Du bist uff dem richtige Weg.', 'Des Kleine hat die beschde Mama vun de ganze Welt.', 'Du machst des mit Herz un Verstand, des merkt mer.');
PRAISE_DIALECT.bayrisch.mama.push('Mei, bist du guad! Des hast du fei super gmacht.', 'Do schau her, wia du des rockst!', 'Des Kloane tanzt vor Freid in dei’m Bauch.', 'A Wahnsinn, wia stark du bist!', 'Bravissimo! Des muss gfeiert wern.', 'Du bist a Wuchtbrumme, und no a liabe dazua.', 'So guad, dass des Kloane scho klatscht!', 'Jawoi, des passt! Des hast du perfekt hibracht.', 'Des Ziel is gschafft! Jetz a Pausn, gell.', 'Du bist a Sunnschein, und des spürt a des Baby.', 'Respekt, Respekt, des war a Leistung zum Dahoamzeign.', 'Des hast du mit Herz und Hirn gmacht, bravo!', 'Heit hast ois richtig gmacht, mei liabe!', 'Des Kloane hat de beste Mama der Welt!', 'Gschafft! Und zwar mit links.', 'A Hoch auf di, du Prachtstück!', 'Des war sakrisch guad, glaub’s oafach!', 'Do kann ma nur sogn: Hut ab!', 'Du machst des wia a Weltmeisterin.', 'Des Baby is stolz, und mir san des aa.', 'So geht des! Weiter so, du Gscheite.', 'Ois im grünen Bereich, und du mittendrin: Super!', 'Mei, des Gfui kenn i: Du bist oafach guad.', 'Des hast du schee gmacht, richtig schee.');
PRAISE_DIALECT.schwaebisch.mama.push('Subber, des hosch prima hiebroocht!', 'Des isch a ganz a Guate, des muss mr sage.', 'Ha noi, wie guat du des machsch!', 'Du bisch a Schätzle, ond des Kloine mag di au.', 'Mir klatsched uns d’Händ wund, so guat war des!', 'Des kasch stolz uff di sei, wirklich!', 'Schaffe, schaffe, Ziel erreicht! Jetzt hosch’s verdient.', 'Du hosch a Herz vo Gold ond a Hand vo Silber.', 'Des war net schlecht, des war schpitze!', 'Gell, des hosch guat gmacht!', 'Des Kloine hot die beschte Mama vo de Wält.', 'Ha, des lauft bei dir wie g’schmiert!', 'Jetzt gibt’s an Kaffee. Äh, a Wasser. Bravo!', 'Des isch a Leistung, do ziehsch dr Hut!', 'Du bisch a Wucht, des muss mr oifach sage.', 'So guat, dass dr Nachbar neidisch wird.', 'Immer weiter so, du schaffsch des!', 'Des hosch mit Verstand ond Herz gmacht.', 'A Lob für di, du Gscheite!', 'Heut hosch dei bests gäbe, ond des sieht mr.', 'Mit dir kommt des Kloine gut ons Ziel.', 'Du machsch des echt prima, ehrlich!', 'Des war a Glanzstück, ganz ohne Schwätzle.', 'Do kasch ruhig a bissle schtolz sei.');
PRAISE_DIALECT.saechsisch.mama.push('Nu das ham wir gudd gemachd, du Gudste!', 'Du bisd ä Wunnr, ehrlich, nu!', 'Ei, das war aber ä Leisdung!', 'Das Gleene glaschd vor Freide in die Händchen.', 'Gloor, das hasde im Griff!', 'Du bisd so schdarg, mei Gudsde.', 'Heide haddsde alles gegähm, das siehd mor.', 'Nu gugge mol, wie weid du schon bisd!', 'Das war scheene, das mach ich dor nich nach.', 'Dor Gleene is schdolz uff seine Mudder.', 'Das hasde mid Herz gemachd, das merkd mor.', 'Eijeijei, was ä Daach, un du middenmang!', 'Nu gudd, nu gudd, da mussde nich meggern.', 'Kräfdig, kräfdig, das war ä Hammer!', 'Wunnerbar gemachd, mei Schadz.', 'Nu schdell dor vor: Du hasd das alles geschaffd.', 'Das nenn ich ä Dagesziel, nu!', 'Gönn dor jetz ä Gaffeegänndchen, du hasd’s verdiend.', 'Du machsd das bärfegd, nu!', 'Mid dor gommd jeder Dach gud.', 'Das gleene Wunner is mid dir in guden Händn.', 'Heide bisde Schbidze, nu glar!', 'Ei verbibbsch, wie gudd du das machsd!', 'Das hasde schee hiegriegd, nu wärglich.');
PRAISE_DIALECT.ostfriesisch.mama.push('Dat hest du doll maakt, min Deern!', 'Sehr goot, du büst een Pracht!', 'Nu is dat Ziel schaft, un dat is wat Besonderes.', 'Dat Lüttje danzt vör Freud in dien Buuk.', 'Du büst starker as een Storm up de Nordsee.', 'Prima Arbeit, dat löppt as smeert!', 'Mien Respekt, dat weer ganz groot.', 'Op di kann man sik verlaten, dat is Gold wert.', 'Dat hest du mit Hart un Verstand maakt.', 'Heel fein, nu gifft dat Tee mit Kluntje!', 'Du büst een Sünnenschien, un dat Lüttje markt dat.', 'Dat is een Dag as in Oostfreesland: ruhig un goot.', 'Du hest dat fein inkriegen, dor kannst stolt op wesen.', 'Wat een Leistung! Dat hett nüms beter maakt.', 'Dien Lüttje hett de beste Mama vun de Welt.', 'Ik segg man blots: Dat weer prima!', 'Dat is een Kracht in di, de Lüüd wunnert sik.', 'Goot maakt, dat schall so wesen.', 'Jümmers wieder so, du schafft dat.', 'Een Hoch up di, du Beste!', 'Mit di löppt dat as Ebbe un Flot: ganz natürlich goot.', 'Dat weer gröttste Klasse, ik bün stolt up di!', 'Dat Lüttje klatscht in de Hännen, so goot weer dat.', 'Du hest vundaag allens richtig maakt.');
PRAISE_DIALECT.hessisch.together.push('Ihr zwaa seid ei Herz un ei Seel!', 'Zusamme seid ihr stark, des Kleine hat’s gut getroffe.', 'Ei, wie schee ihr des mitnanner macht!', 'Ihr seid e Team zum Verliebe.');
PRAISE_DIALECT.bayrisch.together.push('Ihr zwoa seids a Herz und a Seel!', 'Zam seids unschlagbar, des Kloane hat’s guad troffa.', 'Mei, wia schee ihr des mitanand macht!', 'A Team zum Verliabn seids!');
PRAISE_DIALECT.schwaebisch.together.push('Ihr zwoi seid a Herz ond a Seel!', 'Zammahalte, des kennet ihr guat.', 'Ha, wie schö ihr des midnander machet!', 'A Team zum Verliebe seid ihr!');
PRAISE_DIALECT.saechsisch.together.push('Ihr zwee seid ä Herz un ä Seele!', 'Zusammn seid ihr schdarg, nu glar!', 'Wie scheene ihr das midnanner machd!', 'Ä Deem zum Verlieben seid ihr!');
PRAISE_DIALECT.ostfriesisch.together.push('Ji twee sünd een Hart un een Seel!', 'Tohoop sünd ji starker, dat Lüttje is stolt.', 'Wo fien ji dat tohoop maakt!', 'Een Team to’t Verleven sünd ji!');