import { useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, Fingerprint, X, Luggage, CircleCheckBig, FileText } from "lucide-react";

import { cases } from "../data/cases";
import { getBriefingAsset } from "../data/briefingAssets";
import { useGameStore } from "../store/gameStore";

export function CaseIntroduction() {
  const briefingDialogRef = useRef<HTMLDialogElement>(null);
  const [briefingOpen, setBriefingOpen] = useState(false);
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
      <div className="case-intro-layout">
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

        <div className="case-intro-header">
          <div className="case-intro-number">CASE #{gameCase.number}</div>
          <div className="case-intro-category">{gameCase.category}</div>
        </div>

        <div className="case-intro-hero">
          <div className="case-intro-heading">
            <h1 className="case-intro-title">{gameCase.title}</h1>
            <p className="case-intro-subtitle">{gameCase.subtitle}</p>
          </div>
        </div>

        <div className="case-intro-container">
          <div className="case-intro-details">
            <section className="case-intro-section">
              <h2><Luggage /> THE CASE</h2>
              <p className="case-intro-description">{gameCase.description}</p>
            </section>

            <section className="case-intro-section">
              <h2><CircleCheckBig /> YOUR TASK</h2>
              <p className="case-intro-description">
                {gameCase.taskDescription || "Investigate this case to uncover the truth about the correlation."}
              </p>
            </section>

            {gameCase.learningGoals && gameCase.learningGoals.length > 0 && (
              <section className="case-intro-section">
                <div className="case-intro-learning">
                  <CircleCheckBig size={20} />
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

            <section className="case-intro-actions">
              <p className="case-intro-prompt">Ready to begin the investigation?</p>
              <button className="case-intro-cta" onClick={openHeadquarters}>
                START INVESTIGATION <ArrowUpRight size={18} />
              </button>
            </section>
          </div>

          {briefingAsset && (
            <aside className="case-intro-preview">
              <div className="case-intro-preview-copy">
                <h2><FileText /> Case briefing</h2>
              </div>
              <div className="case-intro-preview-frame">
                <span className="case-intro-preview-clipping" aria-hidden="true">
                  <iframe
                    srcDoc={briefingAsset}
                    title="Case briefing preview"
                    sandbox="allow-same-origin"
                    tabIndex={-1}
                  />
                </span>
                <button
                  type="button"
                  className="case-intro-preview-button"
                  onClick={() => {
                    setBriefingOpen(true);
                    briefingDialogRef.current?.showModal();
                  }}
                >
                  Read full briefing <ArrowUpRight size={17} aria-hidden="true" />
                </button>
              </div>
            </aside>
          )}
        </div>

      </div>

      {briefingAsset && (
        <dialog
          ref={briefingDialogRef}
          className="case-intro-dialog"
          aria-labelledby="case-intro-dialog-title"
          onClose={() => setBriefingOpen(false)}
        >
          <div className="case-intro-dialog-header">
            <h2 id="case-intro-dialog-title">Case briefing</h2>
            <button
              type="button"
              className="case-intro-dialog-close"
              onClick={() => briefingDialogRef.current?.close()}
              aria-label="Close case briefing"
            >
              <X size={21} aria-hidden="true" />
            </button>
          </div>
          {briefingOpen && (
            <iframe
              srcDoc={briefingAsset}
              className="case-intro-dialog-iframe"
              title="Case briefing"
              sandbox="allow-same-origin"
            />
          )}
        </dialog>
      )}
    </motion.main>
  );
}
