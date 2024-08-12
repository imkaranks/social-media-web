import { createContext, useCallback, useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import useSocket from "@/hooks/useSocket";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { socket } = useSocket();

  const [notifications, setNotifications] = useState([]);

  const handleNotification = useCallback((payload) => {
    // console.log(payload);

    setNotifications((prevNotifications) => [...prevNotifications, payload]);
  }, []);

  useEffect(() => {
    if (!auth || !socket) return;

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [auth, socket, handleNotification]);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await axiosPrivate.get(
          `/notification/${auth.user._id}`,
        );
        // console.log(response?.data?.data);
        setNotifications(response?.data?.data);
      } catch (error) {
        console.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to get notifications",
        );
      }
    };

    auth && !notifications.length && getNotifications();
  }, [auth, notifications.length]);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
