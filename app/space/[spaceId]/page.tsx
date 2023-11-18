"use client";

import React, { useState } from "react";
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
  const [currentMessage, setCurrentMassage] = useState<string>("");

  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    //TODO : set change state
    const value = event.currentTarget.value;
    setCurrentMassage(value ? value : "");
  }

  function handleOnSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
