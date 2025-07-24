import { SetterOrUpdater } from "recoil";
import React, { FC } from "react";
import { IconButton, TextField } from "@radix-ui/themes";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";

type SearchFieldProps = {
  value: string;
  setText: SetterOrUpdater<string>;
  handleToggleSearch: () => void;
};

export const SearchField: FC<SearchFieldProps> = ({
  value,
  setText,
  handleToggleSearch,
}) => (
  <TextField.Root>
    <TextField.Slot>
      <MagnifyingGlassIcon height="16" width="16" />
    </TextField.Slot>
    <TextField.Input
      value={value}
      onChange={(e) => setText(e.target.value)}
      size="3"
      placeholder="Search issues.."
    />
    <TextField.Slot pr="3">
      <IconButton onClick={handleToggleSearch} size="2" variant="ghost">
        <Cross2Icon height="16" width="16" />
      </IconButton>
    </TextField.Slot>
  </TextField.Root>
);
