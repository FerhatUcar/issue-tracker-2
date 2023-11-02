import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Returns data to the client side, that is called with the useQuery hook
 * @param path the name of the endpoint
 */
export const useDataQuery = <T>(path: string) =>
  useQuery<T[]>({
    queryKey: [path],
    queryFn: () => axios.get(`/api/${path}`).then((res) => res.data),
    staleTime: 60 * 1000, //60s
    retry: 3,
  });
