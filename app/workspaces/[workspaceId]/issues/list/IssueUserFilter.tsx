"use client";

import React from "react";
import { Flex, Select } from "@radix-ui/themes";
import { Skeleton } from "@/app/components";
import { deduplicateByProperty } from "@/app/helpers";
import { useDataQuery } from "@/app/hooks";
import { User } from "next-auth";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type UniqueUserIssues = {
  assignedToUserId: string | null;
};
type UserName = string | null | undefined;
type AssignedUser = {
  name: UserName;
  assignedToUserId: UniqueUserIssues["assignedToUserId"];
};

type Props = {
  workspaceId: string;
};

const IssueUserFilter = ({ workspaceId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    data: issues,
    isError: isIssuesError,
    isLoading,
  } = useDataQuery<UniqueUserIssues>("issues");
  const { data: users, error: isUsersError } = useDataQuery<User>(
    "users",
    workspaceId,
  );
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

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Flex align="center" gap="3">
      <Select.Root
        defaultValue={searchParams.get("assignedToUserId") ?? undefined}
        onValueChange={handleOnValueChange}
      >
        <Select.Trigger
          placeholder="Filter by user"
          className="truncate max-w-[85px] sm:max-w-none"
        />
        <Select.Content>
          <Select.Item value="">All</Select.Item>
          {filteredIssuesArray.map(({ name, assignedToUserId }, i) => (
            <Select.Item key={i} value={assignedToUserId || ""}>
              {name}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Flex>
  );
};

export default IssueUserFilter;
