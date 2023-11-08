import React from "react";
import style from "../_styles/message.module.scss";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface IMessage {
  isUser: boolean;
}

export default function Message({ isUser }: IMessage) {
  return (
    <div className={`${style.message_container} font-geo`}>
      <div className={style.message_time}>
        <span>14:30</span>
      </div>
      <div className={style.message_body}>
        <div className={style.message_avatar}>
          <AccountCircleIcon />
        </div>
        <p className={style.message_text}>What is this document about ?</p>
      </div>
    </div>
  );
}
