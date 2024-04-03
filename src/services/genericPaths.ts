function authPaths() {
  const base = "/auth";

  return {
    base,
    signup: `${base}/signup`,
    forgot: `${base}/forgot-password`,
    verify: `${base}/verify-otp`,
    login: `${base}/login`,
    reset: `${base}/reset-password`,
    logout: `${base}/logout`,
    googleSso: `/authsso/login?accessToken=`,
    me: `${base}/me`,
    changePassword: `/user/change-password`,
  };
}

export const AUTH = authPaths();

export const CONVERSATIONS = "get-conversation-history";
export const CHAT = "chat";
export const CLEAR = "clear-chat";
export const RESP_FEED = "response-feedback";
export const FEED = "feedback";
