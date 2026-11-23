
export type CaseStatus = "available" | "locked";

export type CaseCategory =
  | "Korrelation"
  | "Kausalität"
  | "Umgekehrte Kausalität"
  | "Kontext";

export interface DecisionQuestion {
  id: string;
  question: string;
  options: Array<{
    value: string;
    label: string;
    isCorrect?: boolean;
  }>;
  feedback?: string;
  hint?: string;
  correctMessage?: string;
  incorrectMessage?: string;
}

export interface InvestigationCase {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  taskDescription?: string;
  learningGoals?: string[];

  status: CaseStatus;
  category: CaseCategory;
  briefingAsset?: string;

  evidenceIds: string[];
  datasetId?: string;
  decisionQuestions?: DecisionQuestion[];
}

export const cases: InvestigationCase[] = [
  {
    id: "confounding_school_education",
    number: "001",
    title: "Digitale Ausstattung und Mathematikleistung",
    subtitle: "Entdecke eine mögliche Scheinkorrelation im schulischen Kontext",

    description:
      "Schulen mit besserer digitaler Ausstattung erzielen bessere Mathematikergebnisse. Aber ist die Technologie wirklich die Ursache? Oder gibt es andere Faktoren, die beide Variablen erklären?",
    
    taskDescription:
      "Deine Aufgabe ist es, die verfügbaren Daten und Hinweise zu untersuchen, um herauszufinden, ob die digitale Ausstattung die Mathematikleistung wirklich verursacht oder ob es sich um eine Scheinkorrelation handelt.",
    
    learningGoals: [
      "Verstehe die Unterschied zwischen Korrelation und Kausalität",
      "Erkenne Scheinkorrelationen und Störvariablen",
      "Lerne, kritisch über Daten zu denken"
    ],

    status: "available",
    category: "Korrelation",
    briefingAsset: "newspaper.html",

    evidenceIds: [
      "ice-cream",
      "accidents",
      "weather",
      "visitors",
    ],

    datasetId: "summer-dataset",

    decisionQuestions: [
      {
        id: "q1-variable-importance",
        question: "Welche Variable ist am wichtigsten für die Vorhersage von Mathematikleistung?",
        options: [
          { value: "devices", label: "Digitale Ausstattung", isCorrect: false },
          { value: "funding", label: "Schulbudget", isCorrect: false },
          { value: "teachers", label: "Lehrerqualifikation", isCorrect: false },
          { value: "uncertain", label: "Das ist unklar", isCorrect: true },
        ],
        feedback:
          "Basierend auf den Daten kann es schwierig sein, die wahre Ursache zu identifizieren. Achte darauf, dass Korrelation nicht gleich Kausalität ist.",
        hint: "Reichen die vorliegenden Informationen aus, um die Vorhersagekraft dieser Variablen zu vergleichen?",
        correctMessage: "Richtig! Die vorliegenden Informationen erlauben keinen Vergleich der Vorhersagekraft.",
        incorrectMessage: "Die wichtigste Vorhersagevariable lässt sich hier nicht bestimmen.",
      },
      {
        id: "q2-confounding-variable",
        question: "Welche Variable könnte ein Störfaktor (Confounder) sein?",
        options: [
          { value: "weather", label: "Wetter", isCorrect: false },
          { value: "school_location", label: "Schulstandort (urban vs. ländlich)", isCorrect: true },
          { value: "time", label: "Zeit des Jahres", isCorrect: false },
          { value: "none", label: "Es gibt keinen Störfaktor", isCorrect: false },
        ],
        feedback:
          "Ein Störfaktor könnte erklären, warum digitale Ausstattung und Mathematikleistung korreliert sind, ohne dass eines das andere verursacht.",
        hint: "Welcher Faktor könnte BEIDE Variablen beeinflussen - sowohl die Verfügbarkeit von digitaler Ausstattung als auch die Mathematikleistung?",
        correctMessage: "Ausgezeichnet! Der Schulstandort könnte ein echter Störfaktor sein - städtische Schulen haben oft mehr Ressourcen.",
        incorrectMessage: "Versuche es nochmal. Überlege, welcher Faktor BEIDE Variablen beeinflussen könnte.",
      },
    ],
  },

  {
    id: "digital-advantage",
    number: "002",
    title: "The Digital Advantage",
    subtitle: "The technology question",

    description:
      "Schools with more digital devices achieve better results. But why? Investigate whether technology itself makes the difference.",

    status: "locked",
    category: "Kausalität",

    evidenceIds: [],

  },

  {
    id: "reading-paradox",
    number: "003",
    title: "The Reading Paradox",
    subtitle: "Which came first?",

    description:
      "Students who read more achieve better results. But does reading improve performance, or do successful students simply read more?",

    status: "locked",
    category: "Umgekehrte Kausalität",

    evidenceIds: [],
  },

  {
    id: "missing-students",
    number: "004",
    title: "The Missing Students",
    subtitle: "An incomplete picture",

    description:
      "Attendance and examination results seem connected. But what happens when important information is missing?",

    status: "locked",
    category: "Kontext",

    evidenceIds: [],
  },
];

