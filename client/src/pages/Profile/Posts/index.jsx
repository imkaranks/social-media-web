import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useDeletePost from "@/hooks/useDeletePost";
import useFriend from "@/hooks/useFriend";
import Post from "@/components/ui/Post";
import PostSkeleton from "@/components/ui/PostSkeleton";

export default function Posts() {
  const { auth } = useAuth();
  const { username } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const { friends } = useFriend();
  const { deletePost: removePost, isSubmitting } = useDeletePost();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);

  const deletePost = async (id) => {
    try {
      setDeletingPostId(id);
      await removePost(id);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : error);
    } finally {
      setDeletingPostId(null);
    }
  };

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      try {
        const response = await axiosPrivate.get(`/post/user/${username}`);
        setPosts(response?.data?.data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, [username, auth, axiosPrivate]);

  return isLoading ? (
    <>
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
    </>
  ) : posts?.length ? (
    <>
      {posts.map((post, idx) => {
        const props = {
          ...post,
          isBeingDeleted: deletingPostId === post._id ? isSubmitting : false,
          deletePost: () => deletePost(post._id),
        };
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
  );
}
