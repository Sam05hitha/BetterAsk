"use client";

import React from "react";
import style from "../_styles/chatAction.module.scss";
import { ChatActionButtons, Recent, TopSpaces } from "..";
import { useRouter } from "next/navigation";

export default function ChatAction() {
  const router = useRouter();

  function handleGoBack() {
    router.back();
  }
  function handleCreateSpace() {
    //TODO: create space form
  }

  return (
    <div className={`${style.chatAction_container} bg-secondary-100`}>
      <ChatActionButtons
        handleCreateSpace={handleCreateSpace}
        handleGoBack={handleGoBack}
      />
      <Recent />
      <TopSpaces />
    </div>
  );
}
