"use client";

import { Select } from "@radix-ui/themes";
import React from "react";
import { Skeleton } from "@/app/components";
import { deduplicateByProperty } from "@/app/helpers/utils";
import { useDataQuery } from "@/app/helpers/hooks";

type UniqueUserIssues = {
  assignedToUserId: string | null;
};

const IssueUserFilter = () => {
  const {
    data: issues,
    error,
    isLoading,
  } = useDataQuery<UniqueUserIssues>("issues");

  if (isLoading) {
    return <Skeleton />;
  }

  if (error) {
    return null;
  }

  const filteredIssuesArray = deduplicateByProperty(issues, "assignedToUserId");

  const handleOnValueChange = (userId: string) => {
    console.log(userId);
  };

  return (
    <Select.Root defaultValue="" onValueChange={handleOnValueChange}>
      <Select.Trigger placeholder="Filter by user" />
      <Select.Content>
        {filteredIssuesArray.map(({ assignedToUserId }, i) => (
          <Select.Item key={i} value={assignedToUserId || "No user"}>
            {assignedToUserId}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};

export default IssueUserFilter;
