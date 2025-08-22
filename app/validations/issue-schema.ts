import { z } from "zod";

const Id = z.union([z.string().uuid(), z.string().cuid()]);

export const issueSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(10000),
  workspaceId: Id, // accept uuid OR cuid
  assignedToUserId: Id.nullable().optional(), // idem for assignee
});

export type NewIssueInput = z.infer<typeof issueSchema>;
