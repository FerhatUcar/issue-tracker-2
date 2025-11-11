"use client";

import { Flex, Text } from "@radix-ui/themes";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { motion } from "framer-motion";

type Props = {
  count: number;
  active: boolean;
  disabled?: boolean;
  action: () => void;
};

export const LikeButton = ({ count, active, disabled, action }: Props) => (
  <Flex align="center" gap="2">
    <motion.button
      whileTap={{ y: -8, rotate: -10 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={action}
      disabled={disabled}
      className={`px-2 py-1 rounded ${
        active ? "text-green-600" : "bg-transparent text-gray-500"
      }`}
      title="Like"
    >
      {active ? <FaThumbsUp /> : <FaRegThumbsUp />}
    </motion.button>
    <Text size="1">{count}</Text>
  </Flex>
);
