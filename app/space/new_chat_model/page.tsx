"use client";

import React from "react";
import style from "../[spaceId]/space.module.scss";
import { ChatContainer, ChatInput, SpaceHeading } from "../_components";

const data: any = [];

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
    <div className={style.space_page_outer_container}>
      <SpaceHeading title="space title" link="/" />
      <section
        className={`${style.space_page_container} bg-secondary-100 font-geo`}
      >
        <ChatContainer data={data} />
      </section>
      <ChatInput
        handleOnChange={handleOnChange}
        handleOnSubmit={handleOnSubmit}
      />
    </div>
  );
}
