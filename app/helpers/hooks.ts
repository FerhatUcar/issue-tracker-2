import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useDataQuery = <T>(path: string) =>
  useQuery<T[]>({
    queryKey: [path],
    queryFn: () => axios.get(`/api/${path}`).then((res) => res.data),
    staleTime: 60 * 1000, //60s
    retry: 3,
  });
