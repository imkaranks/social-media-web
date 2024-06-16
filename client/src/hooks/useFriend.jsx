import { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/hooks/useAuth";
import useStore from "@/app/store";

export default function useFriend() {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const friends = useStore((state) => state.friends);
  const setFriends = useStore((state) => state.setFriends);
  const pendingRequests = useStore((state) => state.pendingFriendRequests);
  const setPendingRequests = useStore(
    (state) => state.setPendingFriendRequests,
  );
  const acceptPendingRequest = useStore(
    (state) => state.acceptPendingFriendRequest,
  );
  const rejectPendingRequest = useStore(
    (state) => state.rejectPendingFriendRequest,
  );

  const [pendingRequestsLoading, setPendingRequestsLoading] = useState(false);
  const [friendsLoading, setFriendsLoading] = useState(false);
  // const [pendingRequests, setPendingRequests] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const acceptRequest = useCallback(
    async (requestId) => {
      setIsSubmitting(true);
      try {
        const response = await axiosPrivate.post(`/friend/accept`, {
          userId: auth?.user?._id,
          requestId,
        });
        acceptPendingRequest(response?.data?.data?._id);
      } catch (error) {
        console.log(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [axiosPrivate, auth, acceptPendingRequest],
  );

  const rejectRequest = useCallback(
    async (requestId) => {
      setIsSubmitting(true);
      try {
        const response = await axiosPrivate.post(`/friend/reject`, {
          userId: auth?.user?._id,
          requestId,
        });
        rejectPendingRequest(response?.data?.data?._id);
      } catch (error) {
        console.log(error);
      } finally {
        setIsSubmitting(true);
      }
    },
    [axiosPrivate, auth, rejectPendingRequest],
  );

  useEffect(() => {
    async function getFriends() {
      setFriendsLoading(true);

      try {
        const response = await axiosPrivate.get(`/friend/${auth.user._id}`);

        setFriends(response?.data?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setFriendsLoading(false);
      }
    }

    async function getPendingRequests() {
      setPendingRequestsLoading(true);

      try {
        const response = await axiosPrivate.get(
          `/friend/pending/${auth.user._id}`,
        );

        setPendingRequests(response?.data?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setPendingRequestsLoading(false);
      }
    }

    Promise.all([getFriends(), getPendingRequests()]);
  }, [axiosPrivate, auth, setFriends, setPendingRequests]);

  return {
    friends,
    friendsLoading,
    pendingRequests,
    pendingRequestsLoading,
    acceptRequest,
    rejectRequest,
    isSubmitting,
  };
}
