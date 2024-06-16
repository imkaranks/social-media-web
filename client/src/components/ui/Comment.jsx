import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { Link } from "react-router-dom";

export default function Comment({
  _id,
  user,
  createdAt,
  content,
  removeComment,
  replyComment,
}) {
  const { auth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [reply, setReply] = useState("");
  const isAuthor = auth?.user?._id === user?._id;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await replyComment(_id, reply);
      setReply("");
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Link to={`/user/${user?.username}`}>
        {user?.avatar?.url ? (
          <img
            className="inline-block size-8 rounded-full object-cover ring-2 ring-gray-100 dark:ring-neutral-700/20"
            src={user.avatar.url}
            alt={user.username}
          />
        ) : (
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold leading-none text-gray-800 dark:bg-white/10 dark:text-white">
            {user?.fullname?.split(" ").map((word) => word[0].toUpperCase())}
          </span>
        )}
      </Link>
      <div className="flex-1">
        <div className="flex items-center gap-6">
          <Link to={`/user/${user?.username}`} className="font-semibold">
            {user.username}
          </Link>
          <span className="list-item list-disc pl-0 text-xs text-gray-400 dark:text-neutral-500">
            <time className="relative -left-1">
              {new Date(createdAt).toLocaleTimeString()}
            </time>
          </span>
        </div>

        <p className="mt-2">{content}</p>

        <div className="mt-1 flex items-center">
          <button className="inline-flex items-center gap-x-1 rounded-full border border-transparent px-2 py-1 text-xs font-medium text-gray-800 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-neutral-700 2xl:text-sm">
            <svg
              fill="currentColor"
              height={16}
              viewBox="0 0 20 20"
              width={16}
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
            >
              <path d="M12.877 19H7.123A1.125 1.125 0 0 1 6 17.877V11H2.126a1.114 1.114 0 0 1-1.007-.7 1.249 1.249 0 0 1 .171-1.343L9.166.368a1.128 1.128 0 0 1 1.668.004l7.872 8.581a1.25 1.25 0 0 1 .176 1.348 1.113 1.113 0 0 1-1.005.7H14v6.877A1.125 1.125 0 0 1 12.877 19ZM7.25 17.75h5.5v-8h4.934L10 1.31 2.258 9.75H7.25v8ZM2.227 9.784l-.012.016c.01-.006.014-.01.012-.016Z" />
            </svg>
            <span>Like</span>
          </button>
          <button
            className="inline-flex items-center gap-x-1 rounded-full border border-transparent px-2 py-1 text-xs font-medium text-gray-800 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-neutral-700 2xl:text-sm"
            onClick={() => setIsOpen((prev) => !prev)}
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
                d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
              />
            </svg>
            <span>Reply</span>
          </button>
          {isAuthor && (
            <button
              className="inline-flex items-center gap-x-1 rounded-full border border-transparent px-2 py-1 text-xs font-medium text-gray-800 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-neutral-700 2xl:text-sm"
              onClick={() => removeComment(_id)}
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
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>

              <span>Delete</span>
            </button>
          )}
        </div>

        {isOpen && (
          <form className="mt-2 grid max-w-md gap-2" onSubmit={handleSubmit}>
            <textarea
              className="block w-full resize-none rounded-lg border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
              placeholder="Enter Reply"
              rows={2}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
            <button
              type="submit"
              className="mr-auto inline-flex items-center rounded-lg border border-transparent bg-blue-600 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 2xl:text-sm"
            >
              Reply
            </button>
          </form>
        )}
      </div>
    </>
  );
}
