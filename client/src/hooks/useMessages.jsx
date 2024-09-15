import { useContext } from "react";
import MessageContext from "@/context/MessageContext";

export default function useMessages() {
  return useContext(MessageContext);
}
