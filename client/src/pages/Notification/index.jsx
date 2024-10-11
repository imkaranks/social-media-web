import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useNotifications from "@/hooks/useNotifications";
import Spinner from "@/components/ui/Spinner";
import {
  generateNotificationMessage,
  generateNotificationAuthorAvatar,
} from "@/utils/notificationUtils";
import isToday from "@/utils/isToday";
import formatDate from "@/utils/formatDate";
import formatTime from "@/utils/formatTime";

export default function Notification() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoading, notifications, totalPages, getNotifications } =
    useNotifications();
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  );

  useEffect(() => {
    getNotifications({ page: Number(searchParams.get("page")) });
  }, [searchParams, getNotifications]);

  return isLoading ? (
    <Spinner className="flex h-[calc(100vh-4.5625rem)] items-center justify-center" />
  ) : (
    <div className="bg-gray-20 dark:bg-neutral-70 flex min-h-[calc(100vh-4.5625rem)] flex-col rounded-xl p-4 md:pr-0">
      <div className="flex items-center justify-between border-b-2 border-gray-100 p-4 dark:border-white/5 md:px-6">
        <h2 className="font-semibold md:text-lg">Notifications</h2>
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
      </div>

      <div>
        {notifications.map((notification, idx) => {
          const [avatar, alt] = generateNotificationAuthorAvatar(notification);

          return (
            <div
              key={idx}
              className="flex items-start gap-4 border-b-2 border-gray-100 p-4 text-[var(--clr-notification)] dark:border-white/5 dark:text-[var(--clr-notification-dark)] md:px-6"
              style={{
                "--clr-notification":
                  idx % 2 === 0 ? "rgb(0 0 0)" : "rgb(0 0 0 / 0.6)",
                "--clr-notification-dark":
                  idx % 2 === 0 ? "rgb(255 255 255)" : "rgb(255 255 255 / 0.6)",
              }}
            >
              <img
                className="inline-block size-8 rounded-full sm:size-9 md:size-10"
                src={avatar}
                alt={alt}
              />
              <div className="flex-1">
                <h3>{generateNotificationMessage(notification)}</h3>
                <p className="text-sm text-gray-400 dark:text-neutral-500">
                  {notification?.createdAt
                    ? isToday(notification.createdAt)
                      ? formatTime(notification.createdAt)
                      : formatDate(notification.createdAt)
                    : "now"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <nav
          className="mt-auto flex flex-wrap items-center justify-center gap-x-1"
          aria-label="Pagination"
        >
          <button
            type="button"
            className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center gap-x-1.5 rounded-lg px-2.5 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
            aria-label="Previous"
            onClick={() => {
              if (currentPage <= 1) return;
              const query = new URLSearchParams({ page: currentPage - 1 });
              setCurrentPage(currentPage - 1);
              setSearchParams(query);
            }}
            disabled={currentPage === 1}
          >
            <svg
              className="size-3.5 shrink-0"
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
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>Previous</span>
          </button>
          <div className="flex flex-wrap items-center justify-center gap-x-1">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => {
                  const query = new URLSearchParams({ page: index + 1 });
                  setCurrentPage(index + 1);
                  setSearchParams(query);
                }}
                disabled={currentPage === index + 1}
                type="button"
                className={
                  currentPage === index + 1
                    ? "flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg bg-gray-200 px-3 py-2 text-sm text-gray-800 focus:bg-gray-300 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-600 dark:text-white dark:focus:bg-neutral-500"
                    : "flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
                }
                // aria-current="page"
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center gap-x-1.5 rounded-lg px-2.5 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
            aria-label="Next"
            onClick={() => {
              if (currentPage >= totalPages) return;
              const query = new URLSearchParams({ page: currentPage + 1 });
              setCurrentPage(currentPage + 1);
              setSearchParams(query);
            }}
            disabled={currentPage === totalPages}
          >
            <span>Next</span>
            <svg
              className="size-3.5 shrink-0"
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
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </nav>
      )}
    </div>
  );
}
