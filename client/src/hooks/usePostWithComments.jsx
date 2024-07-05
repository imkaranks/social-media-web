import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useEffect, useState } from "react";

export default function usePostWithComments(postId) {
  const axiosPrivate = useAxiosPrivate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPostAndComments = async () => {
      setIsLoading(true);
      try {
        const [postResponse, commentsResponse] = await Promise.all([
          axiosPrivate.get(`/post/${postId}`),
          axiosPrivate.get(`/comment/${postId}`),
        ]);

        setPost(postResponse?.data?.data);
        setComments(commentsResponse?.data?.data);
      } catch (error) {
        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to get the post and its comments",
        );
      } finally {
        setIsLoading(false);
      }
    };

    getPostAndComments();
  }, [postId, axiosPrivate]);

  return { post, comments, isLoading, error };
}
