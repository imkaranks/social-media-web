import { useCallback, useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

export default function usePostWithComments(postId) {
  const axiosPrivate = useAxiosPrivate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetechComments = useCallback(async () => {
    try {
      const commentsResponse = await axiosPrivate.get(`/comment/${postId}`);
      const comments = commentsResponse?.data?.data;

      setComments(comments);
      return comments;
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to refetech comments",
      );
    }
  }, [axiosPrivate, postId]);

  const refetechPost = useCallback(async () => {
    try {
      const postResponse = await axiosPrivate.get(
        `/post/${postId}?withEngagement=true`,
      );
      const post = postResponse?.data?.data;

      setPost(post);
      return post;
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to refetech post",
      );
    }
  }, [axiosPrivate, postId]);

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

  useEffect(() => {
    const interval = setInterval(() => {
      refetechPost();
    }, 3000);

    return () => clearInterval(interval);
  }, [refetechPost]);

  return { post, comments, isLoading, error, refetechComments, refetechPost };
}
