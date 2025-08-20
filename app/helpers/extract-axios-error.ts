import { AxiosError } from "axios";
import { z } from "zod";

const ErrorResponse = z.object({ error: z.string() });

export const extractAxiosError = (err: unknown): string => {
  const ax = err as AxiosError;
  const data = ax.response?.data;

  if (typeof data === "string") {
    return data;
  }

  const parsed = ErrorResponse.safeParse(data);

  if (parsed.success) {
    return parsed.data.error;
  }

  return ax.response?.statusText || ax.message || "Failed to react";
};
