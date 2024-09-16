import { createContext, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import useSocket from "@/hooks/useSocket";
import useInitMessages from "@/hooks/useInitMessages";
import useStore from "@/app/store";

const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
  const { auth } = useAuth();
  const { socket } = useSocket();

  const addFriendChat = useStore((state) => state.addFriendChat);
  const addUnreadFriendChat = useStore((state) => state.addUnreadFriendChat);
  const markFriendChatAsRead = useStore((state) => state.markFriendChatAsRead);

  const { loading, unreadChatIds, setUnreadChatIds } = useInitMessages();
  const [chattingWithUserId, setChattingWithUserId] = useState(null);

  const setActiveConversation = useCallback(
    (id) => {
      if (chattingWithUserId === id) return;
      setChattingWithUserId(id);
      markFriendChatAsRead(id);
    },
    [chattingWithUserId, markFriendChatAsRead],
  );

  useEffect(() => {
    if (!socket || !auth) return;

    socket.on("new-message", (payload) => {
      addFriendChat({
        username: payload.sender,
        chat: payload,
      });

      // add to unread ids if not chatting with that user
      if (chattingWithUserId !== payload.sender) {
        // TODO: Implement unread message count aggregation from both sockets and database

        // setUnreadChatIds((prev) => ({
        //   ...prev,
        //   [payload.sender]: (prev[payload.sender] || []).push(payload._id),
        // }));

        toast("You have new unread message", {
          icon: "💬",
          position: "bottom-right",
        });

        addUnreadFriendChat(payload.sender);
      }
    });

    return () => {
      socket.off("new-message");
    };
  }, [socket, addFriendChat, auth, addUnreadFriendChat, chattingWithUserId]);

  return (
    <MessageContext.Provider
      value={{
        loading,
        chattingWithUserId,
        setActiveConversation,
        unreadChatIds,
        setUnreadChatIds,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContext;
