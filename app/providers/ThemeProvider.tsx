"use client";

import { Theme } from "@radix-ui/themes";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Appearance = "light" | "dark";

const STORAGE_KEY = "ri.theme";

const getInitialAppearance = (): Appearance => {
  if (typeof window === "undefined") {
    return "dark";
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);

  if (saved === "light" || saved === "dark") {
    return saved;
  }

  const prefersDark = window.matchMedia?.(
    "(prefers-color-scheme: dark)",
  ).matches;

  return prefersDark ? "dark" : "light";
};

const ThemeContext = createContext<{
  appearance: Appearance;
  toggleAppearance: () => void;
  setAppearance: (a: Appearance) => void;
}>({
  appearance: "light",
  toggleAppearance: () => {},
  setAppearance: () => {},
});

export const useThemeToggle = () => useContext(ThemeContext);

export function ThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [appearance, setAppearance] =
    useState<Appearance>(getInitialAppearance);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, appearance);
    } catch {
      console.warn("Failed to save theme to localStorage");
    }
  }, [appearance]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (
        e.key === STORAGE_KEY &&
        (e.newValue === "light" || e.newValue === "dark")
      ) {
        setAppearance(e.newValue);
      }
    };

    window.addEventListener("storage", onStorage);

    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleAppearance = useCallback(() => {
    setAppearance((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const ctxValue = useMemo(
    () => ({ appearance, toggleAppearance, setAppearance }),
    [appearance, toggleAppearance],
  );

  return (
    <ThemeContext.Provider value={ctxValue}>
      <Theme appearance={appearance} accentColor="sky" radius="large">
        {children}
      </Theme>
    </ThemeContext.Provider>
  );
}
