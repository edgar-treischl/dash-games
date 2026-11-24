import { ArrowLeft, TrendingUp, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { Area, ComposedChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts";

import { useGameStore } from "../store/gameStore";
import { cases } from "../data/cases";
import { 
  shoeIncomeData, 
  overallConfidenceBand,
  calculateCorrelation, 
  calculateGroupCorrelations,
  calculateGroupMeans,
  calculateRegression,
} from "../data/factSheetDatasets";

const women = shoeIncomeData.filter((point) => point.sex === "Women");
const men = shoeIncomeData.filter((point) => point.sex === "Men");
const overallTrend = calculateRegression(shoeIncomeData);
const womenTrend = calculateRegression(women);
const menTrend = calculateRegression(men);

function ObservationPoint({ cx, cy, fill }: { cx?: number; cy?: number; fill?: string }) {
  return <circle cx={cx} cy={cy} r={2.2} fill={fill} fillOpacity={0.4} />;
}

export function FactSheet() {
  const selectedCaseId = useGameStore((state) => state.selectedCaseId);
  const returnToHeadquarters = useGameStore((state) => state.returnToHeadquarters);
  const goHome = useGameStore((state) => state.goHome);

  const gameCase = cases.find((item) => item.id === selectedCaseId);

  if (!selectedCaseId || !gameCase || !gameCase.factSheet) {
    return (
      <main className="headquarters">
        <p>Fact sheet not found.</p>
        <button className="back-button" onClick={goHome}>
          <ArrowLeft size={16} />
          BACK TO CASE FILES
        </button>
      </main>
    );
  }

  const factSheet = gameCase.factSheet;
  const overallCorr = calculateCorrelation(shoeIncomeData);
  const groupCorrs = calculateGroupCorrelations(shoeIncomeData);
  const groupMeans = calculateGroupMeans(shoeIncomeData);

  return (
    <motion.main
      className="fact-sheet"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <button className="back-button" onClick={returnToHeadquarters}>
        <ArrowLeft size={16} />
        HEADQUARTERS
      </button>

      <header className="fact-sheet-heading">
        <span className="eyebrow">CASE #{gameCase.number} / FACT SHEET</span>
        <h1>{gameCase.title}</h1>
        <p>{gameCase.subtitle}</p>
      </header>

      {/* Introduction Section */}
      <section className="fact-sheet-section">
        <h2>The Scenario</h2>
        <div className="fact-sheet-content">
          <p>{factSheet.introduction}</p>
        </div>
      </section>

      {/* Graph 1: The Spurious Association */}
      <section className="fact-sheet-section">
        <h2>The Misleading Relationship</h2>
        <div className="fact-sheet-chart">
          <p className="chart-subtitle">
            Correlation: <strong>{overallCorr.toFixed(2)}</strong>
          </p>
          <p className="chart-caption">
            Larger shoe sizes appear to be associated with higher incomes.
          </p>
          <div className="fact-sheet-plot" role="img" aria-label="Scatter plot of 1,000 simulated observations. The overall trend rises with shoe size; the shaded band shows its 95 percent confidence interval.">
            <ResponsiveContainer width="100%" height={400}>
            <ComposedChart margin={{ top: 10, right: 16, bottom: 25, left: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--noir-border)" />
              <XAxis type="number" dataKey="shoe_size" domain={[30, 50]} ticks={[30, 35, 40, 45, 50]}
                name="Shoe size" tick={{ fill: "var(--noir-muted)", fontSize: 12 }}
                label={{ value: "Shoe size", position: "insideBottom", offset: -16, fill: "var(--noir-ink)" }} />
              <YAxis type="number" dataKey="income" domain={[10000, 100000]}
                ticks={[20000, 40000, 60000, 80000, 100000]} width={55}
                tickFormatter={(value: number) => `€${value / 1000}k`}
                tick={{ fill: "var(--noir-muted)", fontSize: 12 }} />
              <Area data={overallConfidenceBand} dataKey="interval" type="linear"
                fill="#e55d3e" fillOpacity={0.18} stroke="none" legendType="none"
                isAnimationActive={false} zIndex={100} />
              <Scatter 
                name="All Data" 
                data={shoeIncomeData} 
                fill="#5B7DB6"
                shape={<ObservationPoint />}
                activeShape={false}
                isAnimationActive={false}
              />
              <ReferenceLine 
                stroke="#E55D3E" 
                strokeWidth={2}
                segment={overallTrend}
              />
            </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="chart-note">Annual income (€) · Red line: linear fit; shading: 95% confidence interval</p>
        </div>
      </section>

      {/* Explanation Section */}
      <section className="fact-sheet-section">
        <h2>The Explanation</h2>
        <div className="fact-sheet-content">
          <p>{factSheet.mainExplanation}</p>
        </div>
      </section>

      {/* Graph 2: The Relationship Explained by Sex */}
      <section className="fact-sheet-section">
        <h2>Revealing the Third Variable</h2>
        <div className="fact-sheet-chart">
          <p className="chart-subtitle">
            When we separate by sex, the relationship mostly disappears
          </p>
          <p className="chart-caption">
            Women correlation: <strong>{groupCorrs.women.toFixed(2)}</strong> | 
            Men correlation: <strong>{groupCorrs.men.toFixed(2)}</strong>
          </p>
          <div className="fact-sheet-plot" role="img" aria-label="The same 1,000 observations colored by sex, with a separate, nearly flat linear trend for each group.">
            <ResponsiveContainer width="100%" height={400}>
            <ComposedChart margin={{ top: 10, right: 16, bottom: 25, left: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--noir-border)" />
              <XAxis type="number" dataKey="shoe_size" domain={[30, 50]} ticks={[30, 35, 40, 45, 50]}
                name="Shoe size" tick={{ fill: "var(--noir-muted)", fontSize: 12 }}
                label={{ value: "Shoe size", position: "insideBottom", offset: -16, fill: "var(--noir-ink)" }} />
              <YAxis type="number" dataKey="income" domain={[10000, 100000]}
                ticks={[20000, 40000, 60000, 80000, 100000]} width={55}
                tickFormatter={(value: number) => `€${value / 1000}k`}
                tick={{ fill: "var(--noir-muted)", fontSize: 12 }} />
              <Scatter 
                name="Women" 
                data={women} 
                fill="#D66BA0"
                shape={<ObservationPoint />}
                activeShape={false}
                isAnimationActive={false}
              />
              <Scatter 
                name="Men" 
                data={men} 
                fill="#3677B8"
                shape={<ObservationPoint />}
                activeShape={false}
                isAnimationActive={false}
              />
              <ReferenceLine segment={womenTrend} stroke="#D66BA0" strokeWidth={2} />
              <ReferenceLine segment={menTrend} stroke="#3677B8" strokeWidth={2} />
            </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="chart-note">Annual income (€) · Lines show the linear fit within each group</p>
          <div className="chart-legend" aria-label="Sex">
            <span><i className="chart-legend-women" /> Women</span>
            <span><i className="chart-legend-men" /> Men</span>
          </div>
        </div>
      </section>

      {/* Graph 3: The Causal Diagram */}
      <section className="fact-sheet-section">
        <h2>The Causal Diagram</h2>
        <div className="fact-sheet-chart causal-diagram">
          <h3>The actual causal structure</h3>
          <p className="chart-caption">
            Sex is the common cause of both variables.
          </p>
          <svg
            className="causal-diagram-graphic"
            viewBox="0 0 720 330"
            role="img"
            aria-labelledby="causal-diagram-title causal-diagram-description"
          >
            <title id="causal-diagram-title">The actual causal structure</title>
            <desc id="causal-diagram-description">
              Sex causes both shoe size and income. There is no direct causal relationship between shoe size and income.
            </desc>
            <defs>
              <marker
                id="causal-arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="5"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--noir-accent)" />
              </marker>
            </defs>
            <path
              className="causal-arrow"
              d="M 324 115 C 296 157 258 182 218 212"
              markerEnd="url(#causal-arrowhead)"
            />
            <path
              className="causal-arrow"
              d="M 396 115 C 424 157 462 182 502 212"
              markerEnd="url(#causal-arrowhead)"
            />
            <g className="causal-node causal-node--cause">
              <rect x="270" y="42" width="180" height="74" rx="8" />
              <text x="360" y="88">SEX</text>
            </g>
            <g className="causal-node causal-node--outcome">
              <rect x="92" y="212" width="220" height="74" rx="8" />
              <text x="202" y="258">SHOE SIZE</text>
            </g>
            <g className="causal-node causal-node--outcome">
              <rect x="408" y="212" width="220" height="74" rx="8" />
              <text x="518" y="258">INCOME</text>
            </g>
          </svg>
          <p className="causal-diagram-note">
            Shoe size and income move together in the data, but neither causes the other.
          </p>
        </div>
      </section>

      {/* Summary Table */}
      <section className="fact-sheet-section">
        <h2>Group Averages</h2>
        <div className="fact-sheet-table">
          <table>
            <thead>
              <tr>
                <th>Group</th>
                <th>Mean Shoe Size</th>
                <th>Mean Income (€)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Women</td>
                <td>{groupMeans.women.mean_shoe_size.toFixed(1)}</td>
                <td>{groupMeans.women.mean_income.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
              </tr>
              <tr>
                <td>Men</td>
                <td>{groupMeans.men.mean_shoe_size.toFixed(1)}</td>
                <td>{groupMeans.men.mean_income.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Key Takeaway */}
      <section className="fact-sheet-section fact-sheet-highlight">
        <div className="highlight-box">
          <AlertCircle size={24} />
          <div>
            <h3>Key Takeaway</h3>
            <p>{factSheet.keyTakeaway}</p>
          </div>
        </div>
      </section>

      {/* Methodological Note */}
      <section className="fact-sheet-section">
        <h2>Methodological Note</h2>
        <div className="fact-sheet-content">
          <p>{factSheet.methodologicalNote}</p>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="fact-sheet-actions">
        <button className="primary-button" onClick={returnToHeadquarters}>
          <TrendingUp size={16} />
          NEXT: DATA INVESTIGATION
        </button>
      </section>
    </motion.main>
  );
}
