export default function Notification() {
  return (
    <div className="bg-gray-20 dark:bg-neutral-70 rounded-xl p-4 md:pr-0">
      <div className="flex items-center justify-between border-b-2 border-gray-100 p-4 dark:border-white/5 md:px-6">
        <h2 className="font-semibold md:text-lg">Notifications</h2>
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
            d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      </div>

      <div>
        {new Array(10).fill(0).map((_, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 border-b-2 border-gray-100 p-4 text-[var(--clr-notification)] dark:border-white/5 dark:text-[var(--clr-notification-dark)] md:px-6"
            style={{
              "--clr-notification":
                idx % 2 === 0 ? "rgb(0 0 0)" : "rgb(0 0 0 / 0.6)",
              "--clr-notification-dark":
                idx % 2 === 0 ? "rgb(255 255 255)" : "rgb(255 255 255 / 0.6)",
            }}
          >
            <img
              className="inline-block size-8 rounded-full sm:size-9 md:size-10"
              src={`https://i.pravatar.cc/150?img=${idx + 10}`}
              alt="Someone"
            />
            <div className="flex-1">
              <h3>
                <strong>Lorem ipsum</strong> did something awesome
              </h3>
              <p className="text-sm text-gray-400 dark:text-neutral-500">
                3 minutes ago
              </p>
            </div>
            {idx % 2 === 0 &&
              (Math.round(Math.random()) ? (
                <span className="mt-[0.75ch] inline-block size-2.5 rounded-full bg-orange-400"></span>
              ) : Math.round(Math.random()) ? (
                <button className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50">
                  Follow back
                </button>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-500 hover:border-blue-600 hover:text-blue-600 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-600 dark:hover:text-blue-500"
                  disabled={true}
                >
                  Followed
                </button>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
