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
    createComment: { mutate, isPending },
  } = useCommentMutation();
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    mutate(
      {
        content,
        issueId,
      },
      {
        onSuccess: () => {
          setContent("");
          router.refresh();
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <textarea
        className="w-full p-3 text-sm rounded-md resize-none bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white"
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        disabled={isPending}
      />
      <Button
        type="submit"
        variant="soft"
        className="text-sm font-medium px-4 py-2 rounded shadow-sm disabled:opacity-50 float-right w-full md:w-[150px]"
        disabled={isPending || !content.trim()}
      >
        {isPending ? "Posting..." : "Post Comment"}
      </Button>
    </form>
  );
};
