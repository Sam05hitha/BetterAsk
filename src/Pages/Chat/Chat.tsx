import style from "./chat.module.scss";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import HourglassBottomRoundedIcon from "@mui/icons-material/HourglassBottomRounded";
import { Tooltip } from "@mui/material";

import useConversation from "../../hooks/useConversation";
import useSendQuery from "../../hooks/useSendQuery";
import ChatContainer from "./ChatContainer";

export default function Chat() {
  const { conversations, refetch, mutateData, messageRef } = useConversation();

  const { queryMutate, queryStatus } = useSendQuery({ onSettled });

  function onSettled(_data: any) {
    refetch();
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const input = formData.get("prompt") as string;
    if (input) {
      mutateData(input);
      queryMutate({ query: input });
    }
    const text = document.getElementById("prompt") as HTMLInputElement;
    if (text) text.value = "";
  }

  return (
    <div className={style.c_container}>
      <div className={style.c_container_inner}>
        <div className={style.c_message_container}>
          <ChatContainer
            conversations={conversations}
            messageRef={messageRef}
          />
        </div>
        <form className={style.c_form} onSubmit={onSubmit}>
          <div className={style.c_input}>
            <input
              disabled={queryStatus === "pending"}
              placeholder="Ask me anything about VAT..."
              type="text"
              name="prompt"
              id="prompt"
            />
            <Tooltip
              title={queryStatus === "pending" ? "Getting response" : "send"}
              placement="top"
            >
              <button type="submit">
                {queryStatus === "pending" ? (
                  <HourglassBottomRoundedIcon
                    className={style.c_input_loading}
                  />
                ) : (
                  <SendRoundedIcon />
                )}
              </button>
            </Tooltip>
          </div>
        </form>
      </div>
    </div>
  );
}
