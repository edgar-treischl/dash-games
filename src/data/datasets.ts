
export interface DatasetObservation {
  month: string;
  temperature: number;
  iceCreamSales: number;
  swimmingAccidents: number;
  poolVisitors: number;
}

export interface InvestigationDataset {
  id: string;
  title: string;
  observations: DatasetObservation[];
}

export const datasets: InvestigationDataset[] = [
  {
    id: "summer-dataset",
    title: "The Summer Mystery",
    observations: [
      { month: "Jan", temperature: 4, iceCreamSales: 120, swimmingAccidents: 8, poolVisitors: 180 },
      { month: "Feb", temperature: 5, iceCreamSales: 135, swimmingAccidents: 9, poolVisitors: 210 },
      { month: "Mar", temperature: 9, iceCreamSales: 180, swimmingAccidents: 12, poolVisitors: 340 },
      { month: "Apr", temperature: 13, iceCreamSales: 260, swimmingAccidents: 18, poolVisitors: 520 },
      { month: "May", temperature: 18, iceCreamSales: 390, swimmingAccidents: 29, poolVisitors: 850 },
      { month: "Jun", temperature: 23, iceCreamSales: 570, swimmingAccidents: 45, poolVisitors: 1400 },
      { month: "Jul", temperature: 27, iceCreamSales: 720, swimmingAccidents: 61, poolVisitors: 1900 },
      { month: "Aug", temperature: 26, iceCreamSales: 690, swimmingAccidents: 58, poolVisitors: 1800 },
      { month: "Sep", temperature: 20, iceCreamSales: 470, swimmingAccidents: 37, poolVisitors: 1100 },
      { month: "Oct", temperature: 14, iceCreamSales: 290, swimmingAccidents: 21, poolVisitors: 620 },
      { month: "Nov", temperature: 8, iceCreamSales: 165, swimmingAccidents: 11, poolVisitors: 280 },
      { month: "Dec", temperature: 5, iceCreamSales: 130, swimmingAccidents: 9, poolVisitors: 200 },
    ],
  },
];
