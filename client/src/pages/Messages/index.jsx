export default function Messages() {
  return (
    <div className="sticky top-[4.5rem] grid h-[calc(100vh-4.5625rem)] grid-cols-[auto_1fr] md:grid-cols-[15rem_1fr]">
      <div className="h-full overflow-y-auto border-r border-r-gray-200 p-2 py-4 dark:border-r-neutral-700">
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

            <div className="max-md:hidden">
              <h4 className="max-2xl:text-sm">Jane Doe</h4>
              <p className="text-xs opacity-35 2xl:text-sm">
                Lorem ipsum dolor sit.
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="relative h-full">
        <div className="flex items-center gap-2 border-b border-b-gray-200 p-2 dark:border-b-neutral-700 sm:gap-4 md:p-4">
          <img
            className="inline-block size-9 rounded-full"
            src={`https://i.pravatar.cc/150?img=${20}`}
            alt="Jane Doe"
          />
          <h3>Jane Doe</h3>
        </div>

        {/* chats */}
        <div className="space-y-4 p-4">
          {/* me */}
          <div className="ml-auto w-fit space-y-2 [&>*]:ml-auto">
            <div className="w-fit rounded-lg bg-blue-500 p-2 text-white">
              Hey there! How&apos;s it going?
            </div>
            <div className="w-fit text-sm">
              {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* sender */}
          <div className="space-y-2">
            <div className="w-fit rounded-lg bg-gray-200 p-2 dark:bg-neutral-700">
              Hey! Not too bad, thanks for asking.
            </div>
            <div className="w-fit rounded-lg bg-gray-200 p-2 dark:bg-neutral-700">
              How about you?
            </div>
            <div className="text-sm">{new Date().toLocaleTimeString()}</div>
          </div>

          {/* me */}
          <div className="ml-auto w-fit space-y-2 [&>*]:ml-auto">
            <div className="w-fit rounded-lg bg-blue-500 p-2 text-white">
              I&apos;m doing alright, just finished up some work.
            </div>
            <div className="w-fit rounded-lg bg-blue-500 p-2 text-white">
              What are you up to?
            </div>
            <div className="w-fit text-sm">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        <form className="absolute bottom-4 left-4 flex w-[calc(100%-2rem)] items-center justify-between rounded-xl bg-gray-200 p-2 dark:bg-neutral-700 md:px-4">
          <img
            className="inline-block size-8 rounded-full sm:size-9 md:size-10"
            src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
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
