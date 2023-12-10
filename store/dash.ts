import { create } from 'zustand';
export interface DashState{
  isDashOpen: boolean,
  setDashVisibility: () => void,
  setDashFlag: (flag: boolean) => void,
}

export const useDashState = create<DashState>((set) => ({
  isDashOpen: false,
  setDashVisibility: () => set((state) => ({ isDashOpen: !state.isDashOpen })),
  setDashFlag: (flag) => set(() => ({ isDashOpen: flag })),
}));