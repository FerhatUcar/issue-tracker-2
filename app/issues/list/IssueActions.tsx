"use client";

import React from "react";
import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";
import IssueStatusFilter from "@/app/issues/list/IssueStatusFilter";
import { AiFillFileAdd } from "react-icons/ai";
import IssueUserFilter from "@/app/issues/list/IssueUserFilter";

const IssueActions = () => (
  <Flex justify="between">
    <Flex gap="3" align="center">
      <IssueStatusFilter />
      <IssueUserFilter />
    </Flex>
    <Button>
      <AiFillFileAdd />
      <Link href="/issues/new">New Issue</Link>
    </Button>
  </Flex>
);

export default IssueActions;
