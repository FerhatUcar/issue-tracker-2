import "@testing-library/jest-dom";
import { vi } from "vitest";
import React, { PropsWithChildren } from "react";

vi.mock("@radix-ui/themes", () => ({
  Flex: ({ children }: PropsWithChildren) => <div>{children}</div>,
  Button: ({ children }: PropsWithChildren) => <button>{children}</button>,
  DropdownMenu: {
    Root: ({ children }: PropsWithChildren) => <div>{children}</div>,
    Trigger: ({ children }: PropsWithChildren) => <div>{children}</div>,
    Content: ({ children }: PropsWithChildren) => <div>{children}</div>,
    Item: ({ children }: PropsWithChildren) => <div>{children}</div>,
  },
}));
