"use client";

import { Select } from "@radix-ui/themes";
import React from "react";
import { Skeleton } from "@/app/components";
import { deduplicateByProperty } from "@/app/helpers/utils";
import { useDataQuery } from "@/app/hooks";
import { User } from "next-auth";
import { useRouter, useSearchParams } from "next/navigation";

type UniqueUserIssues = {
  assignedToUserId: string | null;
};
type UserName = string | null | undefined;
type AssignedUser = {
  name: UserName;
  assignedToUserId: UniqueUserIssues["assignedToUserId"];
};

const IssueUserFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    data: issues,
    isError: isIssuesError,
    isLoading,
  } = useDataQuery<UniqueUserIssues>("issues");
  const { data: users, isError: isUsersError } = useDataQuery<User>("users");
  const nameMapping: Record<string, UserName> = {};
  const assignedUser: AssignedUser[] = [];

  if (isUsersError) {
    return null;
  }

  if (users) {
    users.forEach((user) => {
      nameMapping[user.id] = user.name;
    });
  }

  if (issues) {
    issues.forEach((issue) =>
      assignedUser.push({
        ...issue,
        name: nameMapping[issue.assignedToUserId ?? ""],
      }),
    );
  }

  if (isLoading) {
    return <Skeleton />;
  }

  if (isIssuesError) {
    return null;
  }

  const filteredIssuesArray = deduplicateByProperty(
    assignedUser,
    "assignedToUserId",
  );

  const handleOnValueChange = (assignedToUserId: string) => {
    const params = new URLSearchParams();

    if (assignedToUserId) {
      params.append("assignedToUserId", assignedToUserId);
    }

    if (searchParams.get("status")) {
      params.append("status", searchParams.get("status")!);
    }

    const query = params.size ? "?" + params.toString() : "";
    router.push("/issues/list" + query);
  };

  return (
    <Select.Root
      defaultValue={searchParams.get("assignedToUserId") || "All"}
      onValueChange={handleOnValueChange}
    >
      <Select.Trigger placeholder="Filter by user" />
      <Select.Content>
        <Select.Item value="All">All</Select.Item>

        {filteredIssuesArray.map(({ name, assignedToUserId }, i) => (
          <Select.Item key={i} value={assignedToUserId || "No user"}>
            {name}
          </Select.Item>
        ))}

      </Select.Content>
    </Select.Root>
  );
};

export default IssueUserFilter;
