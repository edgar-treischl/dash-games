import { motion } from "motion/react";
import { Search, FolderOpen, Archive, Fingerprint } from "lucide-react";

import { cases } from "./data/cases";
import { CaseCard } from "./components/CaseCard";

export default function LandingPage() {
  const availableCount = cases.filter((gameCase) => gameCase.status === "available").length;

  return (
    <motion.main
      className="headquarters"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className="topbar">
        <div className="brand">
          <Fingerprint size={27} />
          <span>THE D-FILES</span>
        </div>
        <span className="division">ACTIVE INVESTIGATIONS</span>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">THE D-FILES</span>
          <h1>The truth is<br /><em>in the data.</em></h1>
          <p>
            Suspicious news. Hidden connections. Your mission: find out
            what the data is really telling us.
          </p>
        </div>
        <div className="hero-stamp">
          <Search size={32} />
          <span>Data Literacy</span>
          <span>by Use Cases</span>
        </div>
      </section>

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
        <span><Search size={15} /> INVESTIGATIONS</span>
        <span><Archive size={15} /> ARCHIVE</span>
      </footer>
    </motion.main>
  );
}
