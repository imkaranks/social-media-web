import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useStore from "@/app/store";

export default function useFriendshipHandler() {
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
  const removeExistingFriend = useStore((state) => state.removeExistingFriend);

  const [pendingRequestsLoading, setPendingRequestsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendingFriendRequest, setSendingFriendRequest] = useState(false);

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
        toast.error(
          error?.response?.data?.message || "Failed to accept friend request",
        );
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
        toast.error(
          error?.response?.data?.message || "Failed to reject friend request",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [axiosPrivate, auth, rejectPendingRequest],
  );

  const removeFriend = useCallback(
    async (friendId) => {
      setIsSubmitting(true);
      try {
        await axiosPrivate.post(`/friend/remove/${friendId}`);
        removeExistingFriend(friendId);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to reject friend request",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [axiosPrivate, removeExistingFriend],
  );

  const sendFriendRequest = useCallback(
    async (recipientId) => {
      if (recipientId === auth?.user?._id) return;

      setSendingFriendRequest(true);

      try {
        await axiosPrivate.post("/friend/send", {
          senderId: auth?.user?._id,
          recipientId,
        });
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Error occur while sending friend request",
        );
      } finally {
        setSendingFriendRequest(false);
      }
    },
    [auth, axiosPrivate],
  );

  const isExistingFriend = useCallback(
    (userId) =>
      !isLoading &&
      !!friends.length &&
      friends.find((friend) => friend._id === userId),
    [friends, isLoading],
  );

  const didSentRequest = useCallback(
    (userId) =>
      !pendingRequestsLoading &&
      pendingRequests?.sent?.find(
        (request) => request?.receiver?._id === userId,
      ),
    [pendingRequests, pendingRequestsLoading],
  );

  const didReceivedRequest = useCallback(
    (userId) =>
      !pendingRequestsLoading &&
      pendingRequests?.received?.find(
        (request) => request?.sender?._id === userId,
      ),
    [pendingRequests, pendingRequestsLoading],
  );

  useEffect(() => {
    const getFriends = async () => {
      // setIsLoading(true);

      try {
        const response = await axiosPrivate.get(`/friend/${auth?.user?._id}`);

        setFriends(response?.data?.data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch friend list",
        );
      } finally {
        setIsLoading(false);
      }
    };

    const getPendingRequests = async () => {
      setPendingRequestsLoading(true);

      try {
        const response = await axiosPrivate.get(
          `/friend/pending/${auth?.user?._id}`,
        );

        setPendingRequests(response?.data?.data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Failed to get pending friend requests",
        );
      } finally {
        setPendingRequestsLoading(false);
      }
    };

    if (auth) {
      Promise.all([getFriends(), getPendingRequests()]);
    } else if (isLoading) {
      setIsLoading(false);
    }
  }, [axiosPrivate, auth, setFriends, setPendingRequests]);

  return {
    friends,
    isLoading,
    pendingRequests,
    pendingRequestsLoading,
    acceptRequest,
    rejectRequest,
    removeFriend,
    sendFriendRequest,
    sendingFriendRequest,
    isExistingFriend,
    didSentRequest,
    didReceivedRequest,
    isSubmitting,
  };
}
