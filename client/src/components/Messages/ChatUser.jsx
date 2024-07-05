import Avatar from "@/components/ui/Avatar";

export default function ChatUser({
  index,
  loggedUserId,
  openChatbox,
  currentConversation,
  setCurrentParticipant,
  friend,
  onlineUsers,
  chats,
  unreadFriendChats,
}) {
  return (
    <div
      className={`${
        index === currentConversation ? "bg-gray-200 dark:bg-neutral-700 " : ""
      }flex group cursor-pointer items-start gap-2 rounded-xl p-2 py-2 hover:bg-gray-200 dark:hover:bg-neutral-700 md:py-3 2xl:gap-4`}
      onClick={() => {
        openChatbox(index);
        setCurrentParticipant(friend._id);
      }}
    >
      <div className="relative inline-block">
        <Avatar user={friend} className="size-10 2xl:size-12" size="xsmall" />
        {/* Online status indicator */}
        {onlineUsers &&
          onlineUsers.some((onlineUser) => onlineUser === friend._id) && (
            <span
              className={`${
                index === currentConversation
                  ? "ring-gray-200 dark:ring-neutral-700 "
                  : "ring-white group-hover:ring-gray-200 dark:ring-neutral-800 dark:group-hover:ring-neutral-700 "
              }absolute bottom-0 end-0 block size-2 rounded-full bg-teal-400 ring-2`}
            />
          )}
      </div>

      {/* Friend username and last message */}
      <div className="flex-1 truncate">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="flex-1 text-base 2xl:text-lg">{friend.username}</h4>
          {!!chats[friend?._id][chats[friend?._id].length - 1]?.createdAt && (
            <time className="ml-auto text-[0.675rem] opacity-35 2xl:text-xs">
              {new Date(
                chats[friend?._id][chats[friend?._id].length - 1].createdAt,
              ).toLocaleTimeString()}
            </time>
          )}
        </div>
        {!!chats[friend?._id]?.length && (
          <div className="flex flex-wrap items-center gap-2 text-sm 2xl:text-base">
            <p className="flex truncate opacity-35">
              {`${
                chats[friend?._id][chats[friend?._id].length - 1].sender ===
                loggedUserId
                  ? "me: "
                  : ""
              }${chats[friend?._id][chats[friend?._id].length - 1].message}`}
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
              className={`ml-auto size-[1.6ch] ${!unreadFriendChats[friend._id] ? "text-blue-400" : ""}`}
            >
              <path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z" />
            </svg>
          </div>
        )}
      </div>

      {/* Unread messages count */}
      {!!unreadFriendChats[friend._id] && (
        <span className="mt-auto inline-grid size-5 place-items-center rounded-full bg-blue-500 text-[0.65rem] font-medium text-white">
          {unreadFriendChats[friend._id]}
        </span>
      )}
    </div>
  );
}
