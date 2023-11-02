"use client";

import React from "react";
import { Button, Flex, IconButton } from "@radix-ui/themes";
import Link from "next/link";
import IssueStatusFilter from "@/app/issues/list/IssueStatusFilter";
import { AiFillFileAdd } from "react-icons/ai";
import IssueUserFilter from "@/app/issues/list/IssueUserFilter";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const IssueActions = () => (
  <Flex justify="between">
    <Flex gap="3" align="center">
      <IssueStatusFilter />
      <IssueUserFilter />
    </Flex>
    <Flex gap="3">
      <IconButton>
        <MagnifyingGlassIcon width="18" height="18" />
      </IconButton>
      <Button>
        <AiFillFileAdd />
        <Link href="/issues/new">New Issue</Link>
      </Button>
    </Flex>
  </Flex>
);

export default IssueActions;
