type RawPoint = { x: number; y: number };
export type RegressionPoint = { x: number; trend: number; band: [number, number] };

export function computeLinearRegressionWithCI(
  points: RawPoint[],
  steps = 40
): RegressionPoint[] {
  const n = points.length;
  if (n < 3) return [];

  const meanX = points.reduce((sum, p) => sum + p.x, 0) / n;
  const meanY = points.reduce((sum, p) => sum + p.y, 0) / n;

  let sxx = 0;
  let sxy = 0;
  for (const p of points) {
    sxx += (p.x - meanX) ** 2;
    sxy += (p.x - meanX) * (p.y - meanY);
  }
  if (sxx === 0) return [];

  const slope = sxy / sxx;
  const intercept = meanY - slope * meanX;

  // Residual standard error
  let sse = 0;
  for (const p of points) {
    const predicted = intercept + slope * p.x;
    sse += (p.y - predicted) ** 2;
  }
  const s = Math.sqrt(sse / (n - 2));

  // Approximate 95% two-tailed t-critical value (~1.96 for large n)
  const tCrit = n > 30 ? 1.96 : 2.0 + 2.5 / (n - 2);

  const xs = points.map((p) => p.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const stepSize = (maxX - minX) / (steps - 1);

  const grid: RegressionPoint[] = [];
  for (let i = 0; i < steps; i++) {
    const x = minX + i * stepSize;
    const trend = intercept + slope * x;
    // Standard error of the mean fit at x
    const seFit = s * Math.sqrt(1 / n + (x - meanX) ** 2 / sxx);
    const margin = tCrit * seFit;

    grid.push({
      x,
      trend,
      band: [trend - margin, trend + margin],
    });
  }

  return grid;
}
