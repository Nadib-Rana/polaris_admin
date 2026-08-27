// Swiss Healthcare Admin Value Localizers (Living situation, relation, care degree, caregiver name)

const LIVING_MAP: Record<string, Record<string, string>> = {
  "living independently at home": {
    de: "Eigenständig zu Hause",
    en: "Living independently at home",
    fr: "À domicile de manière autonome",
    it: "Autonomo a casa",
  },
  "independent": {
    de: "Eigenständig zu Hause",
    en: "Living independently at home",
    fr: "À domicile de manière autonome",
    it: "Autonomo a casa",
  },
  "eigenständig zu hause": {
    de: "Eigenständig zu Hause",
    en: "Living independently at home",
    fr: "À domicile de manière autonome",
    it: "Autonomo a casa",
  },
  "living with me in my household": {
    de: "Im selben Haushalt mit mir",
    en: "Living with me in my household",
    fr: "Dans mon ménage",
    it: "Nel mio nucleo familiare",
  },
  "im selben haushalt mit mir": {
    de: "Im selben Haushalt mit mir",
    en: "Living with me in my household",
    fr: "Dans mon ménage",
    it: "Nel mio nucleo familiare",
  },
  "living in an assisted care or nursing facility": {
    de: "Pflegeheim / Betreutes Wohnen",
    en: "Assisted living / Nursing facility",
    fr: "En établissement médico-social (EMS)",
    it: "In casa di cura / residenza assistita",
  },
  "in einer pflegeeinrichtung / betreutes wohnen": {
    de: "Pflegeheim / Betreutes Wohnen",
    en: "Assisted living / Nursing facility",
    fr: "En établissement médico-social (EMS)",
    it: "In casa di cura / residenza assistita",
  },
  "betreutes wohnen": {
    de: "Pflegeheim / Betreutes Wohnen",
    en: "Assisted living / Nursing facility",
    fr: "En établissement médico-social (EMS)",
    it: "In casa di cura / residenza assistita",
  },
  "other living arrangement": {
    de: "Andere Wohnsituation",
    en: "Other living arrangement",
    fr: "Autre situation de logement",
    it: "Altra sistemazione",
  },
  "andere wohnsituation": {
    de: "Andere Wohnsituation",
    en: "Other living arrangement",
    fr: "Autre situation de logement",
    it: "Altra sistemazione",
  },
};

const RELATION_MAP: Record<string, Record<string, string>> = {
  "a parent or parent-in-law": {
    de: "Elternteil / Schwiegereltern",
    en: "Parent or parent-in-law",
    fr: "Parent ou beau-parent",
    it: "Genitore o suocero/a",
  },
  "ein elternteil oder schwiegereltern": {
    de: "Elternteil / Schwiegereltern",
    en: "Parent or parent-in-law",
    fr: "Parent ou beau-parent",
    it: "Genitore o suocero/a",
  },
  "a partner or spouse": {
    de: "Partner / Ehepartner",
    en: "Partner or spouse",
    fr: "Partenaire ou conjoint",
    it: "Partner o coniuge",
  },
  "ein partner oder ehepartner": {
    de: "Partner / Ehepartner",
    en: "Partner or spouse",
    fr: "Partenaire ou conjoint",
    it: "Partner o coniuge",
  },
  "a child": {
    de: "Kind",
    en: "A child",
    fr: "Un enfant",
    it: "Un figlio/a",
  },
  "ein kind": {
    de: "Kind",
    en: "A child",
    fr: "Un enfant",
    it: "Un figlio/a",
  },
  "another family member or close friend": {
    de: "Anderer Angehöriger / Freund",
    en: "Another family member / friend",
    fr: "Autre membre de famille / ami",
    it: "Altro familiare o amico",
  },
  "anderes familienmitglied / freund": {
    de: "Anderer Angehöriger / Freund",
    en: "Another family member / friend",
    fr: "Autre membre de famille / ami",
    it: "Altro familiare o amico",
  },
  "anderes familienmitglied/ freund": {
    de: "Anderer Angehöriger / Freund",
    en: "Another family member / friend",
    fr: "Autre membre de famille / ami",
    it: "Altro familiare o amico",
  },
};

const CAREGIVER_MAP: Record<string, Record<string, string>> = {
  "family caregiver": {
    de: "Pflegende(r) Angehörige(r)",
    en: "Family Caregiver",
    fr: "Proche aidant",
    it: "Familiare curante",
  },
};

const CARE_DEGREE_MAP: Record<string, Record<string, string>> = {
  "grad 1": { de: "Pflegegrad 1", en: "Grade 1", fr: "Degré 1", it: "Grado 1" },
  "grad 2": { de: "Pflegegrad 2", en: "Grade 2", fr: "Degré 2", it: "Grado 2" },
  "grad 3 - 4": { de: "Pflegegrad 3 - 4", en: "Grade 3 - 4", fr: "Degré 3 - 4", it: "Grado 3 - 4" },
  "grad 3 - 5": { de: "Pflegegrad 3 - 5", en: "Grade 3 - 5", fr: "Degré 3 - 5", it: "Grado 3 - 5" },
  "pflegegrad 1 - 2": { de: "Pflegegrad 1 - 2", en: "Care Degree 1 - 2", fr: "Degré de soins 1 - 2", it: "Grado di cura 1 - 2" },
  "pflegegrad 3 - 5": { de: "Pflegegrad 3 - 5", en: "Care Degree 3 - 5", fr: "Degré de soins 3 - 5", it: "Grado di cura 3 - 5" },
  "antrag läuft": { de: "Antrag läuft", en: "Application in progress", fr: "Demande en cours", it: "Domanda in corso" },
  "no / not yet applied": { de: "Nicht beantragt", en: "Not yet applied", fr: "Non demandé", it: "Non richiesto" },
  "noch nicht beantragt": { de: "Nicht beantragt", en: "Not yet applied", fr: "Non demandé", it: "Non richiesto" },
  "nicht beantragt": { de: "Nicht beantragt", en: "Not yet applied", fr: "Non demandé", it: "Non richiesto" },
};

// Universal Answer Translation Map for all 12 Assessment Questions
const ANSWER_MAP: Record<string, Record<string, string>> = {
  // Q1: Relation
  "ein elternteil oder schwiegereltern": { de: "Ein Elternteil oder Schwiegereltern", en: "A parent or parent-in-law", fr: "Un parent ou beau-parent", it: "Un genitore o suocero/a" },
  "a parent or parent-in-law": { de: "Ein Elternteil oder Schwiegereltern", en: "A parent or parent-in-law", fr: "Un parent ou beau-parent", it: "Un genitore o suocero/a" },
  "ein partner oder ehepartner": { de: "Ein Partner oder Ehepartner", en: "A partner or spouse", fr: "Un partenaire ou conjoint", it: "Un partner o coniuge" },
  "a partner or spouse": { de: "Ein Partner oder Ehepartner", en: "A partner or spouse", fr: "Un partenaire ou conjoint", it: "Un partner o coniuge" },
  "ein kind": { de: "Ein Kind", en: "A child", fr: "Un enfant", it: "Un figlio/a" },
  "a child": { de: "Ein Kind", en: "A child", fr: "Un enfant", it: "Un figlio/a" },
  "anderes familienmitglied / freund": { de: "Anderes Familienmitglied / Freund", en: "Another family member or close friend", fr: "Autre membre de famille ou ami", it: "Altro familiare o amico" },
  "anderes familienmitglied/ freund": { de: "Anderes Familienmitglied / Freund", en: "Another family member or close friend", fr: "Autre membre de famille ou ami", it: "Altro familiare o amico" },
  "another family member or close friend": { de: "Anderes Familienmitglied / Freund", en: "Another family member or close friend", fr: "Autre membre de famille ou ami", it: "Altro familiare o amico" },

  // Q2: Living
  "eigenständig zu hause": { de: "Eigenständig zu Hause", en: "Living independently at home", fr: "À domicile de manière autonome", it: "Autonomo a casa" },
  "living independently at home": { de: "Eigenständig zu Hause", en: "Living independently at home", fr: "À domicile de manière autonome", it: "Autonomo a casa" },
  "im selben haushalt mit mir": { de: "Im selben Haushalt mit mir", en: "Living with me in my household", fr: "Dans mon ménage", it: "Nel mio nucleo familiare" },
  "living with me in my household": { de: "Im selben Haushalt mit mir", en: "Living with me in my household", fr: "Dans mon ménage", it: "Nel mio nucleo familiare" },
  "in einer pflegeeinrichtung / betreutes wohnen": { de: "In einer Pflegeeinrichtung / Betreutes Wohnen", en: "Living in an assisted care or nursing facility", fr: "En établissement médico-social (EMS)", it: "In casa di cura / residenza assistita" },
  "living in an assisted care or nursing facility": { de: "In einer Pflegeeinrichtung / Betreutes Wohnen", en: "Living in an assisted care or nursing facility", fr: "En établissement médico-social (EMS)", it: "In casa di cura / residenza assistita" },
  "andere wohnsituation": { de: "Andere Wohnsituation", en: "Other living arrangement", fr: "Autre situation de logement", it: "Altra sistemazione" },
  "other living arrangement": { de: "Andere Wohnsituation", en: "Other living arrangement", fr: "Autre situation de logement", it: "Altra sistemazione" },

  // Q3: Assistance
  "leichte hilfe (einkauf, behörden, haushalt)": { de: "Leichte Hilfe (Einkauf, Behörden, Haushalt)", en: "Light support (shopping, transport, paperwork)", fr: "Aide légère (courses, démarches, ménage)", it: "Aiuto leggero (spesa, burocrazia, faccende)" },
  "light support (shopping, transport, paperwork)": { de: "Leichte Hilfe (Einkauf, Behörden, Haushalt)", en: "Light support (shopping, transport, paperwork)", fr: "Aide légère (courses, démarches, ménage)", it: "Aiuto leggero (spesa, burocrazia, faccende)" },
  "mittlere hilfe (mahlzeiten, medikamente, mobilität)": { de: "Mittlere Hilfe (Mahlzeiten, Medikamente, Mobilität)", en: "Moderate daily help (meals, medication, mobility)", fr: "Aide modérée (repas, médicaments, mobilité)", it: "Aiuto moderato (pasti, farmaci, mobilità)" },
  "moderate daily help (meals, medication, mobility)": { de: "Mittlere Hilfe (Mahlzeiten, Medikamente, Mobilität)", en: "Moderate daily help (meals, medication, mobility)", fr: "Aide modérée (repas, médicaments, mobilité)", it: "Aiuto moderato (pasti, farmaci, mobilità)" },
  "intensive 24/7 betreuung (körperpflege, aufsicht)": { de: "Intensive 24/7 Betreuung (Körperpflege, Aufsicht)", en: "Intensive 24/7 care (hygiene, continuous supervision)", fr: "Soins intensifs 24/7 (hygiène, surveillance)", it: "Assistenza intensiva 24/7 (igiene, sorveglianza)" },
  "intensive 24/7 care (hygiene, continuous supervision)": { de: "Intensive 24/7 Betreuung (Körperpflege, Aufsicht)", en: "Intensive 24/7 care (hygiene, continuous supervision)", fr: "Soins intensifs 24/7 (hygiène, surveillance)", it: "Assistenza intensiva 24/7 (igiene, sorveglianza)" },
  "unsicher / bedarf wird aktuell abgeklärt": { de: "Unsicher / Bedarf wird aktuell abgeklärt", en: "Uncertain / currently evaluating needs", fr: "Incertain / besoins en cours d'évaluation", it: "Incerto / valutazione in corso" },
  "uncertain / currently evaluating needs": { de: "Unsicher / Bedarf wird aktuell abgeklärt", en: "Uncertain / currently evaluating needs", fr: "Incertain / besoins en cours d'évaluation", it: "Incerto / valutazione in corso" },

  // Q4: Pflegegrad
  "ja (pflegegrad 1 - 2)": { de: "Ja (Pflegegrad 1 - 2)", en: "Yes (Care Degree 1 - 2)", fr: "Oui (Degré de soins 1 - 2)", it: "Sì (Livello di cura 1 - 2)" },
  "yes (pflegegrad 1 - 2)": { de: "Ja (Pflegegrad 1 - 2)", en: "Yes (Care Degree 1 - 2)", fr: "Oui (Degré de soins 1 - 2)", it: "Sì (Livello di cura 1 - 2)" },
  "ja (pflegegrad 3 - 5)": { de: "Ja (Pflegegrad 3 - 5)", en: "Yes (Care Degree 3 - 5)", fr: "Oui (Degré de soins 3 - 5)", it: "Sì (Livello di cura 3 - 5)" },
  "yes (pflegegrad 3 - 5)": { de: "Ja (Pflegegrad 3 - 5)", en: "Yes (Care Degree 3 - 5)", fr: "Oui (Degré de soins 3 - 5)", it: "Sì (Livello di cura 3 - 5)" },
  "antrag läuft aktuell": { de: "Antrag läuft aktuell", en: "Application is currently in progress", fr: "Demande en cours", it: "Domanda in corso" },
  "application is currently in progress": { de: "Antrag läuft aktuell", en: "Application is currently in progress", fr: "Demande en cours", it: "Domanda in corso" },
  "nein / noch nicht beantragt": { de: "Nein / Noch nicht beantragt", en: "No / Not yet applied", fr: "Non / Pas encore demandé", it: "No / Non ancora richiesto" },
  "no / not yet applied": { de: "Nein / Noch nicht beantragt", en: "No / Not yet applied", fr: "Non / Pas encore demandé", it: "No / Non ancora richiesto" },

  // Q5: Challenges
  "bürokratie, recht & versicherungsansprüche": { de: "Bürokratie, Recht & Versicherungsansprüche", en: "Navigating medical, legal & insurance bureaucracy", fr: "Bureaucratie, aspects juridiques & assurances", it: "Burocrazia, aspetti legali e assicurativi" },
  "navigating medical, legal & insurance bureaucracy": { de: "Bürokratie, Recht & Versicherungsansprüche", en: "Navigating medical, legal & insurance bureaucracy", fr: "Bureaucratie, aspects juridiques & assurances", it: "Burocrazia, aspetti legali e assicurativi" },
  "emotionale erschöpfung & überlastung der angehörigen": { de: "Emotionale Erschöpfung & Überlastung der Angehörigen", en: "Emotional exhaustion & caregiver burnout", fr: "Épuisement émotionnel & surcharge du proche aidant", it: "Sfinimento emotivo & sovraccarico del caregiver" },
  "emotional exhaustion & caregiver burnout": { de: "Emotionale Erschöpfung & Überlastung der Angehörigen", en: "Emotional exhaustion & caregiver burnout", fr: "Épuisement émotionnel & surcharge du proche aidant", it: "Sfinimento emotivo & sovraccarico del caregiver" },
  "vereinbarkeit von beruf, familie & pflege": { de: "Vereinbarkeit von Beruf, Familie & Pflege", en: "Balancing my job/family with care duties", fr: "Conciliation travail, famille & soins", it: "Conciliare lavoro, famiglia e assistenza" },
  "balancing my job/family with care duties": { de: "Vereinbarkeit von Beruf, Familie & Pflege", en: "Balancing my job/family with care duties", fr: "Conciliation travail, famille & soins", it: "Conciliare lavoro, famiglia e assistenza" },
  "finanzielle belastung & kostenübernahme": { de: "Finanzielle Belastung & Kostenübernahme", en: "Financial costs & funding available services", fr: "Charge financière & prise en charge des coûts", it: "Costi finanziari e copertura delle spese" },
  "financial costs & funding available services": { de: "Finanzielle Belastung & Kostenübernahme", en: "Financial costs & funding available services", fr: "Charge financière & prise en charge des coûts", it: "Costi finanziari e copertura delle spese" },

  // Q6: Network
  "ja, aufgaben sind gut im umfeld verteilt": { de: "Ja, Aufgaben sind gut im Umfeld verteilt", en: "Yes, responsibilities are shared well", fr: "Oui, les responsabilités sont bien partagées", it: "Sì, i compiti sono ben distribuiti" },
  "yes, responsibilities are shared well": { de: "Ja, Aufgaben sind gut im Umfeld verteilt", en: "Yes, responsibilities are shared well", fr: "Oui, les responsabilités sont bien partagées", it: "Sì, i compiti sono ben distribuiti" },
  "etwas hilfe, aber hauptverantwortung liegt bei mir": { de: "Etwas Hilfe, aber Hauptverantwortung liegt bei mir", en: "Some help, but I carry most of the responsibility", fr: "Un peu d'aide, mais je porte la responsabilité principale", it: "Un po' d'aiuto, ma la responsabilità principale è mia" },
  "some help, but i carry most of the responsibility": { de: "Etwas Hilfe, aber Hauptverantwortung liegt bei mir", en: "Some help, but I carry most of the responsibility", fr: "Un peu d'aide, mais je porte la responsabilité principale", it: "Un po' d'aiuto, ma la responsabilità principale è mia" },
  "nein, ich trage die betreuung vollständig allein": { de: "Nein, ich trage die Betreuung vollständig allein", en: "No, I am managing everything entirely alone", fr: "Non, je gère tout entièrement seul(e)", it: "No, gestisco tutto completamente da solo/a" },
  "no, i am managing everything entirely alone": { de: "Nein, ich trage die Betreuung vollständig allein", en: "No, I am managing everything entirely alone", fr: "Non, je gère tout entièrement seul(e)", it: "No, gestisco tutto completamente da solo/a" },

  // Q7: Spitex
  "ja, tägliche spitex-einsätze": { de: "Ja, tägliche Spitex-Einsätze", en: "Yes, on a daily basis (Spitex)", fr: "Oui, interventions quotidiennes (Spitex)", it: "Sì, interventi quotidiani (Spitex)" },
  "yes, on a daily basis": { de: "Ja, tägliche Spitex-Einsätze", en: "Yes, on a daily basis (Spitex)", fr: "Oui, interventions quotidiennes (Spitex)", it: "Sì, interventi quotidiani (Spitex)" },
  "ja, mehrmals pro woche": { de: "Ja, mehrmals pro Woche", en: "Yes, a few times per week", fr: "Oui, plusieurs fois par semaine", it: "Sì, più volte a settimana" },
  "yes, a few times per week": { de: "Ja, mehrmals pro Woche", en: "Yes, a few times per week", fr: "Oui, plusieurs fois par semaine", it: "Sì, più volte a settimana" },
  "spitex-einbezug wird aktuell geprüft": { de: "Spitex-Einbezug wird aktuell geprüft", en: "Considering hiring professional support", fr: "Recours aux soins ambulatoires à l'étude", it: "Valutazione del supporto professionale in corso" },
  "we are considering hiring professional support": { de: "Spitex-Einbezug wird aktuell geprüft", en: "Considering hiring professional support", fr: "Recours aux soins ambulatoires à l'étude", it: "Valutazione del supporto professionale in corso" },
  "aktuell keine professionellen pflegedienste": { de: "Aktuell keine professionellen Pflegedienste", en: "No professional services at this time", fr: "Aucun service professionnel actuellement", it: "Nessun servizio professionale al momento" },
  "no professional services at this time": { de: "Aktuell keine professionellen Pflegedienste", en: "No professional services at this time", fr: "Aucun service professionnel actuellement", it: "Nessun servizio professionale al momento" },

  // Q8: Legal
  "ja, vorsorgeauftrag & patientenverfügung vollständig geregelt": { de: "Ja, Vorsorgeauftrag & Patientenverfügung vollständig geregelt", en: "Yes, health proxy and power of attorney are complete", fr: "Oui, mandat pour cause d'inaptitude & directives prêts", it: "Sì, procure e direttive anticipate complete" },
  "yes, health proxy and power of attorney are complete": { de: "Ja, Vorsorgeauftrag & Patientenverfügung vollständig geregelt", en: "Yes, health proxy and power of attorney are complete", fr: "Oui, mandat pour cause d'inaptitude & directives prêts", it: "Sì, procure e direttive anticipate complete" },
  "teilweise vorhanden / in bearbeitung": { de: "Teilweise vorhanden / in Bearbeitung", en: "Partially completed / in progress", fr: "Partiellement / en cours d'élaboration", it: "Parzialmente pronto / in corso" },
  "partially completed / in progress": { de: "Teilweise vorhanden / in Bearbeitung", en: "Partially completed / in progress", fr: "Partiellement / en cours d'élaboration", it: "Parzialmente pronto / in corso" },
  "noch nicht erstellt": { de: "Noch nicht erstellt", en: "Not yet created", fr: "Pas encore établi", it: "Non ancora creato" },
  "not yet created": { de: "Noch nicht erstellt", en: "Not yet created", fr: "Pas encore établi", it: "Non ancora creato" },

  // Q9: Wellbeing
  "gut bewältigbar mit stabiler balance": { de: "Gut bewältigbar mit stabiler Balance", en: "Managing well with good balance", fr: "Bien géré avec un bon équilibre", it: "Ben gestibile con un buon equilibrio" },
  "managing well with good balance": { de: "Gut bewältigbar mit stabiler Balance", en: "Managing well with good balance", fr: "Bien géré avec un bon équilibre", it: "Ben gestibile con un buon equilibrio" },
  "häufig gestresst, aber noch handhabbar": { de: "Häufig gestresst, aber noch handhabbar", en: "Frequently stressed but coping", fr: "Souvent stressé(e) mais gérable", it: "Spesso stressato/a ma gestibile" },
  "frequently stressed but coping": { de: "Häufig gestresst, aber noch handhabbar", en: "Frequently stressed but coping", fr: "Souvent stressé(e) mais gérable", it: "Spesso stressato/a ma gestibile" },
  "stark überlastet und nahe an der erschöpfung": { de: "Stark überlastet und nahe an der Erschöpfung", en: "Overwhelmed and nearing exhaustion", fr: "Très surchargé(e) et proche de l'épuisement", it: "Fortemente sovraccarico/a e vicino all'esaurimento" },
  "overwhelmed and nearing exhaustion": { de: "Stark überlastet und nahe an der Erschöpfung", en: "Overwhelmed and nearing exhaustion", fr: "Très surchargé(e) et proche de l'épuisement", it: "Fortemente sovraccarico/a e vicino all'esaurimento" },
  "dringender entlastungsbedarf zur erholung": { de: "Dringender Entlastungsbedarf zur Erholung", en: "In urgent need of relief and respite support", fr: "Besoin urgent de répit et de soutien", it: "Urgente bisogno di sollievo e riposo" },
  "in urgent need of relief and respite support": { de: "Dringender Entlastungsbedarf zur Erholung", en: "In urgent need of relief and respite support", fr: "Besoin urgent de répit et de soutien", it: "Urgente bisogno di sollievo e riposo" },

  // Q10: Canton
  "zürich / nordostschweiz": { de: "Zürich / Nordostschweiz (ZH, SH, TG, SG)", en: "Zurich / North-Eastern Switzerland", fr: "Zurich / Suisse du Nord-Est", it: "Zurigo / Svizzera nord-orientale" },
  "zurich / north-eastern switzerland": { de: "Zürich / Nordostschweiz (ZH, SH, TG, SG)", en: "Zurich / North-Eastern Switzerland", fr: "Zurich / Suisse du Nord-Est", it: "Zurigo / Svizzera nord-orientale" },
  "bern / espace mittelland": { de: "Bern / Espace Mittelland (BE, SO, AG, BL, BS)", en: "Bern / Mittelland region", fr: "Berne / Espace Mittelland", it: "Berna / Mittelland" },
  "bern / mittelland region": { de: "Bern / Espace Mittelland (BE, SO, AG, BL, BS)", en: "Bern / Mittelland region", fr: "Berne / Espace Mittelland", it: "Berna / Mittelland" },
  "romandie (genf, waadt, wallis, neuenburg)": { de: "Romandie (VD, GE, VS, NE, FR, JU)", en: "Romandie (Geneva, Vaud, Valais, Neuchâtel)", fr: "Romandie (Genève, Vaud, Valais, Neuchâtel)", it: "Svizzera romanda (Ginevra, Vaud, Vallese, Neuchâtel)" },
  "romandie (geneva, vaud, valais, neuchâtel)": { de: "Romandie (VD, GE, VS, NE, FR, JU)", en: "Romandie (Geneva, Vaud, Valais, Neuchâtel)", fr: "Romandie (Genève, Vaud, Valais, Neuchâtel)", it: "Svizzera romanda (Ginevra, Vaud, Vallese, Neuchâtel)" },
  "zentralschweiz / tessin / übrige kantone": { de: "Zentralschweiz / Tessin / Übrige Kantone", en: "Central Switzerland / Ticino / Other Cantons", fr: "Suisse centrale / Tessin / Autres cantons", it: "Svizzera centrale / Ticino / Altri cantoni" },
  "other canton / central switzerland / ticino": { de: "Zentralschweiz / Tessin / Übrige Kantone", en: "Central Switzerland / Ticino / Other Cantons", fr: "Suisse centrale / Tessin / Autres cantons", it: "Svizzera centrale / Ticino / Altri cantoni" },

  // Q11: Respite
  "ja, dringend auf der suche nach entlastung": { de: "Ja, dringend auf der Suche nach Entlastung", en: "Yes, urgently looking for temporary relief options", fr: "Oui, recherche urgente d'offres de répit", it: "Sì, ricerca urgente di sollievo temporaneo" },
  "ja, dringend kurzfristige entlastung": { de: "Ja, dringend auf der Suche nach Entlastung", en: "Yes, urgently looking for temporary relief options", fr: "Oui, recherche urgente d'offres de répit", it: "Sì, ricerca urgente di sollievo temporaneo" },
  "yes, urgently looking for temporary relief options": { de: "Ja, dringend auf der Suche nach Entlastung", en: "Yes, urgently looking for temporary relief options", fr: "Oui, recherche urgente d'offres de répit", it: "Sì, ricerca urgente di sollievo temporaneo" },
  "ja, als vorsorge für künftige bedarfe": { de: "Ja, als Vorsorge für künftige Bedarfe", en: "Yes, planning for future respite needs", fr: "Oui, en prévision de besoins futurs", it: "Sì, pianificazione per esigenze future" },
  "ja, für die mittelfristige planung": { de: "Ja, als Vorsorge für künftige Bedarfe", en: "Yes, planning for future respite needs", fr: "Oui, en prévision de besoins futurs", it: "Sì, pianificazione per esigenze future" },
  "yes, planning for future respite needs": { de: "Ja, als Vorsorge für künftige Bedarfe", en: "Yes, planning for future respite needs", fr: "Oui, en prévision de besoins futurs", it: "Sì, pianificazione per esigenze future" },
  "möchte mich über möglichkeiten informieren": { de: "Möchte mich über Möglichkeiten informieren", en: "Would like to learn what respite options exist", fr: "Souhaite m'informer sur les options", it: "Vorrei informarmi sulle opzioni" },
  "möchte mich erst informieren": { de: "Möchte mich über Möglichkeiten informieren", en: "Would like to learn what respite options exist", fr: "Souhaite m'informer sur les options", it: "Vorrei informarmi sulle opzioni" },
  "would like to learn what respite options exist": { de: "Möchte mich über Möglichkeiten informieren", en: "Would like to learn what respite options exist", fr: "Souhaite m'informer sur les options", it: "Vorrei informarmi sulle opzioni" },
  "aktuell kein entlastungsbedarf": { de: "Aktuell kein Entlastungsbedarf", en: "Not needed at this time", fr: "Pas nécessaire pour le moment", it: "Non necessario al momento" },
  "aktuell kein bedarf": { de: "Aktuell kein Entlastungsbedarf", en: "Not needed at this time", fr: "Pas nécessaire pour le moment", it: "Non necessario al momento" },
  "not needed at this time": { de: "Aktuell kein Entlastungsbedarf", en: "Not needed at this time", fr: "Pas nécessaire pour le moment", it: "Non necessario al momento" },

  // Q12: Goals
  "strukturierter schritt-für-schritt-plan für unsere familie": { de: "Strukturierter Schritt-für-Schritt-Plan für unsere Familie", en: "A structured step-by-step roadmap for our family", fr: "Un plan d'action structuré pour notre famille", it: "Un piano d'azione strutturato per la nostra famiglia" },
  "strukturierter fahrplan für die familie": { de: "Strukturierter Schritt-für-Schritt-Plan für unsere Familie", en: "A structured step-by-step roadmap for our family", fr: "Un plan d'action structuré pour notre famille", it: "Un piano d'azione strutturato per la nostra famiglia" },
  "a structured step-by-step roadmap for our family": { de: "Strukturierter Schritt-für-Schritt-Plan für unsere Familie", en: "A structured step-by-step roadmap for our family", fr: "Un plan d'action structuré pour notre famille", it: "Un piano d'azione strutturato per la notre famille" },
  "finanzielle klarheit über ergänzungsleistungen (el/ahv)": { de: "Finanzielle Klarheit über Ergänzungsleistungen (EL/AHV)", en: "Financial assistance and insurance entitlement clarity", fr: "Clarté financière sur les prestations complémentaires (PC/AVS)", it: "Chiarezza finanziaria sulle prestazioni complementari (PC/AVS)" },
  "finanzielle hilfen & krankenkassenansprüche": { de: "Finanzielle Klarheit über Ergänzungsleistungen (EL/AHV)", en: "Financial assistance and insurance entitlement clarity", fr: "Clarté financière sur les prestations complémentaires (PC/AVS)", it: "Chiarezza finanziaria sulle prestazioni complementari (PC/AVS)" },
  "financial assistance and insurance entitlement clarity": { de: "Finanzielle Klarheit über Ergänzungsleistungen (EL/AHV)", en: "Financial assistance and insurance entitlement clarity", fr: "Clarté financière sur les prestations complémentaires (PC/AVS)", it: "Chiarezza finanziaria sulle prestazioni complementari (PC/AVS)" },
  "notfallplanung & entlastungsmöglichkeiten": { de: "Notfallplanung & Entlastungsmöglichkeiten", en: "Emergency backup and respite planning", fr: "Plan d'urgence & options de répit", it: "Pianificazione d'emergenza e sollievo" },
  "notfallplan & entlastungsorganisation": { de: "Notfallplanung & Entlastungsmöglichkeiten", en: "Emergency backup and respite planning", fr: "Plan d'urgence & options de répit", it: "Pianificazione d'emergenza e sollievo" },
  "emergency backup and respite planning": { de: "Notfallplanung & Entlastungsmöglichkeiten", en: "Emergency backup and respite planning", fr: "Plan d'urgence & options de répit", it: "Pianificazione d'emergenza e sollievo" },
  "vermittlung akkreditierter regionaler beratungsstellen": { de: "Vermittlung akkreditierter regionaler Beratungsstellen", en: "Connecting with verified local care partners", fr: "Mise en relation avec des centres de conseil accrédités", it: "Contatto con centri di consulenza accreditati" },
  "vermittlung geprüfter lokaler pflegepartner": { de: "Vermittlung akkreditierter regionaler Beratungsstellen", en: "Connecting with verified local care partners", fr: "Mise en relation avec des centres de conseil accrédités", it: "Contatto con centri di consulenza accreditati" },
  "connecting with verified local care partners": { de: "Vermittlung akkreditierter regionaler Beratungsstellen", en: "Connecting with verified local care partners", fr: "Mise en relation avec des centres de conseil accrédités", it: "Contatto con centri di consulenza accreditati" },
};

export function formatLivingSituation(val: string | undefined | null, lang: string = "de"): string {
  if (!val) return "";
  const key = String(val).trim().toLowerCase();
  if (LIVING_MAP[key]) {
    return LIVING_MAP[key][lang] || LIVING_MAP[key].de || val;
  }
  return val;
}

export function formatRelation(val: string | undefined | null, lang: string = "de"): string {
  if (!val) return "";
  const key = String(val).trim().toLowerCase();
  if (RELATION_MAP[key]) {
    return RELATION_MAP[key][lang] || RELATION_MAP[key].de || val;
  }
  return val;
}

export function formatCaregiverName(val: string | undefined | null, lang: string = "de"): string {
  if (!val) return "";
  const key = String(val).trim().toLowerCase();
  if (CAREGIVER_MAP[key]) {
    return CAREGIVER_MAP[key][lang] || CAREGIVER_MAP[key].de || val;
  }
  return val;
}

export function formatCareDegree(val: string | undefined | null, lang: string = "de"): string {
  if (!val) return "";
  const key = String(val).trim().toLowerCase();
  if (CARE_DEGREE_MAP[key]) {
    return CARE_DEGREE_MAP[key][lang] || CARE_DEGREE_MAP[key].de || val;
  }
  return val;
}

export function formatAnswer(val: string | undefined | null, lang: string = "de"): string {
  if (!val) return "";
  const key = String(val).trim().toLowerCase();
  if (ANSWER_MAP[key]) {
    return ANSWER_MAP[key][lang] || ANSWER_MAP[key].de || val;
  }
  return val;
}

export function formatDateTime(val: string | undefined | null, lang: string = "de"): string {
  if (!val) return "";
  try {
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      const localeMap: Record<string, string> = {
        de: "de-CH",
        en: "en-US",
        fr: "fr-CH",
        it: "it-CH",
      };
      const locale = localeMap[lang] || "de-CH";
      return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d);
    }
  } catch {}
  return val;
}

const TIME_MAP: Record<string, Record<string, string>> = {
  vormittag: { de: "Vormittag", en: "Morning", fr: "Matin", it: "Mattina" },
  morning: { de: "Vormittag", en: "Morning", fr: "Matin", it: "Mattina" },
  nachmittag: { de: "Nachmittag", en: "Afternoon", fr: "Après-midi", it: "Pomeriggio" },
  afternoon: { de: "Nachmittag", en: "Afternoon", fr: "Après-midi", it: "Pomeriggio" },
  abend: { de: "Abend", en: "Evening", fr: "Soirée", it: "Sera" },
  evening: { de: "Abend", en: "Evening", fr: "Soirée", it: "Sera" },
  jederzeit: { de: "Jederzeit", en: "Anytime", fr: "À tout moment", it: "In qualsiasi momento" },
  anytime: { de: "Jederzeit", en: "Anytime", fr: "À tout moment", it: "In qualsiasi momento" },
};

export function formatPreferredTime(val: string | undefined | null, lang: string = "de"): string {
  if (!val) return "";
  let formatted = val;
  for (const [key, map] of Object.entries(TIME_MAP)) {
    const regex = new RegExp(`\\b${key}\\b`, "i");
    if (regex.test(formatted)) {
      formatted = formatted.replace(regex, map[lang] || map.de || key);
    }
  }
  return formatted;
}


