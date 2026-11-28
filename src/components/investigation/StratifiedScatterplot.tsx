import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  Area,
} from "recharts";
import { type DatasetObservation } from "../../data/datasets";
import {
  computeLinearRegressionWithCI,
  type RegressionPoint,
} from "../../utils/computeCI";

export interface StratifiedScatterplotProps {
  data: DatasetObservation[];
  xKey: keyof DatasetObservation;
  yKey: keyof DatasetObservation;
  stratifyKey: keyof DatasetObservation; // Variable to stratify by
  xLabel: string;
  yLabel: string;
  stratifyLabel: string;
  xUnit: string;
  yUnit: string;
  ariaLabel?: string;
  showRegression?: boolean;
}

const tickStyle = { fill: "var(--noir-muted)", fontSize: 11 };
const tooltipStyle = {
  background: "var(--noir-surface)",
  border: "1px solid var(--noir-accent)",
  borderRadius: 5,
  color: "var(--noir-ink)",
};

// Create stratification groups (tertiles)
function stratifyData(
  data: DatasetObservation[],
  stratifyKey: keyof DatasetObservation
): Map<string, DatasetObservation[]> {
  const values = data
    .map((item) => item[stratifyKey] as number)
    .filter((v) => typeof v === "number")
    .sort((a, b) => a - b);

  if (values.length < 3) {
    // If too few values, create two groups
    const mid = values[Math.floor(values.length / 2)];
    return new Map([
      ["Low", data.filter((item) => (item[stratifyKey] as number) <= mid)],
      ["High", data.filter((item) => (item[stratifyKey] as number) > mid)],
    ]);
  }

  const tercile1 = values[Math.floor(values.length / 3)];
  const tercile2 = values[Math.floor((values.length * 2) / 3)];

  return new Map([
    ["Low", data.filter((item) => (item[stratifyKey] as number) <= tercile1)],
    ["Medium", data.filter((item) => {
      const v = item[stratifyKey] as number;
      return v > tercile1 && v <= tercile2;
    })],
    ["High", data.filter((item) => (item[stratifyKey] as number) > tercile2)],
  ]);
}

export function StratifiedScatterplot({
  data,
  xKey,
  yKey,
  stratifyKey,
  xLabel,
  yLabel,
  stratifyLabel,
  xUnit,
  yUnit,
  ariaLabel,
  showRegression = false,
}: StratifiedScatterplotProps) {
  const groups = stratifyData(data, stratifyKey);
  const groupNames = Array.from(groups.keys());

  // Colors for each group
  const groupColors = {
    Low: "var(--noir-accent)",
    Medium: "#D68B48",
    High: "#2878A0",
  };

  return (
    <div
      className="chart-container stratified-chart"
      role="img"
      aria-label={
        ariaLabel ||
        `Stratified scatterplots showing ${yLabel} against ${xLabel}, split by ${stratifyLabel}. ${
          showRegression ? "Linear regression lines and 95% confidence bands shown." : ""
        }`
      }
    >
      <div className="stratified-charts-grid">
        {groupNames.map((groupName) => {
          const groupData = groups.get(groupName) || [];
          const chartData = groupData.map((item) => ({
            x: item[xKey] as number,
            y: item[yKey] as number,
          }));

          const regressionData: RegressionPoint[] = showRegression
            ? computeLinearRegressionWithCI(chartData)
            : [];

          const chartComponent = showRegression ? (
            <ComposedChart
              key={groupName}
              data={regressionData}
              margin={{ top: 15, right: 15, bottom: 25, left: 0 }}
            >
              <CartesianGrid stroke="var(--noir-border)" strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="x"
                name={xLabel}
                stroke="var(--noir-muted)"
                tick={tickStyle}
                label={{
                  value: `${xLabel} (${xUnit})`,
                  position: "insideBottom",
                  offset: -12,
                  fill: "var(--noir-accent)",
                  fontSize: 10,
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name={yLabel}
                stroke="var(--noir-muted)"
                tick={tickStyle}
                width={45}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3", stroke: "var(--noir-accent)" }}
                contentStyle={tooltipStyle}
                formatter={(value, name) => {
                  if (name === "95% Confidence Band") return [];
                  if (typeof value !== "number") return [value, name];
                  if (name === "trend") {
                    return [`${(value as number).toFixed(2)} ${yUnit}`, "Linear Fit"];
                  }
                  return [value.toFixed(2), name];
                }}
              />
              <Area
                type="monotone"
                dataKey="band"
                stroke="none"
                fill={groupColors[groupName as keyof typeof groupColors] || "var(--noir-muted)"}
                fillOpacity={0.1}
                name="95% Confidence Band"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="trend"
                stroke={groupColors[groupName as keyof typeof groupColors] || "var(--noir-muted)"}
                strokeWidth={2}
                dot={false}
                name="Linear Fit"
                isAnimationActive={false}
              />
              <Scatter
                name={groupName}
                data={chartData}
                fill={groupColors[groupName as keyof typeof groupColors] || "var(--noir-accent)"}
              />
            </ComposedChart>
          ) : (
            <ScatterChart
              key={groupName}
              data={chartData}
              margin={{ top: 15, right: 15, bottom: 25, left: 0 }}
            >
              <CartesianGrid stroke="var(--noir-border)" strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="x"
                name={xLabel}
                stroke="var(--noir-muted)"
                tick={tickStyle}
                label={{
                  value: `${xLabel} (${xUnit})`,
                  position: "insideBottom",
                  offset: -12,
                  fill: "var(--noir-accent)",
                  fontSize: 10,
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name={yLabel}
                stroke="var(--noir-muted)"
                tick={tickStyle}
                width={45}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3", stroke: "var(--noir-accent)" }}
                contentStyle={tooltipStyle}
                formatter={(value, name) => {
                  if (typeof value !== "number") return [value, name];
                  return [value.toFixed(2), name];
                }}
              />
              <Scatter
                name={groupName}
                data={chartData}
                fill={groupColors[groupName as keyof typeof groupColors] || "var(--noir-accent)"}
              />
            </ScatterChart>
          );

          return (
            <div key={groupName} className="stratified-chart-item">
              <h3>{groupName} {stratifyLabel}</h3>
              <div className="stratified-chart-content">
                <ResponsiveContainer width="100%" height={300}>
                  {chartComponent}
                </ResponsiveContainer>
              </div>
              <p className="stratified-chart-count">{groupData.length} observations</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
