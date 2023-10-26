"use client";

import React from "react";
import { Select } from "@radix-ui/themes";
import { Issue } from "@prisma/client";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { notFound, useRouter } from "next/navigation";

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
            <Select.Item value="OPEN">Open</Select.Item>
            <Select.Item value="IN_PROGRESS">In Progress</Select.Item>
            <Select.Item value="CLOSED">Closed</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Toaster />
    </>
  );
};

export default IssueStatus;
