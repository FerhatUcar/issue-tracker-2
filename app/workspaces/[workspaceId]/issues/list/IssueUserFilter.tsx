"use client";

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

  if (isUsersError || isIssuesError) return null;
  if (isUsersLoading || isIssuesLoading) return <Skeleton />;

  const urlValue = searchParams.get("assignedToUserId") ?? "";
  const selectedIds = urlValue ? urlValue.split(",") : [];

  const hasUnassigned = (issues ?? []).some((i) => i.assignedToUserId === null);

  let options = (users ?? []).map(({ id, name }) => ({
    value: id,
    label: name ?? "(No name)",
  }));

  if (hasUnassigned) {
    options = [{ value: UNASSIGNED, label: "Unassigned" }, ...options];
  }

  const handleSelect = (id: string) => {
    const params = new URLSearchParams();

    if (id === ALL) {
      // alles tonen → geen filter
    } else {
      params.set("assignedToUserId", id === UNASSIGNED ? "null" : id);
    }

    const status = searchParams.get("status");
    if (status) params.set("status", status);

    router.push(`${pathname}?${params.toString()}`);
  };

  const isAll = selectedIds.length === 0;

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
            onSelect={(e) => {
              e.preventDefault();
              handleSelect(ALL);
            }}
            className="flex items-center gap-2"
          >
            <span className="w-4 h-4 flex items-center justify-center border rounded">
              {isAll && <CheckIcon className="w-3 h-3" />}
            </span>
            All
          </DropdownMenu.Item>

          {options.map((opt) => {
            const checked = selectedIds.includes(opt.value);
            return (
              <DropdownMenu.Item
                key={opt.value}
                onSelect={(e) => {
                  e.preventDefault();
                  handleSelect(opt.value);
                }}
                className="flex items-center gap-2"
              >
                <span className="w-4 h-4 flex items-center justify-center border rounded">
                  {checked && <CheckIcon className="w-3 h-3" />}
                </span>
                {opt.label}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Flex>
  );
}
