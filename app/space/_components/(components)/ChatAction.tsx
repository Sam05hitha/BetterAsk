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
    //TODO: create space form
  }

  return (
    <div className={`${style.chatAction_container} bg-secondary-100`}>
      <ActionButtons
        custom={["w-[180px] ", "w-[50px] h-[50px]"]}
        handleCreateSpace={handleCreateSpace}
        handleGoBack={handleGoBack}
      />
      <Recent />
      <TopSpaces />
    </div>
  );
}
