import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

import { useGameStore } from "../store/gameStore";

export function EvidenceWall() {
  const goHome = useGameStore((state) => state.goHome);

  return (
    <motion.main
      className="headquarters"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <button className="back-button" onClick={goHome}>
        <ArrowLeft size={16} />
        BACK TO CASE FILES
      </button>

      <header className="evidence-heading">
        <span className="eyebrow">EVIDENCE WALL</span>
        <h1>No longer used</h1>
        <p>This component is no longer part of the game flow.</p>
      </header>
    </motion.main>
  );
}
