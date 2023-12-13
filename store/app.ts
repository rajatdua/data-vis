import { create } from 'zustand';
import {INIT_DASHBOARD} from "../constants";

export interface IDashboardType {
  id: string,
  title: string,
  description: string,
  tweetIds: string[],
  graphsToRender: { [key: string]: boolean },
  depth: number,
  container: string,
}

interface IGraphType { type: string, value: boolean }

export interface ISetters {
  setGraphToRender: (dashboardId: string, value: IGraphType) => void;
  setTweetIds: (dashboardId: string, ids: string[]) => void;
  setTitle: (dashboardId: string, title: string, description: string, depth: number, container: string) => void;
  setDashboard: (opts: IDashboardType) => void,
}

export interface IDashboard {
  dashboards: { [key: string]: IDashboardType }
  dashboardIds: string[],
}

export interface AppState extends ISetters, IDashboard {
  selectedDash: IDashboardType,
  deleteDash: (dashboardId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  dashboards: {},
  dashboardIds: [],
  selectedDash: INIT_DASHBOARD,
  setDashboard: (dashboardOpts) => set(() => ({
    selectedDash: dashboardOpts
  })),
  deleteDash: (dashboardId) => set((state) => {
    const currDashboards = state.dashboards;
    delete currDashboards[dashboardId]
    return ({
      dashboardIds: state.dashboardIds.filter(ids => ids !== dashboardId),
      dashboardId: currDashboards,
    })
  }),
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
  setTitle: (dashboardId, title, description, depth, container) => set((state) => {
    const dashboardSet = new Set(state.dashboardIds);
    dashboardSet.add(dashboardId)
    const selectedDashboard = state.dashboards[dashboardId] ?? INIT_DASHBOARD;
    const updatedDash = {
      ...selectedDashboard,
      title,
      description,
      depth: depth + 1,
      id: dashboardId,
      container,
    };
    return ({
      dashboardIds: Array.from(dashboardSet),
      dashboards: {
        ...state.dashboards,
        [dashboardId]: updatedDash
      }
    });
  }),
}));