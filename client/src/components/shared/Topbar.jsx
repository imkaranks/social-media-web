import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useLogout from "@/hooks/useLogout";
import useDebounce from "@/hooks/useDebounce";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
// import useStore from "@/app/store";

const initialUsersState = [];

export default function Topbar() {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { logout, isSubmitting } = useLogout();

  // const users = useStore((state) => state.search.users);
  // const setSearchUsers = useStore((state) => state.setSearchUsers);
  // const setSearchPosts = useStore((state) => state.setSearchPosts);

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [users, setUsers] = useState(initialUsersState);
  const debouncedQuery = useDebounce(query);
  const source = axios.CancelToken.source();

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      if (!debouncedQuery?.trim()) {
        throw new Error("Please provide some search keyword");
      }
      source.cancel();
      navigate(`/search/?query=${debouncedQuery?.trim()}`);
      setUsers(initialUsersState);
    } catch (error) {
      console.log(error?.response?.data?.message || error?.message || error);
    }
  };

  useEffect(() => {
    const searchQuery = async () => {
      setIsSearching(true);
      try {
        if (!debouncedQuery?.trim()) {
          setUsers(initialUsersState);
          return;
        }

        const response = await axiosPrivate.get(
          `/user/search/?keyword=${debouncedQuery?.trim()}`,
          { source: source.token },
        );
        source.cancel();
        setUsers(response?.data?.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.log(
            error?.response?.data?.message || error?.message || error,
          );
        }
        setUsers(initialUsersState);
      } finally {
        setIsSearching(false);
      }
    };

    searchQuery();
  }, [debouncedQuery, axiosPrivate]);

  return (
    <header className="sticky top-0 z-50 border-b border-b-gray-200 bg-white py-4 dark:border-b-neutral-700 dark:bg-neutral-800">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4">
        <Link to="/" className="font-semibold sm:text-lg 2xl:text-xl">
          QuietSphere
        </Link>

        <form
          onSubmit={handleSubmit}
          className="relative flex w-2/5 rounded-full bg-gray-200 px-3 py-2 dark:bg-neutral-700 max-md:hidden"
        >
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
            className="w-full min-w-0 flex-1 bg-transparent px-2 outline-none"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            size="small"
            type="button"
            variant="ghost"
            className="p-0"
            disabled={isSearching}
            onClick={() => setQuery("")}
          >
            {isSearching ? (
              <div
                className="inline-block size-5 animate-spin rounded-full border-[3px] border-white border-t-transparent text-blue-600"
                role="status"
                aria-label="loading"
              >
                <span className="sr-only">Searching...</span>
              </div>
            ) : debouncedQuery?.trim() > 0 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
                className="size-5"
              >
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            ) : null}
          </Button>
          {users.length > 0 && (
            <div className="absolute left-0 top-full z-50 w-full rounded-lg border border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
              <div className="max-h-72 overflow-hidden overflow-y-auto rounded-b-lg [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar]:w-2">
                <div className="m-3 mb-1 text-xs uppercase text-gray-500 dark:text-neutral-500">
                  Users
                </div>
                {users?.map((user, idx) => (
                  <div
                    key={idx}
                    className="flex w-full cursor-pointer items-center px-4 py-2 text-sm text-gray-800 transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                    onClick={() => {
                      navigate(`/user/${user?._id}`);
                      setQuery("");
                      setUsers(initialUsersState);
                    }}
                  >
                    <div className="flex w-full items-center">
                      <div className="me-2.5 flex size-6 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                        <img
                          className="h-full w-full flex-shrink-0 object-cover object-center"
                          src={user?.avatar?.url}
                          alt={user?.fullname}
                        />
                      </div>
                      <div>{user?.username}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>

        {/* {isSearching && (
        <button onClick={() => controller.abort()}>Cancel</button>
        )} */}

        <div className="flex items-center gap-2.5 md:gap-4 lg:gap-6 2xl:gap-8">
          <Button as="label" htmlFor="create-post">
            Create
          </Button>

          {auth && (
            <div className="hs-dropdown relative inline-flex">
              <button
                id="avatar-dropdown"
                type="button"
                className="bg-transparent"
                onClick={() => setIsOpen((prevState) => !prevState)}
              >
                <Avatar size="xsmall" user={auth?.user} />
              </button>
              <div
                className={`${isOpen ? "mt-0 opacity-100 " : "pointer-events-none mt-2 opacity-0 "}absolute right-0 top-12 z-50 min-w-60 rounded-lg bg-white p-2 shadow-md transition-[opacity,margin] focus-within:opacity-100 dark:border dark:border-neutral-700 dark:bg-neutral-800`}
                aria-labelledby="avatar-dropdown"
              >
                <div className="-m-2 rounded-t-lg bg-gray-100 px-5 py-3 dark:bg-neutral-700">
                  <p className="text-sm text-gray-500 dark:text-neutral-400">
                    Signed in as
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-neutral-300">
                    {auth?.user?.email}
                  </p>
                </div>
                <div className="mt-2 py-2 first:pt-0 last:pb-0">
                  <Link
                    className="flex items-center gap-x-3.5 rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                    to={`/user/${auth?.user?._id}`}
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
                    Profile
                  </Link>
                  <Link
                    className="flex items-center gap-x-3.5 rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                    to="/settings"
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
                    Settings
                  </Link>
                  <button
                    className="flex w-full items-center gap-x-3.5 rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                    disabled={isSubmitting}
                    onClick={logout}
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
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
