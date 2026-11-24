import { motion } from "motion/react";
import { ArrowLeft, Fingerprint } from "lucide-react";

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
            <button className="hub-task-item" onClick={openFactSheet}>
              <span className="hub-task-number">1</span>
              <div className="hub-task-content">
                <h3>Read the fact sheet</h3>
                <p>Understand the scenario with visualizations and explanations.</p>
              </div>
            </button>

            <button className="hub-task-item" onClick={openVariablePicker}>
              <span className="hub-task-number">2</span>
              <div className="hub-task-content">
                <h3>Explore the data</h3>
                <p>Use the data explorer to examine variables and patterns.</p>
              </div>
            </button>

            <button className="hub-task-item" onClick={openEffectExplorer}>
              <span className="hub-task-number">3</span>
              <div className="hub-task-content">
                <h3>Analyze relationships</h3>
                <p>Use the effect explorer to compare variables and spot correlations.</p>
              </div>
            </button>

            <button className="hub-task-item" onClick={openDecisionRoom}>
              <span className="hub-task-number">4</span>
              <div className="hub-task-content">
                <h3>Make your decision</h3>
                <p>Answer the critical questions and form your conclusions.</p>
              </div>
            </button>
          </div>
        </section>

        {gameCase.caseImage && gameCase.caseImage !== "NULL" && (
          <figure className="hub-case-image">
            <img
              src={new URL(`../assets/${gameCase.caseImage}`, import.meta.url).href}
              alt={gameCase.title}
            />
          </figure>
        )}
      </div>

    </motion.main>
  );
}
