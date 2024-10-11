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

  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const handleNotification = useCallback((payload) => {
    const notificationMessage = generateNotificationMessage(payload);
    toast(notificationMessage, { icon: "🔔", position: "bottom-right" });
    setNotifications((prevNotifications) => [...prevNotifications, payload]);
  }, []);

  const getNotifications = useCallback(
    async (query) => {
      const searchParams = new URLSearchParams(query).toString();
      setIsLoading(true);

      try {
        const response = await axiosPrivate.get(
          `/notification/${auth.user._id}/${searchParams?.trim() ? `?${searchParams}` : ""}`,
        );
        setTotalPages(response?.data?.totalPages);
        setNotifications(response?.data?.data);
      } catch (error) {
        console.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to get notifications",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [auth?.user?._id, axiosPrivate],
  );

  useEffect(() => {
    if (!auth || !socket) return;

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [auth, socket, handleNotification]);

  useEffect(() => {
    if (auth && !notifications.length) {
      getNotifications();
    }
  }, [auth, notifications.length, getNotifications]);

  return (
    <NotificationContext.Provider
      value={{ isLoading, notifications, totalPages, getNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
