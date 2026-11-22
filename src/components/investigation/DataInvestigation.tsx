import { useState } from "react";
import { ArrowLeft, ChartScatter } from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
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

export function DataInvestigation() {
  const selectedCaseId = useGameStore((state) => state.selectedCaseId);
  const goHome = useGameStore((state) => state.goHome);
  const returnToHeadquarters = useGameStore((state) => state.returnToHeadquarters);
  const gameCase = cases.find((item) => item.id === selectedCaseId);
  const dataset = datasets.find((item) => item.id === gameCase?.datasetId);

  const [plotType, setPlotType] = useState<"bar" | "scatter">("bar");
  const [xKey, setXKey] = useState<VariableId>("iceCreamSales");
  const [yKey, setYKey] = useState<VariableId>("swimmingAccidents");
  const [barKey, setBarKey] = useState<VariableId>("iceCreamSales");

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
        <h1>Data investigation</h1>
        <p>No dataset is available for this case yet.</p>
      </main>
    );
  }

  const chartData = dataset.observations.map((observation) => ({
    ...observation,
    x: observation[xKey],
    y: observation[yKey],
  }));
  const chartDescription = plotType === "bar"
    ? `${variableLabels[barKey]} by month`
    : `${variableLabels[yKey]} against ${variableLabels[xKey]}`;
  const correlation = plotType === "scatter" ? pearsonCorrelation(chartData) : null;

  return (
    <motion.main
      className="headquarters data-investigation"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
    >
      <button className="back-button" onClick={returnToHeadquarters}>
        <ArrowLeft size={16} /> HEADQUARTERS
      </button>
      <header className="evidence-heading">
        <span className="eyebrow">
          CASE #{gameCase.number} / STATISTICAL ANALYSIS
        </span>
        <h1>Data Investigation</h1>
        <p>Choose what to explore, then select your variables.</p>
      </header>

      <section className="hypothesis-panel" aria-label="Data explorer">
        <div className="wall-title">
          <ChartScatter size={20} />
          <span>DATA EXPLORER</span>
        </div>
        <div className="explorer-layout">
          <aside className="chart-controls" aria-label="Explorer controls">
            <fieldset className="explorer-choice">
              <legend>1. What do you want to explore?</legend>
              <label className="explorer-option">
                <input
                  type="radio"
                  name="exploration-type"
                  value="bar"
                  checked={plotType === "bar"}
                  onChange={() => setPlotType("bar")}
                />
                <span>One variable <small>Bar chart by month</small></span>
              </label>
              <label className="explorer-option">
                <input
                  type="radio"
                  name="exploration-type"
                  value="scatter"
                  checked={plotType === "scatter"}
                  onChange={() => setPlotType("scatter")}
                />
                <span>A relationship <small>Scatterplot</small></span>
              </label>
            </fieldset>

            <div className="explorer-variables">
              <h2>2. Choose {plotType === "bar" ? "a variable" : "variables"}</h2>
              {plotType === "bar" ? (
                <div>
                  <label htmlFor="bar-variable">Variable</label>
                  <select
                    id="bar-variable"
                    value={barKey}
                    onChange={(event) => setBarKey(event.target.value as VariableId)}
                  >
                    {variables.map((id) => (
                      <option key={id} value={id}>{variableLabels[id]}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          </aside>

          <div className="explorer-results">
            <div className="chart-heading">
              <h2>{chartDescription}</h2>
              <p>
                {plotType === "bar"
                  ? `Vertical axis: ${variableLabels[barKey]} (${variableUnits[barKey]})`
                  : `Vertical axis: ${variableLabels[yKey]} (${variableUnits[yKey]})`}
              </p>
            </div>
            <div
              className="chart-container"
              role="img"
              aria-label={`${plotType === "bar" ? "Bar chart" : "Scatterplot"} showing ${chartDescription}. The observations are available in the data table below.`}
            >
              <ResponsiveContainer width="100%" height="100%">
                {plotType === "bar" ? (
                  <BarChart data={chartData} margin={{ top: 20, right: 15, bottom: 10, left: 0 }}>
                    <CartesianGrid stroke="var(--noir-border)" strokeDasharray="3 3" />
                    <XAxis dataKey="month" stroke="var(--noir-muted)" tick={tickStyle} />
                    <YAxis stroke="var(--noir-muted)" tick={tickStyle} width={50} />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value) => [`${value} ${variableUnits[barKey]}`, variableLabels[barKey]]}
                    />
                    <Bar dataKey={barKey} name={variableLabels[barKey]} fill="var(--noir-accent)" />
                  </BarChart>
                ) : (
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
                )}
              </ResponsiveContainer>
            </div>
            <p className="chart-months">
              {chartData.length} monthly observations
              {plotType === "scatter" ? " · Each point represents one month" : ""}
            </p>
            {plotType === "scatter" && (
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
            )}

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
