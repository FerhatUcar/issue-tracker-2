"use client";

import { useMemo } from "react";
import { z } from "zod";
import { Spinner } from "@/app/components";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Issue } from "@prisma/client";
import {
  Button,
  Callout,
  Card,
  Flex,
  Select,
  TextField,
} from "@radix-ui/themes";
import "easymde/dist/easymde.min.css";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { patchIssueSchema } from "@/app/validationSchema";
import SimpleMDE from "react-simplemde-editor";
import type { Options } from "easymde";
import { AiOutlineSend } from "react-icons/ai";
import { useDataQuery, useIssueMutation } from "@/app/hooks";
import { User } from "next-auth";

const simpleMdeOptions: Options = {
  hideIcons: ["fullscreen", "side-by-side", "preview", "guide"] as const,
};

type Props = {
  issue?: Issue;
};

const IssueForm = ({ issue }: Props) => {
  const router = useRouter();
  const params = useParams();
  const {
    upsertIssue: { mutateAsync },
  } = useIssueMutation();

  const workspaceId = Array.isArray(params?.workspaceId)
    ? params?.workspaceId[0]
    : params?.workspaceId;

  const { data: users, isLoading: isLoadingUsers } = useDataQuery<User>(
    "users",
    workspaceId,
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
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
      assignedToUserId,
      workspaceId,
    };

    try {
      await mutateAsync(payload, {
        onSuccess: () => {
          toast.success("Issue submitted successfully!");

          router.push(`/workspaces/${workspaceId}`);
          router.refresh();
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(`An unexpected error occurred: ${errorMessage}`);
    }
  });

  return (
    <Card className="md:max-w-xl">
      {(errors.title?.message || errors.description?.message) && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>
            {errors.title?.message || errors.description?.message}
          </Callout.Text>
        </Callout.Root>
      )}

      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form className="space-y-4" onSubmit={onSubmit}>
        <TextField.Root>
          <Flex align="center">
            <TextField.Input
              size="3"
              placeholder="Issue title..."
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
                onValueChange={(val) => field.onChange(val)}
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
                    {users?.map(({ id, name }) => (
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

        <Flex justify="end">
          <Button
            disabled={isSubmitting || (!!errors.title && !!errors.description)}
            type="submit"
            variant="soft"
          >
            <AiOutlineSend />
            {issue ? "Update Issue" : "Submit New Issue"}
            {isSubmitting && <Spinner />}
          </Button>
        </Flex>
      </form>
    </Card>
  );
};

export default IssueForm;
