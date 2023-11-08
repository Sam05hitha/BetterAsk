import React from "react";
import style from "../_styles/chatInput.module.scss";
import { TOnChange, TOnSubmit } from "@/app/_utils/types";
import Image from "next/image";
import SendIcon from "../../../../public/send.svg";

interface TChatInput {
  handleOnSubmit: TOnSubmit;
  handleOnChange: TOnChange;
}

export default function ChatInput({
  handleOnSubmit,
  handleOnChange,
}: TChatInput) {
  return (
    <form className={style.space_page_chat_input} onSubmit={handleOnSubmit}>
      <div>
        <input
          placeholder="Enter your message here"
          type="text"
          onChange={handleOnChange}
        />
        <button type="submit" className={style.space_send_button}>
          <Image src={SendIcon} alt="send message" />
        </button>
      </div>
    </form>
  );
}
