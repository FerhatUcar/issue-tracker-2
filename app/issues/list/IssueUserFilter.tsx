"use client";

import { Select } from "@radix-ui/themes";
import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/app/components";
import { deduplicateByProperty } from "@/app/utils/utils";

type UniqueUserIssues = {
  assignedToUserId: string | null;
};

const IssueUserFilter = () => {
  const { data: issues, error, isLoading } = useIssues();

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

const useIssues = () =>
  useQuery<UniqueUserIssues[]>({
    queryKey: ["issues"],
    queryFn: () => axios.get("/api/issues").then((res) => res.data),
    staleTime: 60 * 1000, //60s
    retry: 3,
  });

export default IssueUserFilter;
