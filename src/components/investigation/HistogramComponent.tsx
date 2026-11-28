import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type DatasetObservation } from "../../data/datasets";

export interface HistogramComponentProps {
  data: DatasetObservation[];
  dataKey: keyof DatasetObservation;
  dataLabel: string;
  dataUnit: string;
  ariaLabel?: string;
  bins?: number;
}

const tickStyle = { fill: "var(--noir-muted)", fontSize: 11 };
const tooltipStyle = {
  background: "var(--noir-surface)",
  border: "1px solid var(--noir-accent)",
  borderRadius: 5,
  color: "var(--noir-ink)",
};

export function HistogramComponent({
  data,
  dataKey,
  dataLabel,
  ariaLabel,
  bins = 20,
}: HistogramComponentProps) {
  const values = data
    .map((item) => item[dataKey] as number)
    .filter((v) => typeof v === "number");

  if (values.length === 0) {
    return <div>No data available</div>;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const binWidth = (max - min) / bins;

  const histogramData = Array.from({ length: bins }, (_, i) => {
    const binStart = min + i * binWidth;
    const binEnd = binStart + binWidth;
    const count = values.filter(
      (v) => v >= binStart && v < binEnd
    ).length;
    return {
      range: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`,
      count,
      binStart,
    };
  });

  return (
    <div
      className="chart-container"
      role="img"
      aria-label={
        ariaLabel ||
        `Histogram showing distribution of ${dataLabel}. The observations are available in the data table below.`
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={histogramData}
          margin={{ top: 20, right: 15, bottom: 10, left: 0 }}
        >
          <CartesianGrid stroke="var(--noir-border)" strokeDasharray="3 3" />
          <XAxis dataKey="range" stroke="var(--noir-muted)" tick={tickStyle} />
          <YAxis stroke="var(--noir-muted)" tick={tickStyle} width={50} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [
              `${value} schools`,
              "Count",
            ]}
          />
          <Bar
            dataKey="count"
            name="Count"
            fill="var(--noir-accent)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
