"use client";

import { Flex, Select } from "@radix-ui/themes";
import { Skeleton } from "@/app/components";
import { useDataQuery } from "@/app/hooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type IssueLite = { assignedToUserId: string | null };
type AppUser = { id: string; name: string | null };

type Props = { workspaceId: string };

const UNASSIGNED = "__unassigned__";

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

  // get the user id from the URL
  const urlValue = searchParams.get("assignedToUserId") ?? "";

  // Only show "assigned-only" when actually filtering on a specific user.
  // So NOT at All ("") and NOT at Unassigned.
  const showingAssignedOnly = urlValue !== "" && urlValue !== "null";

  // Set of userIds that appear in issues
  const assignedIds = new Set(
    (issues ?? [])
      .map(({ assignedToUserId }) => assignedToUserId)
      .filter((id): id is string => !!id),
  );

  // Options: default ALL users
  let options = (users ?? []).map(({ id, name }) => ({
    value: id,
    label: name ?? "(No name)",
  }));

  // If you filter specifically on user, you can limit it to users with issues
  if (showingAssignedOnly) {
    options = options.filter((o) => assignedIds.has(o.value));

    // Make sure the selected user remains visible, even without issues
    if (urlValue && !options.some(({ value }) => value === urlValue)) {
      const user = users?.find(({ id }) => id === urlValue);

      if (user)
        options = [
          { value: user.id, label: user.name ?? "(No name)" },
          ...options,
        ];
    }
  }

  // Include "Unassigned" if there are unassigned issues.
  const hasUnassigned = (issues ?? []).some((i) => i.assignedToUserId === null);

  if (hasUnassigned) {
    options = [{ value: UNASSIGNED, label: "Unassigned" }, ...options];
  }

  const value =
    urlValue === "" ? "" : urlValue === "null" ? UNASSIGNED : urlValue;

  const handleOnValueChange = (assignedToUserId: string) => {
    const params = new URLSearchParams();

    if (assignedToUserId && assignedToUserId !== UNASSIGNED) {
      params.set("assignedToUserId", assignedToUserId);
    } else if (assignedToUserId === UNASSIGNED) {
      params.set("assignedToUserId", "null");
    }

    const status = searchParams.get("status");

    if (status) {
      params.set("status", status);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Flex align="center" gap="3">
      <Select.Root value={value} onValueChange={handleOnValueChange}>
        <Select.Trigger
          placeholder="Filter by user"
          className="truncate max-w-[85px] sm:max-w-none"
        />
        <Select.Content>
          <Select.Item value="">All</Select.Item>
          {options.map((opt) => (
            <Select.Item key={opt.value} value={opt.value}>
              {opt.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Flex>
  );
}
