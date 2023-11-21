"use client";

import React, { useState } from "react";
import style from "../_styles/message.module.scss";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { formatTimestampTo24Hour, getCookie } from "@/app/_utils/methods";
import { TConversation } from "@/app/_utils/types";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { sendResponseFeedback } from "@/app/_services/commonApis";
import Image from "next/image";
import loadingIcon from "../../../../public/loading-dots.gif";

interface IMessage {
  isUser: boolean;
  data: TConversation;
  isPending?: boolean;
}

export default function Message({ isPending, isUser, data }: IMessage) {
  const time = formatTimestampTo24Hour(data?.timestamp);
  const answer = data.answer ? data.answer : "Please retry";
  const [copied, setCopied] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);

  async function handleLike() {
    if (!liked) {
      try {
        const session_id = getCookie();
        if (session_id) {
          await sendResponseFeedback(
            session_id,
            String(data.converstaion_id),
            true
          );
        }
      } catch (error) {
        throw error;
      }
    }
    setLiked(true);
  }
  function handleCopyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
  }

  return (
    <div
      className={`${style.message_container} font-geo ${
        isUser ? style.message_container_isUser : ""
      }`}
    >
      <div className={style.message_time}>
        {!isPending && <span>{time}</span>}
      </div>
      <div className={style.message_body}>
        <div
          className={`${style.message_avatar} ${
            isUser ? style.message_avatar_isUser : ""
          }`}
        >
          {isUser ? <AccountCircleIcon /> : "Better Ask"}{" "}
        </div>
        {isUser ? (
          <p className={style.message_text}>{data.query}</p>
        ) : (
          <>
            {isPending ? (
              <div className={style.message_isGenerating}>
                <Image src={loadingIcon} alt="" width={40} height={40} />
              </div>
            ) : (
              <p className={style.message_text}>{answer}</p>
            )}
          </>
        )}
      </div>
      {!isUser && !isPending && (
        <div className={style.message_footer}>
          <button onClick={() => handleCopyToClipboard(answer)}>
            {copied ? <FileCopyIcon /> : <FileCopyOutlinedIcon />}
          </button>
          <button onClick={handleLike}>
            {liked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
          </button>
        </div>
      )}
    </div>
  );
}
