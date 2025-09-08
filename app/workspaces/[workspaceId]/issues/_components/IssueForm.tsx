"use client";

import dynamic from "next/dynamic";
import { FormEventHandler, useMemo } from "react";
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
import { PatchIssueSchema, patchIssueSchema } from "@/app/validations";
import type { Options } from "easymde";
import { MdOutlineRocketLaunch } from "react-icons/md";
import { useDataQuery, useIssueMutation } from "@/app/hooks";
import { User } from "next-auth";
import IssueFormSkeleton from "@/app/workspaces/[workspaceId]/issues/_components/IssueFormSkeleton";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
  loading: () => <Skeleton className="h-20" />,
});

const simpleMdeOptions: Options = {
  hideIcons: ["fullscreen", "side-by-side", "preview", "guide"] as const,
};

type Props = {
  issue?: Partial<Issue>;
  action?: () => void;
};

export const IssueForm = ({ issue, action }: Props) => {
  const router = useRouter();
  const params = useParams();
  const {
    upsertIssue: { mutateAsync },
  } = useIssueMutation();

  // Resolve workspaceId from a route if not provided by props
  const workspaceId = Array.isArray(params?.workspaceId)
    ? params?.workspaceId[0]
    : params?.workspaceId;

  // Load users for assignee select
  const { data: users = [], isLoading: isLoadingUsers } = useDataQuery<User>(
    "users",
    workspaceId,
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PatchIssueSchema>({
    resolver: zodResolver(patchIssueSchema),
    defaultValues: {
      title: issue?.title ?? "",
      description: issue?.description ?? "",
      assignedToUserId: issue?.assignedToUserId ?? "unassigned",
    },
  });

  const defaultDescription = useMemo(
    () => issue?.description ?? "",
    [issue?.description],
  );

  const isEdit = typeof issue?.id === "number" && !Number.isNaN(issue.id);

  const onSubmit = handleSubmit(async (data) => {
    const assignedToUserId =
      data.assignedToUserId === "unassigned" ? null : data.assignedToUserId;

    // Build payload conditionally:
    // - CREATE: include workspaceId
    // - PATCH: never include workspaceId
    const payload = isEdit
      ? {
          id: issue.id,
          title: data.title,
          description: data.description,
          assignedToUserId,
        }
      : {
          title: data.title,
          description: data.description,
          assignedToUserId,
          workspaceId,
        };

    try {
      await mutateAsync(payload, {
        onSuccess: () => {
          toast.success("Issue submitted successfully!");
          if (action) {
            action();
            router.refresh();
          } else {
            router.push(`/workspaces/${workspaceId}`);
            router.refresh();
          }
        },
      });
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(`An unexpected error occurred: ${msg}`);
    }
  });

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    // Do NOT pass the event to onSubmit; RHF doesn't need it
    void onSubmit();
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

      {isLoadingUsers && <IssueFormSkeleton />}

      <form className="!space-y-4" onSubmit={handleFormSubmit}>
        <TextField.Root
          className="relative rounded-sm z-10 pointer-events-auto"
          size="3"
          placeholder="Issue title..."
          inputMode="text"
          autoComplete="off"
          {...register("title")}
        />

        {!isLoadingUsers && users.length > 0 ? (
          <Controller
            name="assignedToUserId"
            control={control}
            render={({ field }) => (
              <Select.Root
                value={(field.value as string | null) ?? "unassigned"}
                onValueChange={field.onChange}
              >
                <Select.Trigger
                  className="!w-full"
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
        ) : (
          <Skeleton />
        )}

        <Box className="relative z-0 min-h-0">
          <Controller
            name="description"
            control={control}
            defaultValue={defaultDescription}
            render={({ field: { onChange, value } }) => (
              <SimpleMDE
                value={value ?? ""}
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
                {isEdit ? "Update Issue" : "Submit Issue"}
              </>
            )}
          </Button>
        </Flex>
      </form>
    </>
  );
};
