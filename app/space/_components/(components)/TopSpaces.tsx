import React from "react";
import style from "../_styles/chatAction.module.scss";
import { ChatActionTabs } from "..";
// import { ChatTabItem } from "./ChatActionTabs";

export default function TopSpaces() {
  return (
    <div className={style.chatAction_top_spaces}>
      <ChatActionTabs title="">
        {/* <ChatTabItem href="/" title="how to chat" />
        <ChatTabItem href="/" title="how to chat" />
        <ChatTabItem href="/" title="how to chat" /> */}
      </ChatActionTabs>
    </div>
  );
}
