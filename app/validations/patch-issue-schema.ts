import { z } from "zod";
import { baseMinLength } from "@/app/validations/helpers";

export const patchIssueSchema = z.object({
  title: baseMinLength("Title is required.").max(255).optional(),
  description: baseMinLength("Description is required.").max(65535).optional(),
  assignedToUserId: baseMinLength("AssignedToUserId is required.")
    .max(255)
    .optional()
    .nullable(),
});

/** Validate and coerce route params */
export const ParamsIssue = z.object({
  id: z.string().regex(/^\d+$/, "id must be numeric").transform(Number),
});

/** PATCH payload schema: partial update, strict, at least one field */
export const PatchBody = z
  .object({
    title: z.string().trim().min(1, "title is required").max(200).optional(),
    description: z.string().trim().max(10000).optional(),
    // Adapt the enum to your schema values
    status: z.enum(["OPEN", "IN_PROGRESS", "REVIEW", "CLOSED"]).optional(),
    // Allow unassigning by sending null; IDs are string in NextAuth/Prisma, don't force UUID
    assignedToUserId: z.string().min(1).nullable().optional(),
  })
  .strict()
  .refine(
    (obj) => Object.keys(obj).length > 0,
    "Provide at least one field to update",
  );

export type PatchIssueData = z.infer<typeof PatchBody>;
export type PatchIssueSchema = z.infer<typeof patchIssueSchema>;
