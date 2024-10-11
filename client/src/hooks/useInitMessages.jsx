import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import useFriendshipHandler from "@/hooks/useFriendshipHandler";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useStore from "@/app/store";

export default function useInitMessages() {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { friends } = useFriendshipHandler();

  const chats = useStore((state) => state.chats);
  const setChats = useStore((state) => state.setChats);
  const initUnreadFriendChats = useStore(
    (state) => state.initUnreadFriendChats,
  );
  const [loading, setLoading] = useState(true);
  const [unreadChatIds, setUnreadChatIds] = useState({});

  // TODO: Implement unread message count aggregation from both sockets and database

  useEffect(() => {
    if (!auth) return;

    async function getAllMessages() {
      // setLoading(true);

      try {
        const responses = await Promise.allSettled(
          friends.map((friend) => axiosPrivate.get(`/message/${friend._id}`)),
        );
        const chats = responses.reduce(
          (acc, response, idx) => ({
            ...acc,
            [friends[idx]._id]:
              response.status === "fulfilled"
                ? response?.value?.data?.data
                : [],
          }),
          {},
        );

        setChats(chats);

        initUnreadFriendChats(friends.map((friend) => ({ user: friend._id })));

        // const unreadChats = responses.reduce(
        //   (acc, response, idx) => {
        //     if (response.status === "fulfilled") {
        //       const unreadChats = response?.value?.data?.data?.filter(
        //         (chat) => !chat?.read,
        //       );
        //       const unreadSentChats = unreadChats
        //         ?.filter((chat) => chat.sender === auth?.user?._id)
        //         .map((chat) => chat._id);
        //       const unreadReceivedChats = unreadChats
        //         ?.filter((chat) => chat.sender !== auth?.user?._id)
        //         .map((chat) => chat._id);

        //       return {
        //         ...acc,
        //         sent: {
        //           ...acc.sent,
        //           [friends[idx]._id]: acc.sent[friends[idx]._id]?.length
        //             ? [...acc.sent[friends[idx]._id], ...unreadSentChats]
        //             : [...unreadSentChats],
        //         },
        //         received: {
        //           ...acc.received,
        //           [friends[idx]._id]: acc.received[friends[idx]._id]?.length
        //             ? [
        //                 ...acc.received[friends[idx]._id],
        //                 ...unreadReceivedChats,
        //               ]
        //             : [...unreadReceivedChats],
        //         },
        //       };
        //     } else {
        //       return {
        //         ...acc,
        //         sent: { ...acc.sent, [friends[idx]._id]: [] },
        //         received: { ...acc.received, [friends[idx]._id]: [] },
        //       };
        //     }
        //   },
        //   { sent: {}, received: {} },
        // );

        // setUnreadChatIds(unreadChats);
      } catch (error) {
        console.log(error instanceof Error ? error.message : error);
      } finally {
        setLoading(false);
      }
    }

    if (!Object.keys(chats)?.length) {
      getAllMessages();
    } else {
      if (loading) {
        setLoading(false);
      }
    }
  }, [auth, friends, axiosPrivate, setChats, initUnreadFriendChats, loading]);

  return { loading, unreadChatIds, setUnreadChatIds };
}
