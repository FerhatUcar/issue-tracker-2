"use client";

import React, { FC, useState } from "react";
import { Button, Flex, IconButton, TextField } from "@radix-ui/themes";
import Link from "next/link";
import IssueStatusFilter from "@/app/issues/list/IssueStatusFilter";
import { AiFillFileAdd } from "react-icons/ai";
import IssueUserFilter from "@/app/issues/list/IssueUserFilter";
import { MagnifyingGlassIcon, Cross2Icon } from "@radix-ui/react-icons";
import { SetterOrUpdater, useRecoilState } from "recoil";
import { searchState } from "@/app/state/selectors";

type SearchFieldProps = {
  value: string;
  setText: SetterOrUpdater<string>;
  handleToggleSearch: () => void;
};

const SearchField: FC<SearchFieldProps> = ({
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

const IssueActions = () => {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [text, setText] = useRecoilState(searchState);

  const handleToggleSearch = () => {
    setSearchOpen(!isSearchOpen);
    setText("");
  };

  return isSearchOpen ? (
    <SearchField
      handleToggleSearch={handleToggleSearch}
      setText={setText}
      value={text}
    />
  ) : (
    <Flex justify="between">
      <Flex gap="3" align="center">
        <IssueStatusFilter />
        <IssueUserFilter />
      </Flex>
      <Flex gap="3">
        <IconButton onClick={handleToggleSearch}>
          <MagnifyingGlassIcon width="18" height="18" />
        </IconButton>
        <Button>
          <AiFillFileAdd />
          <Link href="/issues/new">New Issue</Link>
        </Button>
      </Flex>
    </Flex>
  );
};

export default IssueActions;
