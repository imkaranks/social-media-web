import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import useSocket from "@/hooks/useSocket";

export default function useListenTyping() {
  const { auth } = useAuth();
  const { socket } = useSocket();
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    if (!socket || !auth) return;

    socket.on("user-start-typing", (payload) => {
      const { sender } = payload;
      setTypingUsers((prevUsers) => [...new Set([...prevUsers, sender])]);
    });

    socket.on("user-stop-typing", (payload) => {
      const { sender } = payload;
      setTypingUsers((prevUsers) =>
        prevUsers.filter((user) => user !== sender),
      );
    });

    return () => {
      socket.off("user-start-typing");
      socket.off("user-stop-typing");
    };
  }, [socket, auth, setTypingUsers]);

  return { typingUsers, setTypingUsers };
}
