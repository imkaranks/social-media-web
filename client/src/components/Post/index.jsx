import { useState } from "react";
import { Link } from "react-router-dom";
import useLikeHandler from "@/hooks/useLikeHandler";
import useAuth from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";

export default function Post({
  _id,
  title,
  content,
  images,
  author,
  likes,
  likeCount,
  userLikedPost,
  isAuthor,
  commentCount,
  friendsWhoLiked,
  deletePost,
}) {
  const { auth } = useAuth();
  const { toggleLike, isSubmitting: toggleLikePending } = useLikeHandler();

  const [isOpen, setIsOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(userLikedPost ?? false);
  const [likesCount, setLikesCount] = useState(likeCount ?? 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [action, setAction] = useState(null);

  const removePost = async () => {
    setIsSubmitting(true);
    try {
      setAction("deletePost");
      await deletePost(_id);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
      setAction(null);
    }
  };

  return (
    <>
      <article className="my-4 rounded-xl bg-gray-100 p-4 text-sm leading-normal dark:bg-neutral-700/20">
        <header className="flex w-full items-start gap-4">
          <div className="flex items-start gap-2 max-sm:flex-col md:gap-4">
            <Avatar className="size-8 sm:size-9 md:size-10" user={author} />
            <div>
              <p>{author?.username}</p>
              <p>{title}</p>
            </div>
          </div>

          <div className="relative ml-auto mt-2">
            <Button
              size="small"
              variant="ghost"
              className="aspect-square p-1"
              onClick={() => setIsOpen((prev) => !prev)}
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
                  d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            </Button>

            <div
              className={`${isOpen ? "mt-0 opacity-100 " : "pointer-events-none mt-2 opacity-0 "}absolute right-0 top-full grid min-w-40 rounded-lg bg-white p-2 shadow-md transition-[opacity,margin] before:absolute before:-top-4 before:start-0 before:h-4 before:w-full after:absolute after:-bottom-4 after:start-0 after:h-4 after:w-full dark:divide-neutral-700 dark:border dark:border-neutral-700 dark:bg-neutral-800`}
            >
              <Button
                size="small"
                variant="ghost"
                disabled={isSubmitting}
                onClick={() => setAction("savePost")}
                className={
                  action === "savePost" && isSubmitting ? "animate-pulse" : ""
                }
              >
                {action === "savePost" && isSubmitting ? (
                  <>
                    <span
                      className="inline-block size-5 animate-spin rounded-full border-[3px] border-white border-t-transparent text-blue-600"
                      role="status"
                      aria-labelledby="save-label"
                    ></span>
                    <span id="save-label">Saving</span>
                  </>
                ) : (
                  "Save"
                )}
              </Button>
              {isAuthor && deletePost && (
                <>
                  <Button
                    size="small"
                    variant="ghost"
                    disabled={isSubmitting}
                    onClick={() => setAction("editPost")}
                    className={
                      action === "editPost" && isSubmitting
                        ? "animate-pulse"
                        : ""
                    }
                  >
                    {action === "editPost" && isSubmitting ? (
                      <>
                        <span
                          className="inline-block size-5 animate-spin rounded-full border-[3px] border-white border-t-transparent text-blue-600"
                          role="status"
                          aria-labelledby="edit-label"
                        ></span>
                        <span id="edit-label">Editing</span>
                      </>
                    ) : (
                      "Edit"
                    )}
                  </Button>
                  <Button
                    size="small"
                    variant="ghost"
                    disabled={isSubmitting}
                    onClick={removePost}
                    className={
                      action === "deletePost" && isSubmitting
                        ? "animate-pulse"
                        : ""
                    }
                  >
                    {action === "deletePost" && isSubmitting ? (
                      <>
                        <span
                          className="inline-block size-5 animate-spin rounded-full border-[3px] border-white border-t-transparent text-blue-600"
                          role="status"
                          aria-labelledby="delete-label"
                        ></span>
                        <span id="delete-label">deleting</span>
                      </>
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        {!!images?.length && (
          <div className="mt-3 overflow-hidden rounded-xl">
            <img
              src={images[0]?.url}
              className="h-96 w-full object-cover object-center"
              alt={title}
            />
          </div>
        )}

        <div className="my-1.5 flex items-center">
          <Button
            size="small"
            variant="ghost"
            disabled={toggleLikePending}
            onClick={async () => {
              await toggleLike("post", _id);
              setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
              setIsLiked(!isLiked);
            }}
            className="p-2 text-blue-600 hover:bg-blue-100 hover:text-blue-800 dark:text-blue-500 dark:hover:bg-blue-800/30 dark:hover:text-blue-400"
          >
            <span className="sr-only">like</span>
            {isLiked ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentColor"
                className="size-6"
              >
                <path d="M720-120H320v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h218q32 0 56 24t24 56v80q0 7-1.5 15t-4.5 15L794-168q-9 20-30 34t-44 14ZM240-640v520H80v-520h160Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentColor"
                className="size-6"
              >
                <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
              </svg>
            )}
            {!!likesCount && <span>{likesCount}</span>}
          </Button>
          <Button
            as={Link}
            to={`/post/${_id}`}
            size="small"
            variant="ghost"
            className="p-2 text-blue-600 hover:bg-blue-100 hover:text-blue-800 dark:text-blue-500 dark:hover:bg-blue-800/30 dark:hover:text-blue-400"
          >
            <span className="sr-only">Comment</span>
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
                d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
              />
            </svg>
            {!!commentCount && <span>{commentCount}</span>}
          </Button>
          <Button
            size="small"
            variant="ghost"
            className="p-2 text-blue-600 hover:bg-blue-100 hover:text-blue-800 dark:text-blue-500 dark:hover:bg-blue-800/30 dark:hover:text-blue-400"
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
                d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
              />
            </svg>
          </Button>
          <Button
            size="small"
            variant="ghost"
            className="ml-auto p-2 text-blue-600 hover:bg-blue-100 hover:text-blue-800 dark:text-blue-500 dark:hover:bg-blue-800/30 dark:hover:text-blue-400"
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
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              />
            </svg>
          </Button>
        </div>

        {/* Liked by */}
        {!!likes?.length && (
          <div className="mb-1 flex gap-2 max-sm:flex-col sm:items-center">
            <div className="flex items-center -space-x-2">
              {(likes.length > 5 ? likes.slice(0, 5) : likes)
                .filter((likedBy) => likedBy?._id !== auth?.user?._id)
                .map((likedBy, idx) => (
                  <Avatar key={idx} className="size-8" user={likedBy} />
                ))}
            </div>
            {friendsWhoLiked?.length > 0 ? (
              <p className="text-xs sm:text-sm">
                Liked by{" "}
                {friendsWhoLiked?.length >= 1 &&
                  friendsWhoLiked.map((friendWhoLiked, idx) => (
                    <>
                      <strong key={idx}>{friendWhoLiked.username}</strong>
                      {idx !== friendsWhoLiked?.length - 1
                        ? idx !== friendsWhoLiked.length - 2
                          ? ", "
                          : !(likes.length - friendsWhoLiked?.length)
                            ? " and "
                            : ", "
                        : likes.length - friendsWhoLiked?.length
                          ? " and"
                          : ""}
                    </>
                  ))}
                {!!(likes.length - friendsWhoLiked?.length) &&
                  ` ${likes.length - friendsWhoLiked.length} others`}
              </p>
            ) : likes?.length ? (
              <p className="text-xs sm:text-sm">
                Liked by {likes?.length} people.
              </p>
            ) : null}
          </div>
        )}

        <div className="mb-1 text-xs sm:text-sm">
          <p>
            <strong>{author?.username}</strong> {content}{" "}
            <span>#lifestyle</span>
          </p>
        </div>
      </article>
    </>
  );
}
