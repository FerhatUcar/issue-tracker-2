import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type StripeRedirectResponse = {
  url: string;
};

export const useStripePortal = () => {
  return useMutation({
    mutationFn: async (): Promise<StripeRedirectResponse> => {
      const { data } =
        await axios.post<StripeRedirectResponse>("/api/stripe/portal");
      return data;
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
