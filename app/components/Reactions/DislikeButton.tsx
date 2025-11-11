"use client";

import { Flex, Text } from "@radix-ui/themes";
import { FaRegThumbsDown, FaThumbsDown } from "react-icons/fa";
import { motion } from "framer-motion";

type Props = {
  count: number;
  active: boolean;
  disabled?: boolean;
  action: () => void;
};

export const DislikeButton = ({ count, active, disabled, action }: Props) => (
  <Flex align="center" gap="2">
    <motion.button
      whileTap={{ y: 8, rotate: 10 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={action}
      disabled={disabled}
      className={`px-2 py-1 rounded ${
        active ? "text-red-600" : "bg-transparent text-gray-500"
      }`}
      title="Dislike"
    >
      {active ? <FaThumbsDown /> : <FaRegThumbsDown />}
    </motion.button>
    <Text size="1">{count}</Text>
  </Flex>
);
