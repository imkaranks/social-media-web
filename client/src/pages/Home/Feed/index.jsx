import { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Post from "@/components/ui/Post";
import useFriend from "@/hooks/useFriend";
import PostSkeleton from "@/components/ui/PostSkeleton";
import useStore from "@/app/store";

export default function Feed() {
  const posts = useStore((state) => state.posts);
  const setPosts = useStore((state) => state.setPosts);
  // const [posts, setPosts] = useState([]);
  const { friends } = useFriend();
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      try {
        const response = await axiosPrivate.get("/post");
        // console.log(response?.data?.data);
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
    <div className="mx-auto lg:w-[90%]">
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
    </div>
  ) : posts.length ? (
    <div className="mx-auto lg:w-[90%]">
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
    <div className="mx-auto lg:w-[90%]">
      <h2>No Posts</h2>
    </div>
  );
}
