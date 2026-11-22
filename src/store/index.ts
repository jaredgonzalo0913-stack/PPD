import { create } from 'zustand';
import { Page, StudentProgress, Component } from '../types';

interface AppState {
  currentPage: Page;
  navigationHistory: Page[];
  navigationGuards: Record<string, () => boolean>;
  setCurrentPage: (page: Page) => void;
  goToPreviousPage: () => void;
  returnToPage: (page: Page) => void;
  setNavigationGuard: (key: string, guard: (() => boolean) | null) => void;
  studentProgress: StudentProgress;
  updateProgress: (updates: Partial<StudentProgress>) => void;
  resetStudentProgress: () => void;
  selectedComponent: Component | null;
  setSelectedComponent: (component: Component | null) => void;
  engineLabMode: 'normal' | 'exploded' | 'cutaway' | 'component';
  setEngineLabMode: (mode: 'normal' | 'exploded' | 'cutaway' | 'component') => void;
  auto360Rotation: boolean;
  setAuto360Rotation: (enabled: boolean) => void;
  guidedTourActive: boolean;
  setGuidedTourActive: (active: boolean) => void;
  guidedTourStep: number;
  setGuidedTourStep: (step: number) => void;
}

const canLeaveCurrentPage = (state: Pick<AppState, 'navigationGuards'>) =>
  Object.values(state.navigationGuards).every((guard) => guard());

export const useAppStore = create<AppState>((set, get) => ({
  currentPage: 'home',
  navigationHistory: [],
  navigationGuards: {},
  setCurrentPage: (page) => {
    const state = get();
    if (state.currentPage === page || !canLeaveCurrentPage(state)) return;
    set((current) => ({
      currentPage: page,
      navigationHistory: [...current.navigationHistory, current.currentPage].slice(-50),
      selectedComponent: current.currentPage === 'components' ? null : current.selectedComponent,
    }));
  },
  goToPreviousPage: () => {
    const current = get();
    if (current.navigationHistory.length === 0 || !canLeaveCurrentPage(current)) return;
    set((state) => {
      if (state.navigationHistory.length === 0) return state;
      const navigationHistory = [...state.navigationHistory];
      const currentPage = navigationHistory[navigationHistory.length - 1];
      if (!currentPage) return state;
      navigationHistory.pop();
      return {
        currentPage,
        navigationHistory,
        selectedComponent: state.currentPage === 'components' ? null : state.selectedComponent,
      };
    });
  },
  returnToPage: (page) => {
    const current = get();
    if (current.currentPage === page || !canLeaveCurrentPage(current)) return;
    set((state) => {
      const selectedComponent = state.currentPage === 'components' ? null : state.selectedComponent;
      const history = state.navigationHistory;
      if (history[history.length - 1] === page) {
        return { currentPage: page, navigationHistory: history.slice(0, -1), selectedComponent };
      }
      return {
        currentPage: page,
        navigationHistory: [...history, state.currentPage].slice(-50),
        selectedComponent,
      };
    });
  },
  setNavigationGuard: (key, guard) =>
    set((state) => {
      const navigationGuards = { ...state.navigationGuards };
      if (guard) navigationGuards[key] = guard;
      else delete navigationGuards[key];
      return { navigationGuards };
    }),
  
  studentProgress: {
    moduleScores: {},
    quizScores: {},
    componentsExplored: [],
    quizzesCompleted: 0,
    totalXP: 0,
    achievements: [],
    lessonsCompleted: 0,
  },
  updateProgress: (updates) =>
    set((state) => ({
      studentProgress: { ...state.studentProgress, ...updates },
    })),
  resetStudentProgress: () =>
    set({
      studentProgress: {
        moduleScores: {},
        quizScores: {},
        componentsExplored: [],
        quizzesCompleted: 0,
        totalXP: 0,
        achievements: [],
        lessonsCompleted: 0,
      },
    }),
  
  selectedComponent: null,
  setSelectedComponent: (component) => set({ selectedComponent: component }),
  
  engineLabMode: 'normal',
  setEngineLabMode: (mode) => set({ engineLabMode: mode }),
  
  auto360Rotation: false,
  setAuto360Rotation: (enabled) => set({ auto360Rotation: enabled }),
  
  guidedTourActive: false,
  setGuidedTourActive: (active) => set({ guidedTourActive: active }),
  
  guidedTourStep: 0,
  setGuidedTourStep: (step) => set({ guidedTourStep: step }),
}));
