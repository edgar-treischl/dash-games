
import { useState } from "react";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { evidence } from "../data/evidence";
import { useGameStore } from "../store/gameStore";

type Category = "supports" | "context" | "unclear";

const categories: {
  id: Category;
  title: string;
  description: string;
}[] = [
  {
    id: "supports",
    title: "Supports my hypothesis",
    description: "Evidence relevant to the observed relationship",
  },
  {
    id: "context",
    title: "Additional context",
    description: "Information that may explain the relationship",
  },
  {
    id: "unclear",
    title: "Still unclear",
    description: "Evidence I cannot yet interpret",
  },
];

export function EvidenceWall() {
  const collected = useGameStore(
    (state) => state.collectedEvidence
  );

  const goHome = useGameStore(
    (state) => state.goHome
  );

  const [placements, setPlacements] = useState<
    Partial<Record<string, Category>>
  >({});

  const available = evidence.filter(
    (item) =>
      collected.includes(item.id) &&
      !placements[item.id]
  );

  function handleDrop(
    event: React.DragEvent<HTMLDivElement>,
    category: Category
  ) {
    event.preventDefault();

    const id = event.dataTransfer.getData("evidenceId");

    if (!collected.includes(id)) return;

    setPlacements((previous) => ({
      ...previous,
      [id]: category,
    }));
  }

  function handleDragStart(
    event: React.DragEvent<HTMLDivElement>,
    id: string
  ) {
    event.dataTransfer.setData("evidenceId", id);
  }

  return (
    <main className="headquarters">
      <button className="back-button" onClick={goHome}>
        <ArrowLeft size={16} />
        HEADQUARTERS
      </button>

      <header className="evidence-heading">
        <span className="eyebrow">
          CASE #001 / INVESTIGATION
        </span>

        <h1>Evidence Wall</h1>

        <p>
          Organize the evidence. Examine the connections.
        </p>
      </header>

      <section className="wall-layout">
        <aside className="wall-source">
          <h2>Available Evidence</h2>

          {available.map((item) => (
            <div
              key={item.id}
              className="wall-card"
              draggable
              onDragStart={(event) =>
                handleDragStart(event, item.id)
              }
            >
              <span className="eyebrow">
                {item.category}
              </span>

              <h3>{item.title}</h3>

              <p>{item.description}</p>
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

          {categories.map((category) => (
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

              {Object.entries(placements)
                .filter(
                  ([, value]) => value === category.id
                )
                .map(([id]) => {
                  const item = evidence.find(
                    (entry) => entry.id === id
                  );

                  if (!item) return null;

                  return (
                    <div
                      key={id}
                      className="placed-evidence"
                    >
                      <strong>{item.title}</strong>

                      <button
                        onClick={() =>
                          setPlacements((previous) => {
                            const next = { ...previous };
                            delete next[id];
                            return next;
                          })
                        }
                      >
                        REMOVE
                      </button>
                    </div>
                  );
                })}
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
