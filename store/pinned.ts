import React from "react";
import { create } from 'zustand';
import {IDashboardType} from "./app";
import {INIT_PINNED} from "../constants";
export interface IPinnedDetails {
  id: string,
  node: React.ReactNode,
  dashboard: IDashboardType,
}

export interface PinnedState{
  isPinned: boolean,
  pinnedDetails: IPinnedDetails,
  setPinned: (details: IPinnedDetails) => void,
  setPinnedCollapse: (flag: boolean) => void,
  deletePinned: () => void,
  isPinnedCollapsed: boolean,
  isPinnedOptions: boolean,
  setPinnedOptions: (flag: boolean) => void,
}


export const usePinnedState = create<PinnedState>((set) => ({
  isPinned: false,
  isPinnedCollapsed: false,
  isPinnedOptions: false,
  pinnedDetails: INIT_PINNED,
  setPinned: (details) => set(() => {
    return ({
      pinnedDetails: details,
      isPinned: true,
    });
  }),
  setPinnedCollapse: (flag) => set(() => {
    return ({
      isPinnedCollapsed: flag,
    });
  }),
  setPinnedOptions: (flag) => set(() => {
    return ({
      isPinnedOptions: flag,
    });
  }),
  deletePinned: () => set(() => ({ isPinned: false, pinnedDetails: INIT_PINNED, isPinnedCollapsed: false, isPinnedOptions: false }))
}));