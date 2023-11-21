"use client";

import React, { useState, useEffect, useRef } from "react";
import style from "./feedback.module.scss";
import { sendFeedback } from "@/app/_services/commonApis";
import { getCookie } from "@/app/_utils/methods";
import TagFacesOutlinedIcon from "@mui/icons-material/TagFacesOutlined";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";

export default function Feedback() {
  const [openFeedback, setOpenFeedback] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFeedbackSent, setIsFeedbackSent] = useState<boolean>(false);

  function reset() {
    setInput("");
    setIsFeedbackSent(false);
  }
  async function handleFeedbackSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (input) {
      try {
        const session_id = getCookie();
        if (session_id) {
          await sendFeedback(session_id, input);
        }
      } catch (error) {
        throw error;
      } finally {
        setIsFeedbackSent(true);
      }
    }
  }

  function handleOnChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(event.target.value);
  }

  function handleOpenPopUp() {
    setOpenFeedback(true);
  }
  function handleOnLater() {
    setOpenFeedback(false);
    reset();
  }

  useEffect(() => {
    if (openFeedback) {
      textareaRef.current?.focus();
    }
  }, [openFeedback]);

  return (
    <>
      <div className={`${style.feedback_container} bg-white `}>
        <button onClick={handleOpenPopUp} className={style.feedback_button}>
          <FeedbackOutlinedIcon />
          <span>give us Feedback!</span>
        </button>
      </div>
      {openFeedback ? (
        <>
          <div className={style.feedback__popup_container}>
            {isFeedbackSent ? (
              <div className={style.feedback_sent}>
                <TagFacesOutlinedIcon />
                <p>Thank you for helping us improve!</p>
                <button onClick={handleOnLater}>close</button>
              </div>
            ) : (
              <form
                className={style.feedback_form_container}
                onSubmit={handleFeedbackSubmit}
              >
                <textarea
                  ref={textareaRef}
                  onChange={handleOnChange}
                  value={input}
                  cols={30}
                  rows={10}
                ></textarea>
                <div className={style.feedback_form_buttons}>
                  <button onClick={handleOnLater}>Do it later</button>
                  <button type="submit">send feedback</button>
                </div>
              </form>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
