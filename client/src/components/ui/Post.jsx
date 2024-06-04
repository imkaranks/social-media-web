export default function Post() {
  return (
    <article className="my-4 rounded-xl bg-gray-100 p-4 text-sm leading-normal dark:bg-neutral-700/20">
      <header className="flex w-full items-start gap-4">
        <div className="flex items-start gap-2 max-sm:flex-col md:gap-4">
          <img
            className="inline-block size-8 rounded-full sm:size-9 md:size-10"
            src="https://avatars.githubusercontent.com/u/109339437?v=4"
            alt="Me"
          />
          <div>
            <p>Karan Sethi</p>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. A,
              soluta.
            </p>
          </div>
        </div>

        <button className="ml-auto mt-2">
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
              d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
        </button>
      </header>

      <div className="mt-3 overflow-hidden rounded-xl">
        <img
          src="https://images.unsplash.com/photo-1531141445733-14c2eb7d4c1f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxpZmVzdHlsZXxlbnwwfHwwfHx8MA%3D%3D"
          className="max-h-96 w-full object-cover object-center"
          alt="man wearing white shorts holding black backpack"
        />
      </div>

      <div className="my-1.5 flex items-center">
        <button className="inline-flex items-center gap-x-2 rounded-lg border border-transparent p-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 hover:text-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:text-blue-500 dark:hover:bg-blue-800/30 dark:hover:text-blue-400">
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
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </button>
        <button className="inline-flex items-center gap-x-2 rounded-lg border border-transparent p-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 hover:text-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:text-blue-500 dark:hover:bg-blue-800/30 dark:hover:text-blue-400">
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
              d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
        </button>
        <button className="inline-flex items-center gap-x-2 rounded-lg border border-transparent p-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 hover:text-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:text-blue-500 dark:hover:bg-blue-800/30 dark:hover:text-blue-400">
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
              d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
            />
          </svg>
        </button>
        <button className="ml-auto inline-flex items-center gap-x-2 rounded-lg border border-transparent p-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 hover:text-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:text-blue-500 dark:hover:bg-blue-800/30 dark:hover:text-blue-400">
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
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
            />
          </svg>
        </button>
      </div>

      {/* Liked by */}
      <div className="mb-1 flex gap-2 max-sm:flex-col sm:items-center">
        <div className="flex items-center -space-x-2">
          <img
            className="inline-block size-8 rounded-full ring-2 ring-gray-100 dark:ring-neutral-700/20"
            src="https://avatars.githubusercontent.com/u/109339437?v=4"
            alt="Image Description"
          />
          <img
            className="inline-block size-8 rounded-full ring-2 ring-gray-100 dark:ring-neutral-700/20"
            src="https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
            alt="Image Description"
          />
          <img
            className="inline-block size-8 rounded-full ring-2 ring-gray-100 dark:ring-neutral-700/20"
            src="https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&&auto=format&fit=facearea&facepad=3&w=300&h=300&q=80"
            alt="Image Description"
          />
        </div>
        <p className="text-xs sm:text-sm">
          Liked by <strong>Ernest Becker</strong> and 69 others
        </p>
      </div>

      <div className="mb-1 text-xs sm:text-sm">
        <p>
          <strong>Karan Sethi</strong> Lorem ipsum dolor sit amet consectetur.{" "}
          <span>#lifestyle</span>
        </p>
      </div>

      <button className="text-xs sm:text-sm">View all 72 comments</button>
    </article>
  );
}
