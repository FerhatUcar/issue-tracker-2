import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type SubscriptionStatusResponse = {
  isPro: boolean;
}

/**
 * Returns whether the current user has an active Pro subscription.
 * Client-side only. Data is fetched from the API.
 */
export const useIsPro = () =>
  useQuery<SubscriptionStatusResponse>({
    queryKey: ["subscription-status"],
    queryFn: () =>
      axios
        .get<SubscriptionStatusResponse>("/api/stripe/status")
        .then((res) => res.data),
    staleTime: 60 * 1000,
    retry: 3,
  });