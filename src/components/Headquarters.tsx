import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  ChartBar,
  ChartScatter,
  FileSearch,
  FileText,
  Fingerprint,
  LayoutDashboard,
} from "lucide-react";

import { cases } from "../data/cases";
import { useGameStore } from "../store/gameStore";

export function Headquarters() {
  const selectedCaseId = useGameStore((state) => state.selectedCaseId);
  const progress = useGameStore((state) =>
    selectedCaseId ? state.progressByCase[selectedCaseId] : undefined
  );
  const goHome = useGameStore((state) => state.goHome);
  const openBriefing = useGameStore((state) => state.openBriefing);
  const startInvestigation = useGameStore((state) => state.startInvestigation);
  const openVariablePicker = useGameStore((state) => state.openVariablePicker);
  const openEvidenceWall = useGameStore((state) => state.openEvidenceWall);
  const openEffectExplorer = useGameStore((state) => state.openEffectExplorer);
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

  const collectedCount = gameCase.evidenceIds.filter((id) =>
    progress.collectedEvidence.includes(id)
  ).length;
  const placedCount = gameCase.evidenceIds.filter((id) =>
    progress.collectedEvidence.includes(id) && progress.evidencePlacements[id]
  ).length;

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
          <span className="eyebrow">CASE #{gameCase.number} / HEADQUARTERS</span>
          <h1>Your investigation desk</h1>
          <p>Follow the evidence, revisit the report, and make sense of the connections.</p>
        </div>
        <span className="hub-status">CASE OPEN</span>
      </div>

      <div className="hub-desk">
        <section className="hub-file" aria-labelledby="hub-case-title">
          <div className="hub-file-top">
            <span>CASE FILE #{gameCase.number}</span>
            <FileText size={22} />
          </div>
          <p className="hub-file-label">Current investigation</p>
          <h2 id="hub-case-title">{gameCase.title}</h2>
          <p className="hub-file-subtitle">{gameCase.subtitle}</p>
          <div className="hub-file-rule" />
          <p className="hub-file-description">{gameCase.description}</p>
          <button className="hub-file-button" onClick={openBriefing}>
            Read case report <ArrowUpRight size={17} />
          </button>
        </section>

        <section className="hub-workspace" aria-label="Investigation workspace">
          <div className="hub-workspace-heading">
            <span>YOUR WORKSPACE</span>
            <span>CASE #{gameCase.number}</span>
          </div>

          <button className="hub-destination" onClick={startInvestigation}>
            <span className="hub-destination-icon"><FileSearch size={24} /></span>
            <span className="hub-destination-copy">
              <strong>Evidence room</strong>
              <span>Discover and collect the clues.</span>
              <small>{collectedCount} of {gameCase.evidenceIds.length} evidence collected</small>
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

          <button className="hub-destination" onClick={openEvidenceWall}>
            <span className="hub-destination-icon"><LayoutDashboard size={24} /></span>
            <span className="hub-destination-copy">
              <strong>Evidence wall</strong>
              <span>Organize your findings and develop a hypothesis.</span>
              <small>{placedCount} evidence placed</small>
            </span>
            <ArrowUpRight className="hub-destination-arrow" size={20} />
          </button>

          <p className="hub-note">
            {progress.hypothesis.trim()
              ? "Your working hypothesis is saved on the evidence wall."
              : "Your investigation is saved as you go."}
          </p>
        </section>
      </div>
    </motion.main>
  );
}
