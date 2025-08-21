"use client";

import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button, Dialog, Flex, IconButton, Text } from "@radix-ui/themes";
import { Cross2Icon } from "@radix-ui/react-icons";
import { FaFacebookF } from "react-icons/fa";

type Props = {
  callbackUrl?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const Login = ({ callbackUrl = "/", open, setOpen }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleOnClick = () => {
    setLoading(true);

    void signIn("google", { callbackUrl });
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content className="relative mx-4">
        <Dialog.Close>
          <IconButton
            variant="ghost"
            size="1"
            color="gray"
            className="float-right"
            aria-label="Close"
          >
            <Cross2Icon />
          </IconButton>
        </Dialog.Close>

        <Dialog.Title mb="0">Log in</Dialog.Title>
        <Text className="text-gray-600">With your Google account</Text>

        <Flex direction="column" align="center" gap="2" className="mt-6">
          <Button
            type="button"
            variant="soft"
            size="3"
            disabled={loading}
            onClick={handleOnClick}
            className="w-full rounded bg-blue-600 text-white py-2 disabled:opacity-60"
          >
            {loading ? (
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
            className="w-full rounded bg-blue-600 text-white py-2 disabled:opacity-60"
            onClick={() => signIn("facebook", { callbackUrl: "/" })}
            title="Continue with Facebook"
          >
            <FaFacebookF />
            Continue with Facebook
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
