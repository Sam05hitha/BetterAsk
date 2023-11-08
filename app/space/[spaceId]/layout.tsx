import React from "react";
import style from "./space.module.scss";

import { ChatAction } from "../_components";

export default function SpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className={style.space_main_container}>
      <ChatAction />
      {children}
    </section>
  );
}
