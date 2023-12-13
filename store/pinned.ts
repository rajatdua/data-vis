import React from "react";
import { create } from 'zustand';
import {IDashboardType} from "./app";
import {INIT_PINNED} from "../constants";
export interface IPinnedDetails {
  id: string,
  node: React.ReactNode,
  dashboard: IDashboardType,
  isPinned: boolean,
  isPinnedOptions: boolean,
  chartTitle: string,
  chartType: string,
}

export interface PinnedState{
  pinnedIds: string[],
  pinned: { [key: string]: IPinnedDetails }
  setPinned: (details: IPinnedDetails) => void,
  setPinnedVisibility: (flag?: boolean) => void,
  deletePinned: (id: string) => void,
  setChartPinVisibility: (id: string, flag: boolean) => void,
  isPinnedOpen: boolean,
  setPinnedOptions: (id: string, flag: boolean) => void,
}


export const usePinnedState = create<PinnedState>((set) => ({
  isPinnedOpen: false,
  isPinnedOptions: false,
  pinned: {},
  pinnedIds: [],
  setPinned: (details) => set((state) => {
    const pinnedSet = new Set(state.pinnedIds);
    pinnedSet.add(details.id)
    return ({
      pinnedIds: Array.from(pinnedSet),
      pinned: {
        ...state.pinned,
        [details.id]: details ?? INIT_PINNED
      },
    });
  }),
  setPinnedVisibility: (flag) => set((state) => {
    return ({
      isPinnedOpen: flag === undefined ? !state.isPinnedOpen : flag,
    });
  }),
  setPinnedOptions: (id, flag) => set((state) => {
    return ({
      pinned: {...state.pinned, [id]: { ...state.pinned[id], isPinnedOptions: flag }},
    });
  }),
  setChartPinVisibility: (id, flag) => set((state) => {
    const currPinned = state.pinned;
    return ({
      pinned: { ...currPinned, [id]: { ...currPinned[id], isPinned: flag } },
    })
  }),
  deletePinned: (id) => set((state) => {
    const currPinned = state.pinned;
    delete currPinned[id];
    return ({
      pinnedIds: state.pinnedIds.filter(ids => ids !== id),
      pinned: currPinned,
    })
  })
}));