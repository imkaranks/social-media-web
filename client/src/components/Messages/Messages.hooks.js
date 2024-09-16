import { useContext } from "react";
import { MessagesContext } from "@/pages/Messages";

export function useMessagesContext() {
  const context = useContext(MessagesContext);

  if (!context) {
    throw new Error(
      "useMessagesContext must be used within Messages component",
    );
  }

  return context;
}
