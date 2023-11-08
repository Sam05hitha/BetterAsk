"use client";

import React from "react";
import style from "./space.module.scss";
import Image from "next/image";
import { ChatInput, Message, SpaceHeading } from "../_components";

export default function page({ params }: { params: { spaceId: string } }) {
  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    //TODO : set change state
  }

  function handleOnSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    //TODO: submit message
    alert();
  }

  return (
    <section
      className={`${style.space_page_container} bg-secondary-100 font-geo`}
    >
      <SpaceHeading title="Human Resources" link="/" />
      <div className={style.space_messages_container}>
        <Message isUser={true} />
      </div>
      <ChatInput
        handleOnChange={handleOnChange}
        handleOnSubmit={handleOnSubmit}
      />
    </section>
  );
}
