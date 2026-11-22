
import { useState } from "react";
import { ArrowLeft, ChartScatter } from "lucide-react";
import { motion } from "motion/react";

import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

export function DataInvestigation() {
  const selectedCaseId = useGameStore(
    (state) => state.selectedCaseId
  );
  const goHome = useGameStore((state) => state.goHome);
  const returnToHeadquarters = useGameStore((state) => state.returnToHeadquarters);

  const gameCase = cases.find(
    (item) => item.id === selectedCaseId
  );

  const dataset = datasets.find(
    (item) => item.id === gameCase?.datasetId
  );

  const [xKey, setXKey] =
    useState<VariableId>("iceCreamSales");

  const [yKey, setYKey] =
    useState<VariableId>("swimmingAccidents");

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

  const chartData = dataset.observations.map(
    (observation) => ({
      ...observation,
      x: observation[xKey],
      y: observation[yKey],
    })
  );

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

        <p>
          Select two variables and investigate how their values move together.
        </p>
      </header>

      <section className="hypothesis-panel" aria-label="Scatterplot analysis">
      <div className="wall-title">
        <ChartScatter size={20} />
        <span>EXAMINE THE RELATIONSHIP</span>
      </div>
      <div className="chart-controls">
        <div>
          <label htmlFor="x-variable">
            X-AXIS
          </label>

          <select
            id="x-variable"
            value={xKey}
            onChange={(event) =>
              setXKey(event.target.value as VariableId)
            }
          >
            {Object.entries(variableLabels).map(
              ([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label htmlFor="y-variable">
            Y-AXIS
          </label>

          <select
            id="y-variable"
            value={yKey}
            onChange={(event) =>
              setYKey(event.target.value as VariableId)
            }
          >
            {Object.entries(variableLabels).map(
              ([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      <p className="chart-axis-caption">
        Vertical axis: {variableLabels[yKey]} ({variableUnits[yKey]})
      </p>
      <div
        className="chart-container"
        role="img"
        aria-label={`Scatterplot showing ${variableLabels[yKey]} against ${variableLabels[xKey]}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{
            top: 20,
            right: 25,
            bottom: 25,
            left: 10,
          }}>
            <CartesianGrid
              stroke="#44494a"
              strokeDasharray="3 3"
            />

            <XAxis
              type="number"
              dataKey="x"
              name={variableLabels[xKey]}
              stroke="#aaa9a2"
              tick={{ fill: "#aaa9a2", fontSize: 11 }}
              label={{
                value: `${variableLabels[xKey]} (${variableUnits[xKey]})`,
                position: "insideBottom",
                offset: -12,
                fill: "#d68b48",
                fontSize: 11,
              }}
            />

            <YAxis
              type="number"
              dataKey="y"
              name={variableLabels[yKey]}
              stroke="#aaa9a2"
              tick={{ fill: "#aaa9a2", fontSize: 11 }}
            />

            <Tooltip
              cursor={{
                strokeDasharray: "3 3",
                stroke: "#d68b48",
              }}
              contentStyle={{
                background: "#171a1d",
                border: "1px solid #765637",
                borderRadius: 5,
                color: "#e8e0d1",
              }}
              formatter={(value, name) => [
                `${value} ${
                  name === variableLabels[xKey]
                    ? variableUnits[xKey]
                    : variableUnits[yKey]
                }`,
                name,
              ]}
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.month ?? ""
              }
            />

            <Scatter
              name="Monthly observations"
              data={chartData}
              fill="#d68b48"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="wall-category chart-observation">
        <span className="eyebrow">
          INVESTIGATOR'S NOTE
        </span>

        <p>
          Each point represents one month.
          Look for patterns, unusual observations
          and possible alternative explanations.
        </p>

        <p>
          Remember: A visible correlation does not
          establish a causal relationship.
        </p>
      </div>

      <div className="chart-months">
        <span className="eyebrow">
          OBSERVATIONS: {chartData.length} MONTHS
        </span>
      </div>
      </section>
    </motion.main>
  );
}
