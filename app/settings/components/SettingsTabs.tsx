// app/settings/SettingsTabs.tsx
"use client";

import Link from "next/link";
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Separator,
  Table,
  Tabs,
  Text,
} from "@radix-ui/themes";
import { IoMdStats } from "react-icons/io";
import { IssueChart, PageTitle } from "@/app/components";
import { ThemeToggle } from "@/app/settings/components/ThemeToggle";
import { formatDate } from "@/app/helpers";
import { MdOutlineWorkspaces } from "react-icons/md";
import React from "react";
import { AvatarIcon } from "@radix-ui/react-icons";

type WorkspaceDTO = { id: string; name: string; createdAt: string };
type IssueDTO = {
  id: number;
  title: string;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  createdAt: string;
  Workspaces: { id: string; name: string };
};

export default function SettingsTabs(props: {
  user: { name: string; email: string };
  Workspaces: WorkspaceDTO[];
  stats: { open: number; inProgress: number; closed: number };
  recentIssues: IssueDTO[];
}) {
  const { user, Workspaces, stats, recentIssues } = props;
  const totalIssues = stats.open + stats.inProgress + stats.closed;

  return (
    <Box>
      <PageTitle title="Settings" description="Manage your account settings." />

      <Grid columns={{ initial: "1", md: "3" }} gap="3" mb="4">
        <Card>
          <Flex align="center" justify="between">
            <Box>
              <Text
                size="2"
                color="gray"
                className="flex items-center gap-2 mb-2"
              >
                <IoMdStats /> Total issues
              </Text>

              <Heading size="6">{totalIssues}</Heading>
            </Box>
          </Flex>
        </Card>
        <Card>
          <Text size="2" color="gray" className="flex items-center gap-2 mb-2">
            <MdOutlineWorkspaces /> Workspaces
          </Text>
          <Heading size="6">{Workspaces.length}</Heading>
        </Card>
        <Card>
          <Text size="2" color="gray" className="flex items-center gap-2 mb-2">
            <AvatarIcon /> Account
          </Text>
          <Flex direction="column">
            <Text>{user.name || "Naam onbekend"}</Text>
            <Text color="gray" size="1">
              {user.email}
            </Text>
          </Flex>
        </Card>
      </Grid>

      <Separator my="3" />

      <Tabs.Root defaultValue="profile">
        <Tabs.List>
          <Tabs.Trigger value="profile">Profiel</Tabs.Trigger>
          <Tabs.Trigger value="workspaces">Workspaces</Tabs.Trigger>
          <Tabs.Trigger value="issues">Issues</Tabs.Trigger>
          <Tabs.Trigger value="stats">Statistieken</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="profile">
          <Grid columns={{ initial: "1", md: "2" }} gap="3" my="3">
            <Card>
              <Heading size="3" mb="2">
                Profile
              </Heading>
              <Separator my="3" />
              <Flex direction="column" gap="2">
                <Text>
                  Name: <strong>{user.name || "—"}</strong>
                </Text>
                <Text>
                  E‑mail: <strong>{user.email}</strong>
                </Text>
                <Link
                  href="https://myaccount.google.com/personal-info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-44"
                >
                  <Button variant="soft" size="3" className="w-full">
                    Change on Google
                  </Button>
                </Link>
              </Flex>
            </Card>

            <Card>
              <Heading size="3" mb="2">
                Preferences
              </Heading>
              <Separator my="3" />
              <Flex direction="column" gap="3">
                <Flex align="center" justify="between">
                  <Text>Notifications per e‑mail</Text>
                  <Badge color="green">Aan</Badge>
                </Flex>
                <Flex align="center" justify="between">
                  <Text>Theme</Text>
                  <ThemeToggle />
                </Flex>
              </Flex>
            </Card>
          </Grid>
        </Tabs.Content>

        <Tabs.Content value="workspaces">
          <Card my="3">
            <Heading size="3" mb="2">
              Your workspaces
            </Heading>
            <Separator my="3" />
            {Workspaces.length === 0 ? (
              <Flex align="center" justify="between">
                <Text>No workspaces found.</Text>
                <Link href="/workspaces/new" prefetch={false}>
                  <Button variant="solid">New workspace</Button>
                </Link>
              </Flex>
            ) : (
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {Workspaces.map((ws) => (
                    <Table.Row key={ws.id}>
                      <Table.RowHeaderCell>{ws.name}</Table.RowHeaderCell>
                      <Table.Cell>{formatDate(ws.createdAt)}</Table.Cell>
                      <Table.Cell>
                        <Link href={`/workspaces/${ws.id}`} prefetch={false}>
                          <Button size="2" variant="soft">
                            Open
                          </Button>
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}
          </Card>
        </Tabs.Content>

        <Tabs.Content value="issues">
          <Card my="3">
            <Heading size="3" mb="2">
              Recent issues
            </Heading>
            <Separator my="3" />
            {recentIssues.length === 0 ? (
              <Text>No issues found.</Text>
            ) : (
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Workspace</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {recentIssues.map((issue) => (
                    <Table.Row key={issue.id}>
                      <Table.RowHeaderCell>
                        <Link
                          href={`/workspaces/${issue.Workspaces.id}/issues/${issue.id}`}
                          prefetch={false}
                          className="hover:underline"
                        >
                          {issue.title}
                        </Link>
                      </Table.RowHeaderCell>
                      <Table.Cell>
                        <Badge color={statusToColor(issue.status)}>
                          {labelForStatus(issue.status)}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>{issue.Workspaces.name || "—"}</Table.Cell>
                      <Table.Cell>
                        {formatDate(issue.createdAt, true)}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}
          </Card>
        </Tabs.Content>

        <Tabs.Content value="stats">
          <Grid columns={{ initial: "1", md: "2" }} gap="3" my="3">
            <Card>
              <Heading size="3" mb="2">
                Issues per status
              </Heading>
              <IssueChart
                open={stats.open}
                inProgress={stats.inProgress}
                closed={stats.closed}
              />
            </Card>
            <Card>
              <Heading size="3" mb="2">
                Summary
              </Heading>
              <Flex direction="column" gap="2">
                <Row label="Open" value={stats.open} color="orange" />
                <Row
                  label="In progress"
                  value={stats.inProgress}
                  color="yellow"
                />
                <Row label="Closed" value={stats.closed} color="green" />
              </Flex>
            </Card>
          </Grid>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}

function Row({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "orange" | "yellow" | "green";
}) {
  return (
    <Flex align="center" justify="between">
      <Text>{label}</Text>
      <Badge color={color}>{value}</Badge>
    </Flex>
  );
}

function statusToColor(
  status: "OPEN" | "IN_PROGRESS" | "CLOSED",
): "red" | "yellow" | "green" | "gray" {
  switch (status) {
    case "OPEN":
      return "red";
    case "IN_PROGRESS":
      return "yellow";
    case "CLOSED":
      return "green";
    default:
      return "gray";
  }
}
function labelForStatus(status: "OPEN" | "IN_PROGRESS" | "CLOSED") {
  switch (status) {
    case "OPEN":
      return "Open";
    case "IN_PROGRESS":
      return "In progress";
    case "CLOSED":
      return "Closed";
    default:
      return status;
  }
}
