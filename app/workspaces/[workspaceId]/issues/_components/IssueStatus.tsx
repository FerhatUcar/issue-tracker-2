"use client";

import { Select } from "@radix-ui/themes";
import { Issue, Status } from "@prisma/client";
import toast, { Toaster } from "react-hot-toast";
import { notFound, useRouter } from "next/navigation";
import { useIssueMutation } from "@/app/hooks";

export const statuses: { label: string; value?: Status }[] = [
  { label: "All" },
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Review", value: "REVIEW" },
  { label: "Closed", value: "CLOSED" },
];

type Props = {
  issue?: Issue;
};

const IssueStatus = ({ issue }: Props) => {
  const router = useRouter();
  const {
    upsertIssue: { mutate },
  } = useIssueMutation();

  if (!issue) {
    notFound();
  }

  const handleOnChange = (status: string) => {
    if (!issue.id) {
      toast.error("Issue ID is missing");
      return;
    }

    try {
      mutate(
        {
          id: issue.id,
          status: status as Status,
        },
        {
          onSuccess: () => {
            toast.success("Issue status updated successfully");
            router.refresh();
          },
        },
      );
    } catch (error) {
      console.error("Error updating issue status:", error);
      toast.error("Failed to update issue status");
    }
  };

  return (
    <>
      <Select.Root
        defaultValue={issue?.status}
        onValueChange={handleOnChange}
        size="1"
      >
        <Select.Trigger className="!w-full" placeholder="Status..." />
        <Select.Content>
          <Select.Group>
            <Select.Label>Choose status</Select.Label>
            {statuses.slice(1).map((status) => (
              <Select.Item key={status.value} value={status.value || "OPEN"}>
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
