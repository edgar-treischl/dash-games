import { motion } from "motion/react";
import { FileText, Plus, Check } from "lucide-react";
import type { Evidence } from "../data/evidence";

interface Props {
  item: Evidence;
  collected: boolean;
  onCollect: () => void;
  onOpen: () => void;
}

export function EvidenceCard({
  item,
  collected,
  onCollect,
  onOpen,
}: Props) {
  return (
    <motion.div
      layout
      whileHover={{ y: -3 }}
      className="evidence-card"
    >
      <div
        className="evidence-icon"
        onClick={onOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") onOpen();
        }}
      >
        <FileText size={25} />
      </div>

      <span className="eyebrow">{item.category}</span>

      <h3>{item.title}</h3>

      <p>{item.description}</p>

      <button
        className="collect-button"
        onClick={onCollect}
        disabled={collected}
      >
        {collected ? (
          <>
            <Check size={15} /> COLLECTED
          </>
        ) : (
          <>
            <Plus size={15} /> COLLECT EVIDENCE
          </>
        )}
      </button>
    </motion.div>
  );
}