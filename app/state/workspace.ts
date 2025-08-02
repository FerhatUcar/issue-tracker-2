import { atom, selector } from "recoil";

export type Workspace = {
  id: string;
  name: string;

  // Maybe later:
  // createdAt: string;
  // updatedAt: string;
};

export const workspaceState = atom<Workspace | null>({
  key: "workspaceState",
  default: null,
});

export const workspaceValueState = selector({
  key: "workspaceValueState",
  get: ({ get }) => get(workspaceState),
});
