"use client";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Issue } from "@prisma/client";
import { Button, Callout, Flex, TextField } from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { issueSchema } from "@/app/validationSchema";

type IssueFormData = z.infer<typeof issueSchema>;

const IssueForm = ({ issue }: { issue?: Issue }) => {
  const router = useRouter();
  const {
    register,
    // control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
  });
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);

      if (issue) {
        await axios.patch("/api/issues/" + issue.id, data);
      } else {
        await axios.post("/api/issues", data);
      }

      router.push("/issues/list");
      router.refresh();
    } catch (error) {
      setSubmitting(false);
      setError("An unexpected error occurred.");
    }
  });

  return (
    <div className="max-w-xl">
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
        {/*<Controller*/}
        {/*  name="description"*/}
        {/*  control={control}*/}
        {/*  defaultValue={issue?.description}*/}
        {/*  render={({ field }) => {*/}
        {/*    console.log(field.value);*/}
        {/*    return (*/}
        {/*      <SimpleMDE*/}
        {/*        options={{*/}
        {/*          hideIcons: ["fullscreen", "side-by-side", "preview", "guide"],*/}
        {/*        }}*/}
        {/*        placeholder="Description"*/}
        {/*        {...field}*/}
        {/*      />*/}
        {/*    );*/}
        {/*  }}*/}
        {/*/>*/}
        <TextField.Root>
          <Flex align="center">
            <span className="pl-3">Description</span>
            <TextField.Input
              defaultValue={issue?.description}
              size="3"
              placeholder="Issue details..."
              {...register("description")}
            />
          </Flex>
        </TextField.Root>
        <ErrorMessage>{errors.description?.message}</ErrorMessage>
        <Button disabled={isSubmitting}>
          {issue ? "Update Issue" : "Submit New Issue"}{" "}
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default IssueForm;
