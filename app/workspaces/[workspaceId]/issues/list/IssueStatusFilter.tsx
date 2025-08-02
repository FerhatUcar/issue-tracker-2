"use client";

import React, { useMemo } from "react";
import { Flex, Select } from "@radix-ui/themes";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { statuses } from "@/app/workspaces/[workspaceId]/issues/_components/IssueStatus";

const IssueStatusFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const assignedToUserId = searchParams.get("assignedToUserId");
  const orderBy = searchParams.get("orderBy");

  const statusParam = searchParams.get("status");
  const currentStatus = statusParam ?? undefined;

  const key = useMemo(() => `status-${statusParam ?? "ALL"}`, [statusParam]);

  const handleOnValueChange = (status: string) => {
    const params = new URLSearchParams();

    if (status !== "ALL") {
      params.set("status", status);
    } else {
      params.set("status", "ALL");
    }

    if (assignedToUserId) {
      params.set("assignedToUserId", assignedToUserId);
    }

    if (orderBy) {
      params.set("orderBy", orderBy);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Flex align="center" gap="3">
      <Select.Root
        key={key}
        value={currentStatus}
        onValueChange={handleOnValueChange}
      >
        <Select.Trigger placeholder="Filter by status" className="truncate max-w-[85px] sm:max-w-none" />
        <Select.Content>
          {statuses.map((status, i) => (
            <Select.Item key={i} value={status.value || "ALL"}>
              {status.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Flex>
  );
};

export default IssueStatusFilter;
