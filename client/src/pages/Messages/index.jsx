import { useState } from "react";
import useAuth from "@/hooks/useAuth";

export default function Messages() {
  const { auth } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const openChatbox = () => {
    if (innerWidth > 768) return;

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

        {new Array(7).fill(0).map((_, idx) => (
          <div
            key={idx}
            className={`${idx === 0 ? "bg-gray-200 dark:bg-neutral-700 " : ""}flex cursor-pointer items-start gap-2 rounded-xl p-2 py-2 hover:bg-gray-200 dark:hover:bg-neutral-700 md:py-3 2xl:gap-4`}
            onClick={openChatbox}
          >
            <div className="relative inline-block">
              <img
                className="inline-block size-8 rounded-full md:size-9"
                src={`https://i.pravatar.cc/150?img=${idx + 20}`}
                alt="Jane Doe"
              />
              {idx < 2 && (
                <span className="absolute bottom-0 end-0 block size-2 rounded-full bg-teal-400 ring-2 ring-gray-200 dark:ring-neutral-700" />
              )}
            </div>

            <div>
              <h4 className="max-2xl:text-sm">Jane Doe</h4>
              <p className="text-xs opacity-35 2xl:text-sm">
                Lorem ipsum dolor sit.
              </p>
            </div>
          </div>
        ))}
      </div>
      <div
        className="relative h-full bg-white transition-transform dark:bg-neutral-800 max-md:absolute max-md:left-0 max-md:top-0 max-md:w-full max-md:translate-x-[--chatbox-offset]"
        style={{ "--chatbox-offset": expanded ? 0 : "100%" }}
      >
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
            className="inline-block size-9 rounded-full"
            src={`https://i.pravatar.cc/150?img=${20}`}
            alt="Jane Doe"
          />
          <h3>Jane Doe</h3>
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
          <img
            className="inline-block size-8 rounded-full object-cover sm:size-9 md:size-10"
            src={auth?.user?.avatar}
            alt="Someone"
          />
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
      </div>
    </div>
  );
}
