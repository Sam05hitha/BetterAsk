import { useEffect, useRef, useState } from "react";
import { TConversation } from "../utils/types";
import { getConversations } from "../services/query/queryServices";
import {
  UseQueryResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  handleScrollIntoView,
  newPendingMessage,
  sessionProvider,
} from "../utils/methods";

export default function useConversation() {
  const session = sessionProvider.getSession();
  const session_id = session?.session_id;
  const [data, setData] = useState<TConversation[]>([]);
  const queryClient = useQueryClient();
  const messageRef = useRef<HTMLDivElement | null>(null);

  const { data: conversations, isLoading: fetching }: UseQueryResult<any> =
    useQuery({
      queryKey: ["allApiTokens", session_id],
      queryFn: () => getConversations(),
    });

  useEffect(() => {
    if (conversations) {
      setData(conversations?.conversation_chain ?? []);
      handleScrollIntoView(messageRef);
    }
  }, [conversations]);

  function refetch() {
    queryClient.invalidateQueries({
      queryKey: ["allApiTokens", session_id],
      refetchType: "all",
    });
  }

  function handleOnUserQueryProcessing(input: string) {
    setData((prevData) => [
      ...prevData,
      {
        ...newPendingMessage(input),
      },
    ]);
  }

  return {
    conversations: data,
    fetching,
    refetch,
    mutateData: handleOnUserQueryProcessing,
    messageRef,
  };
}
