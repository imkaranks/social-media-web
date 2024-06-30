import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuth from "@/hooks/useAuth";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { auth } = useAuth();

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);

  useEffect(() => {
    if (auth) {
      const socket = io(import.meta.env.VITE_API_BASE_URL, {
        query: {
          userId: auth?.user?._id,
        },
      });

      setSocket(socket);

      socket.on("online-users", (onlineUsers) => setOnlineUsers(onlineUsers));

      return () => {
        socket.off("online-users");
        socket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [auth]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
