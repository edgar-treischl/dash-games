import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, AlertCircle } from "lucide-react";

import { cases } from "../data/cases";
import { getBriefingAsset } from "../data/briefingAssets";
import { useGameStore } from "../store/gameStore";

export function CaseIntroduction() {
  const selectedCaseId = useGameStore((state) => state.selectedCaseId);
  const goHome = useGameStore((state) => state.goHome);
  const openHeadquarters = useGameStore((state) => state.returnToHeadquarters);

  const gameCase = cases.find((c) => c.id === selectedCaseId);
  const briefingAsset = gameCase ? getBriefingAsset(gameCase.briefingAsset) : null;

  if (!gameCase) {
    return (
      <motion.main
        className="case-intro"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <button className="back-button" onClick={goHome}>
          <ArrowLeft size={17} />
          BACK TO CASE FILES
        </button>
        <div className="case-intro-error">Case not found</div>
      </motion.main>
    );
  }

  return (
    <motion.main
      className="case-intro"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <button className="back-button" onClick={goHome}>
        <ArrowLeft size={17} />
        BACK TO CASE FILES
      </button>

      <div className="case-intro-layout">
        <div className="case-intro-container">
          <div className="case-intro-header">
            <div className="case-intro-number">CASE #{gameCase.number}</div>
            <div className="case-intro-category">{gameCase.category}</div>
          </div>

          <h1 className="case-intro-title">{gameCase.title}</h1>
          <p className="case-intro-subtitle">{gameCase.subtitle}</p>

          <div className="case-intro-divider" />

          <section className="case-intro-section">
            <h2>THE SITUATION</h2>
            <p className="case-intro-description">{gameCase.description}</p>
          </section>

          <section className="case-intro-section">
            <h2>YOUR TASK</h2>
            <p className="case-intro-description">
              {gameCase.taskDescription || "Investigate this case to uncover the truth about the correlation."}
            </p>
          </section>

          {gameCase.learningGoals && gameCase.learningGoals.length > 0 && (
            <section className="case-intro-section">
              <div className="case-intro-learning">
                <AlertCircle size={20} />
                <div>
                  <h3>WHAT YOU'LL LEARN</h3>
                  <ul className="case-intro-goals">
                    {gameCase.learningGoals.map((goal, index) => (
                      <li key={index}>{goal}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          <div className="case-intro-divider" />

          <section className="case-intro-actions">
            <p className="case-intro-prompt">Ready to begin the investigation?</p>
            <button className="case-intro-cta" onClick={openHeadquarters}>
              START INVESTIGATION <ArrowUpRight size={18} />
            </button>
          </section>
        </div>

        {briefingAsset && (
          <div className="case-intro-preview">
            <div className="case-intro-preview-header">
              <h3>CASE BRIEFING</h3>
              <p>Read the full briefing in the investigation</p>
            </div>
            <iframe
              srcDoc={briefingAsset}
              className="case-intro-briefing-iframe"
              title="Case Briefing Preview"
              sandbox="allow-same-origin"
            />
          </div>
        )}
      </div>
    </motion.main>
  );
}
