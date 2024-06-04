export default function CreatePost() {
  return (
    <form className="mt-4 flex items-center justify-between rounded-xl bg-gray-200 px-4 py-2 dark:bg-neutral-700">
      <img
        className="inline-block size-8 rounded-full sm:size-9 md:size-10"
        src="https://avatars.githubusercontent.com/u/109339437?v=4"
        alt="Someone"
      />
      <input
        type="text"
        placeholder="What's on your mind, Karan?"
        id="create-post"
        className="flex w-full justify-self-start bg-transparent pl-4 outline-none"
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
        <span className="sr-only">Post</span>
      </button>
    </form>
  );
}
