"use client";

import { Theme } from "@radix-ui/themes";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Appearance = "light" | "dark" | "inherit";

const STORAGE_KEY = "ri.theme";

const ThemeContext = createContext<{
  appearance: Appearance;
  toggleAppearance: () => void;
  setAppearance: (a: Appearance) => void;
}>({
  appearance: "dark",
  toggleAppearance: () => {},
  setAppearance: () => {},
});

export const useThemeToggle = () => useContext(ThemeContext);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [appearance, setAppearance] = useState<Appearance | null>(null);

  // Hydrate on the client
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved === "light" || saved === "dark") {
      setAppearance(saved);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;

      setAppearance(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    if (appearance) {
      window.localStorage.setItem(STORAGE_KEY, appearance);
    }
  }, [appearance]);

  const toggleAppearance = useCallback(() => {
    setAppearance((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const ctxValue = useMemo(
    () => ({
      appearance: appearance ?? "inherit",
      toggleAppearance,
      setAppearance,
    }),
    [appearance, toggleAppearance],
  );

  if (!appearance) {
    // Optional: render a loading state or consistent fallback here
    return null;
  }

  return (
    <ThemeContext.Provider value={ctxValue}>
      <Theme
        appearance={appearance}
        accentColor="sky"
        grayColor="slate"
        radius="large"
        hasBackground={false}
        style={{
          backgroundColor:
            appearance === "light"
              ? "rgba(237, 237, 237, 0.8)"
              : "rgba(27, 27, 27, 0.8)",
        }}
      >
        {children}
      </Theme>
    </ThemeContext.Provider>
  );
}
