import { useCallback, useEffect, useState } from "react";
// import toast from "react-hot-toast";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
// import useDeletePost from "@/hooks/useDeletePost";
import useStore from "@/app/store";

export default function usePosts(query) {
  const axiosPrivate = useAxiosPrivate();

  const posts = useStore((state) => state.posts);
  const setPosts = useStore((state) => state.setPosts);
  const addMorePosts = useStore((state) => state.addMorePosts);
  // const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = new URLSearchParams(query).toString();

  const refetchPosts = useCallback(
    async (query) => {
      const searchParams = new URLSearchParams(query).toString();

      try {
        const response = await axiosPrivate.get(
          !searchParams?.trim() ? "/post" : `/post/?${searchParams}`,
        );
        // console.log([...posts, ...(response?.data?.data || [])]);
        addMorePosts(response?.data?.data || []);
      } catch (error) {
        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to get the posts",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [axiosPrivate, addMorePosts],
  );

  useEffect(() => {
    async function getPosts() {
      // setIsLoading(true);

      try {
        const response = await axiosPrivate.get(
          !searchParams?.trim() ? "/post" : `/post/?${searchParams}`,
        );
        setPosts(response?.data?.data);
        setTotalPages(response?.data?.totalPages || 0);
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

  return { posts, refetchPosts, isLoading, totalPages, error };
}
