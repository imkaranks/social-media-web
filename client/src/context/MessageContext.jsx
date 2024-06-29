import { createContext, useCallback, useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import useSocket from "@/hooks/useSocket";
import useFriend from "@/hooks/useFriend";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useStore from "@/app/store";

const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { socket } = useSocket();
  const { friends } = useFriend();

  const chats = useStore((state) => state.chats);
  const addFriendChat = useStore((state) => state.addFriendChat);
  const addUnreadFriendChat = useStore((state) => state.addUnreadFriendChat);
  const markFriendChatAsRead = useStore((state) => state.markFriendChatAsRead);
  const setChats = useStore((state) => state.setChats);
  const initUnreadFriendChats = useStore(
    (state) => state.initUnreadFriendChats,
  );

  const [currentChatUserId, setCurrentChatUserId] = useState(null);
  const [loading, setLoading] = useState(false);

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
      const responses = await Promise.all(
        friends.map((friend) => axiosPrivate.get(`/message/${friend._id}`)),
      );
      const chats = responses.reduce(
        (acc, response, idx) => ({
          ...acc,
          [friends[idx]._id]: response?.data?.data,
        }),
        {},
      );
      setChats(chats);
      initUnreadFriendChats(friends.map((friend) => ({ user: friend._id })));
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

      currentChatUserId !== payload.sender &&
        addUnreadFriendChat(payload.sender);
    });

    return () => socket.off("new-message");
  }, [socket, addFriendChat, auth, addUnreadFriendChat, currentChatUserId]);

  return (
    <MessageContext.Provider
      value={{
        currentChatUserId,
        setCurrentParticipant,
        loading,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContext;
