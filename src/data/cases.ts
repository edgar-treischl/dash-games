export interface InvestigationCase {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  status: "available" | "locked";
  category: string;
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
  },
  {
    id: "digital-advantage",
    number: "002",
    title: "The Digital Advantage",
    subtitle: "The technology question",
    description:
      "Schools with more digital devices achieve better results. But why?",
    status: "locked",
    category: "CAUSALITY",
  },
  {
    id: "reading-paradox",
    number: "003",
    title: "The Reading Paradox",
    subtitle: "Which came first?",
    description:
      "Students who read more achieve better results. What is driving the relationship?",
    status: "locked",
    category: "REVERSE CAUSALITY",
  },
  {
    id: "missing-students",
    number: "004",
    title: "The Missing Students",
    subtitle: "An incomplete picture",
    description:
      "Attendance and examination results seem connected. What information is missing?",
    status: "locked",
    category: "CONTEXT",
  },
];