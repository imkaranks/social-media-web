import useAuth from "@/hooks/useAuth";
import useSocket from "@/hooks/useSocket";
import useMessages from "@/hooks/useMessages";
import Avatar from "@/components/ui/Avatar";
import formatDate from "@/utils/formatDate";
import formatTime from "@/utils/formatTime";
import isToday from "@/utils/isToday";
import useStore from "@/app/store";

const LastMessageTimestamp = ({ createdAt }) => {
  if (!createdAt) return null;

  const isTodayDate = isToday(createdAt);
  const formattedTime = isTodayDate
    ? formatTime(createdAt)
    : formatDate(createdAt);

  return (
    <time className="ml-auto text-[0.675rem] opacity-35 2xl:text-xs">
      {formattedTime}
    </time>
  );
};

export default function ChatUser({
  index,
  openChatbox,
  currentConversation,
  friend,
  // unreadFriendChats,
}) {
  const { auth } = useAuth();
  const {
    // unreadChatIds,
    setCurrentParticipant,
  } = useMessages();
  const { onlineUsers } = useSocket();
  const chats = useStore((state) => state.chats);
  const userId = auth?.user?._id;

  return (
    <div
      className={`${
        index === currentConversation ? "bg-gray-200 dark:bg-neutral-700 " : ""
      }flex group cursor-pointer items-center gap-2 rounded-xl p-2 py-2 transition-colors hover:bg-gray-200 dark:hover:bg-neutral-700 md:py-3 2xl:gap-4`}
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
          {chats[friend?._id]?.length > 0 &&
            !!chats[friend?._id][chats[friend?._id]?.length - 1]?.createdAt && (
              <LastMessageTimestamp
                createdAt={
                  chats[friend?._id][chats[friend?._id].length - 1].createdAt
                }
              />
            )}
        </div>
        {!!chats[friend?._id]?.length && (
          <div className="flex flex-wrap items-center gap-2 text-sm 2xl:text-base">
            <p className="flex truncate opacity-35">
              {`${
                chats[friend?._id][chats[friend?._id].length - 1].sender ===
                userId
                  ? "me: "
                  : ""
              }${chats[friend?._id][chats[friend?._id].length - 1].message}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
