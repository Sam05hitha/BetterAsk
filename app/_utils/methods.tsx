import cookie from "cookie";

export function setCookie() {
  const options = { maxAge: 60 * 60 * 24 * 3 };
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
    const storedUserId = cookies.better_ask_user_id || null;
    return storedUserId;
  }
  return null;
}

export function generateRandomId(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join("");
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

export function extractIdFromPath(path: string) {
  const match = path.match(/[a-zA-Z0-9]+$/);
  return match ? match[0] : null;
}
