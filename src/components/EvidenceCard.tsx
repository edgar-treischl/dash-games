
import { motion } from "motion/react";
import { FileText, Plus, Check, Eye } from "lucide-react";
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
    <motion.article
      layout
      whileHover={{ y: -3 }}
      className="evidence-card"
    >
      <button
        type="button"
        className="evidence-icon"
        onClick={onOpen}
        aria-label={`Read ${item.title}`}
      >
        <FileText size={25} />
      </button>

      <span className="eyebrow">
        {item.category}
      </span>

      <h3>{item.title}</h3>

      <p>{item.description}</p>

      <div className="evidence-card-actions">
        <button
          type="button"
          className="collect-button"
          onClick={onOpen}
        >
          <Eye size={15} />
          READ DOCUMENT
        </button>

        <button
          type="button"
          className="collect-button"
          onClick={onCollect}
          disabled={collected}
        >
          {collected ? (
            <>
              <Check size={15} />
              COLLECTED
            </>
          ) : (
            <>
              <Plus size={15} />
              COLLECT EVIDENCE
            </>
          )}
        </button>
      </div>
    </motion.article>
  );
}
