"use client";

import React, { useState } from "react";
import style from "../_styles/chatActionTabs.module.scss";
import Link from "next/link";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

interface ChatHeaderTypes {
  title: string;
  children: React.ReactNode;
}

interface RecentItemsType {
  href: string;
  title: string;
}

export function ChatTabItem({ href, title }: RecentItemsType) {
  return (
    <Link
      className={`${style.chatTabItem_item} bg-secondary-200 font-geo`}
      href={href}
    >
      <ChatBubbleOutlineOutlinedIcon className={style.chatTabItem_item_icon} />
      <span>{title}</span>
    </Link>
  );
}

export default function ChatActionTabs({ title, children }: ChatHeaderTypes) {
  const [open, setOpen] = useState<boolean>(true);

  function handleOnTitleExpanded() {
    setOpen((prevState) => !prevState);
  }

  return (
    <>
      <button
        onClick={handleOnTitleExpanded}
        className={`${style.chatActionTabs_button} font-geo`}
      >
        {title}
      </button>
      {open && <div>{children}</div>}
    </>
  );
}
