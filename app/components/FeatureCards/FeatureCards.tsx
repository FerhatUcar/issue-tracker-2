import { Box, Flex } from "@radix-ui/themes";
import { IoTicketOutline } from "react-icons/io5";
import { BsKanban } from "react-icons/bs";
import { FeatureCard } from "./FeatureCard";
import { MdOutlineWorkspaces } from "react-icons/md";

export const FeatureCards = () => (
  <Box className="max-w-7xl mx-auto py-6">
    <Flex direction={{ initial: "column", md: "row" }} gap="6">
      <FeatureCard
        icon={<IoTicketOutline size={24} className="text-cyan-600" />}
        title="Create tickets"
        description="Quickly and easily add new tickets to keep your team up to date."
      />
      <FeatureCard
        icon={<BsKanban size={24} className="text-indigo-600" />}
        title="Control & manage"
        description="Keep track of open tasks, priorities and the progress of your issues."
      />
      <FeatureCard
        icon={<MdOutlineWorkspaces size={24} className="text-purple-600" />}
        title="Workspaces"
        description="Create multiple workspaces to organize your issues and teams."
      />
    </Flex>
  </Box>
);
