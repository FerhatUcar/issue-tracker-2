"use client";

import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { Spinner } from "@/app/components";
import { TrashIcon } from "@radix-ui/react-icons";
import { useIssueMutation } from "@/app/hooks";
import toast from "react-hot-toast";
import { useState } from "react";

type Props = {
  issueId: number;
};

export const DeleteIssueButton = ({ issueId }: Props) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const {
    deleteIssue: {
      mutateAsync,
      isError,
      reset,
    },
  } = useIssueMutation();

  const handleDeleteIssue = async () => {
    try {
      setIsPending(true);
      await mutateAsync(issueId, {
        onSuccess: () => {
          setIsPending(false);
          router.push("/issues/list");
          router.refresh();
        },
      });
    } catch (error) {
      toast.error(`An unexpected error occurred: ${error}`);
    }
  };

  return (
    <>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button color="red" disabled={isPending}>
            <TrashIcon className="-mr-1" />
            Delete
            {isPending && <Spinner />}
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>Confirm Deletion</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to delete this issue?
          </AlertDialog.Description>
          <Flex mt="4" gap="3" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button color="red" onClick={handleDeleteIssue}>
                Delete Issue
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>

      <AlertDialog.Root open={isError}>
        <AlertDialog.Content>
          <AlertDialog.Title>Error</AlertDialog.Title>
          <AlertDialog.Description>
            This issue could not be deleted.
          </AlertDialog.Description>
          <Button
            color="gray"
            variant="soft"
            mt="2"
            onClick={() => reset()}
          >
            OK
          </Button>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
};
