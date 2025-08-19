"use client";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useThemeToggle } from "@/app/providers";

export const ThemeToggle = () => {
  const { appearance, toggleAppearance } = useThemeToggle();

  const handleOnValueChange = (value: string) => {
    if (value) toggleAppearance();
  };

  return (
    <ToggleGroup.Root
      type="single"
      className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600"
      value={appearance}
      onValueChange={handleOnValueChange}
    >
      <ToggleGroup.Item
        value="light"
        aria-label="Light mode"
        className="rounded-l-lg px-3 py-2 data-[state=on]:bg-gray-200 dark:data-[state=on]:bg-gray-700"
      >
        <SunIcon />
      </ToggleGroup.Item>

      <ToggleGroup.Item
        value="dark"
        aria-label="Dark mode"
        className="rounded-r-lg px-3 py-2 data-[state=on]:bg-gray-200 dark:data-[state=on]:bg-gray-700"
      >
        <MoonIcon />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};
