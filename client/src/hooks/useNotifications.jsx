import { useContext } from "react";
import NotificationContext from "@/context/NotificationContext";

export default function useNotifications() {
  return useContext(NotificationContext);
}
