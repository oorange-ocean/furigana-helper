import {create} from 'zustand';

interface LoadingState {
  isHeaderLoaded: boolean;
  isScrollViewLoaded: boolean;
  isBottomLoaded: boolean;
  setHeaderLoaded: (loaded: boolean) => void;
  setScrollViewLoaded: (loaded: boolean) => void;
  setBottomLoaded: (loaded: boolean) => void;
  resetLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isHeaderLoaded: true,
  isScrollViewLoaded: false,
  isBottomLoaded: true,
  setHeaderLoaded: (loaded) => set({ isHeaderLoaded: loaded }),
  setScrollViewLoaded: (loaded) => set({ isScrollViewLoaded: loaded }),
  setBottomLoaded: (loaded) => set({ isBottomLoaded: loaded }),
  resetLoading: () =>
    set({
      isHeaderLoaded: false,
      isScrollViewLoaded: false,
      isBottomLoaded: false,
    }),
}));