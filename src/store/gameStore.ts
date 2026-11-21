import { create } from "zustand";

interface GameState {
  selectedCaseId: string | null;
  currentScreen: "headquarters" | "briefing" | "evidence" | "evidence-wall"; 

  discoveredEvidence: string[];
  collectedEvidence: string[];

  openCase: (id: string) => void;
  goHome: () => void;
  startInvestigation: () => void;
  discoverEvidence: (id: string) => void;
  collectEvidence: (id: string) => void;
  openEvidenceWall: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  selectedCaseId: null,
  currentScreen: "headquarters",

  discoveredEvidence: ["ice-cream", "accidents"],
  collectedEvidence: [],

  openCase: (id) =>
    set({
      selectedCaseId: id,
      currentScreen: "briefing",
    }),

  goHome: () =>
    set({
      selectedCaseId: null,
      currentScreen: "headquarters",
    }),

  startInvestigation: () =>
    set({ currentScreen: "evidence" }),

  discoverEvidence: (id) =>
    set((state) => ({
      discoveredEvidence: state.discoveredEvidence.includes(id)
        ? state.discoveredEvidence
        : [...state.discoveredEvidence, id],
    })),

  collectEvidence: (id) =>
    set((state) => ({
      collectedEvidence: state.collectedEvidence.includes(id)
        ? state.collectedEvidence
        : [...state.collectedEvidence, id],
    })),

    openEvidenceWall: () =>
  set({ currentScreen: "evidence-wall" }),
}));

