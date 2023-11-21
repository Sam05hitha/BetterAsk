import React from "react";
import style from "../_styles/chatInput.module.scss";
import { TOnChange, TOnSubmit } from "@/app/_utils/types";
import Image from "next/image";
import SendIcon from "../../../../public/send.svg";
import PendingRoundedIcon from "@mui/icons-material/PendingRounded";

interface TChatInput {
  handleOnSubmit: TOnSubmit;
  handleOnChange: TOnChange;
  value: string;
  placeHolder?: string;
  loading?: boolean;
}

export default function ChatInput({
  handleOnSubmit,
  handleOnChange,
  value,
  placeHolder,
  loading,
}: TChatInput) {
  return (
    <form
      className={`${style.space_page_chat_input} bg-secondary-100`}
      onSubmit={handleOnSubmit}
    >
      <div>
        <input
          value={value}
          placeholder={placeHolder || "Enter your message here"}
          type="text"
          onChange={handleOnChange}
        />
        {!loading ? (
          <button
            disabled={!value ? true : false}
            type="submit"
            className={
              value ? style.space_send_button : style.space_send_button_disabled
            }
          >
            <div className="flex justify-center items-center">
              <Image objectFit="cover" src={SendIcon} alt="send message" />
            </div>
          </button>
        ) : (
          <button
            className={`${style.space_send_button} ${style.space_send_button_pulse}`}
          >
            <div className="flex justify-center items-center">
              <PendingRoundedIcon style={{ width: "30px" }} />
            </div>
          </button>
        )}
      </div>
    </form>
  );
}