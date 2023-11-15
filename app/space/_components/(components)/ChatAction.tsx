"use client";

import React from "react";
import style from "../_styles/chatAction.module.scss";
import { Recent, TopSpaces } from "..";
import { useRouter } from "next/navigation";
import { ActionButtons } from "@/app/_components";

export default function ChatAction() {
  const router = useRouter();

  function handleGoBack() {
    router.back();
  }

  function handleCreateSpace() {
    // TODO create new chat channel
    router.push("/space/new_chat_model");
  }

  return (
    <div
      className={`${style.chatAction_container} ${style.no_navbar} bg-secondary-100`}
    >
      <ActionButtons
        spaces
        custom={["w-[100%]", "w-[50px] h-[50px] flex-shrink-0"]}
        handleCreateSpace={handleCreateSpace}
        handleGoBack={handleGoBack}
      />
      <Recent />
      <TopSpaces />
    </div>
  );
}
