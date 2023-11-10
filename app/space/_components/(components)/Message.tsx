import React from "react";
import style from "../_styles/message.module.scss";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface IMessage {
  isUser: boolean;
  data: { text: string; time: string };
}

export default function Message({ isUser, data }: IMessage) {
  return (
    <div className={`${style.message_container} font-geo`}>
      <div className={style.message_time}>
        <span>{data.time}</span>
      </div>
      <div className={style.message_body}>
        <div className={style.message_avatar}>
          <AccountCircleIcon />
        </div>
        <p className={style.message_text}>{data.text}</p>
      </div>
    </div>
  );
}
