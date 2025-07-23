"use client";

import React from "react";
import { Select } from "@radix-ui/themes";
import { User } from "next-auth";
import axios from "axios";
import { Skeleton } from "@/app/components";
import { Issue } from "@prisma/client";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDataQuery } from "@/app/hooks";

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
  const router = useRouter();
  const { data: users, error, isLoading } = useDataQuery<User>("users");

  if (isLoading) {
    return <Skeleton />;
  }

  if (error) {
    return null;
  }

  const handleOnValueChange = (userId: string) => {
    const assignedToUserId = userId === "unassigned" ? null : userId;
    return axios
      .patch(`/api/issues/${issue.id}`, {
        assignedToUserId,
      })
      .then(() => {
        router.push("/issues/list");
        router.refresh();
      })
      .catch(() => {
        toast.error("Changes could not be saved.");
      });
  };

  return (
    <>
      <Select.Root
        defaultValue={issue.assignedToUserId || "Unassigned"}
        onValueChange={handleOnValueChange}
      >
        <Select.Trigger placeholder="Assign..." />
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
