import { useCallback, useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import useSocket from "@/hooks/useSocket";
import useMessages from "@/hooks/useMessages";
import useFriendshipHandler from "@/hooks/useFriendshipHandler";
import Conversation, {
  ConversationPlaceholder,
} from "@/components/Messages/Conversation";
import ChatUser from "@/components/Messages/ChatUser";
import ChatHeader from "@/components/Messages/ChatHeader";
import MessageInput from "@/components/Messages/MessageInput";
import useStore from "@/app/store";

export default function Messages() {
  const { auth } = useAuth();
  const { friends, friendsLoading } = useFriendshipHandler();
  const { onlineUsers } = useSocket();
  const { currentChatUserId, setCurrentParticipant } = useMessages();

  const chats = useStore((state) => state.chats);
  const unreadFriendChats = useStore((state) => state.unreadFriendChats);
  const messages = chats[currentChatUserId];

  const [expanded, setExpanded] = useState(false);
  const [currentConversation, setCurrentConversation] = useState(-1);

  const openChatbox = useCallback((idx) => {
    if (window.innerWidth > 767) {
      setCurrentConversation(idx);
    } else {
      setExpanded(true);
      setCurrentConversation(idx);
    }
  }, []);

  const closeChatbox = useCallback(() => {
    if (window.innerWidth <= 767) {
      setExpanded(false);
    }
  }, []);

  useEffect(() => {
    return () => setCurrentParticipant(-1);
  }, []);

  return (
    <div className="sticky top-[4.5rem] grid h-[calc(100vh-4.5625rem)] overflow-hidden md:grid-cols-[15rem_1fr] lg:grid-cols-[18rem_1fr]">
      {/* Left sidebar */}
      <div className="h-full overflow-y-auto border-r border-r-gray-200 p-4 dark:border-r-neutral-700 md:px-2">
        <div className="mb-4 flex overflow-hidden rounded-full bg-gray-200 px-3 py-2 dark:bg-neutral-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            className="w-full min-w-0 flex-1 bg-transparent px-2 text-sm outline-none"
            type="text"
            placeholder="#Search"
          />
        </div>

        {/* Display friends list */}
        {friendsLoading ? (
          <p>Loading</p>
        ) : friends.length ? (
          friends.map((friend, idx) => (
            <ChatUser
              key={idx}
              index={idx}
              loggedUserId={auth?.user?._id}
              openChatbox={openChatbox}
              currentConversation={currentConversation}
              setCurrentParticipant={setCurrentParticipant}
              friend={friend}
              onlineUsers={onlineUsers}
              chats={chats}
              unreadFriendChats={unreadFriendChats}
            />
          ))
        ) : (
          <p>No friends yet</p>
        )}
      </div>

      {/* Right chat panel */}
      <div
        className="relative h-full overflow-y-hidden bg-white transition-transform dark:bg-neutral-800 max-md:absolute max-md:left-0 max-md:top-0 max-md:w-full max-md:translate-x-[--chatbox-offset]"
        style={{ "--chatbox-offset": expanded ? 0 : "100%" }}
      >
        {/* Chat header */}
        {currentConversation !== -1 ? (
          <ChatHeader
            closeChatbox={closeChatbox}
            friend={friends[currentConversation]}
          />
        ) : (
          <ConversationPlaceholder>
            <span>Start conversation</span>
          </ConversationPlaceholder>
        )}

        {currentConversation !== -1 &&
          (messages?.length > 0 ? (
            <Conversation
              messages={messages}
              auth={auth}
              friend={friends[currentConversation]}
            />
          ) : (
            <div className="h-[calc(100%-4.625rem)]">
              <ConversationPlaceholder>
                <span>No conversation yet</span>
              </ConversationPlaceholder>
            </div>
          ))}

        {currentConversation !== -1 && <MessageInput />}
      </div>
    </div>
  );
}
