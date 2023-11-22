"use client";

import React, { useContext, useState } from "react";
import style from "../_styles/chatAction.module.scss";
import { Recent, TopSpaces } from "..";
import { useRouter } from "next/navigation";
import { ActionButtons, Feedback, ToolTip } from "@/app/_components";
import useTooltip from "@/app/_hooks/useTooltip";
import SignalCellularAlt1BarRoundedIcon from "@mui/icons-material/SignalCellularAlt1BarRounded";
import { getCookie } from "@/app/_utils/methods";
import { clearChat } from "@/app/_services/commonApis";
import { AppContext } from "@/app/_context/appContext";

export default function ChatAction() {
  const router = useRouter();
  const {
    appState: { conversations },
  } = useContext(AppContext);

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

  async function handleClearChat() {
    const session_id = getCookie();
    if (session_id) {
      try {
        await clearChat(session_id);
      } catch (error) {
        throw error;
      }
    }
  }

  return (
    <>
      <div
        className={`${style.chatAction_container} ${
          style.no_navbar
        } bg-secondary-100 ${collapse ? style.collapsed_sidebar : ""} ${
          showCollapseButton ? style.chatAction_container_hide_hovered : ""
        }`}
      >
        <h1 className="mb-[10px] font-geo font-extrabold text-3xl">
          BetterAsk
        </h1>
        {/* <ActionButtons
          spaces
          custom={["w-[100%]", "w-[50px] h-[50px] flex-shrink-0"]}
          handleCreateSpace={handleCreateSpace}
          handleGoBack={handleGoBack}
        /> */}
        <Recent clearChat={handleClearChat} conversations={conversations} />
        <TopSpaces />
        <Feedback />
        <button
          onClick={onCollapseClick}
          onMouseOver={onshow}
          onMouseOut={onHide}
          className={style.collapse_sidebar_button}
        >
          <svg
            className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 20 20"
            data-testid="SignalCellularAlt1BarRoundedIcon"
          >
            <path d="M6.5 20c-.83 0-1.5-.67-1.5-1.5v-17c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v17c0 .83-.67 1.5-1.5 1.5z"></path>
          </svg>

          <ToolTip
            show={showCollapseButton}
            text={collapse ? "show sidebar" : "hide sidebar"}
          />
        </button>
      </div>
    </>
  );
}
