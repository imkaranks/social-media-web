import { useState, memo } from "react";

export const FriendRequestControlsSkeleton = () => {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 2xl:gap-4">
      <div className="h-[2.375rem] w-24 animate-pulse rounded-lg bg-black/5 px-3 py-2 dark:bg-white/30"></div>
    </div>
  );
};

export default memo(function FriendRequestControls({
  userId,
  alreadyFriend,
  receivedRequest,
  isSubmitting,
  acceptRequest,
  rejectRequest,
  removeFriend,
  didSentRequest,
  sendingFriendRequest,
  sendFriendRequest,
}) {
  const [sentRequest, setSentRequest] = useState(didSentRequest(userId));

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 2xl:gap-4">
      {alreadyFriend && (
        <button
          disabled={isSubmitting}
          className="inline-flex items-center rounded-lg border border-transparent bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-200 dark:bg-white/10 dark:text-neutral-400 dark:hover:bg-white/20 dark:hover:text-neutral-300"
          onClick={() => removeFriend(userId)}
        >
          Remove friend
        </button>
      )}

      {!alreadyFriend && sentRequest && (
        <div className="flex items-center">
          <span className="mr-2 text-gray-500">Friend request sent</span>
          <button
            className="inline-flex items-center rounded-lg border border-transparent bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-200 dark:bg-white/10 dark:text-neutral-400 dark:hover:bg-white/20 dark:hover:text-neutral-300"
            onClick={() => setSentRequest(false)} // TODO: Allow cancel
          >
            Cancel Request
          </button>
        </div>
      )}

      {!alreadyFriend && !sentRequest && receivedRequest && (
        <>
          <button
            disabled={isSubmitting}
            onClick={() => acceptRequest(receivedRequest?._id)}
            className="inline-flex items-center rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
          >
            Accept
          </button>
          <button
            disabled={isSubmitting}
            onClick={() => rejectRequest(receivedRequest?._id)}
            className="inline-flex items-center rounded-lg border border-transparent bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-50 dark:bg-white/10 dark:text-neutral-400 dark:hover:bg-white/20 dark:hover:text-neutral-300"
          >
            Reject
          </button>
        </>
      )}

      {!alreadyFriend && !sentRequest && !receivedRequest && (
        <button
          disabled={sendingFriendRequest}
          className="inline-flex items-center rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
          onClick={async () => {
            await sendFriendRequest(userId);
            setSentRequest(true);
          }}
        >
          Send Friend Request
        </button>
      )}
    </div>
  );
});
