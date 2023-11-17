"use client";

import React, { useState } from "react";
import style from "../_styles/chatAction.module.scss";
import { Recent, TopSpaces } from "..";
import { useRouter } from "next/navigation";
import { ActionButtons } from "@/app/_components";
import Tooltip from "@/app/_components/Tooltip/Tooltip";
import useTooltip from "@/app/_hooks/useTooltip";

export default function ChatAction() {
  const router = useRouter();
  const [showCollapseButton, onshow, onHide] = useTooltip();
  const [collapse, setCollapse] = useState<boolean>(false);

  function onCollapseClick() {
    setCollapse((prev) => !prev);
  }

  function handleGoBack() {
    router.back();
  }

  function handleCreateSpace() {
    // TODO create new chat channel
    router.push("/space/new_chat_model");
  }

  return (
    <>
      <div
        className={`${style.chatAction_container} ${
          style.no_navbar
        } bg-secondary-100 ${collapse ? style.collapsed_sidebar : ""}`}
      >
        <ActionButtons
          spaces
          custom={["w-[100%]", "w-[50px] h-[50px] flex-shrink-0"]}
          handleCreateSpace={handleCreateSpace}
          handleGoBack={handleGoBack}
        />
        <Recent />
        <TopSpaces />
        <button
          onClick={onCollapseClick}
          onMouseOver={onshow}
          onMouseOut={onHide}
          className={style.collapse_sidebar}
        >
          <Tooltip show={showCollapseButton} text="hide sidebar" />
        </button>
      </div>
    </>
  );
}
