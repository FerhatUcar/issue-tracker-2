"use client";

import { Flex, Text } from "@radix-ui/themes";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { motion } from "framer-motion";

type Props = {
  count: number;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export const LikeButton = ({ count, active, disabled, onClick }: Props) => (
  <Flex align="center" gap="2">
    <motion.button
      whileTap={{ y: -8, rotate: -10 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={onClick}
      disabled={disabled}
      className={`px-2 py-1 rounded ${
        active ? "bg-green-100 text-green-600" : "bg-transparent text-gray-500"
      }`}
      title="Like"
    >
      {active ? <FaThumbsUp /> : <FaRegThumbsUp />}
    </motion.button>
    <Text size="1">{count}</Text>
  </Flex>
);
