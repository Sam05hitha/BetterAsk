import { CONVERSATIONS } from "../_utils/constants";
import { getQueryApi } from "./getUsers";

export async function getConversations(sessionId: string) {
  const data = {
    session_id: sessionId,
  };
  try {
    const response = await getQueryApi.post(CONVERSATIONS, data);
    return response;
  } catch (error) {
    throw error;
  }
}
