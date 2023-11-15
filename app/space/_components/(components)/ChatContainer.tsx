import React from "react";
import { Message } from "..";
import style from "../../[spaceId]/space.module.scss";

type TData = { text: string; time: string };

interface IChatContainer {
  data: TData[];
}

export default function ChatContainer({ data }: IChatContainer) {
  return (
    <section
      className={`${style.space_page_container}`}
    >
      {data.map((item, index) => (
        <Message key={index} data={item} isUser={true} />
      ))}
    </section>
  );
}
