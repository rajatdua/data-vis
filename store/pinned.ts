import { create } from 'zustand';
export interface IPinnedDetails {
  id: string,
}

export interface ModalState{
  isPinned: boolean,
  pinnedDetails: IPinnedDetails,
  setPinned: (details: IPinnedDetails) => void,
  deletePinned: () => void,
}

export const useModalState = create<ModalState>((set) => ({
  isPinned: false,
  pinnedDetails: { id: '' },
  setPinned: (details) => set(() => {
    return ({
      pinnedDetails: details,
    });
  }),
  deletePinned: () => set(() => ({ isPinned: false, pinnedDetails: { id: '' } }))
}));