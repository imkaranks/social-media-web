import { useState } from "react";
import { Link } from "react-router-dom";

export default function Topbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-b-gray-200 bg-white py-4 dark:border-b-neutral-700 dark:bg-neutral-800">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4">
        <Link to="/" className="font-semibold sm:text-lg 2xl:text-xl">
          QuietSphere
        </Link>

        <div className="flex w-2/5 overflow-hidden rounded-full bg-gray-200 px-3 py-2 dark:bg-neutral-700 max-md:hidden">
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
            placeholder="#Explore"
          />
        </div>

        <div className="flex items-center gap-2.5 md:gap-4 lg:gap-6 2xl:gap-8">
          <label
            className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
            htmlFor="create-post"
          >
            Create
          </label>

          <div className="hs-dropdown relative inline-flex">
            <button
              id="avatar-dropdown"
              type="button"
              className="bg-transparent"
              onClick={() => setIsDropdownOpen((prevState) => !prevState)}
            >
              <img
                className="inline-block size-9 rounded-full"
                src="https://avatars.githubusercontent.com/u/109339437?v=4"
                alt="My Profile"
              />
            </button>
            <div
              className={`${isDropdownOpen ? "mt-0 opacity-100 " : "pointer-events-none mt-2 opacity-0 "}absolute right-0 top-12 z-50 min-w-60 rounded-lg bg-white p-2 shadow-md transition-[opacity,margin] focus-within:opacity-100 dark:border dark:border-neutral-700 dark:bg-neutral-800`}
              aria-labelledby="avatar-dropdown"
            >
              <div className="-m-2 rounded-t-lg bg-gray-100 px-5 py-3 dark:bg-neutral-700">
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  Signed in as
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-neutral-300">
                  karan@test.com
                </p>
              </div>
              <div className="mt-2 py-2 first:pt-0 last:pb-0">
                <a
                  className="flex items-center gap-x-3.5 rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                  href="#"
                >
                  <svg
                    className="size-4 flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                  Newsletter
                </a>
                <a
                  className="flex items-center gap-x-3.5 rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                  href="#"
                >
                  <svg
                    className="size-4 flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx={8} cy={21} r={1} />
                    <circle cx={19} cy={21} r={1} />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                  </svg>
                  Purchases
                </a>
                <a
                  className="flex items-center gap-x-3.5 rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                  href="#"
                >
                  <svg
                    className="size-4 flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                    <path d="M12 12v9" />
                    <path d="m8 17 4 4 4-4" />
                  </svg>
                  Downloads
                </a>
                <a
                  className="flex items-center gap-x-3.5 rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                  href="#"
                >
                  <svg
                    className="size-4 flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx={9} cy={7} r={4} />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Team Account
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
