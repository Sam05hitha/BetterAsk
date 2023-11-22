"use client";

import React, { useEffect, useState, useRef } from "react";
import style from "./space.module.scss";
import { ChatContainer, ChatInput, SpaceHeading } from "../_components";
import useConversation from "@/app/_hooks/useConversation";
import useSendQuery from "@/app/_hooks/useSendQuery";
import { TConversation } from "@/app/_utils/types";
import {
  formatTimestampTo24Hour,
  handleScrollIntoView,
  newPendingMessage,
} from "@/app/_utils/methods";

interface INewChatModel {
  searchParams?: { chatStartInput: string | undefined | null };
  params: { spaceId: string };
}

export default function SpaceWithID({ params }: INewChatModel) {
  const [currentMessage, setCurrentMassage] = useState<string>("");
  const spacePageRef = useRef<HTMLDivElement | null>(null);

  const { conversations, isLoading, isError, refresh } = useConversation(
    params.spaceId
  );
  const { response, error, getInputQuery, loadingQuery } = useSendQuery();

  const [conversationsData, setConversationsData] =
    useState<TConversation[]>(conversations);

  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;
    setCurrentMassage(value ? value : "");
  }

  function handleOnSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    getInputQuery(currentMessage);

    setConversationsData((prevData) => [
      ...prevData,
      {
        ...newPendingMessage(currentMessage),
      },
    ]);
    setCurrentMassage("");
  }

  useEffect(() => {
    if (response) {
      refresh();
    }
  }, [response]);

  useEffect(() => {
    handleScrollIntoView(spacePageRef);
  }, []);

  useEffect(() => {
    if (conversations) {
      setConversationsData(conversations);
    }
  }, [conversations]);

  return (
    <div
      ref={spacePageRef}
      className={`${style.space_page_outer_container} ${style.no_navbar} bg-primary-100`}
    >
      {/* <SpaceHeading title="Human Resources" link="/" /> */}
      <ChatContainer data={conversationsData} />
      <div className="relative">
        <ChatInput
          loading={loadingQuery}
          value={currentMessage}
          handleOnChange={handleOnChange}
          handleOnSubmit={handleOnSubmit}
        />
      </div>
    </div>
  );
}
