import assert from "node:assert/strict";
import { test } from "node:test";
import { createServer } from "vite";

test("repairs saved starting evidence without losing progress", async () => {
  const values = new Map();
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  const key = "correlation-files-save";
  localStorage.setItem(key, JSON.stringify({
    version: 1,
    state: {
      selectedCaseId: "summer-mystery",
      currentScreen: "evidence",
      progressByCase: {
        "summer-mystery": {
          discoveredEvidence: ["weather"],
          collectedEvidence: ["weather"],
          evidencePlacements: { weather: "context" },
          hypothesis: "Seasonal effects",
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
    const progress = useGameStore.getState().progressByCase["summer-mystery"];
    assert.deepEqual(progress.discoveredEvidence, ["ice-cream", "accidents", "weather"]);
    assert.deepEqual(progress.collectedEvidence, ["weather"]);
    assert.deepEqual(progress.evidencePlacements, { weather: "context" });
    assert.equal(progress.hypothesis, "Seasonal effects");
    assert.equal(JSON.parse(localStorage.getItem(key)).version, 2);

    useGameStore.getState().collectEvidence("ice-cream");
    assert.deepEqual(
      useGameStore.getState().progressByCase["summer-mystery"].collectedEvidence,
      ["weather", "ice-cream"],
    );
    await useGameStore.persist.rehydrate();
    assert.deepEqual(
      useGameStore.getState().progressByCase["summer-mystery"].discoveredEvidence,
      ["ice-cream", "accidents", "weather"],
    );

    const saved = JSON.parse(localStorage.getItem(key));
    saved.version = 1;
    saved.state.progressByCase["summer-mystery"].discoveredEvidence = [];
    localStorage.setItem(key, JSON.stringify(saved));
    await useGameStore.persist.rehydrate();
    assert.deepEqual(
      useGameStore.getState().progressByCase["summer-mystery"].discoveredEvidence,
      ["ice-cream", "accidents"],
    );
  } finally {
    await server.close();
    delete globalThis.localStorage;
  }
});
