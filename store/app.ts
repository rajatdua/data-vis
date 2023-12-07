import { create } from 'zustand';

interface AppState {
  tweetIds: string[];
  graphsToRender: { [key: string]: boolean }
  setGraphToRender: (key: string, value: boolean) => void;
  setTweetIds: (ids: string[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  tweetIds: [],
  graphsToRender: {},
  setGraphToRender: (key, value) => set((state) => ({ graphsToRender: { ...state.graphsToRender, [key]: value } })),
  setTweetIds: (ids) => set(() => ({ tweetIds: ids }))
}));