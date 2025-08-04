import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Returns data to the client side, that is called with the useQuery hook
 * @param path the name of the endpoint
 * @param params optional parameters to be passed to the endpoint
 */
export const useDataQuery = <T>(path: string, params?: string | number) =>
  useQuery<T[]>({
    queryKey: [path, params],
    queryFn: () =>
      axios.get<T[]>(`/api/${path}?id=${params}`).then((res) => res.data),
    staleTime: 60 * 1000,
    retry: 3,
  });
