import { useState } from "react";
import { ArrowLeft, ChartScatter } from "lucide-react";
import { motion } from "motion/react";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { datasets } from "../../data/datasets";
import { cases } from "../../data/cases";
import { useGameStore } from "../../store/gameStore";
import { pearsonCorrelation } from "./correlation";

type VariableId =
  | "temperature"
  | "iceCreamSales"
  | "swimmingAccidents"
  | "poolVisitors";

const variableLabels: Record<VariableId, string> = {
  temperature: "Average Temperature",
  iceCreamSales: "Ice Cream Sales",
  swimmingAccidents: "Swimming Accidents",
  poolVisitors: "Pool Visitors",
};

const variableUnits: Record<VariableId, string> = {
  temperature: "°C",
  iceCreamSales: "units",
  swimmingAccidents: "incidents",
  poolVisitors: "visitors",
};

const variables = Object.keys(variableLabels) as VariableId[];
const tickStyle = { fill: "var(--noir-muted)", fontSize: 11 };
const tooltipStyle = {
  background: "var(--noir-surface)",
  border: "1px solid var(--noir-accent)",
  borderRadius: 5,
  color: "var(--noir-ink)",
};

export function EffectExplorer() {
  const selectedCaseId = useGameStore((state) => state.selectedCaseId);
  const goHome = useGameStore((state) => state.goHome);
  const returnToHeadquarters = useGameStore((state) => state.returnToHeadquarters);
  const gameCase = cases.find((item) => item.id === selectedCaseId);
  const dataset = datasets.find((item) => item.id === gameCase?.datasetId);

  const [xKey, setXKey] = useState<VariableId>("iceCreamSales");
  const [yKey, setYKey] = useState<VariableId>("swimmingAccidents");

  if (!gameCase || !selectedCaseId) {
    return (
      <main className="headquarters">
        <button className="back-button" onClick={goHome}>
          <ArrowLeft size={16} /> BACK TO CASE FILES
        </button>
        <p>Investigation not found.</p>
      </main>
    );
  }

  if (!dataset) {
    return (
      <main className="headquarters">
        <button className="back-button" onClick={returnToHeadquarters}>
          <ArrowLeft size={16} /> HEADQUARTERS
        </button>
        <h1>Effect explorer</h1>
        <p>No dataset is available for this case yet.</p>
      </main>
    );
  }

  const chartData = dataset.observations.map((observation) => ({
    ...observation,
    x: observation[xKey],
    y: observation[yKey],
  }));
  const chartDescription = `${variableLabels[yKey]} against ${variableLabels[xKey]}`;
  const correlation = pearsonCorrelation(chartData);

  return (
    <motion.main
      className="headquarters effect-explorer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
    >
      <button className="back-button" onClick={returnToHeadquarters}>
        <ArrowLeft size={16} /> HEADQUARTERS
      </button>
      <header className="evidence-heading">
        <span className="eyebrow">
          CASE #{gameCase.number} / EFFECT EXPLORATION
        </span>
        <h1>Effect explorer</h1>
        <p>Compare two variables and investigate their relationship.</p>
      </header>

      <section className="hypothesis-panel" aria-label="Effect explorer">
        <div className="wall-title">
          <ChartScatter size={20} />
          <span>EFFECT EXPLORER</span>
        </div>
        <div className="explorer-layout">
          <aside className="chart-controls" aria-label="Explorer controls">
            <div className="explorer-variables">
              <h2>Select variables to compare</h2>
              <div>
                <label htmlFor="x-variable">Horizontal axis</label>
                <select
                  id="x-variable"
                  value={xKey}
                  onChange={(event) => setXKey(event.target.value as VariableId)}
                >
                  {variables.map((id) => (
                    <option key={id} value={id}>{variableLabels[id]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="y-variable">Vertical axis</label>
                <select
                  id="y-variable"
                  value={yKey}
                  onChange={(event) => setYKey(event.target.value as VariableId)}
                >
                  {variables.map((id) => (
                    <option key={id} value={id}>{variableLabels[id]}</option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          <div className="explorer-results">
            <div className="chart-heading">
              <h2>{chartDescription}</h2>
              <p>Vertical axis: {variableLabels[yKey]} ({variableUnits[yKey]})</p>
            </div>
            <div
              className="chart-container"
              role="img"
              aria-label={`Scatterplot showing ${chartDescription}. The observations are available in the data table below.`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 25, bottom: 25, left: 0 }}>
                  <CartesianGrid stroke="var(--noir-border)" strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name={variableLabels[xKey]}
                    stroke="var(--noir-muted)"
                    tick={tickStyle}
                    label={{
                      value: `${variableLabels[xKey]} (${variableUnits[xKey]})`,
                      position: "insideBottom",
                      offset: -12,
                      fill: "var(--noir-accent)",
                      fontSize: 11,
                    }}
                  />
                  <YAxis type="number" dataKey="y" name={variableLabels[yKey]} stroke="var(--noir-muted)" tick={tickStyle} width={50} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3", stroke: "var(--noir-accent)" }}
                    contentStyle={tooltipStyle}
                    formatter={(value, name) => [
                      `${value} ${name === variableLabels[xKey] ? variableUnits[xKey] : variableUnits[yKey]}`,
                      name,
                    ]}
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.month ?? ""}
                  />
                  <Scatter name="Monthly observations" data={chartData} fill="var(--noir-accent)" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="chart-months">
              {chartData.length} monthly observations · Each point represents one month
            </p>

            <section className="chart-correlation" aria-label="Pearson correlation">
              <p className="chart-correlation-label">Pearson correlation (r)</p>
              <p className={correlation === null ? "chart-correlation-unavailable" : "chart-correlation-value"}>
                {correlation === null ? "Unavailable" : correlation.toFixed(2)}
              </p>
              {correlation === null && (
                <p className="chart-correlation-note">
                  Requires at least two valid observations and variation in both variables.
                </p>
              )}
            </section>

            <details className="chart-data">
              <summary>View observations</summary>
              <div className="chart-table-scroll">
                <table>
                  <caption>{dataset.title}: monthly observations</caption>
                  <thead>
                    <tr>
                      <th scope="col">Month</th>
                      {variables.map((id) => (
                        <th scope="col" key={id}>{variableLabels[id]} ({variableUnits[id]})</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataset.observations.map((observation) => (
                      <tr key={observation.month}>
                        <th scope="row">{observation.month}</th>
                        {variables.map((id) => <td key={id}>{observation[id]}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
