
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

import { Headquarters } from "./components/Headquarters";
import { CaseIntroduction } from "./components/CaseIntroduction";
import { DecisionRoom } from "./components/DecisionRoom";
import { FactSheet } from "./components/FactSheetPage";
import LandingPage from "./pages/LandingPage";
import CaseFilesPage from "./pages/CaseFilesPage";
import { DataExplorer } from "./components/investigation/DataExplorer";
import { EffectExplorer } from "./components/investigation/EffectExplorer";

import { cases } from "./data/cases";
import { getBriefingAsset } from "./data/briefingAssets";
import { useGameStore } from "./store/gameStore";

function Briefing() {
  const selectedCaseId = useGameStore((state) => state.selectedCaseId);
  const returnToHeadquarters = useGameStore((state) => state.returnToHeadquarters);

  const gameCase = cases.find((c) => c.id === selectedCaseId);

  if (!gameCase) {
    return (
      <motion.main
        className="briefing"
        initial={{ opacity: 0, x: 25 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -25 }}
      >
        <button className="back-button" onClick={returnToHeadquarters}>
          <ArrowLeft size={17} />
          BACK TO HEADQUARTERS
        </button>
        <div className="briefing-error">Case not found</div>
      </motion.main>
    );
  }

  const assetContent = getBriefingAsset(gameCase.briefingAsset);

  if (!assetContent) {
    return (
      <motion.main
        className="briefing"
        initial={{ opacity: 0, x: 25 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -25 }}
      >
        <button className="back-button" onClick={returnToHeadquarters}>
          <ArrowLeft size={17} />
          BACK TO HEADQUARTERS
        </button>
        <div className="briefing-error">No briefing asset configured for this case</div>
      </motion.main>
    );
  }

  return (
    <motion.main
      className="briefing"
      initial={{ opacity: 0, x: 25 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -25 }}
    >
      <button className="back-button" onClick={returnToHeadquarters}>
        <ArrowLeft size={17} />
        BACK TO HEADQUARTERS
      </button>

      <iframe
        srcDoc={assetContent}
        className="briefing-iframe"
        title="Case Briefing"
        sandbox="allow-same-origin"
      />
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
        {currentScreen === "landing" && (
          <LandingPage key="landing" />
        )}

        {currentScreen === "case-files" && (
          <CaseFilesPage key="case-files" />
        )}

        {currentScreen === "case-intro" && (
          <CaseIntroduction key="case-intro" />
        )}

        {currentScreen === "headquarters" && (
          <Headquarters key="headquarters" />
        )}

        {currentScreen === "briefing" && (
          <Briefing key="briefing" />
        )}

        {currentScreen === "fact-sheet" && (
          <FactSheet key="fact-sheet" />
        )}

        {currentScreen === "data-explorer" && (
          <DataExplorer key="data-explorer" />
        )}

        {currentScreen === "effect-explorer" && (
          <EffectExplorer key="effect-explorer" />
        )}

        {currentScreen === "decision-room" && (
          <DecisionRoom key="decision-room" />
        )}
      </AnimatePresence>
    </div>
  );
}
