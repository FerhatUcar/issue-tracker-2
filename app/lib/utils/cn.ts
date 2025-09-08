import { type ClassValue, clsx } from "clsx";
import { twMerge as _twMerge } from "tailwind-merge";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const twMerge: (...classes: string[]) => string = _twMerge;

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(...inputs));
};
