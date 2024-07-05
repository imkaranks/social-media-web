import { useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useStore from "@/app/store";

export default function useCreatePost() {
  const axiosPrivate = useAxiosPrivate();
  const addPost = useStore((state) => state.addPost);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPost = async (data, selectedFiles) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      for (const key in data) {
        formData.set(key, data[key]);
      }

      for (const file of selectedFiles) {
        formData.append("images", file);
      }

      const response = await axiosPrivate.post("/post/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      addPost(response?.data?.data);
    } catch (error) {
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create post",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createPost, isSubmitting };
}
