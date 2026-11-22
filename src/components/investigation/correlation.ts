export function pearsonCorrelation(points: ReadonlyArray<{ x: number; y: number }>): number | null {
  if (points.length < 2 || points.some(({ x, y }) => !Number.isFinite(x) || !Number.isFinite(y))) {
    return null;
  }

  const meanX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const meanY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
  let crossProduct = 0;
  let varianceX = 0;
  let varianceY = 0;

  for (const { x, y } of points) {
    const dx = x - meanX;
    const dy = y - meanY;
    crossProduct += dx * dy;
    varianceX += dx * dx;
    varianceY += dy * dy;
  }

  if (varianceX === 0 || varianceY === 0) return null;
  return Math.max(-1, Math.min(1, crossProduct / Math.sqrt(varianceX * varianceY)));
}
