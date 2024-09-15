import useAuth from "@/hooks/useAuth";
import usePosts from "@/hooks/usePosts";
import useDeletePost from "@/hooks/useDeletePost";
import useFriendshipHandler from "@/hooks/useFriendshipHandler";
import Post from "@/components/Post";
import PostSkeleton from "@/components/ui/PostSkeleton";

export default function Explore() {
  const { auth } = useAuth();
  const { deletePost } = useDeletePost();
  const { posts, isLoading, error } = usePosts({
    withEngagement: true,
  });
  const { friends } = useFriendshipHandler();

  return isLoading ? (
    <div className="p-4 md:pr-0">
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
    </div>
  ) : !error ? (
    posts.length ? (
      <div className="p-4 md:pr-0">
        {posts.map((post, idx) => {
          const props = {
            ...post,
          };

          if (post?.author?._id === auth?.user?._id) {
            props.isAuthor = true;
            props.deletePost = deletePost;
          }

          return (
            <Post
              key={idx}
              {...props}
              friendsWhoLiked={post.likes.filter(
                (like) =>
                  friends.length &&
                  friends?.find((friend) => friend._id === like._id),
              )}
            />
          );
        })}
      </div>
    ) : (
      <div className="p-4 md:pr-0">
        <h2>No Posts</h2>
      </div>
    )
  ) : (
    <p>{error}</p>
  );
}
