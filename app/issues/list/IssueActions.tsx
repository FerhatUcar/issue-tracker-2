"use client";

import React, { useState, Suspense, useCallback } from "react";
import { Button, Flex, IconButton } from "@radix-ui/themes";
import Link from "next/link";
import IssueStatusFilter from "@/app/issues/list/IssueStatusFilter";
import { AiFillPlusCircle } from "react-icons/ai";
import IssueUserFilter from "@/app/issues/list/IssueUserFilter";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useRecoilState } from "recoil";
import { searchState } from "@/app/state/selectors";
import { SearchField } from "./components";
import { useEscapeKey } from "./hooks";

const IssueActions = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [text, setText] = useRecoilState(searchState);

  const handleToggleSearch = useCallback(() => {
    setIsSearchOpen(!isSearchOpen);
    setText("");
  }, [isSearchOpen, setText]);

  useEscapeKey(() => handleToggleSearch(), isSearchOpen);

  return isSearchOpen ? (
    <SearchField
      handleToggleSearch={handleToggleSearch}
      setText={setText}
      value={text}
    />
  ) : (
    <Flex justify="between">
      <Flex gap="3" align="center">
        <Suspense>
          <IssueStatusFilter />
          <IssueUserFilter />
        </Suspense>
      </Flex>
      <Flex gap="3">
        <IconButton variant="soft" size="3" onClick={handleToggleSearch}>
          <MagnifyingGlassIcon width="18" height="18" />
        </IconButton>

        <Link href="/issues/new">
          <Button variant="soft" size="3">
            <AiFillPlusCircle />
            Create new issue
          </Button>
        </Link>
      </Flex>
    </Flex>
  );
};

export default IssueActions;
