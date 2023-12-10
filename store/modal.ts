import { create } from 'zustand';
export interface IModalButtons {
  btnTitle: string,
  btnClick: () => void,
}

export interface IModalDetails {
  title: string,
  description: string,
  buttons: IModalButtons[],
}

export interface ModalState{
  isModalOpen: boolean,
  modalDetails: IModalDetails,
  setModal: (title: string, description: string, buttons: IModalButtons[]) => void,
  toggleModal: () => void,
  setModalVisibility: (flag: boolean) => void,
}

export const useModalState = create<ModalState>((set) => ({
  isModalOpen: false,
  modalDetails: { title: '', buttons: [], description: '' },
  setModal: (title, description, buttons) => set(() => {
    return ({
      modalDetails: {
        title,
        description,
        buttons
      },
    });
  }),
  toggleModal: () => set((state) => ({ isModalOpen: !state.isModalOpen })),
  setModalVisibility: (flag) => set(() => ({ isModalOpen: flag }))
}));