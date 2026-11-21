
import { useState } from "react";

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

  if (!dataset) {
    return null;
  }

  const chartData = dataset.observations.map(
    (observation) => ({
      ...observation,
      x: observation[xKey],
      y: observation[yKey],
    })
  );

  return (
    <section className="data-investigation">
      <header className="data-heading">
        <span className="eyebrow">
          STATISTICAL ANALYSIS
        </span>

        <h2>Examine the Relationship</h2>

        <p>
          Select two variables and investigate
          how their values move together.
        </p>
      </header>

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

      <div className="chart-observation">
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
  );
}
