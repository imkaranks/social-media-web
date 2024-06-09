import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Post from "@/components/ui/Post";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useDeletePost from "@/hooks/useDeletePost";

export default function Posts() {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
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
        const response = await axiosPrivate.get(`/post/${auth.user._id}`);
        // console.log(response?.data?.data);
        setPosts(response?.data?.data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, [auth, axiosPrivate]);

  return isLoading ? (
    <p>Loading...</p>
  ) : posts?.length ? (
    <>
      {posts.map((post, idx) => {
        const props = {
          ...post,
          isBeingDeleted: deletingPostId === post._id ? isSubmitting : false,
          deletePost: () => deletePost(post._id),
        };
        return <Post key={idx} {...props} />;
      })}
      <Toaster />
    </>
  ) : (
    <p>No Posts</p>
  );
}
