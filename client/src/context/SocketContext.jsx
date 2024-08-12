import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuth from "@/hooks/useAuth";

const SocketContext = createContext(null);

const SOCKET_URI =
  import.meta.env.VITE_API_BASE_URL ||
  "https://quietsphere.onrender.com/api/v1";

export const SocketProvider = ({ children }) => {
  const { auth } = useAuth();

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);

  useEffect(() => {
    if (auth) {
      const socket = io(SOCKET_URI, {
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
