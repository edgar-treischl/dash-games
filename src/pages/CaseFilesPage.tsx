import { motion } from "motion/react";
import { ArrowLeft, FolderOpen, Archive } from "lucide-react";

import { cases } from "../data/cases";
import { CaseCard } from "../components/CaseCard";
import Topbar from "../layout/Topbar";
import { useGameStore } from "../store/gameStore";

export default function CaseFilesPage() {
  const goHome = useGameStore((state) => state.goHome);
  const availableCount = cases.filter((gameCase) => gameCase.status === "available").length;

  return (
    <motion.main
      className="headquarters"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Topbar />

      <button className="back-button" onClick={goHome}>
        <ArrowLeft size={16} /> BACK
      </button>

      <section className="case-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">INVESTIGATION ARCHIVE</span>
            <h2>Open Case Files</h2>
          </div>
          <span className="case-count">
            {String(availableCount).padStart(2, "0")} / {String(cases.length).padStart(2, "0")} AVAILABLE
          </span>
        </div>
        <div className="case-grid">
          {cases.map((gameCase, index) => (
            <CaseCard key={gameCase.id} gameCase={gameCase} index={index} />
          ))}
        </div>
      </section>

      <footer className="bottom-nav">
        <span><FolderOpen size={15} /> CASE FILES</span>
        <span> </span>
        <span><Archive size={15} /> ARCHIVE</span>
      </footer>
    </motion.main>
  );
}
