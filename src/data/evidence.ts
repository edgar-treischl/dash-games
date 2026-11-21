export interface Evidence {
  id: string;
  title: string;
  description: string;
  detail: string;
  category: string;
  unlocks?: string[];
}

export const evidence: Evidence[] = [
  {
    id: "ice-cream",
    title: "Ice Cream Sales",
    description: "Monthly sales figures",
    detail:
      "The monthly sales report shows that ice cream sales increase significantly during the summer months.",
    category: "SALES",
    unlocks: ["weather"],
  },
  {
    id: "accidents",
    title: "Swimming Accidents",
    description: "Monthly accident statistics",
    detail:
      "The accident report indicates an increase in recorded swimming accidents during the summer months.",
    category: "STATISTICS",
    unlocks: ["visitors"],
  },
  {
    id: "weather",
    title: "Weather Report",
    description: "Monthly temperature records",
    detail:
      "The average temperature rises considerably during the same months in which ice cream sales and swimming accidents increase.",
    category: "CONTEXT",
  },
  {
    id: "visitors",
    title: "Swimming Pool Visitors",
    description: "Monthly visitor statistics",
    detail:
      "Swimming pool attendance increases during warmer months. More visitors also mean more opportunities for accidents to occur.",
    category: "CONTEXT",
  },
];