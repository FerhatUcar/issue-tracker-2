"use client";

import { Badge, HoverCard } from "@radix-ui/themes";

type Props = {
  count?: number;
}

export const IssueStatus = ({ count }: Props) => {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        <Badge variant="solid" radius="full" color="red">
          {count}
        </Badge>
      </HoverCard.Trigger>
      <HoverCard.Content>Open issue(s) on your name: {count}</HoverCard.Content>
    </HoverCard.Root>
  );
}
