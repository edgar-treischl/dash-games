import { useState } from "react";
import { ArrowLeft, ChartBar } from "lucide-react";
import { motion } from "motion/react";

import { BarChartComponent } from "./BarChartComponent";
import { variables, variableLabels, variableUnits, type VariableId } from "./variables";
import { datasets } from "../../data/datasets";
import { cases } from "../../data/cases";
import { useGameStore } from "../../store/gameStore";

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

  const chartData = dataset.observations;

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
            <div
              className="chart-heading"
            >
              <h2>{variableLabels[selectedVariable]} by month</h2>
              <p>Vertical axis: {variableLabels[selectedVariable]} ({variableUnits[selectedVariable]})</p>
            </div>
            <BarChartComponent
              data={chartData}
              dataKey={selectedVariable}
              dataLabel={variableLabels[selectedVariable]}
              dataUnit={variableUnits[selectedVariable]}
              ariaLabel={`Bar chart showing ${variableLabels[selectedVariable]} over time. The observations are available in the data table below.`}
            />
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
