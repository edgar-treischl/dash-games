import { motion } from "motion/react";
import { Lock, ArrowUpRight, FileSearch } from "lucide-react";
import type { InvestigationCase } from "../data/cases";
import { useGameStore } from "../store/gameStore";

interface Props {
  gameCase: InvestigationCase;
  index: number;
}

export function CaseCard({ gameCase, index }: Props) {
  const openCase = useGameStore((state) => state.openCase);

  const locked = gameCase.status === "locked";

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={!locked ? { y: -5 } : undefined}
      whileTap={!locked ? { scale: 0.98 } : undefined}
      disabled={locked}
      onClick={() => openCase(gameCase.id)}
      className={`case-card ${locked ? "locked" : ""}`}
    >
      <div className="case-card-top">
        <span>FILE #{gameCase.number}</span>

        {locked ? (
          <Lock size={17} />
        ) : (
          <ArrowUpRight size={19} />
        )}
      </div>

      <div className="case-card-icon">
        <FileSearch size={25} />
      </div>

      <div className="case-card-content">
        <span className="case-category">
          {gameCase.category}
        </span>

        <h3>{gameCase.title}</h3>

        <p>{gameCase.description}</p>
      </div>

      <div className="case-card-footer">
        {locked ? "ACCESS RESTRICTED" : "OPEN CASE"}
      </div>
    </motion.button>
  );
}