import cookie from "cookie";

export function setCookie() {
  const options = { maxAge: 60 * 60 * 24 * 365 };
  const userIds = generateRandomId(10);
  if (typeof document !== "undefined") {
    if (!document.cookie) {
      document.cookie = cookie.serialize(
        "better_ask_user_id",
        userIds,
        options
      );
    }
  }
}

export function getCookie() {
  if (typeof document !== "undefined") {
    const cookies = cookie.parse(document.cookie);
    const storedUserId = cookies.better_ask_user_id || "";
    return storedUserId;
  }
  return "";
}

export function generateRandomId(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join("");
}
