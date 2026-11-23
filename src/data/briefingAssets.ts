import newspaperHTML from "../assets/newspaper.html?raw";

export const briefingAssets: Record<string, string> = {
  "newspaper.html": newspaperHTML,
};

export function getBriefingAsset(assetName?: string): string | null {
  if (!assetName) return null;
  return briefingAssets[assetName] || null;
}
