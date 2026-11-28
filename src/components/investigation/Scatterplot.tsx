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
  colorKey?: keyof DatasetObservation; // Third variable for coloring points
  colorLabel?: string; // Label for the color variable
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
  colorKey,
  colorLabel,
}: ScatterplotProps) {
  const chartData = data.map((item) => ({
    ...item,
    x: item[xKey] as number,
    y: item[yKey] as number,
    color: colorKey ? (item[colorKey] as number) : undefined,
  }));

  // Find min and max for color scale
  const colorValues = colorKey
    ? chartData.map((d) => d.color).filter((v): v is number => v !== undefined)
    : [];
  const colorMin = colorValues.length > 0 ? Math.min(...colorValues) : 0;
  const colorMax = colorValues.length > 0 ? Math.max(...colorValues) : 1;
  const colorRange = colorMax - colorMin || 1;

  // Helper to convert numeric value to viridis-C color (option C)
  // Viridis-C is a cividis-inspired palette: purple → teal → yellow
  const getColor = (value: number | undefined) => {
    if (value === undefined) return "#2878A0";
    const normalized = (value - colorMin) / colorRange;
    // Map normalized [0, 1] to the cividis palette
    // Using 10-90% range of the full palette (begin=0.1, end=0.9)
    const t = 0.1 + normalized * 0.8;
    
    // Viridis-C colors at key points (from matplotlib viridis)
    // 0.1 (purple-blue): rgb(32, 10, 86)
    // 0.4 (teal): rgb(43, 131, 147)
    // 0.7 (cyan): rgb(135, 189, 109)
    // 0.9 (yellow-green): rgb(253, 231, 36)
    
    if (t < 0.4) {
      // Interpolate purple-blue to teal
      const s = (t - 0.1) / 0.3;
      return `rgb(${32 + s * 11}, ${10 + s * 121}, ${86 + s * 61})`;
    } else if (t < 0.7) {
      // Interpolate teal to cyan
      const s = (t - 0.4) / 0.3;
      return `rgb(${43 + s * 92}, ${131 + s * 58}, ${147 - s * 38})`;
    } else {
      // Interpolate cyan to yellow-green
      const s = (t - 0.7) / 0.2;
      return `rgb(${135 + s * 118}, ${189 + s * 42}, ${109 - s * 73})`;
    }
  };

  // Generate color legend stops (just min and max)
  const legendStops = colorKey ? [
    { value: colorMin, label: `${colorMin.toFixed(0)}` },
    { value: colorMax, label: `${colorMax.toFixed(0)}` },
  ] : [];

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
        }${colorLabel ? ` colored by ${colorLabel}` : ""}. The observations are available in the data table below.`
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
              shape={
                colorKey ? (props: any) => {
                  const { cx, cy, payload } = props;
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={3.5}
                      fill={getColor(payload.color)}
                      opacity={0.75}
                    />
                  );
                } : undefined
              }
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
              shape={
                colorKey ? (props: any) => {
                  const { cx, cy, payload } = props;
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={3.5}
                      fill={getColor(payload.color)}
                      opacity={0.75}
                    />
                  );
                } : undefined
              }
            />
          </ScatterChart>
        )}
      </ResponsiveContainer>
      {colorKey && colorLabel && (
        <div className="chart-color-legend">
          <p className="legend-label">{colorLabel}</p>
          <div className="legend-gradient">
            <div className="legend-gradient-bar" />
            <div className="legend-labels">
              {legendStops.map((stop, idx) => (
                <span key={idx} className="legend-value">
                  {stop.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
