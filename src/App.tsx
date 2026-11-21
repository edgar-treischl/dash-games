
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, FileText, LockKeyhole } from "lucide-react";

import { Headquarters } from "./components/Headquarters";
import { EvidenceRoom } from "./components/EvidenceRoom";
import { EvidenceWall } from "./components/EvidenceWall";

import { cases } from "./data/cases";
import { useGameStore } from "./store/gameStore";

function Briefing() {
  const selectedCaseId = useGameStore(
    (state) => state.selectedCaseId
  );

  const goHome = useGameStore((state) => state.goHome);

  const startInvestigation = useGameStore(
    (state) => state.startInvestigation
  );

  const gameCase = cases.find(
    (item) => item.id === selectedCaseId
  );

  if (!gameCase) {
    return (
      <main className="briefing">
        <button className="back-button" onClick={goHome}>
          <ArrowLeft size={17} />
          BACK TO HEADQUARTERS
        </button>

        <div className="briefing-paper">
          <h2>CASE NOT FOUND</h2>
          <p>
            The selected investigation could not be found.
          </p>
        </div>
      </main>
    );
  }

  return (
    <motion.main
      className="briefing"
      initial={{ opacity: 0, x: 25 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -25 }}
    >
      <button className="back-button" onClick={goHome}>
        <ArrowLeft size={17} />
        BACK TO HEADQUARTERS
      </button>

      <div className="briefing-paper">
        <div className="paper-top">
          <FileText size={22} />
          <span>CONFIDENTIAL CASE REPORT</span>
          <LockKeyhole size={17} />
        </div>

        <span className="eyebrow">
          INVESTIGATION FILE #{gameCase.number}
        </span>

        <h1>{gameCase.title}</h1>
        <h3>{gameCase.subtitle}</h3>

        <div className="paper-divider" />

        <h2>THE INCIDENT</h2>
        <p>{gameCase.description}</p>

        <div className="official-report">
          <span>OFFICIAL REPORT</span>
          <p>
            "A suspicious statistical relationship
            has been identified. Further investigation
            is required."
          </p>
        </div>

        <h2>YOUR ASSIGNMENT</h2>

        <p>
          Investigate the available evidence.
          Examine the data and challenge the
          assumptions behind the official report.
        </p>

        <button
          className="primary-button"
          onClick={startInvestigation}
        >
          BEGIN INVESTIGATION →
        </button>
      </div>
    </motion.main>
  );
}

export default function App() {
  const currentScreen = useGameStore(
    (state) => state.currentScreen
  );

  return (
    <div className="game-shell">
      <AnimatePresence mode="wait">
        {currentScreen === "headquarters" && (
          <Headquarters key="headquarters" />
        )}

        {currentScreen === "briefing" && (
          <Briefing key="briefing" />
        )}

        {currentScreen === "evidence" && (
          <EvidenceRoom key="evidence" />
        )}

        {currentScreen === "evidence-wall" && (
          <EvidenceWall key="evidence-wall" />
        )}
      </AnimatePresence>
    </div>
  );
}
