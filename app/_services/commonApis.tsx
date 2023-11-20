import { CLEAR, FEED, RESP_FEED } from "../_utils/constants";
import { getQueryApi } from "./getUsers";

export async function clearChat(sessionId: string) {
  const data = {
    session_id: sessionId,
  };
  try {
    await getQueryApi.post(CLEAR, data);
  } catch (error) {
    throw error;
  }
}

export async function sendResponseFeedback(
  sessionId: string,
  conversationID: string,
  like: boolean
) {
  const data = {
    session_id: sessionId,
    conversation_id: conversationID,
    like_dislike: like,
    response_feedback: like ? "good response" : "bad response",
  };

  try {
    const response = await getQueryApi.post(RESP_FEED, data);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function sendFeedback(sessionId: string, user_feedback: string) {
  const data = {
    session_id: sessionId,
    user_feedback: user_feedback,
  };

  try {
    const response = await getQueryApi.post(FEED, data);
    return response;
  } catch (error) {
    throw error;
  }
}
