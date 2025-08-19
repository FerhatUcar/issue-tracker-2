"use client";

import dynamic from "next/dynamic";
import { FormEventHandler, useMemo } from "react";
import { z } from "zod";
import { Skeleton, Spinner } from "@/app/components";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Issue } from "@prisma/client";
import {
  Box,
  Button,
  Callout,
  Flex,
  Select,
  TextField,
} from "@radix-ui/themes";
import "easymde/dist/easymde.min.css";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { patchIssueSchema } from "@/app/validations";
import type { Options } from "easymde";
import { MdOutlineRocketLaunch } from "react-icons/md";
import { useDataQuery, useIssueMutation } from "@/app/hooks";
import { User } from "next-auth";
import IssueFormSkeleton from "@/app/workspaces/[workspaceId]/issues/_components/IssueFormSkeleton";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
  loading: () => <Skeleton className="h-40" />,
});

const simpleMdeOptions: Options = {
  hideIcons: ["fullscreen", "side-by-side", "preview", "guide"] as const,
};

type Props = {
  workspaceId?: string;
  issue?: Partial<Issue>;
  onSuccess?: () => void;
};

export const IssueForm = ({ issue, onSuccess }: Props) => {
  const router = useRouter();
  const params = useParams();
  const {
    upsertIssue: { mutateAsync },
  } = useIssueMutation();

  const workspaceId = Array.isArray(params?.workspaceId)
    ? params?.workspaceId[0]
    : params?.workspaceId;

  const { data: users = [], isLoading: isLoadingUsers } = useDataQuery<User>(
    "users",
    workspaceId,
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isLoading },
  } = useForm<z.infer<typeof patchIssueSchema>>({
    resolver: zodResolver(patchIssueSchema),
    defaultValues: {
      title: issue?.title || "",
      description: issue?.description || "",
      assignedToUserId: issue?.assignedToUserId ?? "unassigned",
    },
  });

  const defaultDescription = useMemo(() => issue?.description ?? "", [issue]);

  const onSubmit = handleSubmit(async (data) => {
    const assignedToUserId =
      data.assignedToUserId === "unassigned" ? null : data.assignedToUserId;

    const payload = {
      ...data,
      id: issue?.id,
      assignedToUserId,
      workspaceId,
    };

    try {
      await mutateAsync(payload, {
        onSuccess: () => {
          toast.success("Issue submitted successfully!");

          if (onSuccess) {
            onSuccess();
            router.refresh();
          } else {
            router.push(`/workspaces/${workspaceId}`);
            router.refresh();
          }
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(`An unexpected error occurred: ${errorMessage}`);
    }
  });

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    void onSubmit(e);
  };

  return (
    <>
      {(errors.title?.message || errors.description?.message) && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>
            {errors.title?.message || errors.description?.message}
          </Callout.Text>
        </Callout.Root>
      )}

      {isLoading && <IssueFormSkeleton />}

      <form className="space-y-4" onSubmit={handleFormSubmit}>
        <TextField.Root className="relative z-10 pointer-events-auto">
          <Flex align="center" width="100%">
            <TextField.Input
              size="3"
              placeholder="Issue title..."
              inputMode="text"
              autoComplete="off"
              className="rounded-sm"
              {...register("title")}
            />
          </Flex>
        </TextField.Root>

        {!isLoadingUsers && (
          <Controller
            name="assignedToUserId"
            control={control}
            render={({ field }) => (
              <Select.Root
                value={field.value || "unassigned"}
                onValueChange={field.onChange}
              >
                <Select.Trigger
                  className="w-full"
                  placeholder="Assign user..."
                />
                <Select.Content className="bg-neutral-500 dark:bg-neutral-900">
                  <Select.Group>
                    <Select.Label>Suggestions</Select.Label>
                    <Select.Item value="unassigned">Unassigned</Select.Item>
                    <Select.Separator />
                    {users.map(({ id, name }) => (
                      <Select.Item key={id} value={id}>
                        {name}
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            )}
          />
        )}

        <Box className="relative z-0 min-h-0">
          <Controller
            name="description"
            control={control}
            defaultValue={defaultDescription}
            render={({ field: { onChange, value } }) => (
              <SimpleMDE
                value={value}
                onChange={onChange}
                options={simpleMdeOptions}
                placeholder="Description"
              />
            )}
          />
        </Box>

        <Flex justify="end">
          <Button
            disabled={isSubmitting || !!errors.title || !!errors.description}
            type="submit"
            variant="soft"
            className="w-full"
            size="3"
          >
            {isSubmitting ? (
              <Spinner />
            ) : (
              <>
                <MdOutlineRocketLaunch />
                {issue ? "Update Issue" : "Submit Issue"}
              </>
            )}
          </Button>
        </Flex>
      </form>
    </>
  );
};
