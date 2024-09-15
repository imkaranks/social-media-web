import { useCallback, useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

export default function useLikeHandler(query) {
  const axiosPrivate = useAxiosPrivate();
  const [likes, setLikes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchParams = new URLSearchParams(query).toString();

  const toggleLike = async (type, id) => {
    setIsSubmitting(true);
    try {
      const response = await axiosPrivate.post("/like", {
        type,
        id,
      });
      return response?.data?.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchLikes = useCallback(async () => {
    const url = `/like/${searchParams ? `?${searchParams}` : ""}`;

    try {
      const likesResponse = await axiosPrivate.get(url);
      const likes = likesResponse?.data?.data;

      setLikes(likes);
      return likes;
    } catch (error) {
      console.log(error);
    }
  }, [axiosPrivate, searchParams]);

  useEffect(() => {
    searchParams && fetchLikes();
  }, [fetchLikes, searchParams]);

  return { likes, toggleLike, isSubmitting };
}
