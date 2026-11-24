import observations from "./shoe-income.csv?raw";
import confidenceIntervals from "./shoe-income-confidence.csv?raw";

export interface ShoeIncomeDataPoint {
  sex: "Women" | "Men";
  shoe_size: number;
  income: number;
}

// Both CSVs are exported from the seeded simulation and lm() in fact_sheet_confounding.R.
export const shoeIncomeData: ShoeIncomeDataPoint[] = observations.trim().split("\n").slice(1).map((row) => {
  const [sex, shoeSize, income] = row.split(",");
  if (sex !== '"Women"' && sex !== '"Men"') {
    throw new Error(`Unexpected sex in shoe-income data: ${sex}`);
  }
  return {
    sex: sex === '"Women"' ? "Women" : "Men",
    shoe_size: Number(shoeSize),
    income: Number(income),
  };
});

export const overallConfidenceBand = confidenceIntervals.trim().split("\n").slice(1).map((row) => {
  const [shoeSize, , lower, upper] = row.split(",").map(Number);
  return { shoe_size: shoeSize, interval: [lower, upper] };
});

export function calculateCorrelation(data: ShoeIncomeDataPoint[]): number {
  const n = data.length;
  const meanShoe = data.reduce((sum, d) => sum + d.shoe_size, 0) / n;
  const meanIncome = data.reduce((sum, d) => sum + d.income, 0) / n;
  const numerator = data.reduce(
    (sum, d) => sum + (d.shoe_size - meanShoe) * (d.income - meanIncome),
    0,
  );
  const denominator = Math.sqrt(
    data.reduce((sum, d) => sum + (d.shoe_size - meanShoe) ** 2, 0) *
      data.reduce((sum, d) => sum + (d.income - meanIncome) ** 2, 0),
  );
  return numerator / denominator;
}

export function calculateRegression(data: ShoeIncomeDataPoint[]) {
  const meanShoe = data.reduce((sum, d) => sum + d.shoe_size, 0) / data.length;
  const meanIncome = data.reduce((sum, d) => sum + d.income, 0) / data.length;
  const slope = data.reduce(
    (sum, d) => sum + (d.shoe_size - meanShoe) * (d.income - meanIncome),
    0,
  ) / data.reduce((sum, d) => sum + (d.shoe_size - meanShoe) ** 2, 0);
  const min = Math.min(...data.map((d) => d.shoe_size));
  const max = Math.max(...data.map((d) => d.shoe_size));
  return [
    { x: min, y: meanIncome + slope * (min - meanShoe) },
    { x: max, y: meanIncome + slope * (max - meanShoe) },
  ] as const;
}

export function calculateGroupCorrelations(data: ShoeIncomeDataPoint[]) {
  return {
    women: calculateCorrelation(data.filter((d) => d.sex === "Women")),
    men: calculateCorrelation(data.filter((d) => d.sex === "Men")),
  };
}

export function calculateGroupMeans(data: ShoeIncomeDataPoint[]) {
  const mean = (group: ShoeIncomeDataPoint[]) => ({
    mean_shoe_size: group.reduce((sum, d) => sum + d.shoe_size, 0) / group.length,
    mean_income: group.reduce((sum, d) => sum + d.income, 0) / group.length,
  });
  return {
    women: mean(data.filter((d) => d.sex === "Women")),
    men: mean(data.filter((d) => d.sex === "Men")),
  };
}
