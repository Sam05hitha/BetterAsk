"use client";

import React, { useRef, useEffect } from "react";
import { Message } from "..";
import style from "../../[spaceId]/space.module.scss";
import { TConversation } from "@/app/_utils/types";
import { handleScrollIntoView, scrollToBottom } from "@/app/_utils/methods";

interface IChatContainer {
  data: TConversation[];
}

export default function ChatContainer({ data }: IChatContainer) {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // scrollToBottom(chatContainerRef);
    handleScrollIntoView(answerRef);
  }, [data]);

  return (
    <section ref={chatContainerRef} className={`${style.space_page_container}`}>
      {Array.isArray(data) ? (
        data?.map((item: any, index: any) => (
          <div key={index} className={style.space_page_chat_q_and_a}>
            <Message data={item} isUser={true} />
            <Message
              answerRef={index === data.length - 1 ? answerRef : null}
              isPending={item?.isPending}
              data={item}
              isUser={false}
            />
          </div>
        ))
      ) : (
        <></>
      )}
    </section>
  );
}
