import assert from "node:assert/strict";
import { test } from "node:test";
import { createServer } from "vite";

test("Pearson correlation measures the selected paired observations", async () => {
  const server = await createServer({
    configFile: false,
    server: { middlewareMode: true },
    logLevel: "silent",
  });
  try {
    const { pearsonCorrelation } = await server.ssrLoadModule(
      "/src/components/investigation/correlation.ts",
    );
    assert.ok(Math.abs(pearsonCorrelation([{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }]) - 1) < 1e-12);
    assert.ok(Math.abs(pearsonCorrelation([{ x: 1, y: 3 }, { x: 2, y: 2 }, { x: 3, y: 1 }]) + 1) < 1e-12);
    assert.ok(Math.abs(pearsonCorrelation([{ x: 1, y: 1 }, { x: 2, y: 3 }, { x: 3, y: 2 }]) - 0.5) < 1e-12);
    assert.equal(pearsonCorrelation([]), null);
    assert.equal(pearsonCorrelation([{ x: 1, y: 1 }]), null);
    assert.equal(pearsonCorrelation([{ x: 1, y: 1 }, { x: 1, y: 2 }]), null);
    assert.equal(pearsonCorrelation([{ x: 1, y: 1 }, { x: 2, y: 1 }]), null);
    assert.equal(pearsonCorrelation([{ x: 1, y: 1 }, { x: NaN, y: 2 }]), null);
  } finally {
    await server.close();
  }
});
