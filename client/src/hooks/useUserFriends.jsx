import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useUserInformation from "@/hooks/useUserInformation";
import useStore from "@/app/store";

export default function useUserFriends(query) {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { user, isLoading: userLoading } = useUserInformation(query);

  const myFriends = useStore((state) => state.friends);

  const [friends, setFriends] = useState([]);
  const [mutualFriends, setMutualFriends] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getFriends = async () => {
      try {
        if (!auth) {
          throw new Error("User must be authenticated to see friends");
        }

        const response = await axiosPrivate.get(`/friend/${user?._id}`);
        setFriends(response?.data?.data);
      } catch (error) {
        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to get friends",
        );
      } finally {
        setIsLoading(false);
      }
    };

    const findMutualFriends = () => {
      if (user && myFriends && friends) {
        if (user._id === auth.user._id) {
          setMutualFriends(myFriends);
          return;
        }

        const userFriendIds = friends.map((friend) => friend._id);
        const myFriendIds = myFriends.map((friend) => friend._id);
        const mutualFriendIds = userFriendIds.filter((id) =>
          myFriendIds.includes(id),
        );
        const mutualFriendsList = friends.filter((friend) =>
          mutualFriendIds.includes(friend._id),
        );
        setMutualFriends(mutualFriendsList);
      }
    };

    if (auth && user && !userLoading) {
      getFriends();
      findMutualFriends();
    }
  }, [auth, axiosPrivate, user, userLoading, myFriends]);

  return {
    friends,
    mutualFriends,
    error,
    isLoading,
  };
}
