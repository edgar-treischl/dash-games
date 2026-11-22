import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type DatasetObservation } from "../../data/datasets";
import {
  computeLinearRegressionWithCI,
  type RegressionPoint,
} from "../../utils/computeCI";

export interface ScatterplotProps {
  data: DatasetObservation[];
  xKey: keyof DatasetObservation;
  yKey: keyof DatasetObservation;
  xLabel: string;
  yLabel: string;
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

export function Scatterplot({
  data,
  xKey,
  yKey,
  xLabel,
  yLabel,
  xUnit,
  yUnit,
  ariaLabel,
  showRegression = false,
}: ScatterplotProps) {
  const chartData = data.map((item) => ({
    ...item,
    x: item[xKey] as number,
    y: item[yKey] as number,
  }));

  // Compute regression if requested
  const regressionData: RegressionPoint[] = showRegression
    ? computeLinearRegressionWithCI(
        chartData.map((d) => ({ x: d.x, y: d.y }))
      )
    : [];

  return (
    <div
      className="chart-container"
      role="img"
      aria-label={
        ariaLabel ||
        `Scatterplot showing ${yLabel} against ${xLabel}${
          showRegression
            ? " with linear regression line and 95% confidence band"
            : ""
        }. The observations are available in the data table below.`
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        {showRegression ? (
          <ComposedChart
            data={regressionData}
            margin={{ top: 20, right: 25, bottom: 25, left: 0 }}
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
                fontSize: 11,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={yLabel}
              stroke="var(--noir-muted)"
              tick={tickStyle}
              width={50}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3", stroke: "var(--noir-accent)" }}
              contentStyle={tooltipStyle}
              formatter={(value, name) => {
                if (name === "95% Confidence Band") {
                  return [];
                }
                if (typeof value !== "number") return [value, name];
                if (name === "trend") {
                  return [`${(value as number).toFixed(2)} ${yUnit}`, "Linear Fit"];
                }
                return [value.toFixed(2), name];
              }}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.month ?? ""}
            />
            <Area
              type="monotone"
              dataKey="band"
              stroke="none"
              fill="var(--noir-muted)"
              fillOpacity={0.15}
              name="95% Confidence Band"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="trend"
              stroke="var(--noir-muted)"
              strokeWidth={2}
              dot={false}
              name="Linear Fit"
              isAnimationActive={false}
            />
            <Scatter
              name="Monthly observations"
              data={chartData}
              fill="var(--noir-accent)"
            />
          </ComposedChart>
        ) : (
          <ScatterChart
            data={chartData}
            margin={{ top: 20, right: 25, bottom: 25, left: 0 }}
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
                fontSize: 11,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={yLabel}
              stroke="var(--noir-muted)"
              tick={tickStyle}
              width={50}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3", stroke: "var(--noir-accent)" }}
              contentStyle={tooltipStyle}
              formatter={(value, name) => {
                if (typeof value !== "number") return [value, name];
                const formatted = (value as number).toFixed(2);
                if (name === "y" || name === yLabel) {
                  return [`${formatted} ${yUnit}`, yLabel];
                }
                return [formatted, name];
              }}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.month ?? ""}
            />
            <Scatter
              name="Monthly observations"
              data={chartData}
              fill="var(--noir-accent)"
            />
          </ScatterChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
