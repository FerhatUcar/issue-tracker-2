"use client";

import React from "react";
import { Select } from "@radix-ui/themes";
import { User } from "next-auth";
import { Skeleton } from "@/app/components";
import { Issue } from "@prisma/client";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDataQuery, useIssueMutation } from "@/app/hooks";

type Props = {
  issue: Issue;
};

const AssigneeSelect = ({ issue }: Props) => {
  const router = useRouter();
  const { data: users, error, isLoading } = useDataQuery<User>("users");
  const {
    upsertIssue: { mutateAsync },
  } = useIssueMutation();

  if (isLoading) {
    return <Skeleton />;
  }

  if (error) {
    return null;
  }

  const handleOnValueChange = async (userId: string) => {
    const assignedToUserId = userId === "unassigned" ? null : userId;

    if (issue.assignedToUserId === assignedToUserId) {
      return;
    }

    try {
      await mutateAsync(
        {
          id: issue.id,
          assignedToUserId,
        },
        {
          onSuccess: () => {
            router.push("/issues/list");
            router.refresh();
          },
        },
      );
    } catch {
      toast.error("Changes could not be saved.");
    }
  };

  return (
    <>
      <Select.Root
        defaultValue={issue.assignedToUserId || "unassigned"}
        onValueChange={handleOnValueChange}
      >
        <Select.Trigger
          className="w-full selectTriggerSmall"
          placeholder="Assign..."
        />
        <Select.Content>
          <Select.Group>
            <Select.Label>Suggestions</Select.Label>
            <Select.Item value="unassigned">Unassigned</Select.Item>
            <Select.Separator />
            {users?.map(({ name, id }) => (
              <Select.Item key={id} value={id}>
                {name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Toaster />
    </>
  );
};

export default AssigneeSelect;
