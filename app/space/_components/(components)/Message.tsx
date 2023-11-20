import React from "react";
import style from "../_styles/message.module.scss";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { formatTimestampTo24Hour } from "@/app/_utils/methods";
import { TConversation } from "@/app/_utils/types";

interface IMessage {
  isUser: boolean;
  data: TConversation;
}

export default function Message({ isUser, data }: IMessage) {
  const time = formatTimestampTo24Hour(data?.timestamp);
  const answer = data.answer ? data.answer : "Please retry";

  return (
    <div
      className={`${style.message_container} font-geo ${
        isUser ? style.message_container_isUser : ""
      }`}
    >
      <div className={style.message_time}>
        <span>{time}</span>
      </div>
      <div className={style.message_body}>
        <div
          className={`${style.message_avatar} ${
            isUser ? style.message_avatar_isUser : ""
          }`}
        >
          {isUser ? <AccountCircleIcon /> : "Better Ask"}{" "}
        </div>
        <p className={style.message_text}>{isUser ? data.query : answer}</p>
      </div>
    </div>
  );
}
