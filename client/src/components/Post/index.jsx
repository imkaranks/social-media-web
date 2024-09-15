import PostHeader from "./PostHeader";
import PostEngagement from "./PostEngagement";
import PostFooter from "./PostFooter";

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
  return (
    <article className="my-4 rounded-xl bg-gray-100 p-4 text-sm leading-normal dark:bg-neutral-700/20">
      <PostHeader
        postId={_id}
        title={title}
        isAuthor={isAuthor}
        author={author}
        deletePost={deletePost}
      />

      {images?.length > 0 && (
        <div className="mt-3 overflow-hidden rounded-xl">
          <img
            src={images[0]?.url}
            className="h-[60vw] max-h-96 w-full object-cover object-center" /* min(60vw, 24rem) */
            alt={title}
          />
        </div>
      )}

      <PostEngagement
        postId={_id}
        likes={likes}
        likeCount={likeCount}
        userLikedPost={userLikedPost}
        commentCount={commentCount}
      />

      <PostFooter
        author={author}
        content={content}
        likes={likes}
        friendsWhoLiked={friendsWhoLiked}
      />
    </article>
  );
}
