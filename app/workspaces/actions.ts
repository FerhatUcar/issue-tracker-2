"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/prisma/client";
import { z } from "zod";

const PromoteSchema = z.object({
  userId: z.string().min(1),
  workspaceId: z.string().min(1),
});

export const promoteToAdmin = async (formData: FormData) => {
  const parsed = PromoteSchema.safeParse({
    userId: formData.get("userId"),
    workspaceId: formData.get("workspaceId"),
  });

  if (!parsed.success) {
    throw new Error("Invalid form data for promoteToAdmin");
  }

  const { userId, workspaceId } = parsed.data;

  await prisma.membership.updateMany({
    where: { workspaceId, userId },
    data: { role: "ADMIN" },
  });

  revalidatePath(`/workspaces/${workspaceId}/members`);
};
