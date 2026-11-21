
import { ArrowLeft, Lightbulb, FileText } from "lucide-react";
import { motion } from "motion/react";
import { DataInvestigation } from "./investigation/DataInvestigation";

import { evidence } from "../data/evidence";
import { cases } from "../data/cases";

import {
  useGameStore,
  type EvidenceCategory,
} from "../store/gameStore";

const categories: {
  id: EvidenceCategory;
  title: string;
  description: string;
}[] = [
  {
    id: "supports",
    title: "Supports my hypothesis",
    description:
      "Evidence that supports your current interpretation.",
  },
  {
    id: "context",
    title: "Additional context",
    description:
      "Information that may help explain the relationship.",
  },
  {
    id: "unclear",
    title: "Still unclear",
    description:
      "Evidence that you cannot confidently interpret yet.",
  },
];

export function EvidenceWall() {
  const selectedCaseId = useGameStore(
    (state) => state.selectedCaseId
  );

  const progress = useGameStore((state) =>
    state.selectedCaseId
      ? state.progressByCase[state.selectedCaseId]
      : undefined
  );

  const closeEvidenceWall = useGameStore(
    (state) => state.closeEvidenceWall
  );

  const goHome = useGameStore(
    (state) => state.goHome
  );

  const placeEvidence = useGameStore(
    (state) => state.placeEvidence
  );

  const removeEvidencePlacement = useGameStore(
    (state) => state.removeEvidencePlacement
  );

  const updateHypothesis = useGameStore(
    (state) => state.updateHypothesis
  );

  const gameCase = cases.find(
    (item) => item.id === selectedCaseId
  );

  if (!selectedCaseId || !gameCase || !progress) {
    return (
      <main className="headquarters">
        <button className="back-button" onClick={goHome}>
          <ArrowLeft size={16} />
          HEADQUARTERS
        </button>
        <p>Investigation not found.</p>
      </main>
    );
  }

  const caseEvidence = evidence.filter(
    (item) =>
      item.caseId === selectedCaseId &&
      gameCase.evidenceIds.includes(item.id)
  );

  const collected = progress.collectedEvidence;

  const placements = progress.evidencePlacements;

  const available = caseEvidence.filter(
    (item) =>
      collected.includes(item.id) &&
      !placements[item.id]
  );

  function handleDrop(
    event: React.DragEvent<HTMLDivElement>,
    category: EvidenceCategory
  ) {
    event.preventDefault();

    const id = event.dataTransfer.getData("text/plain");

    if (!collected.includes(id)) return;

    if (!caseEvidence.some((item) => item.id === id)) {
      return;
    }

    placeEvidence(id, category);
  }

  function handleDragStart(
    event: React.DragEvent<HTMLDivElement>,
    id: string
  ) {
    event.dataTransfer.setData("text/plain", id);
    event.dataTransfer.effectAllowed = "move";
  }

  return (
    <motion.main
      className="headquarters"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
    >
      <button
        className="back-button"
        onClick={closeEvidenceWall}
      >
        <ArrowLeft size={16} />
        BACK TO EVIDENCE ROOM
      </button>

      <header className="evidence-heading">
        <span className="eyebrow">
          CASE #{gameCase.number} / ANALYSIS
        </span>

        <h1>Evidence Wall</h1>

        <p>
          Organize the evidence. Examine the connections.
        </p>
      </header>

      <section className="hypothesis-panel">
        <div className="wall-title">
          <Lightbulb size={20} />
          <span>WORKING HYPOTHESIS</span>
           <DataInvestigation />
        </div>

        <label htmlFor="hypothesis">
          What do you currently think explains the relationship?
        </label>


        <textarea
          id="hypothesis"
          value={progress.hypothesis}
          onChange={(event) =>
            updateHypothesis(event.target.value)
          }
          placeholder="I think ice cream sales and swimming accidents are connected because..."
          rows={4}
        />

        <p className="hypothesis-hint">
          Your hypothesis can change as you discover new evidence.
        </p>
      </section>

      <section className="wall-layout">
        <aside className="wall-source">
          <h2>Available Evidence</h2>

          <p className="wall-instruction">
            Drag collected documents into the categories.
            You can also use the category buttons.
          </p>

          {available.map((item) => (
            <div
              key={item.id}
              className="wall-card"
              draggable
              onDragStart={(event) =>
                handleDragStart(event, item.id)
              }
            >
              <FileText size={19} />

              <span className="eyebrow">
                {item.category}
              </span>

              <h3>{item.title}</h3>

              <p>{item.description}</p>

              <div className="wall-mobile-actions">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      placeEvidence(item.id, category.id)
                    }
                  >
                    {category.id === "supports"
                      ? "SUPPORTS"
                      : category.id === "context"
                        ? "CONTEXT"
                        : "UNCLEAR"}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {available.length === 0 && (
            <p className="empty-message">
              All collected evidence has been placed.
            </p>
          )}
        </aside>

        <section className="wall-canvas">
          <div className="wall-title">
            <Lightbulb size={19} />
            <span>INVESTIGATOR'S ANALYSIS</span>
          </div>

          {categories.map((category) => {
            const placedItems = Object.entries(placements)
              .filter(
                ([, value]) => value === category.id
              )
              .map(([id]) =>
                caseEvidence.find((item) => item.id === id)
              )
              .filter((item) => item !== undefined);

            return (
              <div
                key={category.id}
                className="wall-category"
                onDragOver={(event) =>
                  event.preventDefault()
                }
                onDrop={(event) =>
                  handleDrop(event, category.id)
                }
              >
                <h3>{category.title}</h3>

                <p>{category.description}</p>

                {placedItems.map((item) => (
                  <div
                    key={item.id}
                    className="placed-evidence"
                  >
                    <strong>{item.title}</strong>

                    <button
                      type="button"
                      onClick={() =>
                        removeEvidencePlacement(item.id)
                      }
                      aria-label={`Remove ${item.title} from category`}
                    >
                      REMOVE
                    </button>
                  </div>
                ))}

                {placedItems.length === 0 && (
                  <span className="wall-drop-hint">
                    DROP EVIDENCE HERE
                  </span>
                )}
              </div>
            );
          })}
        </section>
      </section>
    </motion.main>
  );
}
