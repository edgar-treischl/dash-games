import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  ChartBar,
  ChartScatter,
  HelpCircle,
  Fingerprint,
} from "lucide-react";

import { cases } from "../data/cases";
import { useGameStore } from "../store/gameStore";

export function Headquarters() {
  const selectedCaseId = useGameStore((state) => state.selectedCaseId);
  const progress = useGameStore((state) =>
    selectedCaseId ? state.progressByCase[selectedCaseId] : undefined
  );
  const goHome = useGameStore((state) => state.goHome);
  const openFactSheet = useGameStore((state) => state.openFactSheet);
  const openVariablePicker = useGameStore((state) => state.openVariablePicker);
  const openEffectExplorer = useGameStore((state) => state.openEffectExplorer);
  const openDecisionRoom = useGameStore((state) => state.openDecisionRoom);
  const gameCase = cases.find((item) => item.id === selectedCaseId);

  if (!gameCase || !progress) {
    return (
      <main className="headquarters">
        <p>Investigation not found.</p>
        <button className="back-button" onClick={goHome}>
          <ArrowLeft size={16} /> BACK TO CASE FILES
        </button>
      </main>
    );
  }

  return (
    <motion.main
      className="headquarters case-hub"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className="topbar">
        <div className="brand">
          <Fingerprint size={27} />
          <span>THE CORRELATION FILES</span>
        </div>
        <span className="division">INVESTIGATION DIVISION</span>
      </header>

      <button className="back-button hub-back" onClick={goHome}>
        <ArrowLeft size={16} /> BACK TO CASE FILES
      </button>

      <div className="hub-heading">
        <div>
          <span className="eyebrow">HEADQUARTERS</span>
          <h1>Investigation desk</h1>
          <p>Learn about the case and analyze the data.</p>
        </div>
        <span className="hub-status">CASE OPEN</span>
      </div>

      <div className="hub-desk">
        <section className="hub-tasks" aria-labelledby="hub-case-tasks-title">
          <h2 id="hub-case-tasks-title">{gameCase.title}</h2>

          <div className="hub-tasks-list">
            <div className="hub-task-item">
              <span className="hub-task-number">1</span>
              <div className="hub-task-content">
                <h3>Read the fact sheet</h3>
                <p>Understand the scenario with visualizations and explanations.</p>
              </div>
            </div>

            <div className="hub-task-item">
              <span className="hub-task-number">2</span>
              <div className="hub-task-content">
                <h3>Explore the data</h3>
                <p>Use the data explorer to examine variables and patterns.</p>
              </div>
            </div>

            <div className="hub-task-item">
              <span className="hub-task-number">3</span>
              <div className="hub-task-content">
                <h3>Analyze relationships</h3>
                <p>Use the effect explorer to compare variables and spot correlations.</p>
              </div>
            </div>

            <div className="hub-task-item">
              <span className="hub-task-number">4</span>
              <div className="hub-task-content">
                <h3>Make your decision</h3>
                <p>Answer the critical questions and form your conclusions.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="hub-workspace" aria-label="Investigation workspace">
          <div className="hub-workspace-heading">
            <span>YOUR WORKSPACE</span>
          </div>

          <button className="hub-destination" onClick={openFactSheet}>
            <span className="hub-destination-icon"><BookOpen size={24} /></span>
            <span className="hub-destination-copy">
              <strong>Fact sheet</strong>
              <span>Learn about the case with graphs and explanations.</span>
            </span>
            <ArrowUpRight className="hub-destination-arrow" size={20} />
          </button>

          <button className="hub-destination" onClick={openVariablePicker}>
            <span className="hub-destination-icon"><ChartBar size={24} /></span>
            <span className="hub-destination-copy">
              <strong>Data explorer</strong>
              <span>Explore individual variables and their patterns.</span>
            </span>
            <ArrowUpRight className="hub-destination-arrow" size={20} />
          </button>

          <button className="hub-destination" onClick={openEffectExplorer}>
            <span className="hub-destination-icon"><ChartScatter size={24} /></span>
            <span className="hub-destination-copy">
              <strong>Effect explorer</strong>
              <span>Compare variables and look for patterns.</span>
            </span>
            <ArrowUpRight className="hub-destination-arrow" size={20} />
          </button>

          <button className="hub-destination" onClick={openDecisionRoom}>
            <span className="hub-destination-icon"><HelpCircle size={24} /></span>
            <span className="hub-destination-copy">
              <strong>Decision room</strong>
              <span>Answer critical questions about your investigation.</span>
            </span>
            <ArrowUpRight className="hub-destination-arrow" size={20} />
          </button>

          <p className="hub-note">
            {progress.hypothesis.trim()
              ? "Your working hypothesis has been saved."
              : "Your investigation is saved as you go."}
          </p>
        </section>
      </div>
    </motion.main>
  );
}
