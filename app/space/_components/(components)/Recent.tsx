import React from "react";
import style from "../_styles/chatAction.module.scss";

import { ChatActionTabs } from "..";
import { ChatTabItem } from "./ChatActionTabs";

export default function Recent() {
  return (
    <div className={style.chatAction_recent}>
      <ChatActionTabs title="Recent">
        <ChatTabItem href="/" title="how to chat" />
        <ChatTabItem href="/" title="how to chat" />
        <ChatTabItem href="/" title="how to chat" />
      </ChatActionTabs>
    </div>
  );
}
