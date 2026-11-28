import { useState } from "react";
import { ArrowLeft, ChartBar } from "lucide-react";
import { motion } from "motion/react";

import { HistogramComponent } from "./HistogramComponent";
import { BoxplotComponent } from "./BoxplotComponent";
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

  const [selectedVariable, setSelectedVariable] = useState<VariableId>("digital_devices");

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
          CASE #{gameCase.number}
        </span>
        <h1>Data explorer</h1>
        <p>Einzelne Variablen und deren Ausprägungen erkunden.</p>
      </header>

      <section className="hypothesis-panel" aria-label="Variable explorer">
        <div className="wall-title">
          <ChartBar size={20} />
          <span>DATA EXPLORER</span>
        </div>
        <div className="explorer-layout">
          <aside className="chart-controls" aria-label="Explorer controls">
            <fieldset className="explorer-choice">
              <legend>Folgende Daten stehen zur Verfügung</legend>
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
              <h2>{variableLabels[selectedVariable]}</h2>
              <p>Verteilung in {variableUnits[selectedVariable]}</p>
            </div>
            <HistogramComponent
              data={chartData}
              dataKey={selectedVariable}
              dataLabel={variableLabels[selectedVariable]}
              dataUnit={variableUnits[selectedVariable]}
              ariaLabel={`Histogram showing distribution of ${variableLabels[selectedVariable]}. The observations are available in the data table below.`}
              bins={20}
            />
            <p className="chart-months">
              {chartData.length} Schulbeobachtungen
            </p>

            <div className="stats-section">
              <h3>Deskriptive Statistiken</h3>
              <BoxplotComponent
                data={chartData}
                dataKey={selectedVariable}
                dataLabel={variableLabels[selectedVariable]}
                dataUnit={variableUnits[selectedVariable]}
              />
            </div>

            <details className="chart-data">
              <summary>Daten</summary>
              <div className="chart-table-scroll">
                <table>
                  <caption>{dataset.title}: {variableLabels[selectedVariable]}</caption>
                  <thead>
                    <tr>
                      <th scope="col">Schule</th>
                      <th scope="col">{variableLabels[selectedVariable]} ({variableUnits[selectedVariable]})</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataset.observations.map((observation) => (
                      <tr key={observation.school_id}>
                        <th scope="row">{observation.school_id}</th>
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
