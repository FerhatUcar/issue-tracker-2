"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Issue } from "@prisma/client";
import { Card, Button, Callout, Flex, TextField } from "@radix-ui/themes";
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { issueSchema } from "@/app/validationSchema";
import SimpleMDE from "react-simplemde-editor";
import type { Options } from "easymde";
import { AiOutlineSend } from "react-icons/ai";
import { useIssueMutation } from "@/app/hooks";

type IssueFormData = z.infer<typeof issueSchema>;

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
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultDescription = useMemo(() => issue?.description ?? "", [issue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);

      await mutateAsync({ ...data, id: issue?.id }, {
        onSuccess: () => {
          toast.success('Issue submitted successfully!');
          setIsSubmitting(false);
          router.push("/issues/list");
          router.refresh();
        }
      })

    } catch (error) {
      setError(`An unexpected error occurred: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Card className="md:max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className="space-y-2" onSubmit={onSubmit}>
        <ErrorMessage>{errors.title?.message}</ErrorMessage>
        <TextField.Root>
          <Flex align="center">
            <span className="pl-3">Title</span>
            <TextField.Input
              defaultValue={issue?.title}
              size="3"
              placeholder="Issue title..."
              {...register("title")}
            />
          </Flex>
        </TextField.Root>
        <ErrorMessage>{errors.description?.message}</ErrorMessage>
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
          <Button disabled={isSubmitting}>
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
