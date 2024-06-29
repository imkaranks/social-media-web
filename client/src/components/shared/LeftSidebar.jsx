import { Link, NavLink, useLocation } from "react-router-dom";
import useLogout from "@/hooks/useLogout";
import useAuth from "@/hooks/useAuth";
import useStore from "@/app/store";

export default function LeftSidebar() {
  const { auth } = useAuth();
  const location = useLocation();
  const { logout, isSubmitting } = useLogout();
  const unreadFriendChats = useStore((state) => state.unreadFriendChats);
  const unreadChats =
    location.pathname !== "/messages" &&
    Object.values(unreadFriendChats).reduce(
      (cnt, item) => (item > 0 ? cnt + 1 : cnt),
      0,
    );

  return (
    <aside className="sticky top-[4.5625rem] z-50 h-[calc(100vh-4.5625rem)] border-r border-r-gray-200 bg-white p-4 dark:border-r-neutral-700 dark:bg-neutral-800 xl:space-y-8 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar]:w-2">
      <Link className="max-xl:hidden" to={`/user/${auth?.user?.username}`}>
        <div className="group">
          <div className="flex items-center">
            {auth?.user?.avatar?.url ? (
              <img
                className="inline-block size-14 flex-shrink-0 rounded-full object-cover"
                src={auth.user.avatar.url}
                alt={auth?.user?.fullname}
              />
            ) : (
              <span className="inline-flex size-14 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold leading-none text-gray-800 dark:bg-white/10 dark:text-white">
                {auth?.user?.fullname
                  .split(" ")
                  .map((word) => word[0].toUpperCase())}
              </span>
            )}
            <div className="ms-3">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {auth?.user?.fullname}
              </h3>
              <p className="text-sm font-medium text-gray-400 dark:text-neutral-500">
                {auth?.user?.email}
              </p>
            </div>
          </div>
        </div>
      </Link>

      <nav>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${isActive ? "bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-white " : "text-gray-700 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 "}group relative flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 max-2xl:text-sm max-xl:p-2`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 sm:size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              <span className="max-xl:invisible max-xl:absolute max-xl:left-[calc(100%+0.25rem)] max-xl:z-50 max-xl:inline-block max-xl:rounded max-xl:bg-gray-900 max-xl:px-2 max-xl:py-1 max-xl:text-xs max-xl:font-medium max-xl:text-white max-xl:opacity-0 max-xl:shadow-sm max-xl:transition-opacity max-xl:group-hover:visible max-xl:group-hover:opacity-100 max-xl:dark:bg-neutral-700">
                Home
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/explore"
              className={({ isActive }) =>
                `${isActive ? "bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-white " : "text-gray-700 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 "}group relative flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 max-2xl:text-sm max-xl:p-2`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 sm:size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>
              <span className="max-xl:invisible max-xl:absolute max-xl:left-[calc(100%+0.25rem)] max-xl:z-50 max-xl:inline-block max-xl:rounded max-xl:bg-gray-900 max-xl:px-2 max-xl:py-1 max-xl:text-xs max-xl:font-medium max-xl:text-white max-xl:opacity-0 max-xl:shadow-sm max-xl:transition-opacity max-xl:group-hover:visible max-xl:group-hover:opacity-100 max-xl:dark:bg-neutral-700">
                Explore
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/notification"
              className={({ isActive }) =>
                `${isActive ? "bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-white " : "text-gray-700 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 "}group relative flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 max-2xl:text-sm max-xl:p-2`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 sm:size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
              <span className="max-xl:invisible max-xl:absolute max-xl:left-[calc(100%+0.25rem)] max-xl:z-50 max-xl:inline-block max-xl:rounded max-xl:bg-gray-900 max-xl:px-2 max-xl:py-1 max-xl:text-xs max-xl:font-medium max-xl:text-white max-xl:opacity-0 max-xl:shadow-sm max-xl:transition-opacity max-xl:group-hover:visible max-xl:group-hover:opacity-100 max-xl:dark:bg-neutral-700">
                Notification
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/user/${auth?.user?.username}`}
              className={({ isActive }) =>
                `${isActive ? "bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-white " : "text-gray-700 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 "}group relative flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 max-2xl:text-sm max-xl:p-2`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 sm:size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              <span className="max-xl:invisible max-xl:absolute max-xl:left-[calc(100%+0.25rem)] max-xl:z-50 max-xl:inline-block max-xl:rounded max-xl:bg-gray-900 max-xl:px-2 max-xl:py-1 max-xl:text-xs max-xl:font-medium max-xl:text-white max-xl:opacity-0 max-xl:shadow-sm max-xl:transition-opacity max-xl:group-hover:visible max-xl:group-hover:opacity-100 max-xl:dark:bg-neutral-700">
                Profile
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/messages"
              className={({ isActive }) =>
                `${isActive ? "bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-white " : "text-gray-700 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 "}group relative flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 max-2xl:text-sm max-xl:p-2`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 sm:size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                />
              </svg>
              <span className="max-xl:invisible max-xl:absolute max-xl:left-[calc(100%+0.25rem)] max-xl:z-50 max-xl:inline-block max-xl:rounded max-xl:bg-gray-900 max-xl:px-2 max-xl:py-1 max-xl:text-xs max-xl:font-medium max-xl:text-white max-xl:opacity-0 max-xl:shadow-sm max-xl:transition-opacity max-xl:group-hover:visible max-xl:group-hover:opacity-100 max-xl:dark:bg-neutral-700">
                Messages
              </span>
              {!!unreadChats && (
                <span className="absolute -right-1 inline-grid size-6 place-items-center rounded-full bg-blue-600 text-sm font-medium max-xl:-top-1 xl:right-2">
                  {unreadChats}
                </span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/bookmarks"
              className={({ isActive }) =>
                `${isActive ? "bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-white " : "text-gray-700 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 "}group relative flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 max-2xl:text-sm max-xl:p-2`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 sm:size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                />
              </svg>
              <span className="max-xl:invisible max-xl:absolute max-xl:left-[calc(100%+0.25rem)] max-xl:z-50 max-xl:inline-block max-xl:rounded max-xl:bg-gray-900 max-xl:px-2 max-xl:py-1 max-xl:text-xs max-xl:font-medium max-xl:text-white max-xl:opacity-0 max-xl:shadow-sm max-xl:transition-opacity max-xl:group-hover:visible max-xl:group-hover:opacity-100 max-xl:dark:bg-neutral-700">
                Bookmarks
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `${isActive ? "bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-white " : "text-gray-700 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 "}group relative flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 max-2xl:text-sm max-xl:p-2`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 sm:size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              <span className="max-xl:invisible max-xl:absolute max-xl:left-[calc(100%+0.25rem)] max-xl:z-50 max-xl:inline-block max-xl:rounded max-xl:bg-gray-900 max-xl:px-2 max-xl:py-1 max-xl:text-xs max-xl:font-medium max-xl:text-white max-xl:opacity-0 max-xl:shadow-sm max-xl:transition-opacity max-xl:group-hover:visible max-xl:group-hover:opacity-100 max-xl:dark:bg-neutral-700">
                Settings
              </span>
            </NavLink>
          </li>
          <li>
            <button
              disabled={isSubmitting}
              onClick={logout}
              className="group relative flex w-full items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-gray-700 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 max-2xl:text-sm max-xl:p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 sm:size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
              </svg>
              <span className="max-xl:invisible max-xl:absolute max-xl:left-[calc(100%+0.25rem)] max-xl:z-50 max-xl:inline-block max-xl:rounded max-xl:bg-gray-900 max-xl:px-2 max-xl:py-1 max-xl:text-xs max-xl:font-medium max-xl:text-white max-xl:opacity-0 max-xl:shadow-sm max-xl:transition-opacity max-xl:group-hover:visible max-xl:group-hover:opacity-100 max-xl:dark:bg-neutral-700">
                Logout
              </span>
            </button>
          </li>
        </ul>
      </nav>

      <div className="max-xl:hidden">
        <label
          className="inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 max-2xl:text-sm"
          htmlFor="create-post"
        >
          Create
        </label>
      </div>
    </aside>
  );
}
