import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import useAuth from "@/hooks/useAuth";
import useLikeHandler from "@/hooks/useLikeHandler";
import Button from "@/components/ui/Button";

export default function PostEngagement({
  postId,
  likes,
  likeCount,
  userLikedPost,
  commentCount,
}) {
  const { toggleLike, isSubmitting } = useLikeHandler();

  const [isLiked, setIsLiked] = useState(userLikedPost ?? false);
  const [likesCount, setLikesCount] = useState(0);

  const handleLikeClick = async () => {
    try {
      await toggleLike("post", postId);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
      setIsLiked(!isLiked);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLikesCount(likeCount);
  }, [likeCount]);

  return (
    <div className="my-1.5 flex items-center">
      <Button
        size="small"
        variant="ghost"
        disabled={isSubmitting}
        onClick={handleLikeClick}
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
        {isSubmitting ? (
          <>
            <span
              className="inline-block size-3 animate-spin rounded-full border-[3px] border-white border-t-transparent text-blue-600"
              role="status"
              aria-labelledby="like-label"
            ></span>
            <span className="sr-only" id="like-label">
              {isLiked ? "Unliking" : "Liking"}
            </span>
          </>
        ) : (
          likesCount > 0 &&
          likes?.length > 0 && (
            <div
              className="postEngagement__count min-w-3"
              key={likes[likes.length - 1]._id}
            >
              <span>{likesCount - 1}</span>
              <span>{likesCount}</span>
            </div>
          )
        )}
      </Button>
      <Button
        as={Link}
        to={`/post/${postId}`}
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
        {/*commentCount > 0 && <span>{commentCount}</span>*/}
        <div className="postEngagement__count min-w-3" key={commentCount}>
          <span>{commentCount - 1}</span>
          <span>{commentCount}</span>
        </div>
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
  );
}
