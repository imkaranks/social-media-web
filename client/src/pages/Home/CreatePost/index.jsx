export default function CreatePost() {
  return (
    <form className="mt-4 flex items-center justify-between rounded-xl bg-gray-200 px-4 py-2 dark:bg-neutral-700">
      <img
        className="inline-block size-[46px] rounded-full"
        src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
        alt="Someone"
      />
      <input
        type="text"
        placeholder="What's on your mind, Mark?"
        id="create-post"
        className="flex w-full justify-self-start bg-transparent pl-4 outline-none"
      />
      <button className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50">
        Post
      </button>
    </form>
  );
}
