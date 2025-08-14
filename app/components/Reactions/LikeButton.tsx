"use client";

import { IconButton, Text, Flex } from "@radix-ui/themes";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";

type Props = {
  count: number;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export const LikeButton = ({ count, active, disabled, onClick }: Props) => (
  <Flex align="center" gap="2">
    <IconButton
      size="1"
      variant={active ? "solid" : "ghost"}
      color={active ? "green" : "gray"}
      onClick={onClick}
      disabled={disabled}
      title="Like"
    >
      {active ? <FaThumbsUp /> : <FaRegThumbsUp />}
    </IconButton>
    <Text size="1">{count}</Text>
  </Flex>
);
