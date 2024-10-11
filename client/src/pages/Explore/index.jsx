import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import usePosts from "@/hooks/usePosts";
import useDeletePost from "@/hooks/useDeletePost";
import useFriendshipHandler from "@/hooks/useFriendshipHandler";
import Post from "@/components/Post";
import PostSkeleton from "@/components/ui/PostSkeleton";
import Spinner from "@/components/ui/Spinner";

const LIMIT = 7;

export default function Explore() {
  const { auth } = useAuth();
  const { deletePost } = useDeletePost();
  const { posts, isLoading, totalPages, error, refetchPosts } = usePosts({
    withEngagement: true,
    limit: LIMIT,
  });
  const { friends } = useFriendshipHandler();
  const [page, setPage] = useState(1);
  const [morePostsIncoming, setMorePostsIncoming] = useState(false);

  useEffect(() => {
    let timeoutId = null;

    const handleScroll = () => {
      // Check if we are at the bottom of the page
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
          document.documentElement.scrollHeight &&
        page < totalPages
      ) {
        setMorePostsIncoming(true);

        // Clear any existing timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        // Set a new timeout to fetch data
        const newTimeoutId = setTimeout(() => {
          refetchPosts({ page: page + 1, limit: LIMIT }).finally(() => {
            setMorePostsIncoming(false);
          });
          setPage((prev) => prev + 1); // Increment page to fetch next data
        }, 500);

        timeoutId = newTimeoutId;
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, refetchPosts, totalPages]);

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

        {morePostsIncoming && (
          <Spinner className="flex items-center justify-center" />
        )}

        {page >= totalPages && (
          <div className="mt-10">
            <hr className="border-black/20 dark:border-white/20" />

            <h3 className="mx-auto w-fit -translate-y-1/2 bg-white px-8 dark:bg-neutral-800 max-md:text-sm">
              You have reached the end
            </h3>
          </div>
        )}
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
