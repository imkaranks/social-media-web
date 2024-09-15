import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import axios from "@/app/axios";

export default function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const from =
    (location?.state?.from?.pathname || "/") +
    (location?.state?.from?.search ? `${location.state.from.search}` : "");

  const login = useCallback(
    async (data) => {
      setIsSubmitting(true);
      try {
        const response = await axios.post("/auth/signin", data);
        setAuth(response?.data?.data);
        navigate(from);
      } catch (error) {
        throw new Error(
          error?.response?.data?.message ||
            error?.message ||
            "Something went wrong while logging in",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [setAuth, navigate, from],
  );

  return { login, isSubmitting };
}
