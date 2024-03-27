import { useContext, useEffect, useState } from "react";
import { TConversation } from "../_utils/types";
import { getConversations } from "../_services/getConversation";
import { getCookie } from "../_utils/methods";
import { AppContext } from "../_context/appContext";

export default function useConversation(session_id: string | null) {
  const [data, setData] = useState<TConversation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>("");
  const { updateConversations } = useContext(AppContext);

  async function refreshConversations() {
    const sessionId = getCookie();
    if (sessionId) {
      try {
        setLoading(true);
        if (session_id) {
          const response = await getConversations(sessionId);

          setData(response.data?.conversation_chain);
          updateConversations(response.data?.conversation_chain);

          if (response) {
            setLoading(false);
          }
        }
      } catch (error) {
        setError(error);
        throw error;
      }
    } else {
      console.log("session not active");
    }
  }

  useEffect(() => {
    refreshConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session_id]);

  return {
    conversations: data,
    isLoading: loading,
    isError: error,
    refresh: refreshConversations,
  };
}
