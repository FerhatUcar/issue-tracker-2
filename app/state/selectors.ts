import { atom, selector } from "recoil";

export const searchState = atom({
  key: "searchState",
  default: "",
});

export const searchValueState = selector({
  key: "searchValueState",
  get: ({ get }) => get(searchState)
});
