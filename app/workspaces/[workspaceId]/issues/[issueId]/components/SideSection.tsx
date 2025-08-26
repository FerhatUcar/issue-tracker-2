import { PropsWithChildren } from "react";
import { Flex, Text } from "@radix-ui/themes";

type Props = PropsWithChildren<{
  title: string;
}>;

export const SideSection = ({ title, children }: Props) => (
  <Flex
    align="start"
    direction="column"
    gap="3"
    className="text-xs text-gray-400 rounded-md p-2 bg-neutral-100 dark:bg-neutral-900"
  >
    <Text weight="bold">{title}</Text>
    {children}
  </Flex>
);
