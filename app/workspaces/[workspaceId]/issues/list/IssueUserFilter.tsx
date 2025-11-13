"use client";

import React from "react";
import { Button, DropdownMenu, Flex } from "@radix-ui/themes";
import { CheckIcon } from "@radix-ui/react-icons";
import { IoIosArrowDown } from "react-icons/io";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/app/components";
import { useDataQuery } from "@/app/hooks";

type IssueLite = { assignedToUserId: string | null };
type AppUser = { id: string; name: string | null };
type Props = { workspaceId: string };

const UNASSIGNED = "__unassigned__";
const ALL = "__all__";

export default function IssueUserFilter({ workspaceId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    data: issues,
    isError: isIssuesError,
    isLoading: isIssuesLoading,
  } = useDataQuery<IssueLite>("issues");

  const {
    data: users,
    isError: isUsersError,
    isLoading: isUsersLoading,
  } = useDataQuery<AppUser>("users", workspaceId);

  if (isUsersError || isIssuesError) {
    return null;
  }

  if (isUsersLoading || isIssuesLoading) {
    return <Skeleton />;
  }

  const urlValue = searchParams.get("assignedToUserId") ?? "";
  const selectedIds = urlValue ? urlValue.split(",") : [];
  const isAll = selectedIds.length === 0;

  const hasUnassigned = (issues ?? []).some(
    (issue) => issue.assignedToUserId === null,
  );

  let options = (users ?? []).map(({ id, name }) => ({
    value: id,
    label: name ?? "(No name)",
  }));

  if (hasUnassigned) {
    options = [{ value: UNASSIGNED, label: "Unassigned" }, ...options];
  }

  const buildQueryString = (id: string): string => {
    const params = new URLSearchParams();
    const status = searchParams.get("status");

    if (status) {
      params.set("status", status);
    }

    if (id !== ALL) {
      params.set("assignedToUserId", id === UNASSIGNED ? "null" : id);
    }

    return params.toString();
  };

  const handleSelect = (id: string) => {
    const query = buildQueryString(id);
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  };

  const handleSelectAll = (event: Event) => {
    event.preventDefault();
    handleSelect(ALL);
  };

  const handleSelectUser = (id: string) => (event: Event) => {
    event.preventDefault();
    handleSelect(id);
  };

  const renderCheck = (checked: boolean) => (
    <span className="w-4 h-4 flex items-center justify-center border rounded">
      {checked && <CheckIcon className="w-3 h-3" />}
    </span>
  );

  return (
    <Flex align="center" gap="3">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="soft" size="3">
            {isAll ? "All users" : `${selectedIds.length} selected`}
            <IoIosArrowDown />
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content>
          <DropdownMenu.Item
            onSelect={handleSelectAll}
            className="flex items-center gap-2"
          >
            {renderCheck(isAll)}
            All
          </DropdownMenu.Item>

          {options.map(({ value, label }) => (
            <DropdownMenu.Item
              key={value}
              onSelect={handleSelectUser(value)}
              className="flex items-center gap-2"
            >
              {renderCheck(selectedIds.includes(value))}
              {label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Flex>
  );
}
