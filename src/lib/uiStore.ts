import { create } from "zustand";

interface UiState {
  contactOpen: boolean;
  openContact: () => void;
  closeContact: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  contactOpen: false,
  openContact: () => set({ contactOpen: true }),
  closeContact: () => set({ contactOpen: false }),
}));
