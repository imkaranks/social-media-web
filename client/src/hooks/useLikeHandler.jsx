import { useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

export default function useLikeHandler() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const axiosPrivate = useAxiosPrivate();

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

  return { toggleLike, isSubmitting };
}
