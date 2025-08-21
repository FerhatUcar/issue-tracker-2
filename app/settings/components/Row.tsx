import { Badge, Flex, Text } from "@radix-ui/themes";

export const Row = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "red" | "orange" | "yellow" | "green";
}) => (
  <Flex align="center" justify="between">
    <Text>{label}</Text>
    <Badge color={color}>{value}</Badge>
  </Flex>
);
