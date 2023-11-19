import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getQueryApi = axios.create({
  baseURL,
});

export async function getQuery(sessionId: string, query: string) {
  const data = {
    session_id: sessionId,
    query,
  };
  try {
    const response = await getQueryApi.post("chat/query", data);
    return response;
  } catch (error) {
    throw error;
  }
}
