
export type CaseStatus = "available" | "locked";

export type CaseCategory =
  | "CORRELATION"
  | "CAUSALITY"
  | "REVERSE CAUSALITY"
  | "CONTEXT";

export interface InvestigationCase {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;

  status: CaseStatus;
  category: CaseCategory;

  evidenceIds: string[];
  datasetId?: string;
}

export const cases: InvestigationCase[] = [
  {
    id: "summer-mystery",
    number: "001",
    title: "The Summer Mystery",
    subtitle: "A suspicious connection",

    description:
      "Ice cream sales and swimming accidents are rising together. Is there more to this story?",

    status: "available",
    category: "CORRELATION",

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
    category: "CAUSALITY",

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
    category: "REVERSE CAUSALITY",

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
    category: "CONTEXT",

    evidenceIds: [],
  },
];

