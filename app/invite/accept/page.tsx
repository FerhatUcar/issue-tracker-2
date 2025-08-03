import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { redirect } from "next/navigation";
import prisma from "@/prisma/client";
import { Card, Flex, Text, Box, Heading, Button } from "@radix-ui/themes";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";

type Props = {
  searchParams: {
    token: string;
  };
};

export default async function AcceptInvitePage({ searchParams }: Props) {
  const invite = await prisma.invite.findUnique({
    where: { token: searchParams.token },
    include: {
      workspace: {
        select: {
          name: true,
          id: true,
        },
      },
      invitedBy: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!invite) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="max-w-md w-full mx-4">
          <Flex direction="column" align="center" gap="4" className="p-6">
            <CrossCircledIcon className="w-16 h-16 text-red-500" />
            <Heading size="6" className="text-center">
              Ongeldige Uitnodiging
            </Heading>
            <Text
              size="3"
              className="text-center text-gray-600 dark:text-gray-400"
            >
              Deze uitnodiging bestaat niet of is verlopen.
            </Text>
            <Button asChild>
              <Link href="/">Terug naar Home</Link>
            </Button>
          </Flex>
        </Card>
      </Box>
    );
  }

  if (invite.accepted) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="max-w-md w-full mx-4">
          <Flex direction="column" align="center" gap="4" className="p-6">
            <CheckCircledIcon className="w-16 h-16 text-green-500" />
            <Heading size="6" className="text-center">
              Uitnodiging Al Geaccepteerd
            </Heading>
            <Text
              size="3"
              className="text-center text-gray-600 dark:text-gray-400"
            >
              Je bent al lid van <strong>{invite.workspace.name}</strong>.
            </Text>
            <Button asChild>
              <Link href={`/workspaces/${invite.workspaceId}`}>
                Ga naar Workspace
              </Link>
            </Button>
          </Flex>
        </Card>
      </Box>
    );
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect(
      "/api/auth/signin?callbackUrl=/invite/accept?token=" + searchParams.token,
    );
  }

  const existing = await prisma.membership.findFirst({
    where: {
      user: { email: session.user.email },
      workspaceId: invite.workspaceId,
    },
  });

  if (!existing) {
    await prisma.membership.create({
      data: {
        user: { connect: { email: session.user.email } },
        workspace: { connect: { id: invite.workspaceId } },
      },
    });
  }

  await prisma.invite.update({
    where: { id: invite.id },
    data: { accepted: true },
  });

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="max-w-md w-full mx-4">
        <Flex direction="column" align="center" gap="4" className="p-6">
          <CheckCircledIcon className="w-16 h-16 text-green-500" />
          <Heading size="6" className="text-center">
            Welkom bij {invite.workspace.name}!
          </Heading>
          <Box className="text-center">
            <Text
              size="3"
              className="text-gray-600 dark:text-gray-400 block mb-2"
            >
              Je bent succesvol toegevoegd door{" "}
              <strong>{invite.invitedBy.name || invite.invitedBy.email}</strong>
              .
            </Text>
            <Text size="2" className="text-gray-500">
              Je kunt nu beginnen met samenwerken in deze workspace.
            </Text>
          </Box>
          <Flex gap="2" className="w-full">
            <Button asChild className="flex-1">
              <Link href={`/workspaces/${invite.workspaceId}`}>
                Ga naar Workspace
              </Link>
            </Button>
            <Button variant="soft" asChild className="flex-1">
              <Link href="/">Dashboard</Link>
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
}
