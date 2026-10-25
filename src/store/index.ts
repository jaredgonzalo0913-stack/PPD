import { create } from 'zustand';
import { Page, StudentProgress, Component } from '../types';

interface AppState {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  studentProgress: StudentProgress;
  updateProgress: (updates: Partial<StudentProgress>) => void;
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

export const useAppStore = create<AppState>((set) => ({
  currentPage: 'home',
  setCurrentPage: (page) => set({ currentPage: page }),
  
  studentProgress: {
    moduleScores: {},
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
