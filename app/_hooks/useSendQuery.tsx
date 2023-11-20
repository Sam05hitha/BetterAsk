import React, { useState } from "react";
import { getQuery } from "../_services/getUsers";
import { getCookie } from "../_utils/methods";

export default function useSendQuery() {
  const [response, setResponse] = useState<any>("");
  const [error, setError] = useState<any>("");
  const [loadingQuery, setLoadingQuery] = useState<boolean>(false);

  const getInputQuery = async (query: string) => {
    const sessionId = getCookie();
    if (sessionId) {
      setLoadingQuery(true);
      try {
        const data = await getQuery(sessionId, query);
        setResponse(data.data.answer);
      } catch (error) {
        setError(error);
      } finally {
        setLoadingQuery(false);
      }
    } else {
      console.log("no session id");
    }
  };
  return { response, error, getInputQuery, loadingQuery };
}
