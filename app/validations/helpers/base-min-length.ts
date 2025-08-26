import { z } from "zod";

export const baseMinLength = (message: string) => z.string().min(1, message);
