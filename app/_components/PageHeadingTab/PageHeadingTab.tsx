"use client";

import React from "react";
import style from "./pageHeadingTab.module.scss";
import { ActionButtons } from "..";

interface IPageHeadingTab {
  title: string;
}

export default function PageHeadingTab({ title }: IPageHeadingTab) {
  return (
    <div className={`${style.pageHeading_container} bg-secondary font-geo`}>
      <h2>{title}</h2>
      <ActionButtons
        custom={["w-[140px]"]}
        handleCreateSpace={() => {}}
        handleGoBack={() => {}}
      />
    </div>
  );
}
