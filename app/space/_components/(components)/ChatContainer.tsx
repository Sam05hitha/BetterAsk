"use client";

import React, { useRef, useEffect } from "react";
import { Message } from "..";
import style from "../../[spaceId]/space.module.scss";
import { TConversation } from "@/app/_utils/types";

interface IChatContainer {
  data: TConversation[];
}

export default function ChatContainer({ data }: IChatContainer) {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    };

    scrollToBottom();
  }, [data]);

  return (
    <section ref={chatContainerRef} className={`${style.space_page_container}`}>
      {Array.isArray(data)  ? (
        data?.map((item: any, index: any) => (
          <div key={index} className={style.space_page_chat_q_and_a}>
            <Message data={item} isUser={true} />
            <Message data={item} isUser={false} />
          </div>
        ))
      ) : (
        <></>
      )}
    </section>
  );
}
