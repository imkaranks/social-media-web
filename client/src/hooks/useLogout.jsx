import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/hooks/useAuth";
import useStore from "@/app/store";

export default function useLogout() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const setPosts = useStore((state) => state.setPosts);
  const setChats = useStore((state) => state.setChats);
  const setFriends = useStore((state) => state.setFriends);
  const setPendingFriendRequests = useStore(
    (state) => state.setPendingFriendRequests,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearStateAfterLogout = () => {
    setAuth(null);
    setPosts([]);
    setFriends([]);
    setPendingFriendRequests([]);
    setChats({});
  };

  const logout = async () => {
    setIsSubmitting(true);
    try {
      await axiosPrivate.post("/auth/signout");
      clearStateAfterLogout();
    } catch (error) {
      if (error?.response?.data?.message === "jwt expired") {
        clearStateAfterLogout();
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
