
import { create } from "zustand";
import {
  persist,
  createJSONStorage,
} from "zustand/middleware";

export type GameScreen =
  | "landing"
  | "case-intro"
  | "headquarters"
  | "briefing"
  | "fact-sheet"
  | "data-explorer"
  | "effect-explorer"
  | "decision-room";

export interface CaseProgress {
  hypothesis: string;
  decisionAnswers: Record<string, { answer: string; isCorrect: boolean; attempts: number }>;
}

interface GameState {
  selectedCaseId: string | null;
  currentScreen: GameScreen;

  progressByCase: Record<string, CaseProgress>;

  openCase: (id: string) => void;
  openCaseIntro: (id: string) => void;
  goHome: () => void;
  returnToHeadquarters: () => void;
  openBriefing: () => void;
  openFactSheet: () => void;

  openVariablePicker: () => void;
  openEffectExplorer: () => void;
  openDecisionRoom: () => void;

  updateHypothesis: (value: string) => void;
  
  recordDecisionAnswer: (
    questionId: string,
    answer: string,
    isCorrect: boolean
  ) => void;
  resetDecisionAnswers: () => void;
}


const createInitialProgress = (): CaseProgress => ({
  hypothesis: "",
  decisionAnswers: {},
});


export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      selectedCaseId: null,
      currentScreen: "landing",

      progressByCase: {
        "confounding_school_education": createInitialProgress(),
      },

      openCase: (id) => {
        set((state) => ({
          selectedCaseId: id,
          currentScreen: "case-intro",
          progressByCase: {
            ...state.progressByCase,
            [id]: state.progressByCase[id] ?? createInitialProgress(),
          },
        }));
      },

      openCaseIntro: (id) => {
        set((state) => ({
          selectedCaseId: id,
          currentScreen: "case-intro",
          progressByCase: {
            ...state.progressByCase,
            [id]: state.progressByCase[id] ?? createInitialProgress(),
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

      openFactSheet: () => {
        if (!get().selectedCaseId) return;

        set({ currentScreen: "fact-sheet" });
      },

      openVariablePicker: () => {
        if (!get().selectedCaseId) return;

        set({ currentScreen: "data-explorer" });
      },

      openEffectExplorer: () => {
        if (!get().selectedCaseId) return;

        set({ currentScreen: "effect-explorer" });
      },

      openDecisionRoom: () => {
        if (!get().selectedCaseId) return;

        set({ currentScreen: "decision-room" });
      },

      updateHypothesis: (value) => {
        const caseId = get().selectedCaseId;
        if (!caseId) return;

        set((state) => {
          const progress =
            state.progressByCase[caseId] ??
            createInitialProgress();

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

      recordDecisionAnswer: (questionId, answer, isCorrect) => {
        const caseId = get().selectedCaseId;
        if (!caseId) return;

        set((state) => {
          const progress =
            state.progressByCase[caseId] ??
            createInitialProgress();

          const previousAnswer = progress.decisionAnswers?.[questionId];
          const attempts = (previousAnswer?.attempts ?? 0) + 1;

          return {
            progressByCase: {
              ...state.progressByCase,
              [caseId]: {
                ...progress,
                decisionAnswers: {
                  ...progress.decisionAnswers,
                  [questionId]: {
                    answer,
                    isCorrect,
                    attempts,
                  },
                },
              },
            },
          };
        });
      },

      resetDecisionAnswers: () => {
        const caseId = get().selectedCaseId;
        if (!caseId) return;

        set((state) => {
          const progress = state.progressByCase[caseId];
          if (!progress) return state;

          return {
            progressByCase: {
              ...state.progressByCase,
              [caseId]: { ...progress, decisionAnswers: {} },
            },
          };
        });
      },
    }),
    {
      name: "correlation-files-save",
      version: 4,
      storage: createJSONStorage(() => localStorage),

      migrate: (persistedState) => {
        const saved = persistedState as Pick<
          GameState,
          "selectedCaseId" | "currentScreen" | "progressByCase"
        >;

        const migrated = {
          ...saved,
          currentScreen: saved.currentScreen === "headquarters" && !saved.selectedCaseId
            ? "landing" as const
            : saved.currentScreen,
        };

        return migrated;
      },

      partialize: (state) => ({
        selectedCaseId: state.selectedCaseId,
        currentScreen: state.currentScreen,
        progressByCase: state.progressByCase,
      }),
    }
  )
);
