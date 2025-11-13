import { vi } from "vitest";

export const mockUseRouter = vi.fn();
export const mockUseSearchParams = vi.fn().mockImplementation(() => {
  const params = new URLSearchParams();
  params.get = () => "";
  return params;
});

export const mockPathname = vi.fn(() => "/workspace/123/issues");

vi.mock("next/navigation", () => ({
  usePathname: mockPathname,
  useRouter: () =>
    mockUseRouter.mockReturnValueOnce({
      push: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    })(),
  useSearchParams: mockUseSearchParams,
}));