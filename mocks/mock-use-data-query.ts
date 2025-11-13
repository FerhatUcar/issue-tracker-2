import { vi } from "vitest";

export const mockUseDataQuery = vi
  .fn()
  .mockReturnValue({ data: [], isError: false, isLoading: false });

vi.mock("@/app/hooks", () => ({
  useDataQuery: mockUseDataQuery,
}));