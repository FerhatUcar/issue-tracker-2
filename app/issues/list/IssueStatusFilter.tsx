import React from "react";
import { Select } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import { statuses } from "@/app/issues/_components/IssueStatus";

const IssueStatusFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignedToUserId = searchParams.get("assignedToUserId");
  const orderBy = searchParams.get("orderBy");

  const handleOnValueChange = (status: string) => {
    const params = new URLSearchParams();

    if (status) {
      params.append("status", status);
    }

    if (assignedToUserId) {
      params.append("assignedToUserId", assignedToUserId!);
    }

    if (orderBy) {
      params.append("orderBy", orderBy!);
    }

    const query = params.size ? "?" + params.toString() : "";
    router.push("/issues/list" + query);
  };

  return (
    <Select.Root
      defaultValue={searchParams.get("status") || "All"}
      onValueChange={handleOnValueChange}
    >
      <Select.Trigger placeholder="Filter by status" />
      <Select.Content>
        {statuses.map((status, i) => (
          <Select.Item key={i} value={status.value || "All"}>
            {status.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};

export default IssueStatusFilter;
