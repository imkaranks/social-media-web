import { useState } from "react";
import axios from "@/app/axios";
import toast from "react-hot-toast";

export default function useSignup() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signup = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/auth/signup", data);
      toast.success(response?.data?.message, { duration: 10000 });
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
