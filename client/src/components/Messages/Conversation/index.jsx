import { useEffect, useRef, useState } from "react";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useMessages from "@/hooks/useMessages";
import useSocket from "@/hooks/useSocket";
import Avatar from "@/components/ui/Avatar";
import { cn } from "@/utils/cn";
import useStore from "@/app/store";
import styles from "./index.module.css";

export const ConversationPlaceholder = ({ children }) => {
  return (
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
        {children}
      </div>
    </div>
  );
};

export default function Conversation({ messages, friend }) {
  const messagesRef = useRef();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { socket } = useSocket();
  const { currentChatUserId, unreadChatIds, setUnreadChatIds } = useMessages();
  // const setFriendChat = useStore((state) => state.setFriendChat);
  // const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    messagesRef?.current?.scrollTo(0, messagesRef.current.scrollHeight);
  });

  return (
    <div
      className="h-[calc(100%-9rem)] space-y-2 overflow-y-auto overflow-x-hidden p-4"
      ref={messagesRef}
    >
      {isLoading && (
        <div className="flex justify-center">
          <span className="inline-block size-5 animate-spin rounded-full border-[3px] border-white border-t-transparent text-blue-600"></span>
        </div>
      )}
      {messages?.length > 0 ? (
        messages.map((message, idx) => {
          const isSender = message.sender === auth?.user?._id;
          const isLastMessage =
            idx === messages.length - 1 ||
            messages[idx + 1]?.sender !== message.sender;
          return (
            <div
              key={idx}
              className="space-y-2 [&>*]:max-w-[85%] [&_*]:w-fit"
              style={{
                "--margin-start": isSender ? "auto" : "0",
                "--clr-chat": isSender ? "rgb(59 130 246)" : "rgb(64 64 64)",
              }}
            >
              <div
                className="ml-[--margin-start] flex w-fit max-w-[90%] items-end gap-2.5"
                style={{ flexDirection: isSender ? "row-reverse" : "row" }}
              >
                {isLastMessage ? (
                  <Avatar
                    user={isSender ? auth?.user : friend}
                    size="xsmall"
                    className="!size-9 flex-shrink-0 max-sm:hidden"
                  />
                ) : (
                  <div className="!size-9 max-sm:hidden"></div>
                )}
                <div
                  className={
                    isLastMessage
                      ? cn(
                          "w-full space-y-1 rounded-lg bg-[--clr-chat] px-3 py-2 text-white",
                          styles.lastMessage,
                        )
                      : "w-full space-y-1 rounded-lg bg-[--clr-chat] px-3 py-2 text-white"
                  }
                  data-sender={isSender}
                >
                  <p className="ml-[--margin-start]">{message?.message}</p>
                  {isLastMessage && (
                    <div className="ml-[--margin-start] block w-fit text-xs 2xl:text-sm">
                      <span className="opacity-50">
                        {new Date(message?.createdAt).toLocaleTimeString()}
                      </span>
                      {isSender && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="currentColor"
                          className={`ml-auto size-[1.6ch] ${!unreadChatIds?.sent[friend._id]?.find((chatId) => message._id === chatId) ? "text-blue-400" : ""}`}
                        >
                          <path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p>No conversation yet.</p>
      )}
    </div>
  );
}
