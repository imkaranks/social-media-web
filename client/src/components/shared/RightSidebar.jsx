import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useFriendshipHandler from "@/hooks/useFriendshipHandler";
import useSocket from "@/hooks/useSocket";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Spinner from "@/components/ui/Spinner";
import formatDate from "@/utils/formatDate";
import useStore from "@/app/store";

function RequestSkeleton() {
  return (
    <div className="w-full rounded-xl bg-black/5 p-4 dark:bg-white/5 [&_*]:animate-pulse">
      <div className="flex gap-2 2xl:gap-4">
        <div className="size-9 rounded-full bg-black/30 dark:bg-white/30"></div>
        <div className="flex-1 space-y-2 max-2xl:text-sm">
          <div className="h-[1.5ch] w-full max-w-[6ch] bg-black/30 dark:bg-white/30"></div>
          <div className="h-[1.5ch] w-full max-w-[12ch] bg-black/30 text-xs dark:bg-white/30 2xl:text-sm"></div>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 2xl:gap-4">
        <div className="h-[3.5ch] w-full max-w-[6.75ch] rounded-lg bg-black/30 dark:bg-white/30"></div>
        <div className="h-[3.5ch] w-full max-w-[6.25ch] rounded-lg bg-black/30 dark:bg-white/30"></div>
      </div>
    </div>
  );
}

export default function RightSidebar() {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const {
    friends,
    isLoading: friendsLoading,
    pendingRequests,
    isSubmitting,
    pendingRequestsLoading,
    acceptRequest,
    rejectRequest,
    sendFriendRequest,
    sendingFriendRequest,
  } = useFriendshipHandler();
  const { onlineUsers } = useSocket();

  const chats = useStore((state) => state.chats);
  const unreadFriendChats = useStore((state) => state.unreadFriendChats);
  // const pendingFriendRequests = useStore(
  //   (state) => state.pendingFriendRequests,
  // );

  const [suggestions, setSuggestions] = useState(null);

  useEffect(() => {
    const getFriendSuggestions = async () => {
      try {
        const response = await axiosPrivate.get(
          `/friend/mutual-suggestion/${auth?.user?._id}`,
        );
        setSuggestions(
          response?.data?.data?.filter((suggestedUser) => {
            if (
              pendingRequests.sent?.find(
                (request) => request.receiver._id === suggestedUser._id,
              )
            )
              return false;
            return true;
          }),
        );
        // console.log(pendingFriendRequests);
      } catch (error) {
        console.log(error?.response?.data?.message);
      }
    };

    // if (!suggestions) {
    // }
    getFriendSuggestions();
  }, [auth, axiosPrivate, friends]);

  return (
    <div className="sticky top-[4.5625rem] h-[calc(100vh-4.5625rem)] w-[calc(100%-0.5rem)] overflow-y-auto p-4 pr-2 max-md:hidden">
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
            {[
              "Primary",
              "General",
              `Request(${pendingRequests?.received?.length || 0})`,
            ].map((text, idx) => (
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
          {friendsLoading ? (
            <Spinner className="flex items-center justify-center" />
          ) : friends.length ? (
            (friends.length > 3 ? friends.slice(0, 3) : friends).map(
              (friend, idx) => {
                const lastMessage =
                  chats[friend?._id]?.[chats[friend?._id]?.length - 1]
                    ?.message ?? "";

                return (
                  <div key={idx} className="flex items-start gap-2 2xl:gap-4">
                    <div className="relative inline-block">
                      <Avatar size="xsmall" user={friend} />
                      {onlineUsers &&
                        onlineUsers.some(
                          (onlineUser) => onlineUser === friend._id,
                        ) && (
                          <span className="absolute bottom-0 end-0 block size-2 rounded-full bg-teal-400 ring-2 ring-gray-200 dark:ring-neutral-700" />
                        )}
                    </div>

                    <div className="flex-1 truncate">
                      <h4 className="max-2xl:text-sm">{friend?.username}</h4>
                      {!!lastMessage?.length && (
                        <p className="truncate text-xs opacity-35 2xl:text-sm">
                          {lastMessage}
                        </p>
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
              },
            )
          ) : (
            <p className="text-gray-400 dark:text-neutral-500 max-2xl:text-sm">
              No friends yet
            </p>
          )}
        </div>
      </div>

      {/* friend requests */}
      <div>
        <h3 className="mb-4">Requests received</h3>
        <div className="mb-4 space-y-4">
          {pendingRequestsLoading ? (
            <>
              <RequestSkeleton />
              <RequestSkeleton />
            </>
          ) : pendingRequests?.received?.length ? (
            pendingRequests?.received.map((pendingRequest, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-gray-200 p-4 dark:bg-neutral-700"
              >
                <div className="mb-2 flex gap-2 2xl:gap-4">
                  <Link to={`/user/${pendingRequest.sender._id}`}>
                    <Avatar size="xsmall" user={pendingRequest.sender} />
                  </Link>
                  <div className="max-2xl:text-sm">
                    <h4>{pendingRequest.sender.username}</h4>
                    {!!pendingRequest?.mutualFriendsCount && (
                      <p className="text-xs text-gray-400 dark:text-neutral-400 2xl:text-sm">
                        {pendingRequest.mutualFriendsCount} mutual friend
                        {pendingRequest.mutualFriendsCount > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs 2xl:gap-4 2xl:text-sm">
                  <Button
                    size="small"
                    onClick={() => acceptRequest(pendingRequest._id)}
                    disabled={isSubmitting}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => rejectRequest(pendingRequest._id)}
                    disabled={isSubmitting}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 dark:text-neutral-500 max-2xl:text-sm">
              No requests received
            </p>
          )}
        </div>

        <h3 className="mb-4">Requests sent</h3>
        <div className="space-y-4">
          {pendingRequestsLoading ? (
            <>
              <RequestSkeleton />
              <RequestSkeleton />
            </>
          ) : pendingRequests?.sent?.length ? (
            pendingRequests?.sent.map((pendingRequest, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-gray-200 p-4 dark:bg-neutral-700"
              >
                <div className="mb-2 flex gap-2 2xl:gap-4">
                  <Link to={`/user/${pendingRequest.receiver._id}`}>
                    <Avatar size="xsmall" user={pendingRequest.receiver} />
                  </Link>
                  <div className="max-2xl:text-sm">
                    <h4>{pendingRequest.receiver.username}</h4>
                    {!!pendingRequest?.mutualFriendsCount && (
                      <p className="text-xs text-gray-400 dark:text-neutral-400 2xl:text-sm">
                        {pendingRequest.mutualFriendsCount} mutual friend
                        {pendingRequest.mutualFriendsCount > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs opacity-75 2xl:text-sm">
                  Sent on: {formatDate(pendingRequest.createdAt)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 dark:text-neutral-500 max-2xl:text-sm">
              No requests sent
            </p>
          )}
        </div>
      </div>

      {/* friend suggestions */}
      <div className="mt-4">
        <h3 className="mb-4">Suggestions</h3>
        <div className="space-y-4">
          {!suggestions ? (
            <>
              <RequestSkeleton />
              <RequestSkeleton />
            </>
          ) : suggestions?.length ? (
            suggestions.map((suggestions, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-gray-200 p-4 dark:bg-neutral-700"
              >
                <div className="mb-2 flex gap-2 2xl:gap-4">
                  <Link to={`/user/${suggestions._id}`}>
                    <Avatar size="small" user={suggestions} />
                  </Link>
                  <div className="max-2xl:text-sm">
                    <h4>{suggestions.fullname}</h4>
                    <p className="text-gray-400 dark:text-neutral-500">
                      {suggestions.username}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs 2xl:gap-4 2xl:text-sm">
                  <Button
                    size="small"
                    disabled={sendingFriendRequest}
                    onClick={async () => {
                      try {
                        await sendFriendRequest(suggestions._id);
                      } catch (error) {
                        console.error("Failed to send friend request");
                      }
                    }}
                  >
                    Add Friend
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 dark:text-neutral-500 max-2xl:text-sm">
              No friend suggestions
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
