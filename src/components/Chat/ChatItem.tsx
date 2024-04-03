import { useState } from "react";
import style from "./chat.module.scss";
import Markdown from "react-markdown";
import ThumbDownRoundedIcon from "@mui/icons-material/ThumbDownRounded";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import loadingIcon from "../../assets/loading-dots.gif";

import { formatTimestampTo24Hour } from "../../utils/methods";
import { Tooltip } from "@mui/material";
import useFeatures from "../../hooks/useFeatures";
import AlertBar from "../AlertBar/AlertBar";
import CancelRemark from "./CancelRemark";

export type TConversation = {
  isPending?: boolean;
  query: string;
  answer: string;
  converstaion_id: string | number;
  timestamp: string;
  user_id: number;
};

interface IMessage {
  isUser: boolean;
  data: TConversation;
  isPending?: boolean;
  messageRef?: React.RefObject<HTMLDivElement> | null;
}

export default function ChatItem(props: IMessage) {
  const { isPending, isUser, data, messageRef } = props;
  const time = formatTimestampTo24Hour(data?.timestamp);
  const { feedback, alert } = useFeatures({ onSettled });
  const answer = data.answer
    ? data.answer
    : "Oops!, This resulted in Error, Please retry.";

  const [copied, setCopied] = useState<boolean>(false);

  function handleCopyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
  }

  function onSettled() {}
  function handleRemark() {
    alert.onOpen();
    alert.onConfig({
      severity: "info",
      title: "Let us know what could be improved",
      isPrompt: true,
      disableAutoClose: true,
    });
  }

  function handleOnRemarkSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const remark = formData.get("remark") as string;
    feedback({
      conversation_id: String(data.converstaion_id),
      like_dislike: false,
      response_feedback: remark ?? "Disliked the Response",
    });
    alert.onClose();
  }

  function handleLikeRemark() {
    feedback({
      conversation_id: String(data.converstaion_id),
      like_dislike: true,
      response_feedback: "Liked the Response",
    });
  }

  return (
    <>
      <div
        ref={messageRef}
        className={`${style.message_container} ${
          isUser ? style.message_container_isUser : ""
        }`}
      >
        <div className={style.message_time}>
          {!isUser && <div>TaxlabAi</div>}
          {data.timestamp && <span>{time}</span>}
        </div>
        <div className={style.message_body}>
          {isUser ? (
            <p className={style.message_text}>{data.query}</p>
          ) : (
            <>
              {isPending ? (
                <div className={style.message_isGenerating}>
                  <img src={loadingIcon} alt="/" role="presentation" />
                </div>
              ) : (
                <div className={style.message_text}>
                  <Markdown>{answer}</Markdown>
                </div>
              )}
            </>
          )}
        </div>
        {!isUser && !isPending && (
          <div className={style.message_footer}>
            <Tooltip title="Copy Response">
              <button onClick={() => handleCopyToClipboard(answer)}>
                {copied ? <FileCopyIcon /> : <FileCopyOutlinedIcon />}
              </button>
            </Tooltip>
            <Tooltip title="Like the Response">
              <button onClick={handleLikeRemark}>
                <ThumbUpIcon />
              </button>
            </Tooltip>
            <Tooltip title="Provide feedback">
              <button onClick={handleRemark}>
                <ThumbDownRoundedIcon />
              </button>
            </Tooltip>
          </div>
        )}
      </div>
      <AlertBar
        open={alert.open}
        onClose={alert.onClose}
        config={alert.config}
        renderCustom={
          <CancelRemark handleOnRemarkSubmit={handleOnRemarkSubmit} />
        }
      />
    </>
  );
}
