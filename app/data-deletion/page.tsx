import type { Metadata } from "next";
import Link from "next/link";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Separator,
  Text,
} from "@radix-ui/themes";
import { PageTitle } from "@/app/components";

export const metadata: Metadata = {
  title: "User Data Deletion | Rocket Issues",
  description:
    "Instructions for deleting your Rocket Issues account and associated personal data obtained via Facebook/Google login.",
  robots: { index: true, follow: true },
};

export default function DataDeletionPage() {
  return (
    <Box className="space-y-4">
      <PageTitle
        title="User Data Deletion"
        description=" This page explains how to delete your Rocket Issues account and any
        personal data collected via Facebook or Google sign-in."
      />

      <Card className="mb-6">
        <Box p="4">
          <Heading as="h2" size="4" className="mb-2">
            How to delete your data
          </Heading>
          <Separator my="3" />
          <ol className="list-decimal pl-5 space-y-2">
            <li>Sign in to your Rocket Issues account.</li>
            <li>
              Open <strong>Settings</strong> → <strong>Account</strong>.
            </li>
            <li>
              Click <strong>Delete account</strong> and confirm.
            </li>
          </ol>

          <Flex gap="3" className="mt-4" wrap="wrap">
            <Button asChild variant="soft" color="red">
              <Link href="/settings">Go to Account Settings</Link>
            </Button>
            {/*<Button asChild variant="outline">*/}
            {/*  <Link href="/privacy">Privacy Policy</Link>*/}
            {/*</Button>*/}
          </Flex>
        </Box>
      </Card>

      <Card>
        <Box p="4">
          <Heading as="h3" size="3" className="mb-2">
            Can’t access your account?
          </Heading>
          <Separator my="3" />
          <Text size="2" className="block mb-3">
            If you no longer have access to your account, you can request
            deletion by emailing our support with the subject{" "}
            <em>“Delete my account”</em> from the email address associated with
            your account.
          </Text>
          <Text size="2">Email: support@rocket-issues.com</Text>
        </Box>
      </Card>
    </Box>
  );
}
