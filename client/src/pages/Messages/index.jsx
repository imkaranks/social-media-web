import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import useMessages from "@/hooks/useMessages";
import useFriendshipHandler from "@/hooks/useFriendshipHandler";
import useListenTyping from "@/hooks/useListenTyping";
import MessageRightPanel from "@/components/Messages/MessageRightPanel";
import MessageLeftPanel from "@/components/Messages/MessageLeftPanel";
import useStore from "@/app/store";

export const MessagesContext = createContext(null);

export default function Messages() {
  const { friends, friendsLoading } = useFriendshipHandler();
  const {
    loading: messagesLoading,
    chattingWithUserId,
    setActiveConversation,
  } = useMessages();
  const { typingUsers, setTypingUsers } = useListenTyping();

  const chats = useStore((state) => state.chats);
  const unreadFriendChats = useStore((state) => state.unreadFriendChats);
  const messages = useMemo(
    () => chats[chattingWithUserId],
    [chats, chattingWithUserId],
  );

  const [expanded, setExpanded] = useState(false);
  const [currentConversation, setCurrentConversation] = useState(-1);

  const openUserConversation = useCallback((idx) => {
    if (window.innerWidth > 767) {
      setCurrentConversation(idx);
    } else {
      setExpanded(true);
      setCurrentConversation(idx);
    }
  }, []);

  const closeUserConversation = useCallback(() => {
    if (window.innerWidth <= 767) {
      setExpanded(false);
    }
  }, []);

  useEffect(() => {
    return () => setActiveConversation(-1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MessagesContext.Provider
      value={{
        expanded,
        friends,
        friendsLoading,
        chats,
        unreadFriendChats,
        messages,
        messagesLoading,
        typingUsers,
        setTypingUsers,
        currentConversation,
        openUserConversation,
        closeUserConversation,
      }}
    >
      <div className="sticky top-[4.5rem] grid h-[calc(100vh-4.5625rem)] overflow-hidden md:grid-cols-[15rem_1fr] lg:grid-cols-[18rem_1fr]">
        <MessageLeftPanel />

        <MessageRightPanel />
      </div>
    </MessagesContext.Provider>
  );
}
