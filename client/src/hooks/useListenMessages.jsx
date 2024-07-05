import { useEffect } from "react";
import useSocket from "./useSocket";
import useMessages from "./useMessages";

const notifySound = new Audio(
  "https://cdn.pixabay.com/audio/2022/03/15/audio_17cba0354b.mp3",
);

export default function useListenMessages() {
  const { socket } = useSocket();
  const { setMessages } = useMessages();

  useEffect(() => {
    socket?.on("new-message", (newMessage) => {
      notifySound.play();
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => socket?.off("new-message");
  }, [socket, setMessages]);

  return {};
}
