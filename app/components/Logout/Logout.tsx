"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Box, Button, Dialog, Flex, IconButton, Text } from "@radix-ui/themes";
import { Cross2Icon, ExitIcon } from "@radix-ui/react-icons";

type Props = {
  callbackUrl?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const Logout = ({ callbackUrl = "/", open, setOpen }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);

    void signOut({ callbackUrl });
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

        <Dialog.Title mb="0">Logout</Dialog.Title>
        <Text className="text-gray-600">Are you sure you want to log out?</Text>

        <Box className="mt-6">
          <Button
            type="button"
            variant="solid"
            color="red"
            size="3"
            disabled={loading}
            onClick={handleLogout}
            className="w-full py-2 disabled:opacity-60"
          >
            <Flex align="center" justify="center" gap="2">
              <ExitIcon />
              {loading ? "Logging out..." : "Logout"}
            </Flex>
          </Button>
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
};
