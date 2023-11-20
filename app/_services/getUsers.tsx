import axios from "axios";
import { CHAT } from "../_utils/constants";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getQueryApi = axios.create({
  baseURL,
});

export async function getQuery(sessionId: string, query: string) {
  const data = {
    session_id: sessionId,
    query,
  };
  try {
    const response = await getQueryApi.post(CHAT, data);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function processDocuments() {
  try {
    await getQueryApi.post("process-documents");
  } catch (error) {
    throw error;
  }
}
