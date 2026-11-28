import { type DatasetObservation } from "../../data/datasets";
import { type VariableId } from "./variables";

export interface BoxplotComponentProps {
  data: DatasetObservation[];
  dataKey: VariableId;
  dataLabel: string;
  dataUnit: string;
}

interface BoxplotStats {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  mean: number;
  std: number;
}

function calculateBoxplotStats(values: number[]): BoxplotStats {
  if (values.length === 0) {
    return { min: 0, q1: 0, median: 0, q3: 0, max: 0, mean: 0, std: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;

  const q1Index = Math.floor(n * 0.25);
  const medianIndex = Math.floor(n * 0.5);
  const q3Index = Math.floor(n * 0.75);

  const sum = sorted.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  const variance = sorted.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  const std = Math.sqrt(variance);

  return {
    min: sorted[0],
    q1: sorted[q1Index],
    median: sorted[medianIndex],
    q3: sorted[q3Index],
    max: sorted[n - 1],
    mean,
    std,
  };
}

export function BoxplotComponent({
  data,
  dataKey,
}: BoxplotComponentProps) {
  const values = data
    .map((item) => item[dataKey] as number)
    .filter((v) => typeof v === "number");

  const stats = calculateBoxplotStats(values);

  const svgWidth = 600;
  const svgHeight = 180;
  const padding = 40;
  const plotWidth = svgWidth - 2 * padding;
  const plotHeight = svgHeight - 2 * padding - 40;

  const minVal = stats.min - (stats.max - stats.min) * 0.05;
  const maxVal = stats.max + (stats.max - stats.min) * 0.05;
  const range = maxVal - minVal;

  const getX = (val: number) => padding + ((val - minVal) / range) * plotWidth;
  const centerY = padding + plotHeight / 2;

  const boxHeight = 40;
  const boxY = centerY - boxHeight / 2;

  return (
    <div className="boxplot-wrapper">
      <svg
        width="100%"
        height="auto"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ border: "1px solid var(--noir-border)", marginBottom: "1rem", maxWidth: "100%" }}
      >
        {/* Grid background */}
        <rect
          x={padding}
          y={padding}
          width={plotWidth}
          height={plotHeight}
          fill="var(--noir-muted)"
          fillOpacity="0.05"
        />

        {/* Whisker lines (min and max) */}
        <line
          x1={getX(stats.min)}
          y1={centerY - 8}
          x2={getX(stats.min)}
          y2={centerY + 8}
          stroke="var(--noir-accent)"
          strokeWidth="2"
        />
        <line
          x1={getX(stats.min)}
          y1={centerY}
          x2={getX(stats.q1)}
          y2={centerY}
          stroke="var(--noir-muted)"
          strokeWidth="1"
        />
        <line
          x1={getX(stats.max)}
          y1={centerY - 8}
          x2={getX(stats.max)}
          y2={centerY + 8}
          stroke="var(--noir-accent)"
          strokeWidth="2"
        />
        <line
          x1={getX(stats.q3)}
          y1={centerY}
          x2={getX(stats.max)}
          y2={centerY}
          stroke="var(--noir-muted)"
          strokeWidth="1"
        />

        {/* Box (IQR) */}
        <rect
          x={getX(stats.q1)}
          y={boxY}
          width={Math.max(0, getX(stats.q3) - getX(stats.q1))}
          height={boxHeight}
          fill="var(--noir-accent)"
          fillOpacity="0.3"
          stroke="var(--noir-accent)"
          strokeWidth="2"
        />

        {/* Median line */}
        <line
          x1={getX(stats.median)}
          y1={boxY}
          x2={getX(stats.median)}
          y2={boxY + boxHeight}
          stroke="var(--noir-accent)"
          strokeWidth="2.5"
        />

        {/* Mean marker */}
        <circle
          cx={getX(stats.mean)}
          cy={centerY}
          r="3"
          fill="var(--noir-muted)"
          stroke="var(--noir-accent)"
          strokeWidth="1.5"
        />

        {/* Labels above boxplot with values */}
        <text
          x={getX(stats.min) - 20}
          y={padding - 15}
          textAnchor="end"
          fontSize="11"
          fill="var(--noir-muted)"
        >
          Min:
        </text>
        <text
          x={getX(stats.min)}
          y={padding - 15}
          textAnchor="middle"
          fontSize="11"
          fill="var(--noir-accent)"
          fontWeight="bold"
        >
          {stats.min.toFixed(1)}
        </text>

        <text
          x={getX(stats.median) - 25}
          y={padding - 15}
          textAnchor="end"
          fontSize="11"
          fill="var(--noir-muted)"
        >
          Median:
        </text>
        <text
          x={getX(stats.median)}
          y={padding - 15}
          textAnchor="middle"
          fontSize="11"
          fill="var(--noir-accent)"
          fontWeight="bold"
        >
          {stats.median.toFixed(1)}
        </text>

        <text
          x={getX(stats.max) - 20}
          y={padding - 15}
          textAnchor="end"
          fontSize="11"
          fill="var(--noir-muted)"
        >
          Max:
        </text>
        <text
          x={getX(stats.max)}
          y={padding - 15}
          textAnchor="middle"
          fontSize="11"
          fill="var(--noir-accent)"
          fontWeight="bold"
        >
          {stats.max.toFixed(1)}
        </text>
      </svg>
    </div>
  );
}
