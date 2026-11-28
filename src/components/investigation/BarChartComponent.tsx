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

export interface BarChartProps {
  data: DatasetObservation[];
  dataKey: keyof DatasetObservation;
  dataLabel: string;
  dataUnit: string;
  ariaLabel?: string;
}

const tickStyle = { fill: "var(--noir-muted)", fontSize: 11 };
const tooltipStyle = {
  background: "var(--noir-surface)",
  border: "1px solid var(--noir-accent)",
  borderRadius: 5,
  color: "var(--noir-ink)",
};

export function BarChartComponent({
  data,
  dataKey,
  dataLabel,
  dataUnit,
  ariaLabel,
}: BarChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    value: item[dataKey],
  }));

  return (
    <div
      className="chart-container"
      role="img"
      aria-label={
        ariaLabel ||
        `Bar chart showing ${dataLabel}. The observations are available in the data table below.`
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 15, bottom: 10, left: 0 }}
        >
          <CartesianGrid stroke="var(--noir-border)" strokeDasharray="3 3" />
          <XAxis dataKey="school_id" stroke="var(--noir-muted)" tick={tickStyle} />
          <YAxis stroke="var(--noir-muted)" tick={tickStyle} width={50} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [
              `${value} ${dataUnit}`,
              dataLabel,
            ]}
          />
          <Bar
            dataKey="value"
            name={dataLabel}
            fill="var(--noir-accent)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
