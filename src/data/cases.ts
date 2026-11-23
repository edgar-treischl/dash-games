
export type CaseStatus = "available" | "locked";

export type CaseCategory =
  | "Korrelation"
  | "Kausalität"
  | "Umgekehrte Kausalität"
  | "Kontext";

export interface InvestigationCase {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;

  status: CaseStatus;
  category: CaseCategory;
  briefingAsset?: string;

  evidenceIds: string[];
  datasetId?: string;
}

export const cases: InvestigationCase[] = [
  {
    id: "confounding_school_education",
    number: "001",
    title: "Digitale Ausstattung und Mathematikleistung",
    subtitle: "Entdecke eine mögliche Scheinkorrelation im schulischen Kontext",

    description:
      "Missing description?",

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

