import { z } from "zod";

const baseMinLength = (message: string) => z.string().min(1, message);

export const issueSchema = z.object({
  title: baseMinLength("Title is required").max(255),
  description: baseMinLength("Description is required").max(65535),
});

export const patchIssueSchema = z.object({
  title: baseMinLength("Title is required.").max(255).optional(),
  description: baseMinLength("Description is required.").max(65535).optional(),
  assignedToUserId: baseMinLength("AssignedToUserId is required.")
    .max(255)
    .optional()
    .nullable(),
});
