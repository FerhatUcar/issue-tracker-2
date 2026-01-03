"use server";

import { isPro as isProInternal } from "./isPro.server";

/**
 * Server Action wrapper for Server Components.
 */
export async function isPro(userId: string) {
  return isProInternal(userId);
}