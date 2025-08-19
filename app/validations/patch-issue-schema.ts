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
