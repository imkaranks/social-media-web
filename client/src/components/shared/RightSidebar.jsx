export default function RightSidebar() {
  return (
    <div className="sticky top-[4.5rem] h-[calc(100vh-4.5rem)] overflow-y-auto p-4 pt-0 max-md:hidden [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar]:w-2">
      {/* messages */}
      <div className="mb-4 rounded-xl bg-gray-200 p-4 dark:bg-neutral-700">
        <div className="mb-4 flex items-center justify-between">
          <h3>Messages</h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </div>

        {/* search bar */}
        <div className="mb-4 flex overflow-hidden rounded-full bg-white px-3 py-2 dark:bg-neutral-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
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

        {/* category tabs */}
        <div className="mb-4 border-b border-gray-100 dark:border-white/5">
          <nav className="flex" aria-label="Tabs" role="tablist">
            {["Primary", "General", "Request(7)"].map((text, idx) => (
              <button
                key={idx}
                type="button"
                className={`${idx === 0 ? "border-blue-600 font-semibold text-blue-600 " : ""}w-full inline-flex items-center justify-center gap-x-2 whitespace-nowrap border-b-2 border-transparent pb-2 text-xs text-gray-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-400 dark:hover:text-blue-500 2xl:text-sm`}
                id={`tabs-with-underline-item-${idx + 1}`}
                aria-controls={`tabs-with-underline-${idx + 1}`}
                role="tab"
              >
                {text}
              </button>
            ))}
          </nav>
        </div>

        {/* messages */}
        <div className="space-y-4">
          {new Array(3).fill(0).map((_, idx) => (
            <div key={idx} className="flex items-start gap-2 2xl:gap-4">
              <div className="relative inline-block">
                <img
                  className="inline-block size-9 rounded-full"
                  src="https://i.pravatar.cc/150?img=9"
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
      </div>

      {/* friend requests */}
      <div>
        <h3 className="mb-4">Requests</h3>
        <div className="space-y-4">
          {new Array(5).fill(0).map((_, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-gray-200 p-4 dark:bg-neutral-700"
            >
              <div className="mb-2 flex gap-2 2xl:gap-4">
                <img
                  className="inline-block size-9 rounded-full"
                  src="https://i.pravatar.cc/150?img=54"
                  alt="John Doe"
                />
                <div className="max-2xl:text-sm">
                  <h4>John Doe</h4>
                  <p className="text-gray-400 dark:text-neutral-400">
                    8 mutual friends
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 max-2xl:text-sm 2xl:gap-4">
                <button className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50">
                  Accept
                </button>
                <button className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
