import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import useFriend from "@/hooks/useFriend";

export default function Messages() {
  const { auth } = useAuth();
  const { friends, friendsLoading } = useFriend();
  const [expanded, setExpanded] = useState(false);
  const [currentConversation, setCurrentConversation] = useState(-1);

  const openChatbox = (idx) => {
    if (innerWidth > 768) {
      if (currentConversation !== idx) {
        setCurrentConversation(idx);
      }
      return;
    }

    if (!expanded) {
      setExpanded(true);
    }
  };

  const closeChatbox = () => {
    if (innerWidth > 768) return;

    if (expanded) {
      setExpanded(false);
    }
  };

  return (
    <div className="mdgrid-cols-[auto_1fr] sticky top-[4.5rem] grid h-[calc(100vh-4.5625rem)] overflow-hidden md:grid-cols-[15rem_1fr]">
      <div className="h-full overflow-y-auto border-r border-r-gray-200 p-4 dark:border-r-neutral-700 md:px-2">
        <h2 className="mb-4">Messages</h2>

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

        {friendsLoading ? (
          <p>Loading</p>
        ) : friends.length ? (
          friends.map((friend, idx) => (
            <div
              key={idx}
              className={`${idx === currentConversation ? "bg-gray-200 dark:bg-neutral-700 " : ""}flex group cursor-pointer items-start gap-2 rounded-xl p-2 py-2 hover:bg-gray-200 dark:hover:bg-neutral-700 md:py-3 2xl:gap-4`}
              onClick={() => openChatbox(idx)}
            >
              <div className="relative inline-block">
                <img
                  className="inline-block size-8 rounded-full object-cover object-center md:size-9"
                  src={friend.avatar.url}
                  alt={friend.fullname}
                />
                {idx < 2 && (
                  <span
                    className={`${idx === currentConversation ? "ring-gray-200 dark:ring-neutral-700 " : "ring-white group-hover:ring-gray-200 dark:ring-neutral-800 dark:group-hover:ring-neutral-700 "}absolute bottom-0 end-0 block size-2 rounded-full bg-teal-400 ring-2`}
                  />
                )}
              </div>

              <div>
                <h4 className="max-2xl:text-sm">{friend.username}</h4>
                <p className="text-xs opacity-35 2xl:text-sm">
                  Lorem ipsum dolor sit.
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No friends yet</p>
        )}
      </div>
      <div
        className="relative h-full bg-white transition-transform dark:bg-neutral-800 max-md:absolute max-md:left-0 max-md:top-0 max-md:w-full max-md:translate-x-[--chatbox-offset]"
        style={{ "--chatbox-offset": expanded ? 0 : "100%" }}
      >
        {currentConversation !== -1 ? (
          <>
            <div className="flex items-center gap-2 border-b border-b-gray-200 p-4 px-2 dark:border-b-neutral-700 sm:gap-4 md:px-4">
              <button
                className="flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-gray-700 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 max-2xl:text-sm max-xl:p-2 md:hidden"
                onClick={closeChatbox}
              >
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
              <img
                className="inline-block size-9 rounded-full object-cover object-center"
                src={friends[currentConversation]?.avatar?.url}
                alt={friends[currentConversation]?.fullname}
              />
              <h3>{friends[currentConversation]?.username}</h3>
            </div>

            {/* chats */}
            <div className="h-[calc(100%-9rem)] space-y-4 overflow-y-auto p-4 [&>*]:max-w-[85%] [&_*]:w-fit">
              {/* me */}
              <div className="ml-auto space-y-2 [&>*]:ml-auto">
                <div className="rounded-lg bg-blue-500 p-2 text-white">
                  Hey there! How&apos;s it going?
                </div>
                <div className="text-xs text-gray-400 dark:text-neutral-500 sm:text-sm">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>

              {/* sender */}
              <div className="space-y-2">
                <div className="rounded-lg bg-gray-200 p-2 dark:bg-neutral-700">
                  Hey! Not too bad, thanks for asking.
                </div>
                <div className="rounded-lg bg-gray-200 p-2 dark:bg-neutral-700">
                  How about you?
                </div>
                <div className="text-xs text-gray-400 dark:text-neutral-500 sm:text-sm">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>

              {/* me */}
              <div className="ml-auto space-y-2 [&>*]:ml-auto">
                <div className="rounded-lg bg-blue-500 p-2 text-white">
                  I&apos;m doing alright, just finished up some work.
                </div>
                <div className="rounded-lg bg-blue-500 p-2 text-white">
                  What are you up to?
                </div>
                <div className="text-xs text-gray-400 dark:text-neutral-500 sm:text-sm">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>

            <form className="absolute bottom-4 left-4 flex w-[calc(100%-2rem)] items-center justify-between rounded-xl bg-gray-200 p-2 dark:bg-neutral-700 md:px-4">
              {auth?.user?.avatar?.url ? (
                <img
                  className="inline-block size-8 rounded-full object-cover sm:size-9 md:size-10"
                  src={auth.user.avatar.url}
                  alt={auth.user.fullname}
                />
              ) : (
                <span className="inline-flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold leading-none text-gray-800 dark:bg-white/10 dark:text-white">
                  {auth?.user?.fullname
                    .split(" ")
                    .map((word) => word[0].toUpperCase())}
                </span>
              )}
              <input
                type="text"
                placeholder="Say Hi 👋"
                className="flex w-full justify-self-start bg-transparent pl-2 outline-none sm:pl-4"
              />
              <button className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 p-2 text-center text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 sm:size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                </svg>
                <span className="sr-only">Send</span>
              </button>
            </form>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
