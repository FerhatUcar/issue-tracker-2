"use client";

import { useState } from "react";
import { Button } from "@radix-ui/themes";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

export const DeleteAccount = () => {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);

    try {
      const res = await fetch("/api/account/delete", { method: "POST" });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      await signOut({ callbackUrl: "/" });
    } catch {
      toast.error("Failed to delete account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="soft"
      color="red"
      onClick={handleDelete}
      disabled={loading}
      title="Delete account and personal data"
    >
      {loading ? "Deleting…" : "Delete account"}
    </Button>
  );
};
