import { useMessagesContext } from "./Messages.hooks";
import MessageLeftPanelUser from "./MessageLeftPanelUser";

export default function MessagesLeftSidebar() {
  const { friends, friendsLoading, messagesLoading } = useMessagesContext();

  return (
    <div className="h-full overflow-y-auto border-r border-r-gray-200 p-4 dark:border-r-neutral-700 md:px-2">
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

      {/* Display friends list */}
      {friendsLoading || messagesLoading ? (
        <p>Loading</p>
      ) : friends.length ? (
        friends.map((friend, idx) => (
          <MessageLeftPanelUser key={idx} index={idx} friend={friend} />
        ))
      ) : (
        <p>No friends yet</p>
      )}
    </div>
  );
}
