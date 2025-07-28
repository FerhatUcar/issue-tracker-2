import { Card, Box, Text, Heading, Flex } from "@radix-ui/themes";
import { ReactNode } from "react";

type FeatureCardProps = {
  /**
   * Title of the feature card
   */
  title: string;

  /**
   * Description of the feature card
   */
  description: string;

  /**
   * Icon to display in the feature card
   */
  icon: ReactNode;
};

export const FeatureCard = ({ title, description, icon }: FeatureCardProps) => (
  <Card className="flex-1 shadow-sm hover:shadow-md transition-shadow duration-200">
    <Box p="4">
      <Flex align="center" gap="2" mb="4">
        {icon}
        <Heading>
          {title}
        </Heading>
      </Flex>

      <Text size="3">{description}</Text>
    </Box>
  </Card>
);
