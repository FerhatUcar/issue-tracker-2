import { CommentWithReactions, MyReaction } from "@/app/types/types";
import { Reaction } from "@/app/types/reactions";

/**
 * Apply reaction to a comment
 * @param list - list of comments
 * @param commentId - comment id
 * @param next - next reaction
 */
export const applyReaction = (
  list: CommentWithReactions[],
  commentId: number,
  next: Exclude<MyReaction, "NONE">,
) => {
  return list.map((c) => {
    if (c.id !== commentId) {
      return c;
    }

    const was: Reaction = c.myReaction ?? "NONE";

    let likes = c.likesCount ?? 0;
    let dislikes = c.dislikesCount ?? 0;

    if (was === next) {
      // toggle off
      if (next === "LIKE") {
        likes = Math.max(0, likes - 1);
      } else {
        dislikes = Math.max(0, dislikes - 1);
      }

      return {
        ...c,
        myReaction: "NONE" as const,
        likesCount: likes,
        dislikesCount: dislikes,
      };
    } else {
      // switch
      if (next === "LIKE") {
        likes += 1;
        if (was === "DISLIKE") dislikes = Math.max(0, dislikes - 1);
      } else {
        dislikes += 1;
        if (was === "LIKE") likes = Math.max(0, likes - 1);
      }
      return {
        ...c,
        myReaction: next,
        likesCount: likes,
        dislikesCount: dislikes,
      };
    }
  });
};
