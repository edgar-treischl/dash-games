import { useState } from "react";
import { ArrowLeft, Lock, FileSearch } from "lucide-react";
import { motion } from "motion/react";

import { evidence } from "../data/evidence";
import { EvidenceCard } from "./EvidenceCard";
import { useGameStore } from "../store/gameStore";

export function EvidenceRoom() {
  const openEvidenceWall = useGameStore(
  (state) => state.openEvidenceWall
);
  const [activeId, setActiveId] = useState<string | null>(null);

  const discovered = useGameStore(
    (state) => state.discoveredEvidence
  );

  const collected = useGameStore(
    (state) => state.collectedEvidence
  );

  const discover = useGameStore(
    (state) => state.discoverEvidence
  );

  const collect = useGameStore(
    (state) => state.collectEvidence
  );

  const goHome = useGameStore((state) => state.goHome);

  const activeItem = evidence.find(
    (item) => item.id === activeId
  );

  function collectItem(id: string) {
    collect(id);

    const item = evidence.find((entry) => entry.id === id);

    item?.unlocks?.forEach(discover);
  }

  return (
    <motion.main
      className="headquarters"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button className="back-button" onClick={goHome}>
        <ArrowLeft size={16} />
        HEADQUARTERS
      </button>

      <div className="evidence-heading">
        <span className="eyebrow">CASE #001 / INVESTIGATION</span>
        <h1>Evidence Room</h1>
        <p>Every clue matters. Question everything.</p>
      </div>

      <div className="evidence-progress">
        <span>
          EVIDENCE COLLECTED: {collected.length} / 4
        </span>
      </div>

      <button
  className="primary-button"
  onClick={openEvidenceWall}
>
  OPEN EVIDENCE WALL →
</button>

      <div className="evidence-grid">
        {evidence.map((item) => {
          const isDiscovered = discovered.includes(item.id);

          if (!isDiscovered) {
            return (
              <div className="evidence-locked" key={item.id}>
                <Lock size={24} />
                <span>UNDISCOVERED EVIDENCE</span>
              </div>
            );
          }

          return (
            <EvidenceCard
              key={item.id}
              item={item}
              collected={collected.includes(item.id)}
              onOpen={() => setActiveId(item.id)}
              onCollect={() => collectItem(item.id)}
            />
          );
        })}
      </div>

      {activeItem && (
        <div
          className="evidence-overlay"
          onClick={() => setActiveId(null)}
        >
          <div
            className="evidence-document"
            onClick={(e) => e.stopPropagation()}
          >
            <FileSearch size={30} />
            <span className="eyebrow">
              INVESTIGATION DOCUMENT
            </span>

            <h2>{activeItem.title}</h2>

            <p>{activeItem.detail}</p>

            <button
              className="primary-button"
              onClick={() => {
                collectItem(activeItem.id);
                setActiveId(null);
              }}
            >
              COLLECT DOCUMENT
            </button>
          </div>
        </div>
      )}
    </motion.main>
  );
}