import { useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

export default function useDeletePost() {
  const axiosPrivate = useAxiosPrivate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deletePost = async (id) => {
    setIsSubmitting(true);
    try {
      const response = await axiosPrivate.delete(`/post/${id}`);
      return response?.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete the post",
      );
    } finally {
      setIsSubmitting(true);
    }
  };

  return { deletePost, isSubmitting };
}
