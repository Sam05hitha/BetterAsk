"use client";

import React, { useState } from "react";
import style from "../[spaceId]/space.module.scss";
import { ChatContainer, ChatInput, SpaceHeading } from "../_components";

const data: any = [];

export default function page({ params }: { params: { spaceId: string } }) {
  const [currentMessage, setCurrentMassage] = useState<string>("");

  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    //TODO : set change state
  }

  function handleOnSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = event.currentTarget.value?.trim();
    //TODO: submit message
    setCurrentMassage(value ? value : "");
  }

  return (
    <div
      className={`${style.space_page_outer_container} ${style.no_navbar} bg-secondary-100`}
    >
      {/* <SpaceHeading title="Human Resources" link="/" /> */}
      <ChatContainer data={data} />
      <div className="relative">
        <ChatInput
          value={currentMessage}
          handleOnChange={handleOnChange}
          handleOnSubmit={handleOnSubmit}
        />
      </div>
    </div>
  );
}
