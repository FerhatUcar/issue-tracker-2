"use client";

import React from "react";
import { Select } from "@radix-ui/themes";
import { Issue, Status } from "@prisma/client";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { notFound, useRouter } from "next/navigation";

export const statuses: { label: string; value?: Status }[] = [
  { label: "All" },
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Closed", value: "CLOSED" },
];

const IssueStatus = ({ issue }: { issue?: Issue }) => {
  const router = useRouter();

  if (!issue) notFound();

  const handleOnChange = (status: string) => {
    return axios
      .patch("/api/issues/" + issue.id, {
        status,
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
      <Select.Root defaultValue={issue?.status} onValueChange={handleOnChange}>
        <Select.Trigger placeholder="Status..." />
        <Select.Content>
          <Select.Group>
            <Select.Label>Choose status</Select.Label>
            {statuses.slice(1).map((status, i) => (
              <Select.Item key={i} value={status.value || "OPEN"}>
                {status.label}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Toaster />
    </>
  );
};

export default IssueStatus;
