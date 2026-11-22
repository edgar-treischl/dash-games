import {
  ComposedChart,
  Area,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Point = {
  x: number;
  y?: number;
  trend: number;
  band: [number, number];
};

const data: Point[] = [
  { x: 1, y: 12, trend: 10, band: [7, 13] },
  { x: 2, y: 19, trend: 18, band: [14, 22] },
  { x: 3, y: 25, trend: 26, band: [21, 31] },
  { x: 4, y: 36, trend: 34, band: [28, 40] },
];

export function ScatterWithConfidenceBand() {
  return (
    <ResponsiveContainer width="100%" height={360}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" dataKey="x" name="X" />
        <YAxis type="number" name="Y" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="band"
          stroke="none"
          fill="#3b82f6"
          fillOpacity={0.2}
          name="95% Confidence Band"
        />
        <Line
          type="monotone"
          dataKey="trend"
          stroke="#1d4ed8"
          strokeWidth={2}
          dot={false}
          name="Fit"
        />
        <Scatter dataKey="y" fill="#0f172a" name="Observations" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
