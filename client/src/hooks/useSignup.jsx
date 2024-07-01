import { useState } from "react";
import axios from "@/app/axios";

export default function useSignup() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signup = async (data) => {
    setIsSubmitting(true);
    try {
      await axios.post("/auth/signup", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while signing up",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return { signup, isSubmitting };
}
