import { getQuery } from "../services/query/queryServices";
import { useMutation } from "@tanstack/react-query";

export default function useSendQuery({
  onSettled,
  onError,
}: {
  onSettled?: (data: any) => void;
  onError?: (data: any) => void;
}) {
  const { status: queryStatus, mutateAsync: queryMutate } = useMutation({
    mutationFn: (params: { query: string }) => getQuery(params.query),
    onSuccess(data, _variables, _context) {
      onSettled?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return { queryStatus, queryMutate };
}
