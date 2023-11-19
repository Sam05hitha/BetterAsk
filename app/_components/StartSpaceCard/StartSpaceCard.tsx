"use client";

import React, { useState } from "react";
import style from "./start_space_card.module.scss";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { ChatInput } from "@/app/space/_components";
import { useRouter } from "next/navigation";

const slides = [
  {
    id: 0,
    isLast: true,
    p1: "The Prevention of Sexual Harassment (POSH) Act in India is in place to create a safer and more supportive environment for everyone at the workplace. If you have any questions or if there's anything specific you'd like to know , please feel free to ask.",
    p2: "",
    title: "Welcome to BetterAsk - POSH",
  },
  {
    id: 1,
    isInput: true,
    p1: "Your feelings and inquiries are valid, and it's important to ensure that everyone feels secure and respected. If you or someone you know is dealing with a situation related to this, there are mechanisms in place for support and resolution.",
    p2: "Remember that you are not alone, and seeking information is a positive step toward understanding and empowerment.",
    title: "",
  },
];

interface ISlide {
  slideId: number;
}

export default function StartSpaceCard() {
  const [slide, setSlide] = useState<ISlide>({
    slideId: 0,
  });
  const [startChatInputValue, setStartChatInputValue] = useState<string>("");
  const router = useRouter();

  function handleOnSlideStart() {
    setSlide((prev) => ({
      ...prev,
      slideId: prev.slideId + 1,
    }));
  }

  function handleOnSlideBack() {
    setSlide((prev) => ({
      ...prev,
      slideId: prev.slideId ? prev.slideId - 1 : 0,
    }));
  }

  function handleStartChatInput(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setStartChatInputValue(value);
  }
  function handleStartChatSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    router.push("/space/new_chat_model");
  }

  return (
    <div className={style.start_space_container_main}>
      <div
        key={slide?.slideId}
        className={`${style.start_space_card_items_container} ${
          style[`slide_${slide.slideId}`]
        }`}
      >
        {slides.map((item) => (
          <div key={item.id} className={style.start_space_card_item}>
            {item.title && <h2 className="font-bold">{item.title}</h2>}
            <p>{item.p1}</p>
            {item.p2 && <p className="font-medium">{item.p2}</p>}
            <div className={style.start_space_card_footer}>
              {item.isLast && (
                <button
                  className={style.start_slide_button}
                  onClick={handleOnSlideStart}
                >
                  <span className="font-medium">Start</span>
                  <ArrowForwardRoundedIcon />
                </button>
              )}
              {slide.slideId > 0 && (
                <>
                  <button
                    className={style.back_slide_button}
                    onClick={handleOnSlideBack}
                  >
                    <KeyboardBackspaceRoundedIcon />
                    <span className="font-medium">Back</span>
                  </button>
                  <ChatInput
                    placeHolder="Ask me anything about posh"
                    handleOnChange={handleStartChatInput}
                    handleOnSubmit={handleStartChatSubmit}
                    value={startChatInputValue}
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
