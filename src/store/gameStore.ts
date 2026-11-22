
import { create } from "zustand";
import {
  persist,
  createJSONStorage,
} from "zustand/middleware";

export type GameScreen =
  | "landing"
  | "headquarters"
  | "briefing"
  | "evidence"
  | "data-explorer"
  | "effect-explorer"
  | "evidence-wall";

export type EvidenceCategory =
  | "supports"
  | "context"
  | "unclear";

export interface CaseProgress {
  discoveredEvidence: string[];
  collectedEvidence: string[];

  evidencePlacements: Partial<
    Record<string, EvidenceCategory>
  >;

  hypothesis: string;
}

interface GameState {
  selectedCaseId: string | null;
  currentScreen: GameScreen;

  progressByCase: Record<string, CaseProgress>;

  openCase: (id: string) => void;
  goHome: () => void;
  returnToHeadquarters: () => void;
  openBriefing: () => void;
  startInvestigation: () => void;

  discoverEvidence: (id: string) => void;
  collectEvidence: (id: string) => void;

  openVariablePicker: () => void;
  openEvidenceWall: () => void;
  openEffectExplorer: () => void;

  placeEvidence: (
    id: string,
    category: EvidenceCategory
  ) => void;

  removeEvidencePlacement: (id: string) => void;

  updateHypothesis: (value: string) => void;
}


const createInitialProgress = (
  caseId: string
): CaseProgress => ({
  discoveredEvidence:
    caseId === "summer-mystery"
      ? ["ice-cream", "accidents"]
      : [],

  collectedEvidence: [],
  evidencePlacements: {},
  hypothesis: "",
});


export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      selectedCaseId: null,
      currentScreen: "landing",

      progressByCase: {
        "summer-mystery": createInitialProgress("summer-mystery"),
      },

      openCase: (id) => {
        set((state) => ({
          selectedCaseId: id,
          currentScreen: "headquarters",
          progressByCase: {
            ...state.progressByCase,
            [id]: state.progressByCase[id] ?? createInitialProgress(id),
          },
        }));
      },


      goHome: () => {
        set({
          selectedCaseId: null,
          currentScreen: "landing",
        });
      },

      returnToHeadquarters: () => {
        if (!get().selectedCaseId) return;
        set({ currentScreen: "headquarters" });
      },

      openBriefing: () => {
        if (!get().selectedCaseId) return;
        set({ currentScreen: "briefing" });
      },

      startInvestigation: () => {
        if (!get().selectedCaseId) return;

        set({ currentScreen: "evidence" });
      },

      discoverEvidence: (id) => {
        const caseId = get().selectedCaseId;
        if (!caseId) return;

        set((state) => {
          const progress =
            state.progressByCase[caseId] ??
            createInitialProgress(caseId);

          if (progress.discoveredEvidence.includes(id)) {
            return state;
          }

          return {
            progressByCase: {
              ...state.progressByCase,
              [caseId]: {
                ...progress,
                discoveredEvidence: [
                  ...progress.discoveredEvidence,
                  id,
                ],
              },
            },
          };
        });
      },

      collectEvidence: (id) => {
        const caseId = get().selectedCaseId;
        if (!caseId) return;

        set((state) => {
          const progress =
            state.progressByCase[caseId] ??
            createInitialProgress(caseId);

          if (
            !progress.discoveredEvidence.includes(id) ||
            progress.collectedEvidence.includes(id)
          ) {
            return state;
          }

          return {
            progressByCase: {
              ...state.progressByCase,
              [caseId]: {
                ...progress,
                collectedEvidence: [
                  ...progress.collectedEvidence,
                  id,
                ],
              },
            },
          };
        });
      },

      openEvidenceWall: () => {
        if (!get().selectedCaseId) return;

        set({ currentScreen: "evidence-wall" });
      },

      openVariablePicker: () => {
        if (!get().selectedCaseId) return;

        set({ currentScreen: "data-explorer" });
      },

      openEffectExplorer: () => {
        if (!get().selectedCaseId) return;

        set({ currentScreen: "effect-explorer" });
      },

      placeEvidence: (id, category) => {
        const caseId = get().selectedCaseId;
        if (!caseId) return;

        set((state) => {
          const progress =
            state.progressByCase[caseId] ??
            createInitialProgress(caseId);

          if (!progress.collectedEvidence.includes(id)) {
            return state;
          }

          return {
            progressByCase: {
              ...state.progressByCase,
              [caseId]: {
                ...progress,
                evidencePlacements: {
                  ...progress.evidencePlacements,
                  [id]: category,
                },
              },
            },
          };
        });
      },

      removeEvidencePlacement: (id) => {
        const caseId = get().selectedCaseId;
        if (!caseId) return;

        set((state) => {
          const progress =
            state.progressByCase[caseId] ??
            createInitialProgress(caseId);

          const placements = {
            ...progress.evidencePlacements,
          };

          delete placements[id];

          return {
            progressByCase: {
              ...state.progressByCase,
              [caseId]: {
                ...progress,
                evidencePlacements: placements,
              },
            },
          };
        });
      },

      updateHypothesis: (value) => {
        const caseId = get().selectedCaseId;
        if (!caseId) return;

        set((state) => {
          const progress =
            state.progressByCase[caseId] ??
            createInitialProgress(caseId);

          return {
            progressByCase: {
              ...state.progressByCase,
              [caseId]: {
                ...progress,
                hypothesis: value,
              },
            },
          };
        });
      },
    }),
    {
      name: "correlation-files-save",
      version: 3,
      storage: createJSONStorage(() => localStorage),

      migrate: (persistedState) => {
        const saved = persistedState as Pick<
          GameState,
          "selectedCaseId" | "currentScreen" | "progressByCase"
        >;
        const progress = saved.progressByCase?.["summer-mystery"];

        const migrated = {
          ...saved,
          currentScreen: saved.currentScreen === "headquarters" && !saved.selectedCaseId
            ? "landing" as const
            : saved.currentScreen,
        };

        if (!progress) return migrated;

        return {
          ...migrated,
          progressByCase: {
            ...saved.progressByCase,
            "summer-mystery": {
              ...progress,
              discoveredEvidence: [
                ...new Set([
                  ...createInitialProgress("summer-mystery").discoveredEvidence,
                  ...progress.discoveredEvidence,
                ]),
              ],
            },
          },
        };
      },

      partialize: (state) => ({
        selectedCaseId: state.selectedCaseId,
        currentScreen: state.currentScreen,
        progressByCase: state.progressByCase,
      }),
    }
  )
);
