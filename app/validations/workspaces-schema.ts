import { z } from "zod";

// Accept UUID or CUID; switch to z.string().uuid() if your IDs are strictly UUID.
const Id = z.union([z.string().uuid(), z.string().cuid()]);

export const WorkspaceParams = z.object({
  id: Id, // workspaceId
});

// Strict body: only email is allowed
export const InviteBody = z
  .object({
    email: z.string().trim().email("Invalid email address"),
  })
  .strict();

/** GET /api/workspaces?id=... */
export const GetWorkspaceQuery = z
  .object({
    id: Id,
  })
  .strict();

/** POST body: only `name` allowed */
export const CreateWorkspaceBody = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(100),
  })
  .strict();
