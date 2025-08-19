import { z } from "zod";
import { baseMinLength } from "@/app/validations/helpers";

export const issueSchema = z.object({
  title: baseMinLength("Title is required").max(255),
  description: baseMinLength("Description is required").max(65535),
});
