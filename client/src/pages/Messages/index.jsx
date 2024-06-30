import { useEffect, useState, useRef } from "react";
import useAuth from "@/hooks/useAuth";
import useFriend from "@/hooks/useFriend";
import useSocket from "@/hooks/useSocket";
// import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useMessages from "@/hooks/useMessages";
import MessageInput from "./MessageInput";
import useStore from "@/app/store";

export default function Messages() {
  const messagesRef = useRef();

  const { auth } = useAuth();
  const { friends, friendsLoading } = useFriend();
  const { onlineUsers } = useSocket();
  const { currentChatUserId, setCurrentParticipant } = useMessages();

  const chats = useStore((state) => state.chats);
  const unreadFriendChats = useStore((state) => state.unreadFriendChats);
  const messages = chats[currentChatUserId];

  const [expanded, setExpanded] = useState(false);
  const [currentConversation, setCurrentConversation] = useState(-1);

  useEffect(() => {
    messagesRef?.current?.scrollTo(0, messagesRef.current.scrollHeight);
  }, [messages]);

  useEffect(() => {
    return () => setCurrentParticipant(-1);
  }, []);

  const openChatbox = (idx) => {
    if (window.innerWidth > 767) {
      setCurrentConversation(idx);
    } else {
      setExpanded(true);
      setCurrentConversation(idx);
    }
  };

  const closeChatbox = () => {
    if (window.innerWidth <= 767) {
      setExpanded(false);
    }
  };

  return (
    <div className="sticky top-[4.5rem] grid h-[calc(100vh-4.5625rem)] overflow-hidden md:grid-cols-[15rem_1fr]">
      {/* Left sidebar */}
      <div className="h-full overflow-y-auto border-r border-r-gray-200 p-4 dark:border-r-neutral-700 md:px-2">
        {/* Search input */}
        <div className="mb-4 flex overflow-hidden rounded-full bg-gray-200 px-3 py-2 dark:bg-neutral-700">
          {/* Search icon */}
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
          {/* Search input field */}
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
            <div
              key={idx}
              className={`${
                idx === currentConversation
                  ? "bg-gray-200 dark:bg-neutral-700 "
                  : ""
              }flex group cursor-pointer items-start gap-2 rounded-xl p-2 py-2 hover:bg-gray-200 dark:hover:bg-neutral-700 md:py-3 2xl:gap-4`}
              onClick={() => {
                openChatbox(idx);
                setCurrentParticipant(friend._id);
              }}
            >
              {/* Friend avatar */}
              <div className="relative inline-block">
                <img
                  className="inline-block size-8 rounded-full object-cover object-center md:size-9"
                  src={friend.avatar.url}
                  alt={friend.fullname}
                />
                {/* Online status indicator */}
                {onlineUsers &&
                  onlineUsers.some(
                    (onlineUser) => onlineUser === friend._id,
                  ) && (
                    <span
                      className={`${
                        idx === currentConversation
                          ? "ring-gray-200 dark:ring-neutral-700 "
                          : "ring-white group-hover:ring-gray-200 dark:ring-neutral-800 dark:group-hover:ring-neutral-700 "
                      }absolute bottom-0 end-0 block size-2 rounded-full bg-teal-400 ring-2`}
                    />
                  )}
              </div>

              {/* Friend username and last message */}
              <div className="flex-1 truncate">
                <h4 className="max-2xl:text-sm">{friend.username}</h4>
                {!!chats[friend?._id]?.length && (
                  <p className="truncate text-xs opacity-35 2xl:text-sm">
                    {`${
                      chats[friend?._id][chats[friend?._id].length - 1]
                        .sender === auth.user._id
                        ? "me: "
                        : ""
                    }${
                      chats[friend?._id][chats[friend?._id].length - 1].message
                    }`}
                  </p>
                )}
              </div>

              {/* Unread messages count */}
              {!!unreadFriendChats[friend._id] && (
                <span className="mt-auto inline-grid size-5 place-items-center rounded-full bg-blue-500 text-[0.65rem] font-medium text-white">
                  {unreadFriendChats[friend._id]}
                </span>
              )}
            </div>
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
          <div className="flex items-center gap-2 border-b border-b-gray-200 p-4 px-2 dark:border-b-neutral-700 sm:gap-4 md:px-4">
            {/* Close button */}
            <button
              className="flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-gray-700 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 max-2xl:text-sm max-xl:p-2 md:hidden"
              onClick={closeChatbox}
            >
              {/* Close icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
            </button>
            {/* Friend avatar and username */}
            <img
              className="inline-block size-9 rounded-full object-cover object-center"
              src={friends[currentConversation]?.avatar?.url}
              alt={friends[currentConversation]?.fullname}
            />
            <h3>{friends[currentConversation]?.username}</h3>
            {/* <div>
              <h3>{friends[currentConversation]?.username}</h3>
              {!onlineUsers?.some(
                (onlineUser) =>
                  onlineUser === friends[currentConversation]?._id,
              ) &&
                friends[currentConversation]?.lastSeen && (
                  <span className="text-xs text-gray-400 dark:text-neutral-500">
                    {new Date(
                      friends[currentConversation].lastSeen,
                    ).toLocaleTimeString()}
                  </span>
                )}
            </div> */}
          </div>
        ) : (
          // Placeholder for starting conversation
          <div className="grid h-full place-content-center text-2xl text-gray-400 dark:text-neutral-500">
            <div className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-[1.5em]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                />
              </svg>
              <span>Start conversation</span>
            </div>
          </div>
        )}

        {/* Chat messages */}
        {currentConversation !== -1 && (
          <div
            className="h-[calc(100%-9rem)] space-y-4 overflow-y-auto p-4"
            ref={messagesRef}
          >
            {!!messages?.length &&
              messages.map((message, idx) => {
                const isSender = message.sender === auth?.user?._id;
                return (
                  <div
                    key={idx}
                    className="space-y-2 [&>*]:max-w-[85%] [&_*]:w-fit"
                    style={{
                      "--margin-start": isSender ? "auto" : "0",
                      "--clr-chat": isSender
                        ? "rgb(59 130 246)"
                        : "rgb(64 64 64)",
                    }}
                  >
                    <div className="ml-[--margin-start] w-fit max-w-[90%] rounded-lg bg-[--clr-chat] p-2 py-1 text-white">
                      <p>{message.message}</p>
                    </div>
                    <span className="ml-[--margin-start] block w-fit text-xs opacity-50 2xl:text-sm">
                      {new Date(message?.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                );
              })}
          </div>
        )}

        {/* Input for sending messages */}
        {currentConversation !== -1 && <MessageInput />}
      </div>
    </div>
  );
}
