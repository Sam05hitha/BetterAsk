"use client";

import React, { useState } from "react";
import style from "../[spaceId]/space.module.scss";
import { ChatContainer, ChatInput, SpaceHeading } from "../_components";


interface INewChatModel {
  searchParams: { chatStartInput: string | undefined | null };
}

const data: any = [];

export default function NewChatModel({ searchParams }: INewChatModel) {
  const [currentMessage, setCurrentMassage] = useState<string>("");

  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;
    setCurrentMassage(value ? value : "");
  }

  function handleOnSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCurrentMassage("");
    //TODO: submit message
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
