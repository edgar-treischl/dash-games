import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type DatasetObservation } from "../../data/datasets";

export interface ScatterplotProps {
  data: DatasetObservation[];
  xKey: keyof DatasetObservation;
  yKey: keyof DatasetObservation;
  xLabel: string;
  yLabel: string;
  xUnit: string;
  yUnit: string;
  ariaLabel?: string;
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
}: ScatterplotProps) {
  const chartData = data.map((item) => ({
    ...item,
    x: item[xKey],
    y: item[yKey],
  }));

  return (
    <div
      className="chart-container"
      role="img"
      aria-label={
        ariaLabel ||
        `Scatterplot showing ${yLabel} against ${xLabel}. The observations are available in the data table below.`
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 25, bottom: 25, left: 0 }}>
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
            formatter={(value, name) => [
              `${value} ${name === xLabel ? xUnit : yUnit}`,
              name,
            ]}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.month ?? ""}
          />
          <Scatter
            name="Monthly observations"
            data={chartData}
            fill="var(--noir-accent)"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
