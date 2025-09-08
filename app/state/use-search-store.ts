import { create } from "zustand";

interface SearchStore {
  search: string;
  setSearch: (value: string) => void;
  searchValue: () => string;
}

export const useSearchStore = create<SearchStore>((set, get) => ({
  search: "",
  setSearch: (value) => set({ search: value }),
  searchValue: () => get().search,
}));
