import { Box, Heading, Text } from "@radix-ui/themes";
import { ReactNode } from "react";

type Props = {
  title: string;
  description: string | ReactNode;
};

export const PageTitle = ({ title, description }: Props) => (
  <Box mb="4">
    <Heading as="h1" size="6">
      {title}
    </Heading>
    <Text size="2" color="gray">
      {description}
    </Text>
  </Box>
);
