import { localStorageProvider } from "../../utils/methods";
import { CHAT, CONVERSATIONS, RESP_FEED } from "../genericPaths";
import { postAPI } from "../genericRequests";

export async function getQuery(query: string) {
  const local = localStorageProvider.getStorage();

  const data = {
    session_id: local?.session_id ?? "1",
    query,
  };
  try {
    const response = await postAPI(CHAT, data);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function processDocuments() {
  try {
    await postAPI("process-documents", {});
  } catch (error) {
    throw error;
  }
}

export async function getConversations() {
  const local = localStorageProvider.getStorage();

  const data = {
    session_id: local?.session_id ?? "1",
  };
  try {
    const response = await postAPI(CONVERSATIONS, data);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function sendResponseFeedback(
  conversationID: string,
  like: boolean,
  remark: string
) {
  const local = localStorageProvider.getStorage();
  const data = {
    session_id: local?.session_id ?? "1",
    conversation_id: conversationID,
    like_dislike: like,
    response_feedback: remark ?? "",
  };

  try {
    const response = await postAPI(RESP_FEED, data);
    return response;
  } catch (error) {
    throw error;
  }
}
