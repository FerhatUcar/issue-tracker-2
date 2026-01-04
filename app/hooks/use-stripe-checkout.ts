import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type StripeRedirectResponse = {
  url: string;
};

export const useStripeCheckout = () => {
  return useMutation({
    mutationFn: async (): Promise<StripeRedirectResponse> => {
      const { data } = await axios.post<StripeRedirectResponse>(
        "/api/stripe/checkout",
      );
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
