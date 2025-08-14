"use client";

import { Flex, IconButton, Text } from "@radix-ui/themes";
import { FaRegThumbsDown, FaThumbsDown } from "react-icons/fa";

type Props = {
  count: number;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export const DislikeButton = ({ count, active, disabled, onClick }: Props) => (
  <Flex align="center" gap="2">
    <IconButton
      size="1"
      variant={active ? "solid" : "ghost"}
      color={active ? "red" : "gray"}
      onClick={onClick}
      disabled={disabled}
      title="Dislike"
    >
      {active ? <FaThumbsDown /> : <FaRegThumbsDown />}
    </IconButton>
    <Text size="1">{count}</Text>
  </Flex>
);
