export const MutualFriendsSkeleton = () => {
  return (
    <div className="mt-5 flex gap-2 max-sm:flex-col sm:items-center">
      <div className="flex items-center -space-x-2">
        {new Array(3).fill(0).map((_, idx) => (
          <div
            key={idx}
            style={{ animationDelay: `calc(300ms * ${idx})` }}
            className="h-6 w-6 animate-pulse rounded-full bg-black/5 dark:bg-white/30"
          ></div>
        ))}
      </div>
      <p className="text-xs text-gray-400 dark:text-neutral-500 sm:text-sm">
        Loading mutual friends...
      </p>
    </div>
  );
};

export default function MutualFriends({ mutualFriends }) {
  return (
    <div className="mt-4 flex gap-2 max-sm:flex-col sm:items-center">
      <div className="flex items-center -space-x-2">
        {(mutualFriends.length > 3
          ? mutualFriends.slice(0, 3)
          : mutualFriends
        ).map((mutualFriend, idx) => (
          <img
            key={idx}
            className="inline-block size-6 rounded-full ring-2 ring-gray-100 dark:ring-neutral-700/20"
            src={mutualFriend?.avatar?.url}
            alt={mutualFriend?.fullname}
          />
        ))}
      </div>
      <p className="text-xs text-gray-400 dark:text-neutral-500 sm:text-sm">
        friends with{" "}
        {mutualFriends.length === 1 ? (
          <strong>{mutualFriends[0]?.username}</strong>
        ) : (
          <>
            <strong>{mutualFriends[0]?.username}</strong> and{" "}
            {mutualFriends.length - 1} others
          </>
        )}{" "}
        that you know
      </p>
    </div>
  );
}
