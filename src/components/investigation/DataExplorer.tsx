import { useState } from "react";
import { ArrowLeft, ChartBar } from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { datasets } from "../../data/datasets";
import { cases } from "../../data/cases";
import { useGameStore } from "../../store/gameStore";

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

export function DataExplorer() {
  const selectedCaseId = useGameStore((state) => state.selectedCaseId);
  const goHome = useGameStore((state) => state.goHome);
  const returnToHeadquarters = useGameStore((state) => state.returnToHeadquarters);
  const gameCase = cases.find((item) => item.id === selectedCaseId);
  const dataset = datasets.find((item) => item.id === gameCase?.datasetId);

  const [selectedVariable, setSelectedVariable] = useState<VariableId>("iceCreamSales");

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
        <h1>Variable analysis</h1>
        <p>No dataset is available for this case yet.</p>
      </main>
    );
  }

  const chartData = dataset.observations.map((observation) => ({
    ...observation,
    value: observation[selectedVariable],
  }));

  return (
    <motion.main
      className="headquarters variable-picker"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
    >
      <button className="back-button" onClick={returnToHeadquarters}>
        <ArrowLeft size={16} /> HEADQUARTERS
      </button>
      <header className="evidence-heading">
        <span className="eyebrow">
          CASE #{gameCase.number} / DATA EXPLORATION
        </span>
        <h1>Data explorer</h1>
        <p>Select a variable to examine its behavior over time.</p>
      </header>

      <section className="hypothesis-panel" aria-label="Variable explorer">
        <div className="wall-title">
          <ChartBar size={20} />
          <span>DATA EXPLORER</span>
        </div>
        <div className="explorer-layout">
          <aside className="chart-controls" aria-label="Explorer controls">
            <fieldset className="explorer-choice">
              <legend>Select a variable to analyze</legend>
              <div className="variable-options">
                {variables.map((id) => (
                  <label key={id} className="explorer-option">
                    <input
                      type="radio"
                      name="variable-selection"
                      value={id}
                      checked={selectedVariable === id}
                      onChange={() => setSelectedVariable(id)}
                    />
                    <span>{variableLabels[id]}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </aside>

          <div className="explorer-results">
            <div className="chart-heading">
              <h2>{variableLabels[selectedVariable]} by month</h2>
              <p>Vertical axis: {variableLabels[selectedVariable]} ({variableUnits[selectedVariable]})</p>
            </div>
            <div
              className="chart-container"
              role="img"
              aria-label={`Bar chart showing ${variableLabels[selectedVariable]} over time. The observations are available in the data table below.`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 15, bottom: 10, left: 0 }}>
                  <CartesianGrid stroke="var(--noir-border)" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="var(--noir-muted)" tick={tickStyle} />
                  <YAxis stroke="var(--noir-muted)" tick={tickStyle} width={50} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [`${value} ${variableUnits[selectedVariable]}`, variableLabels[selectedVariable]]}
                  />
                  <Bar
                    dataKey="value"
                    name={variableLabels[selectedVariable]}
                    fill="var(--noir-accent)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="chart-months">
              {chartData.length} monthly observations
            </p>

            <details className="chart-data">
              <summary>View observations</summary>
              <div className="chart-table-scroll">
                <table>
                  <caption>{dataset.title}: {variableLabels[selectedVariable]}</caption>
                  <thead>
                    <tr>
                      <th scope="col">Month</th>
                      <th scope="col">{variableLabels[selectedVariable]} ({variableUnits[selectedVariable]})</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataset.observations.map((observation) => (
                      <tr key={observation.month}>
                        <th scope="row">{observation.month}</th>
                        <td>{observation[selectedVariable]}</td>
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
