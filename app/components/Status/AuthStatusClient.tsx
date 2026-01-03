"use client";

import { useSession } from "next-auth/react";
import { AuthStatus } from "@/app/components";

type Props = {
  userId: string;
  count: number;
};

export const AuthStatusClient = ({ userId, count }: Props) => {
  const { status } = useSession();

  if (status === "loading") {
    return null;
  }

  return <AuthStatus userId={userId} count={count} />;
};
