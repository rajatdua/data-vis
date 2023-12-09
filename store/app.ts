import { create } from 'zustand';

interface IDashboardType {
  title: string,
  tweetIds: string[];
  graphsToRender: { [key: string]: boolean }
}

interface IGraphType { type: string, value: boolean }

export interface ISetters {
  setGraphToRender: (dashboardId: string, value: IGraphType) => void;
  setTweetIds: (dashboardId: string, ids: string[]) => void;
  setTitle: (dashboardId: string, title: string) => void;
}

export interface IDashboard {
  dashboards: { [key: string]: IDashboardType }
  dashboardIds: string[],
}

export interface AppState extends ISetters, IDashboard {}

export const useAppStore = create<AppState>((set) => ({
  dashboards: {},
  dashboardIds: [],
  setGraphToRender: (dashboardId, updater) => set((state) => {
    const selectedDashboard = state.dashboards[dashboardId];
    return ({
      dashboards: {
        ...state.dashboards,
        [dashboardId]: {
          ...selectedDashboard,
          graphsToRender: { ...selectedDashboard.graphsToRender, [updater.type]: updater.value }
        }
      }
    });
  }),
  setTweetIds: (dashboardId, ids) => set((state) => {
    const selectedDashboard = state.dashboards[dashboardId];
    return ({
      dashboards: {
        ...state.dashboards,
        [dashboardId]: {
          ...selectedDashboard,
          tweetIds: ids
        }
      }
    });
  }),
  setTitle: (dashboardId, title) => set((state) => {
    const dashboardSet = new Set(state.dashboardIds);
    dashboardSet.add(dashboardId)
    const selectedDashboard = state.dashboards[dashboardId] ?? { title: '', tweetIds: [], graphsToRender: {} };
    return ({
      dashboardIds: Array.from(dashboardSet),
      dashboards: {
        ...state.dashboards,
        [dashboardId]: {
          ...selectedDashboard,
          title
        }
      }
    });
  }),
}));