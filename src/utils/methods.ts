import { RefObject } from "react";
import { COOKIE_KEY, LOCAL_KEY, SESSION_KEY } from "./constants";
import Cookies from "js-cookie";

interface ILocalStorageProvider {
  removeStorage(): void;
  getStorage(): ILocalStorage | null;
  save(session: any): void;
}

export interface ILocalStorage {
  session_id: string;
}

interface ISessionProvider {
  removeSession(): void;
  getSession(): any;
  saveSession(session: any): void;
}

interface ICookiesProvider {
  getCookie: () => string | undefined;
  setCookie: (token: string) => void;
  removeCookie: () => void;
}

export const localStorageProvider: ILocalStorageProvider = {
  save(data: Record<string, any>): void {
    try {
      const prevData = localStorageProvider.getStorage() || {};
      localStorage.setItem(LOCAL_KEY, JSON.stringify({ ...prevData, ...data }));
    } catch (error) {
      console.error("Error setting value in local storage:", error);
    }
  },

  getStorage(): ILocalStorage | null {
    try {
      const storedValue = localStorage.getItem(LOCAL_KEY);
      return storedValue ? JSON.parse(storedValue) : null;
    } catch (error) {
      console.error("Error getting value from local storage:", error);
      return null;
    }
  },
  removeStorage() {
    localStorage.clear();
  },
};

export const sessionProvider: ISessionProvider = {
  removeSession() {
    sessionStorage.removeItem(SESSION_KEY);
  },
  getSession() {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "{}");
  },
  saveSession(session: any) {
    try {
      const existingSessionData = sessionProvider.getSession();
      const mergedSessionData = { ...existingSessionData, ...session };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(mergedSessionData));
    } catch (error) {
      console.error("Error saving session data:", error);
    }
  },
};

export const CookiesProvider: ICookiesProvider = {
  getCookie() {
    return Cookies.get(COOKIE_KEY);
  },
  setCookie(token: string) {
    Cookies.set(COOKIE_KEY, token, {
      secure: true,
      httpOnly: true,
      sameSite: "Strict",
    });
  },
  removeCookie() {
    Cookies.remove(COOKIE_KEY);
  },
};

export function generateRandomId(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join("");
}

export function newPendingMessage(currentMessage: string) {
  return {
    isPending: true,
    query: currentMessage,
    answer: "",
    converstaion_id: "",
    timestamp: "",
    user_id: 0,
  };
}

export function formatTimestampTo24Hour(timestamp: string) {
  const dateObject = new Date(timestamp);

  const formattedTime = dateObject.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  return formattedTime;
}

export function formatMessage(text: string) {
  if (!text) return;
  const formattedText = text
    .replace(/(?<!^)\n(?=\n)/g, "")
    .replace(/(?<!^)\n/g, "<br />");

  let outputString = formattedText.replace(/(\d+\..*?:)/g, function (match) {
    return "<b>" + match + "</b>";
  });

  // Add additional formatting for human readability
  outputString = outputString.replace(/\.\s+/g, ".<br/>");

  return { __html: outputString };
}

export const handleScrollIntoView = (ref: RefObject<HTMLDivElement>) => {
  if (ref.current) {
    ref.current.scrollIntoView({ behavior: "smooth" });
  }
};
