import { z } from "zod";

const baseMinLength = (message: string) => z.string().min(1, message);

export const createIssueSchema = z.object({
  title: baseMinLength("Title is required").max(255),
  description: baseMinLength("Description is required"),
});
