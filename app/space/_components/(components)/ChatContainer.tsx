import React from "react";
import { Message } from "..";

type TData = { text: string; time: string };

interface IChatContainer {
  data: TData[];
}

export default function ChatContainer({ data }: IChatContainer) {
  return (
    <div>
      {data.map((item, index) => (
        <Message key={index} data={item} isUser={true} />
      ))}
    </div>
  );
}
