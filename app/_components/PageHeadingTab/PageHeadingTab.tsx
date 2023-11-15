"use client";

import React from "react";
import style from "./pageHeadingTab.module.scss";
import { ActionButtons } from "..";
import { useRouter } from "next/navigation";

interface IPageHeadingTab {
  title: string;
  spaces?: undefined | true;
}

export default function PageHeadingTab({ spaces, title }: IPageHeadingTab) {
  const router = useRouter();

  function handleGoBack() {
    router.back();
  }

  function handleCreateSpace() {
    router.push("/create_space");
  }

  return (
    <div className={`${style.pageHeading_container} bg-secondary font-geo`}>
      <h2>{title}</h2>
      <ActionButtons
        spaces={spaces}
        custom={["w-[140px]"]}
        handleCreateSpace={handleCreateSpace}
        handleGoBack={handleGoBack}
      />
    </div>
  );
}
