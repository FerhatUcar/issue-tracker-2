import React from "react";
import { mockUseDataQuery, mockUseSearchParams } from "@/mocks";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import IssueUserFilter from "./IssueUserFilter";

describe("IssueUserFilter", () => {
  it("renders with users and issues", () => {
    mockUseSearchParams.mockImplementation(() => {
      const params = new URLSearchParams();
      params.get = () => "assignedToUserId";
      return params;
    });

    mockUseDataQuery
      .mockReturnValueOnce({
        data: [{ assignedToUserId: "u1" }],
        isError: false,
        isLoading: false,
      })
      .mockReturnValueOnce({
        data: [
          { id: "u1", name: "Alice" },
          { id: "u2", name: "Bob" },
        ],
        isError: false,
        isLoading: false,
      });

    render(<IssueUserFilter workspaceId="abc" />);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });
});
