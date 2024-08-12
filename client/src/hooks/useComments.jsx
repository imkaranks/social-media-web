import { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

export default function useComments(query) {
  const axiosPrivate = useAxiosPrivate();

  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchParams = new URLSearchParams(query).toString();

  useEffect(() => {
    const getComments = async () => {
      setIsLoading(true);

      try {
        if (!searchParams?.trim()) {
          throw new Error("Invalid or empty query parameters");
        }

        const response = await axiosPrivate.get(`/comment/?${searchParams}`);

        setComments(response?.data?.data);
      } catch (error) {
        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to get the comments",
        );
      } finally {
        setIsLoading(false);
      }
    };

    getComments();
  }, [axiosPrivate, searchParams]);

  return { comments, isLoading, error };
}
