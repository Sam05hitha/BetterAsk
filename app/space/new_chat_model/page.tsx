"use client";

import React, { useState, useEffect } from "react";
import style from "../[spaceId]/space.module.scss";
import { ChatContainer, ChatInput, SpaceHeading } from "../_components";
import useSendQuery from "@/app/_hooks/useSendQuery";

interface INewChatModel {
  searchParams: { chatStartInput: string | undefined | null };
}

const data: any = [];

export default function NewChatModel({ searchParams }: INewChatModel) {
  const { response, error, getInputQuery } = useSendQuery();
  const [currentMessage, setCurrentMassage] = useState<string>("");
  const [dataList, setDataList] = useState<any>([]);

  useEffect(() => {
    //TODO : get message from start input call api
    //populate data
    //if no start input then open model
    if (searchParams.chatStartInput) {
      getInputQuery(searchParams.chatStartInput);
    }
  }, [searchParams.chatStartInput]);

  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;
    setCurrentMassage(value ? value : "");
  }

  function handleOnSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    getInputQuery(currentMessage);
    setCurrentMassage("");
    //TODO: submit message
  }

  useEffect(() => {
    console.log(response, '|', process.env.NEXT_PUBLIC_API_BASE_URL, 'api');
  }, [response]);

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
