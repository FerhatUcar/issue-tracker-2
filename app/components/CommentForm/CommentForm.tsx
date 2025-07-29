"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useCommentMutation } from "@/app/hooks";
import { Button } from "@radix-ui/themes";

type Props = {
  issueId: number;
};

export const CommentForm = ({ issueId }: Props) => {
  const {
    createComment: { mutateAsync, isLoading },
  } = useCommentMutation();
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    await mutateAsync({
      content,
      issueId,
    }, {
      onSuccess: () => {
        setContent("");
        router.refresh();
      },
    })
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <textarea
        className="w-full p-3 text-sm border border-neutral-300 dark:border-neutral-700 rounded-md resize-none bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white"
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        disabled={isLoading}
      />
      <Button
        type="submit"
        variant="soft"
        className="text-sm font-medium px-4 py-2 rounded shadow-sm disabled:opacity-50 float-right w-full md:w-[150px]"
        disabled={isLoading || !content.trim()}
      >
        {isLoading ? "Posting..." : "Post Comment"}
      </Button>
    </form>
  );
};
