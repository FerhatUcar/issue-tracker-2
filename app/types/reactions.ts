export type Reaction = "NONE" | "LIKE" | "DISLIKE";
export type Action = "LIKE" | "DISLIKE";
export type Delta = { likes: -1 | 0 | 1; dislikes: -1 | 0 | 1; next: Reaction };
