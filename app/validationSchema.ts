import { z } from "zod";

const baseMinLength = (message: string) => z.string().min(1, message);

export const issueSchema = z.object({
  title: baseMinLength("Title is required").max(255),
  description: baseMinLength("Description is required"),
});

export const patchIssueSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255).optional(),
  description: z
    .string()
    .min(1, "Description is required.")
    .max(65535)
    .optional(),
  assignedToUserId: z
    .string()
    .min(1, "AssignedToUserId is required.")
    .max(255)
    .optional()
    .nullable(),
});
