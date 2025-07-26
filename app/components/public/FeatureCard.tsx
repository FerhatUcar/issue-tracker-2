import { Card, Box, Text, Heading, Flex } from "@radix-ui/themes";
import { BsKanban } from "react-icons/bs";
import { HiOutlineMoon } from "react-icons/hi2";
import { IoTicketOutline } from "react-icons/io5";
import { ReactNode } from "react";

export const FeatureCards = () => (
  <Box className="max-w-7xl mx-auto py-6">
    <Flex direction={{ initial: "column", md: "row" }} gap="6">
      <FeatureCard
        icon={<IoTicketOutline size={24} className="text-cyan-600" />}
        title="Tickets aanmaken"
        description="Voeg snel en eenvoudig nieuwe tickets toe om je team up-to-date te houden."
      />
      <FeatureCard
        icon={<BsKanban size={24} className="text-indigo-600" />}
        title="Beheren"
        description="Houd overzicht over openstaande taken, prioriteiten en de voortgang van je issues."
      />
      <FeatureCard
        icon={<HiOutlineMoon size={24} className="text-purple-600" />}
        title="Darkmode"
        description="Wissel tussen licht en donker thema voor een prettige werkervaring, dag én nacht."
      />
    </Flex>
  </Box>
);

type FeatureCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
};

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => (
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
