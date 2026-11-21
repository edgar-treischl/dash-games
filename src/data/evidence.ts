
export type EvidenceRole =
  | "observation"
  | "context"
  | "alternative-explanation";

export interface Evidence {
  id: string;
  caseId: string;

  title: string;
  description: string;
  detail: string;

  category: string;
  role: EvidenceRole;

  unlocks?: string[];
}

export const evidence: Evidence[] = [
  // =========================================
  // CASE 001 – THE SUMMER MYSTERY
  // =========================================

  {
    id: "ice-cream",
    caseId: "summer-mystery",

    title: "Ice Cream Sales",
    description: "Monthly sales figures",

    detail:
      "The monthly sales report shows that ice cream sales increase significantly during the summer months. The pattern appears to coincide with an increase in swimming accidents.",

    category: "SALES",
    role: "observation",

    unlocks: ["weather"],
  },

  {
    id: "accidents",
    caseId: "summer-mystery",

    title: "Swimming Accidents",
    description: "Monthly accident statistics",

    detail:
      "The accident report indicates an increase in recorded swimming accidents during the summer months. The numbers appear to follow a similar seasonal pattern to ice cream sales.",

    category: "STATISTICS",
    role: "observation",

    unlocks: ["visitors"],
  },

  {
    id: "weather",
    caseId: "summer-mystery",

    title: "Weather Report",
    description: "Monthly temperature records",

    detail:
      "The average temperature rises considerably during the same months in which ice cream sales and swimming accidents increase. Warmer weather may influence both activities.",

    category: "CONTEXT",
    role: "alternative-explanation",
  },

  {
    id: "visitors",
    caseId: "summer-mystery",

    title: "Swimming Pool Visitors",
    description: "Monthly visitor statistics",

    detail:
      "Swimming pool attendance increases during warmer months. More visitors also mean more opportunities for accidents to occur. However, visitor numbers alone do not establish why accident rates change.",

    category: "CONTEXT",
    role: "alternative-explanation",
  },

  // =========================================
  // CASE 002 – THE DIGITAL ADVANTAGE
  // =========================================

  // Evidence will be added when Case 002
  // becomes available.

  // =========================================
  // CASE 003 – THE READING PARADOX
  // =========================================

  // Evidence will be added when Case 003
  // becomes available.

  // =========================================
  // CASE 004 – THE MISSING STUDENTS
  // =========================================

  // Evidence will be added when Case 004
  // becomes available.
];
