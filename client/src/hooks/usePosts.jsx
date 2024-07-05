import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
// import useDeletePost from "@/hooks/useDeletePost";
import useStore from "@/app/store";

export default function usePosts(query) {
  const axiosPrivate = useAxiosPrivate();

  const posts = useStore((state) => state.posts);
  const setPosts = useStore((state) => state.setPosts);
  // const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchParams = new URLSearchParams(query).toString();

  useEffect(() => {
    async function getPosts() {
      setIsLoading(true);
      try {
        const response = await axiosPrivate.get(
          !searchParams?.trim() ? "/post" : `/post/?${searchParams}`,
        );
        setPosts(response?.data?.data);
      } catch (error) {
        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to get the posts",
        );
      } finally {
        setIsLoading(false);
      }
    }

    getPosts();
  }, [axiosPrivate, setPosts, searchParams]);

  return { posts, isLoading, error };
}
