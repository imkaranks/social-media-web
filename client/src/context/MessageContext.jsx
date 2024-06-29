import { createContext, useCallback, useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import useSocket from "@/hooks/useSocket";
// import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useStore from "@/app/store";

const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
  const { auth } = useAuth();
  const { socket } = useSocket();
  const addFriendChat = useStore((state) => state.addFriendChat);
  const addUnreadFriendChat = useStore((state) => state.addUnreadFriendChat);
  const markFriendChatAsRead = useStore((state) => state.markFriendChatAsRead);
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
