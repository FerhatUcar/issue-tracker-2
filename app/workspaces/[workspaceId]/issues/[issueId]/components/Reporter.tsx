import { Avatar, Flex, Separator, Text } from "@radix-ui/themes";
import { formatDate } from "@/app/helpers";

type Props = {
  issue: {
    createdAt: Date;
    author: {
      name: string | null;
      image: string | null;
    } | null;
  };
};

export const Reporter = ({ issue }: Props) => (
  <Flex
    align="start"
    direction="column"
    gap="2"
    className="text-xs text-gray-400 rounded-md p-2 bg-neutral-100 dark:bg-neutral-900"
  >
    <Text weight="bold">Reporter</Text>
    <Separator />
    <Flex align="center" justify="between" width="100%">
      <Flex direction="column" gap="1">
        <Text>{issue.author?.name}</Text>
        <Text>{formatDate(issue.createdAt, true)}</Text>
      </Flex>
      <Avatar
        fallback="?"
        radius="large"
        src={issue.author?.image ?? ""}
        size="2"
      />
    </Flex>
  </Flex>
);
