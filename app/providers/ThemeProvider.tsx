"use client";

import { Theme } from "@radix-ui/themes";
import { ReactNode, createContext, useContext, useState, useCallback } from "react";

type Appearance = "light" | "dark";

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
      <Theme appearance={appearance} accentColor="sky">
        {children}
      </Theme>
    </ThemeContext.Provider>
  );
}