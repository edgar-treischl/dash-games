
import { useState } from "react";
import {
  ArrowLeft,
  Lock,
  FileSearch,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { evidence } from "../data/evidence";
import { cases } from "../data/cases";
import { EvidenceCard } from "./EvidenceCard";
import { useGameStore } from "../store/gameStore";

export function EvidenceRoom() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const selectedCaseId = useGameStore(
    (state) => state.selectedCaseId
  );

  const progress = useGameStore((state) =>
    selectedCaseId
      ? state.progressByCase[selectedCaseId]
      : undefined
  );

  const goHome = useGameStore((state) => state.goHome);
  const returnToHeadquarters = useGameStore((state) => state.returnToHeadquarters);
  const discoverEvidence = useGameStore(
    (state) => state.discoverEvidence
  );

  const collectEvidence = useGameStore(
    (state) => state.collectEvidence
  );

  const gameCase = cases.find(
    (item) => item.id === selectedCaseId
  );

  if (!selectedCaseId || !gameCase || !progress) {
    return (
      <main className="headquarters">
        <p>Investigation not found.</p>
        <button className="back-button" onClick={goHome}>
          <ArrowLeft size={16} />
          BACK TO CASE FILES
        </button>
      </main>
    );
  }

  const caseEvidence = evidence.filter(
    (item) =>
      item.caseId === selectedCaseId &&
      gameCase.evidenceIds.includes(item.id)
  );

  const discovered = progress.discoveredEvidence;
  const collected = progress.collectedEvidence;

  const activeItem = caseEvidence.find(
    (item) => item.id === activeId
  );

  const collectedCount = collected.filter((id) =>
    caseEvidence.some((item) => item.id === id)
  ).length;

  function collectItem(id: string) {
    const item = caseEvidence.find(
      (entry) => entry.id === id
    );

    if (!item) return;

    collectEvidence(id);

    item.unlocks?.forEach((unlockedId) => {
      const belongsToCase = caseEvidence.some(
        (entry) => entry.id === unlockedId
      );

      if (belongsToCase) {
        discoverEvidence(unlockedId);
      }
    });
  }

  return (
    <motion.main
      className="headquarters"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <button className="back-button" onClick={returnToHeadquarters}>
        <ArrowLeft size={16} />
        HEADQUARTERS
      </button>

      <header className="evidence-heading">
        <span className="eyebrow">
          CASE #{gameCase.number} / INVESTIGATION
        </span>

        <h1>Evidence Room</h1>

        <p>
          Every clue matters. Question everything.
        </p>
      </header>

      <div className="evidence-progress">
        <span>
          EVIDENCE COLLECTED: {collectedCount} / {caseEvidence.length}
        </span>

        <span>
          DISCOVERED: {discovered.filter((id) =>
            caseEvidence.some((item) => item.id === id)
          ).length} / {caseEvidence.length}
        </span>
      </div>

      <div className="evidence-grid">
        {caseEvidence.map((item) => {
          const isDiscovered = discovered.includes(item.id);
          const isCollected = collected.includes(item.id);

          if (!isDiscovered) {
            return (
              <div
                key={item.id}
                className="evidence-locked"
              >
                <Lock size={24} />
                <span>UNDISCOVERED EVIDENCE</span>
              </div>
            );
          }

          return (
            <EvidenceCard
              key={item.id}
              item={item}
              collected={isCollected}
              onOpen={() => setActiveId(item.id)}
              onCollect={() => collectItem(item.id)}
            />
          );
        })}
      </div>

      <AnimatePresence>
        {activeItem && (
          <motion.div
            className="evidence-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setActiveId(null);
              }
            }}
          >
            <motion.section
              className="evidence-document"
              role="dialog"
              aria-modal="true"
              aria-labelledby="evidence-document-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <FileSearch size={30} />

              <span className="eyebrow">
                INVESTIGATION DOCUMENT
              </span>

              <h2 id="evidence-document-title">
                {activeItem.title}
              </h2>

              <p>{activeItem.detail}</p>

              <button
                className="primary-button"
                onClick={() => {
                  collectItem(activeItem.id);
                  setActiveId(null);
                }}
              >
                {collected.includes(activeItem.id)
                  ? "CLOSE DOCUMENT"
                  : "COLLECT DOCUMENT"}
              </button>

              <button
                className="back-button"
                onClick={() => setActiveId(null)}
              >
                CLOSE
              </button>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
