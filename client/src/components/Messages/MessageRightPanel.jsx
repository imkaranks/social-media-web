import { useMessagesContext } from "./Messages.hooks";
import MessageConversationHeader from "./MessageConversationHeader";
import MessageConversation, {
  MessageConversationPlaceholder,
} from "./MessageConversation";
import MessageInput from "./MessageInput";

export default function MessageRightPanel() {
  const {
    expanded,
    messages,
    currentConversation,
    friends,
    closeUserConversation,
  } = useMessagesContext();

  return (
    <div
      className="relative h-full overflow-y-hidden bg-white transition-transform dark:bg-neutral-800 max-md:absolute max-md:left-0 max-md:top-0 max-md:w-full max-md:translate-x-[--chatbox-offset]"
      style={{ "--chatbox-offset": expanded ? 0 : "100%" }}
    >
      {currentConversation !== -1 ? (
        <MessageConversationHeader
          closeUserConversation={closeUserConversation}
          friend={friends[currentConversation]}
        />
      ) : (
        <MessageConversationPlaceholder>
          <span>Start conversation</span>
        </MessageConversationPlaceholder>
      )}

      {currentConversation !== -1 &&
        (messages?.length > 0 ? (
          <MessageConversation
            messages={messages}
            friend={friends[currentConversation]}
          />
        ) : (
          <div className="h-[calc(100%-4.625rem)]">
            <MessageConversationPlaceholder>
              <span>No conversation yet</span>
            </MessageConversationPlaceholder>
          </div>
        ))}

      {currentConversation !== -1 && <MessageInput />}
    </div>
  );
}
