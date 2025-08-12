"use client";

import { Box, Select, Text } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { MdOutlineWorkspaces } from "react-icons/md";

type Props = {
  workspaces: { id: string; name: string }[];
};

export const WorkspaceSelect = ({ workspaces }: Props) => {
  const router = useRouter();

  return (
    <>
      <Box mb="2">
        <Text size="2" weight="bold" className="flex items-center gap-2">
          <MdOutlineWorkspaces /> Go back to a workspace:
        </Text>
      </Box>

      <Select.Root
        onValueChange={(value) => router.push(`/workspaces/${value}`)}
      >
        <Select.Trigger placeholder="Select workspace" />
        <Select.Content>
          <Select.Group>
            <Select.Label>Workspaces</Select.Label>
            {workspaces.map((ws) => (
              <Select.Item key={ws.id} value={ws.id}>
                {ws.name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </>
  );
};
