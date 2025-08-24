import { z } from "zod";

const Id = z.union([z.string().uuid(), z.string().cuid()]);
export const DeleteMembershipBody = z
  .object({
    userId: Id,
    workspaceId: Id,
  })
  .strict();
