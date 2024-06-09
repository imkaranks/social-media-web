import { useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function useLogout() {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setAuth } = useAuth();

  const logout = async () => {
    setIsSubmitting(true);
    try {
      await axiosPrivate.post("/auth/signout");
      setAuth(null);
    } catch (error) {
      if (error?.response?.data?.message === "jwt expired") {
        setAuth(null);
        navigate("/sign-in");
        return;
      }
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { logout, isSubmitting };
}
