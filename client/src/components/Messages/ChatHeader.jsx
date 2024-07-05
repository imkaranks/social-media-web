import Avatar from "@/components/ui/Avatar";

export default function ChatHeader({ closeChatbox, friend }) {
  return (
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

      <Avatar user={friend} size="xsmall" />
      <h3>{friend?.username}</h3>

      {/* <div>
        <h3>{friend?.username}</h3>
        {!onlineUsers?.some(
          (onlineUser) => onlineUser === friend?._id,
        ) &&
          friend?.lastSeen && (
            <span className="text-xs text-gray-400 dark:text-neutral-500">
              {new Date(
                friend.lastSeen,
              ).toLocaleTimeString()}
            </span>
          )}
      </div> */}
    </div>
  );
}
