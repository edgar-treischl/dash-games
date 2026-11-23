import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

test("decision results survive old saves and retries", async () => {
  const values = new Map();
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  const caseId = "confounding_school_education";
  localStorage.setItem("correlation-files-save", JSON.stringify({
    version: 3,
    state: {
      selectedCaseId: caseId,
      currentScreen: "decision-room",
      progressByCase: {
        [caseId]: {
          discoveredEvidence: [],
          collectedEvidence: [],
          evidencePlacements: {},
          hypothesis: "Existing progress",
        },
      },
    },
  }));
  const server = await createServer({
    configFile: false,
    server: { middlewareMode: true },
    logLevel: "silent",
  });
  try {
    const { useGameStore } = await server.ssrLoadModule("/src/store/gameStore.ts");
    const { DecisionRoom } = await server.ssrLoadModule("/src/components/DecisionRoom.tsx");
    const render = () => {
      Object.assign(useGameStore.getInitialState(), useGameStore.getState());
      return renderToStaticMarkup(createElement(DecisionRoom));
    };

    assert.match(render(), /Question 1 of 2/);
    assert.doesNotMatch(render(), /Quiz results/);

    useGameStore.getState().recordDecisionAnswer("q1-variable-importance", "devices", false);
    assert.match(render(), /Question 2 of 2/);
    useGameStore.getState().recordDecisionAnswer("q2-confounding-variable", "school_location", true);
    let markup = render();
    assert.match(markup, /Quiz results/);
    assert.match(markup, /1 \/ 2/);
    assert.match(markup, /Your answer:/);
    assert.match(markup, /Digitale Ausstattung/);
    assert.match(markup, /Hint:/);
    assert.match(markup, /Show answer/);
    assert.match(markup, /Retry quiz/);

    useGameStore.getState().resetDecisionAnswers();
    await useGameStore.persist.rehydrate();
    assert.deepEqual(useGameStore.getState().progressByCase[caseId].decisionAnswers, {});
    assert.match(render(), /Question 1 of 2/);
    useGameStore.getState().recordDecisionAnswer("q1-variable-importance", "uncertain", true);
    useGameStore.getState().recordDecisionAnswer("q2-confounding-variable", "school_location", true);
    markup = render();
    assert.match(markup, /2 \/ 2/);
    assert.doesNotMatch(markup, /Retry quiz/);
    const progress = useGameStore.getState().progressByCase[caseId];
    assert.equal(progress.decisionAnswers["q1-variable-importance"].attempts, 1);
    assert.equal(progress.hypothesis, "Existing progress");
  } finally {
    await server.close();
    delete globalThis.localStorage;
  }
});
