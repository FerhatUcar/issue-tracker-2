import { describe, expect, it } from "vitest";
import type { CommentWithReactions, MyReaction } from "@/app/types/types";
import { applyReaction } from "./apply-reactions";

const base = (
  myReaction: MyReaction,
  likes = 0,
  dislikes = 0,
): CommentWithReactions => ({
  id: 1,
  content: "",
  likesCount: likes,
  dislikesCount: dislikes,
  myReaction,
  authorId: null,
  author: null,
});

describe("applyReaction", () => {
  it("NONE -> LIKE", () => {
    const [c] = applyReaction([base("NONE", 0, 0)], 1, "LIKE");

    expect(c.myReaction).toBe("LIKE");
    expect(c.likesCount).toBe(1);
    expect(c.dislikesCount).toBe(0);
  });

  it("LIKE -> LIKE toggles to NONE", () => {
    const [c] = applyReaction([base("LIKE", 1, 0)], 1, "LIKE");

    expect(c.myReaction).toBe("NONE");
    expect(c.likesCount).toBe(0);
  });

  it("DISLIKE -> LIKE switches counters", () => {
    const [c] = applyReaction([base("DISLIKE", 0, 1)], 1, "LIKE");

    expect(c.myReaction).toBe("LIKE");
    expect(c.likesCount).toBe(1);
    expect(c.dislikesCount).toBe(0);
  });
});
