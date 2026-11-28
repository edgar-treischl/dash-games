import { type DatasetObservation } from "../../data/datasets";
import { type VariableId } from "./variables";

export interface DescriptiveStatsProps {
  data: DatasetObservation[];
  variables: VariableId[];
}

function calculateStats(values: number[]) {
  if (values.length === 0) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / values.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const std = Math.sqrt(variance);

  return { mean, median, min, max, std };
}

export function DescriptiveStats({ data, variables }: DescriptiveStatsProps) {
  return (
    <div className="stats-panel">
      <h3>Deskriptive Statistiken</h3>
      <table className="stats-table">
        <thead>
          <tr>
            <th scope="col">Variable</th>
            <th scope="col">Mean</th>
            <th scope="col">Median</th>
            <th scope="col">Std Dev</th>
            <th scope="col">Min</th>
            <th scope="col">Max</th>
          </tr>
        </thead>
        <tbody>
          {variables.map((varId) => {
            const values = data
              .map((item) => item[varId] as number)
              .filter((v) => typeof v === "number");
            const stats = calculateStats(values);

            return (
              <tr key={varId}>
                <th scope="row">{varId}</th>
                <td>{stats?.mean.toFixed(2)}</td>
                <td>{stats?.median.toFixed(2)}</td>
                <td>{stats?.std.toFixed(2)}</td>
                <td>{stats?.min.toFixed(2)}</td>
                <td>{stats?.max.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
