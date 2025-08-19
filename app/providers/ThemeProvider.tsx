"use client";

import { Theme } from "@radix-ui/themes";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

export type Appearance = "light" | "dark";

const ThemeContext = createContext<{
  appearance: Appearance;
  toggleAppearance: () => void;
}>({
  appearance: "light",
  toggleAppearance: () => {},
});

export const useThemeToggle = () => useContext(ThemeContext);

export function ThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [appearance, setAppearance] = useState<Appearance>("dark");

  const toggleAppearance = useCallback(() => {
    setAppearance((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return (
    <ThemeContext.Provider value={{ appearance, toggleAppearance }}>
      <Theme appearance={appearance} accentColor="sky" radius="large">
        {children}
      </Theme>
    </ThemeContext.Provider>
  );
}
