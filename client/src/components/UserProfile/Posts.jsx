import useAuth from "@/hooks/useAuth";
import usePosts from "@/hooks/usePosts";
import useDeletePost from "@/hooks/useDeletePost";
import useFriendshipHandler from "@/hooks/useFriendshipHandler";
import Post from "@/components/Post";
import PostSkeleton from "@/components/ui/PostSkeleton";

export default function Posts({ username }) {
  const { auth } = useAuth();
  const { friends } = useFriendshipHandler();
  const { deletePost } = useDeletePost();
  const { posts, isLoading, error } = usePosts({
    username,
    withEngagement: true,
  });

  return isLoading ? (
    <>
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
    </>
  ) : !error ? (
    posts?.length ? (
      <>
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
      </>
    ) : (
      <p>No Posts</p>
    )
  ) : (
    <p>{error}</p>
  );
}
