import { useMutation } from "@tanstack/react-query";

type SendPushPayload = {
  token: string;
  title: string;
  body: string;
  url?: string;
};

type PushNotificationResponse = {
  name?: string;
  error?: string;
  status?: number;
};

export const usePushNotificationMutation = () =>
  useMutation<PushNotificationResponse, Error, SendPushPayload>({
    mutationFn: async (data: SendPushPayload) => {
      const res = await fetch("/api/send-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = (await res.json()) as PushNotificationResponse;

      console.log("📬 Push API response:", json);

      if (!res.ok) {
        const error = (await res.json().catch(() => ({
          error: "Failed to parse error response",
          status: res.status,
        }))) as PushNotificationResponse;

        throw new Error(error?.error || "Push notification failed");
      }

      console.log("✅ Mutate push success hook called", data);

      return json;
    },
  });
