import ChatItem from "../../components/Chat/ChatItem";
import style from "./chat.module.scss";

export default function ChatContainer(props: {
  messageRef: any;
  conversations: any;
}) {
  const { conversations, messageRef } = props;

  return (
    <>
      {Array.isArray(conversations) ? (
        conversations.map((item, index) => (
          <div key={index} className={style.message_container_couple}>
            <ChatItem data={item} isUser={true} />
            <ChatItem
              messageRef={
                index === conversations.length - 1 ? messageRef : null
              }
              isPending={item?.isPending}
              data={item}
              isUser={false}
            />
          </div>
        ))
      ) : (
        <></>
      )}
    </>
  );
}
