import assert from "node:assert/strict";
import { test } from "node:test";
import { createServer } from "vite";

test("fact sheet uses the R simulation and its fitted relationships", async () => {
  const server = await createServer({
    configFile: false,
    server: { middlewareMode: true },
    logLevel: "silent",
  });
  try {
    const { shoeIncomeData, overallConfidenceBand, calculateCorrelation, calculateRegression } =
      await server.ssrLoadModule("/src/data/factSheetDatasets.ts");
    const women = shoeIncomeData.filter((point) => point.sex === "Women");
    const men = shoeIncomeData.filter((point) => point.sex === "Men");
    assert.equal(shoeIncomeData.length, 1000);
    assert.equal(women.length, 506);
    assert.equal(men.length, 494);
    assert.ok(Math.abs(calculateCorrelation(shoeIncomeData) - 0.3594147) < 1e-6);
    assert.ok(Math.abs(calculateCorrelation(women) - -0.005751755) < 1e-6);
    assert.ok(Math.abs(calculateCorrelation(men) - -0.04920195) < 1e-6);

    for (const [data, expectedSlope] of [[shoeIncomeData, 1293.271], [women, -29.38086], [men, -256.1109]]) {
      const [start, end] = calculateRegression(data);
      assert.ok(Math.abs((end.y - start.y) / (end.x - start.x) - expectedSlope) < 0.001);
    }

    const [start] = calculateRegression(shoeIncomeData);
    assert.equal(overallConfidenceBand.length, 80);
    assert.ok(Math.abs(overallConfidenceBand[0].shoe_size - start.x) < 1e-10);
    assert.ok(Math.abs(overallConfidenceBand[0].interval[0] - 37547.55) < 0.01);
    assert.ok(Math.abs(overallConfidenceBand[0].interval[1] - 41192.69) < 0.01);
    assert.ok(overallConfidenceBand[0].interval[0] < start.y && start.y < overallConfidenceBand[0].interval[1]);
  } finally {
    await server.close();
  }
});
