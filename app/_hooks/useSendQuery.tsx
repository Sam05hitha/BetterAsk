import React, { useState } from "react";
import { getQuery } from "../services/getUsers";
import { getCookie } from "../_utils/methods";

export default function useSendQuery() {
  const [response, setResponse] = useState<any>("");
  const [error, setError] = useState<any>("");
  const sessionId = getCookie();

  const getInputQuery = async (query: string) => {
    if (sessionId) {
      try {
        const data = await getQuery(sessionId, query);
        setResponse(data);
      } catch (error) {
        setError(error);
      }
    }
  };
  return { response, error, getInputQuery };
}
