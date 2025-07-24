"use client";

import { useMemo } from "react";
import { z } from "zod";
import Spinner from "@/app/components/Spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Issue } from "@prisma/client";
import { Box, Card, Button, Callout, Flex, TextField } from "@radix-ui/themes";
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { issueSchema } from "@/app/validationSchema";
import SimpleMDE from "react-simplemde-editor";
import type { Options } from "easymde";
import { AiOutlineSend } from "react-icons/ai";
import { useIssueMutation } from "@/app/hooks";

const simpleMdeOptions: Options = {
  hideIcons: ["fullscreen", "side-by-side", "preview", "guide"] as const,
};

const IssueForm = ({ issue }: { issue?: Issue }) => {
  const router = useRouter();
  const { mutateAsync } = useIssueMutation();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof issueSchema>>({
    resolver: zodResolver(issueSchema),
  });

  const defaultDescription = useMemo(() => issue?.description ?? "", [issue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutateAsync({ ...data, id: issue?.id }, {
        onSuccess: () => {
          toast.success('Issue submitted successfully!');
          router.push("/issues/list");
          router.refresh();
        }
      })
    } catch (error) {
      toast.error(`An unexpected error occurred: ${error}`);
    }
  });

  return (
    <Card className="md:max-w-xl">
      {(errors.title?.message || errors.description?.message) && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{errors.title?.message || errors.description?.message}</Callout.Text>
        </Callout.Root>
      )}

      <form className="space-y-4" onSubmit={onSubmit}>
        <TextField.Root>
          <Flex align="center">
            <Box className="pl-3">Title</Box>
            <TextField.Input
              defaultValue={issue?.title}
              size="3"
              placeholder="Issue title..."
              {...register("title")}
            />
          </Flex>
        </TextField.Root>
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
          <Button disabled={isSubmitting || !!errors.title && !!errors.description} type="submit">
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
