import useAuth from "@/hooks/useAuth";
import useSocket from "@/hooks/useSocket";
import useMessages from "@/hooks/useMessages";
import { useMessagesContext } from "./Messages.hooks";
import Avatar from "@/components/ui/Avatar";
import formatDate from "@/utils/formatDate";
import formatTime from "@/utils/formatTime";
import isToday from "@/utils/isToday";

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

export default function MessageLeftPanelUser({ index, friend }) {
  const { auth } = useAuth();
  const { setActiveConversation } = useMessages();
  const { onlineUsers } = useSocket();
  const { chats, typingUsers, currentConversation, openUserConversation } =
    useMessagesContext();
  const userId = auth?.user?._id;
  const isTyping = typingUsers.includes(friend._id);

  return (
    <div
      className={`${
        index === currentConversation ? "bg-gray-200 dark:bg-neutral-700 " : ""
      }flex group h-full max-h-[4.5rem] cursor-pointer items-center gap-2 rounded-xl p-2 py-2 transition-colors hover:bg-gray-200 dark:hover:bg-neutral-700 md:py-3 2xl:max-h-[4.75rem] 2xl:gap-4`}
      onClick={() => {
        openUserConversation(index);
        setActiveConversation(friend._id);
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
      <div className="h-full flex-1 truncate">
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
        {isTyping ? (
          <span className="truncate text-xs text-green-500 2xl:text-sm">
            typing...
          </span>
        ) : (
          !!chats[friend?._id]?.length && (
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
          )
        )}
      </div>
    </div>
  );
}
