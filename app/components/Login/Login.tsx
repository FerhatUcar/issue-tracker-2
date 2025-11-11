"use client";

import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Box, Button, Dialog, Flex, IconButton, Text } from "@radix-ui/themes";
import { Cross2Icon } from "@radix-ui/react-icons";
import { FaFacebookF } from "react-icons/fa";

type Props = {
  callbackUrl?: string;
  open: boolean;
  action: (open: boolean) => void;
};

type Provider = "google" | "facebook";

export const Login = ({ callbackUrl = "/", open, action }: Props) => {
  const [loading, setLoading] = useState({
    google: false,
    facebook: false,
  });

  const handleOnClick = (provider: Provider) => {
    setLoading((prev) => ({
      ...prev,
      [provider]: true,
    }));

    signIn(provider, { callbackUrl })
      .then(() => {
        setLoading((prev) => ({
          ...prev,
          [provider]: false,
        }));
      })
      .catch((error: Error) => {
        console.error("Error signing in:", error.message);
      });
  };

  return (
    <Dialog.Root open={open} onOpenChange={action}>
      <Dialog.Content className="relative mx-2">
        <Flex justify="between" align="start">
          <Box>
            <Dialog.Title mb="0">Log in</Dialog.Title>
            <Text className="text-gray-600">With your Google account</Text>
          </Box>
          <Dialog.Close>
            <IconButton
              variant="ghost"
              size="1"
              color="gray"
              aria-label="Close"
            >
              <Cross2Icon />
            </IconButton>
          </Dialog.Close>
        </Flex>

        <Flex direction="column" align="center" gap="2" className="mt-6">
          <Button
            type="button"
            variant="soft"
            size="3"
            disabled={loading.google}
            onClick={() => handleOnClick("google")}
            className="rounded bg-blue-600 text-white py-2 disabled:opacity-60"
          >
            {loading.google ? (
              "Loading..."
            ) : (
              <Flex direction="row" align="center" justify="center" gap="2">
                <Image src="/google.png" alt="google" width={25} height={25} />
                Login with Google
              </Flex>
            )}
          </Button>
          <Button
            type="button"
            variant="soft"
            size="3"
            disabled={loading.facebook}
            className="rounded bg-blue-600 text-white py-2 disabled:opacity-60"
            onClick={() => handleOnClick("facebook")}
            title="Login with Facebook"
          >
            {loading.facebook ? (
              "Loading..."
            ) : (
              <Flex direction="row" align="center" justify="center" gap="2">
                <FaFacebookF />
                Login with Facebook
              </Flex>
            )}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
