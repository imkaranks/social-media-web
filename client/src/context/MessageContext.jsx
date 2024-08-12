import { createContext, useCallback, useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import useSocket from "@/hooks/useSocket";
import useFriendshipHandler from "@/hooks/useFriendshipHandler";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useStore from "@/app/store";

const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { socket } = useSocket();
  const { friends } = useFriendshipHandler();

  const chats = useStore((state) => state.chats);
  const addFriendChat = useStore((state) => state.addFriendChat);
  const addUnreadFriendChat = useStore((state) => state.addUnreadFriendChat);
  const markFriendChatAsRead = useStore((state) => state.markFriendChatAsRead);
  const setChats = useStore((state) => state.setChats);
  const initUnreadFriendChats = useStore(
    (state) => state.initUnreadFriendChats,
  );

  const [loading, setLoading] = useState(false);
  const [currentChatUserId, setCurrentChatUserId] = useState(null);
  const [unreadChatIds, setUnreadChatIds] = useState({});

  const setCurrentParticipant = useCallback(
    (id) => {
      if (currentChatUserId === id) return;
      setCurrentChatUserId(id);
      markFriendChatAsRead(id);
    },
    [currentChatUserId, markFriendChatAsRead],
  );

  useEffect(() => {
    if (!auth) return;

    async function getAllMessages() {
      setLoading(true);
      try {
        // const responses = await Promise.all(
        //   friends.map((friend) => axiosPrivate.get(`/message/${friend._id}`)),
        // );
        // const chats = responses.reduce(
        //   (acc, response, idx) => ({
        //     ...acc,
        //     [friends[idx]._id]: response?.data?.data,
        //   }),
        //   {},
        // );
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
        const unreadChats = responses.reduce(
          (acc, response, idx) => {
            // return {
            //   ...acc,
            //   [friends[idx]._id]:
            //     (
            //       response.status === "fulfilled" &&
            //       response?.value?.data?.data?.filter((chat) => !chat?.read)
            //     ).map((chat) => chat._id) || [],
            // };
            if (response.status === "fulfilled") {
              const unreadChats = response?.value?.data?.data?.filter(
                (chat) => !chat?.read,
              );
              const unreadSentChats = unreadChats
                ?.filter((chat) => chat.sender === auth?.user?._id)
                .map((chat) => chat._id);
              const unreadReceivedChats = unreadChats
                ?.filter((chat) => chat.sender !== auth?.user?._id)
                .map((chat) => chat._id);

              return {
                ...acc,
                sent: {
                  ...acc.sent,
                  [friends[idx]._id]: acc.sent[friends[idx]._id]?.length
                    ? [...acc.sent[friends[idx]._id], ...unreadSentChats]
                    : [...unreadSentChats],
                },
                received: {
                  ...acc.received,
                  [friends[idx]._id]: acc.received[friends[idx]._id]?.length
                    ? [
                        ...acc.received[friends[idx]._id],
                        ...unreadReceivedChats,
                      ]
                    : [...unreadReceivedChats],
                },
              };
            } else {
              return {
                ...acc,
                sent: { ...acc.sent, [friends[idx]._id]: [] },
                received: { ...acc.received, [friends[idx]._id]: [] },
              };
            }
          },
          { sent: {}, received: {} },
        );
        // console.log(unreadChats);
        setUnreadChatIds(
          // friends.reduce((acc, friend) => {
          //   return { ...acc, [friend._id]: [] };
          // }, {}),
          unreadChats,
        );
      } catch (error) {
        console.log(error instanceof Error ? error.message : error);
      } finally {
        setLoading(false);
      }
    }

    if (!Object.keys(chats)?.length) {
      getAllMessages();
    }
  }, [auth, friends, axiosPrivate, setChats, initUnreadFriendChats]);

  useEffect(() => {
    if (!socket || !auth) return;

    socket.on("new-message", (payload) => {
      addFriendChat({
        username: payload.sender,
        chat: payload,
      });

      // add to unread ids
      setUnreadChatIds((prev) => ({
        ...prev,
        [payload.sender]: (prev[payload.sender] || []).push(payload._id),
      }));

      currentChatUserId !== payload.sender &&
        addUnreadFriendChat(payload.sender);
    });

    socket.on("messagesRead", (userId) => {
      console.log(userId);
      setUnreadChatIds((prevUnreadChatIds) => ({
        ...prevUnreadChatIds,
        sent: { ...prevUnreadChatIds.sent, [userId]: [] },
      }));
    });

    return () => {
      socket.off("new-message");
      socket.off("messagesRead");
    };
  }, [socket, addFriendChat, auth, addUnreadFriendChat, currentChatUserId]);

  return (
    <MessageContext.Provider
      value={{
        loading,
        currentChatUserId,
        setCurrentParticipant,
        unreadChatIds,
        setUnreadChatIds,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContext;
