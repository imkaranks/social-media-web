import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "@/app/axios";
import useAuth from "./useAuth";

export default function useSignup() {
  const { setAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const from = location?.state?.from?.pathname || "/";

  const signup = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/auth/signup", data);
      setAuth(response?.data?.data);
      navigate(from);
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
