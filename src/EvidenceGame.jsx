
import { useState } from "react";
import {
  DragDropProvider,
  useDraggable,
  useDroppable,
} from "@dnd-kit/react";
import { motion, AnimatePresence } from "motion/react";
import { Search, CheckCircle, HelpCircle } from "lucide-react";

const clues = [
  {
    id: "students",
    title: "Schülerstruktur",
    description: "Unterschiedliche Ausgangsbedingungen",
    correctZone: "relevant",
  },
  {
    id: "period",
    title: "Erhebungszeitraum",
    description: "Unterschiedliche Zeiträume",
    correctZone: "relevant",
  },
  {
    id: "definition",
    title: "Definition",
    description: "Unterschiedliche Definitionen von Abbruch",
    correctZone: "relevant",
  },
  {
    id: "building",
    title: "Gebäudealter",
    description: "Alter des Schulgebäudes",
    correctZone: "other",
  },
];

function ClueCard({ clue }) {
  const { ref, isDragging } = useDraggable({
    id: clue.id,
  });

  return (
    <motion.div
      ref={ref}
      layout
      whileHover={{ scale: 1.02 }}
      className="clue-card"
      style={{
        opacity: isDragging ? 0.4 : 1,
        cursor: "grab",
        padding: 16,
        border: "1px solid #ddd",
        borderRadius: 12,
        background: "white",
        marginBottom: 10,
        touchAction: "none",
      }}
    >
      <strong>{clue.title}</strong>
      <p>{clue.description}</p>
      <small>↕ Ziehen zum Sortieren</small>
    </motion.div>
  );
}

function DropZone({ id, title, icon, items }) {
  const { ref, isDropTarget } = useDroppable({ id });

  return (
    <div
      ref={ref}
      style={{
        minHeight: 180,
        padding: 16,
        border: isDropTarget
          ? "2px solid #16a34a"
          : "2px dashed #bbb",
        borderRadius: 14,
        background: isDropTarget ? "#ecfdf5" : "#f8fafc",
      }}
    >
      <h3>{icon} {title}</h3>

      {items.map((clue) => (
        <ClueCard key={clue.id} clue={clue} />
      ))}

      {items.length === 0 && (
        <p>Hinweise hier ablegen ...</p>
      )}
    </div>
  );
}

export default function EvidenceGame() {
  const [assignments, setAssignments] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const remaining = clues.filter(
    (clue) => !assignments[clue.id]
  );

  const getItems = (zone) =>
    clues.filter(
      (clue) => assignments[clue.id] === zone
    );

  const handleDragEnd = (event) => {
    if (event.canceled) return;

    const sourceId = event.operation.source?.id;
    const targetId = event.operation.target?.id;

    if (
      !sourceId ||
      !["relevant", "other"].includes(targetId)
    ) return;

    setAssignments((previous) => ({
      ...previous,
      [sourceId]: targetId,
    }));

    setSubmitted(false);
  };

  const allPlaced = remaining.length === 0;

  const score = clues.filter(
    (clue) =>
      assignments[clue.id] === clue.correctZone
  ).length;

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <main className="evidence-game">

        <header>
          <Search />
          <h1>The Missing Context</h1>
          <p>
            Welche Informationen sind für einen
            fairen Schulvergleich relevant?
          </p>
        </header>

        <section>
          <h2>Deine Hinweise</h2>
          <div>
            {remaining.map((clue) => (
              <ClueCard key={clue.id} clue={clue} />
            ))}
          </div>
        </section>

        <section className="drop-zones">
          <DropZone
            id="relevant"
            title="Relevant für den Vergleich"
            icon="✓"
            items={getItems("relevant")}
          />

          <DropZone
            id="other"
            title="Nicht unmittelbar relevant"
            icon="?"
            items={getItems("other")}
          />
        </section>

        {allPlaced && (
          <button onClick={() => setSubmitted(true)}>
            Ergebnis überprüfen
          </button>
        )}

        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="feedback"
            >
              <CheckCircle />
              <h2>Investigation abgeschlossen!</h2>
              <p>
                Du hast {score} von {clues.length}
                Hinweisen richtig zugeordnet.
              </p>
              <button
                onClick={() => {
                  setAssignments({});
                  setSubmitted(false);
                }}
              >
                Noch einmal spielen
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </DragDropProvider>
  );
}
