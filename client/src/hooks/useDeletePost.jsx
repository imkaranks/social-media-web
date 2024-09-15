import { useCallback, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useStore from "@/app/store";

export default function useDeletePost() {
  const axiosPrivate = useAxiosPrivate();
  const removePost = useStore((state) => state.removePost);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deletePost = useCallback(
    async (postId) => {
      setIsSubmitting(true);
      try {
        const response = await axiosPrivate.delete(`/post/${postId}`);
        removePost(postId);
        return response?.data;
      } catch (error) {
        throw new Error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to delete the post",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [axiosPrivate, removePost],
  );

  return { deletePost, isSubmitting };
}
