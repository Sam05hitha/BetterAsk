import React from "react";
import style from "../_styles/chatAction.module.scss";

import { ChatActionTabs } from "..";
import { ChatTabItem } from "./ChatActionTabs";
import { getCookie } from "@/app/_utils/methods";

interface IRecent {
  conversations: any;
  clearChat: () => void;
}

export default function Recent({ clearChat, conversations }: IRecent) {
  const session_id = getCookie();
  const conversation_title = conversations?.length
    ? conversations[0]?.query
    : "";

  return (
    <div className={style.chatAction_recent}>
      <ChatActionTabs title="Recent">
        {conversation_title ? (
          <ChatTabItem
            clearChat={clearChat}
            href={`/space/${session_id}`}
            title={conversation_title}
          />
        ) : (
          <></>
        )}
      </ChatActionTabs>
    </div>
  );
}
