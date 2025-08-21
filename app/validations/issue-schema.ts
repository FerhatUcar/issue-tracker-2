import { z } from "zod";
import { baseMinLength } from "@/app/validations/helpers";

export const issueSchema = z.object({
  title: baseMinLength("Title is required").max(255),
  description: baseMinLength("Description is required").max(65535),
  workspaceId: z.string().min(1),
  assignedToUserId: z.preprocess(
    (v) => (v === "" || v === null ? undefined : v),
    z.string().uuid().optional(),
  ),
});
