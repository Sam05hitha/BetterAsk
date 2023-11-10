"use client";

import React from "react";
import style from "./space.module.scss";
import { ChatContainer, ChatInput, SpaceHeading } from "../_components";

const data = [
  {
    text: "What is this document about ?",
    time: "14:21",
  },
  {
    text: "Human resources (HR) departments maintain and manage a variety of documents and records related to employees, employment, and the organization. These documents serve several essential purposes, including legal compliance, employee management, and decision-making. Here are some common types of HR documents:",
    time: "14:21",
  },
  {
    text: "Human resources (HR) departments maintain and manage a variety of documents and records related to employees, employment, and the organization. These documents serve several essential purposes, including legal compliance, employee management, and decision-making. Here are some common types of HR documents:",
    time: "14:21",
  },
  {
    text: "Human resources (HR) departments maintain and manage a variety of documents and records related to employees, employment, and the organization. These documents serve several essential purposes, including legal compliance, employee management, and decision-making. Here are some common types of HR documents:",
    time: "14:21",
  },
];

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
      <SpaceHeading title="Human Resources" link="/" />
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
