export const UserInfoSkeleton = () => {
  return (
    <div>
      <div className="mb-2 h-6 max-w-24 animate-pulse rounded-md bg-black/5 dark:bg-white/30"></div>
      <div className="h-4 max-w-36 animate-pulse rounded-md bg-black/5 dark:bg-white/30"></div>
      <div className="mt-4 h-4 animate-pulse rounded-md bg-black/5 dark:bg-white/30"></div>
      <div className="mt-2 h-4 w-3/5 max-w-64 animate-pulse rounded-md bg-black/5 dark:bg-white/30"></div>
    </div>
  );
};

export default function UserInfo({ user }) {
  return (
    <div>
      <h3 className="font-semibold text-gray-800 dark:text-white">
        {user?.fullname}
      </h3>
      <p className="text-sm font-medium text-gray-400 dark:text-neutral-500">
        {user?.email}
      </p>
      {user?.bio && <p className="mt-4">{user.bio}</p>}

      {user?.location && (
        <div className="mt-2 flex items-center gap-1 text-sm text-gray-400 dark:text-neutral-500">
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
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>

          {user.location && <span>{user.location}</span>}
        </div>
      )}
    </div>
  );
}
