"use client";

import React, { useState } from "react";
import style from "../_styles/chatActionTabs.module.scss";
import Link from "next/link";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { usePathname } from "next/navigation";
import { extractIdFromPath } from "@/app/_utils/methods";

interface ChatHeaderTypes {
  title: string;
  children: React.ReactNode;
}

interface RecentItemsType {
  href: string;
  title: string;
}

export function ChatTabItem({ href, title }: RecentItemsType) {
  const pathname = usePathname();

  const isActivePath = extractIdFromPath(pathname) === extractIdFromPath(href);
  return (
    <Link
      className={`${style.chatTabItem_item} ${
        isActivePath ? "bg-secondary-200" : "bg-white"
      } font-geo`}
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
