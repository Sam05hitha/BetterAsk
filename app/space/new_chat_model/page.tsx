"use client";

import React, { useState, useEffect, useCallback } from "react";
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

  const getInputQueryMemorized = useCallback(getInputQuery, []);

  useEffect(() => {
    //TODO : get message from start input call api
    //populate data
    //if no start input then open model
    if (searchParams.chatStartInput) {
      getInputQueryMemorized(searchParams.chatStartInput);
    }
  }, [searchParams.chatStartInput, getInputQueryMemorized]);

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
