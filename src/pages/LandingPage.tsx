import { motion } from "motion/react";
import { Search, FolderOpen, Archive } from "lucide-react";

import { useGameStore } from "../store/gameStore";
import Topbar from "../layout/Topbar";

export default function LandingPage() {
  const openCaseFiles = useGameStore((state) => state.openCaseFiles);

  return (
    <motion.main
      className="headquarters"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Topbar />
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">THE D-FILES</span>
          <h1>The truth is<br /><em>in the data.</em></h1>
          <p>
            Suspicious news. Hidden connections. Your mission: find out
            what the data is really telling us.
          </p>
          <button className="cta-button" onClick={openCaseFiles}>
            Start Investigation
          </button>
        </div>
        <div className="hero-stamp">
          <Search size={32} />
          <span>Data Literacy</span>
          <span>by Use Cases</span>
        </div>
      </section>

      <footer className="bottom-nav">
        <button onClick={openCaseFiles}><FolderOpen size={15} /> CASE FILES</button>
        <span><Search size={15} /> INVESTIGATIONS</span>
        <span><Archive size={15} /> ARCHIVE</span>
      </footer>
    </motion.main>
  );
}
