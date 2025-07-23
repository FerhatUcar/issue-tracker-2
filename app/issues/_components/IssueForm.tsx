"use client";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Issue } from "@prisma/client";
import { Box, Button, Callout, Flex, TextField } from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { issueSchema } from "@/app/validationSchema";
import SimpleMDE from "react-simplemde-editor";
import type { Options } from "easymde";

type IssueFormData = z.infer<typeof issueSchema>;

const simpleMdeOptions: Options = {
  hideIcons: ["fullscreen", "side-by-side", "preview", "guide"] as const,
};

const IssueForm = ({ issue }: { issue?: Issue }) => {
  const router = useRouter();
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

      if (issue) {
        await axios.patch("/api/issues/" + issue.id, data);
      } else {
        await axios.post("/api/issues", data);
      }

      router.push("/issues/list");
      router.refresh();
    } catch (error) {
      setIsSubmitting(false);
      setError("An unexpected error occurred.");
    }
  });

  return (
    <Box className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className="space-y-3" onSubmit={onSubmit}>
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
        <ErrorMessage>{errors.title?.message}</ErrorMessage>
        <Controller
          name="description"
          control={control}
          defaultValue={defaultDescription}
          render={({ field: { value } }) => (
            <SimpleMDE
              value={value}
              options={simpleMdeOptions}
              placeholder="Description"
            />
          )}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>
        <Button disabled={isSubmitting}>
          {issue ? "Update Issue" : "Submit New Issue"}
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </Box>
  );
};

export default IssueForm;
