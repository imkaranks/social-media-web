import { createContext, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import useSocket from "@/hooks/useSocket";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import generateNotificationMessage from "../utils/notificationUtils";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { socket } = useSocket();

  const [notifications, setNotifications] = useState([]);

  const handleNotification = useCallback((payload) => {
    const notificationMessage = generateNotificationMessage(payload);
    toast(notificationMessage, { icon: "🔔", position: "bottom-right" });
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
