"use client";

import React, { useState, Suspense, useCallback } from "react";
import { Flex, IconButton } from "@radix-ui/themes";
import Link from "next/link";
import IssueStatusFilter from "@/app/workspaces/[workspaceId]/issues/list/IssueStatusFilter";
import IssueUserFilter from "@/app/workspaces/[workspaceId]/issues/list/IssueUserFilter";
import { AiFillPlusCircle } from "react-icons/ai";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useRecoilState } from "recoil";
import { searchState } from "@/app/state/selectors";
import { SearchField } from "./components";
import { useEscapeKey } from "./hooks";

type Props = {
  workspaceId: string;
};

const IssueActions = ({ workspaceId }: Props) => {
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
          <IssueUserFilter workspaceId={workspaceId} />
        </Suspense>
      </Flex>
      <Flex gap="2">
        <IconButton variant="soft" size="3" onClick={handleToggleSearch}>
          <MagnifyingGlassIcon width="18" height="18" />
        </IconButton>
        <Link href={`/workspaces/${workspaceId}/issues/new`}>
          <IconButton variant="soft" size="3">
            <AiFillPlusCircle />
          </IconButton>
        </Link>
      </Flex>
    </Flex>
  );
};

export default IssueActions;
