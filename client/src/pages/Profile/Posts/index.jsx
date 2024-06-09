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
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const deletePost = async (id) => {
    try {
      await removePost(id);
      setData((prevData) => prevData.filter((post) => post._id !== id));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : error);
    }
  };

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      try {
        const response = await axiosPrivate.get("/post");
        setData(response?.data?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, [axiosPrivate]);

  return isLoading ? (
    <p>Loading...</p>
  ) : data?.length ? (
    <>
      {data.map((post, idx) => {
        const props = {
          ...post,
          author: auth.user,
          isSubmitting,
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
