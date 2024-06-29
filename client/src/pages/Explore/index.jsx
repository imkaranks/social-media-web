import { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useFriend from "@/hooks/useFriend";
import Post from "@/components/ui/Post";
import PostSkeleton from "@/components/ui/PostSkeleton";
import useStore from "@/app/store";

export default function Explore() {
  const posts = useStore((state) => state.posts);
  const setPosts = useStore((state) => state.setPosts);
  // const [posts, setPosts] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const { friends } = useFriend();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      try {
        const response = await axiosPrivate.get("/post");
        setPosts(response?.data?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, [axiosPrivate, setPosts]);

  return isLoading ? (
    <div className="p-4 md:pr-0">
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
    </div>
  ) : posts.length ? (
    <div className="p-4 md:pr-0">
      {posts.map((post, idx) => (
        <Post
          key={idx}
          {...post}
          friendsWhoLiked={post.likes.filter(
            (like) =>
              friends.length &&
              friends?.find((friend) => friend._id === like._id),
          )}
        />
      ))}
    </div>
  ) : (
    <div className="p-4 md:pr-0">
      <h2>No Posts</h2>
    </div>
  );
}
