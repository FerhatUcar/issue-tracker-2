"use client";

import { Suspense, useCallback, useState } from "react";
import { Flex, IconButton } from "@radix-ui/themes";
import IssueStatusFilter from "@/app/workspaces/[workspaceId]/issues/list/IssueStatusFilter";
import IssueUserFilter from "@/app/workspaces/[workspaceId]/issues/list/IssueUserFilter";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useSearchStore } from "@/app/state";
import { SearchField } from "./components";
import { useEscapeKey } from "./hooks";
import { CreateIssue } from "@/app/workspaces/[workspaceId]/issues/_components";

type Props = {
  workspaceId: string;
};

const IssueActions = ({ workspaceId }: Props) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const text = useSearchStore((state) => state.search);
  const setText = useSearchStore((state) => state.setSearch);

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
        <CreateIssue hasText={false} />
      </Flex>
    </Flex>
  );
};

export default IssueActions;
