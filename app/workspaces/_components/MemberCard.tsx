import { MembersMenu } from "@/app/workspaces/_components";
import { Avatar, Box, Card, Flex, Text } from "@radix-ui/themes";
import { Role } from "@prisma/client";
import { PiCrownDuotone } from "react-icons/pi";

type SlimUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

type Props = {
  workspaceId: string;
  user: SlimUser;
  role: Role;
  isPro: boolean;
  isCurrentUser: boolean;
  showMenu: boolean;
  glow?: boolean;
  onPromote?: () => void;
};

export const MemberCard = ({
  workspaceId,
  user,
  role,
  isPro,
  isCurrentUser,
  showMenu,
  glow = false,
  onPromote,
}: Props) => {
  const isAdmin = role === "ADMIN";

  return (
    <Card variant="surface" className={glow ? "admin-glow" : ""}>
      <Flex align="center" gap="3" justify="between">
        <Flex align="center" gap="3">
          <Avatar
            fallback={user.name?.[0] ?? "?"}
            radius="large"
            src={user.image ?? ""}
            size="3"
            className={`${
              isPro
                ? "ring-1 ring-yellow-500 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                : ""
            }`}
          />
          <Flex direction="column">
            <Text weight="bold">
              {user.name}
              {isCurrentUser && " (you)"}
            </Text>
            <Text size="1" color="gray">
              {user.email}
            </Text>
          </Flex>
        </Flex>

        <Flex align="center" gap="2">
          {isAdmin && (
            <PiCrownDuotone className="mr-2" size={18} color="gold" />
          )}

          {showMenu && (
            <Box className="mr-2 flex items-center">
              <MembersMenu
                workspaceId={workspaceId}
                userId={user.id}
                userName={user.name ?? "Member"}
                onPromote={onPromote}
              />
            </Box>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};
