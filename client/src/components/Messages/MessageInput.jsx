import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import useSocket from "@/hooks/useSocket";
import useMessages from "@/hooks/useMessages";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Avatar from "@/components/ui/Avatar";
import useStore from "@/app/store";

export default function MessageInput() {
  const { auth } = useAuth();
  const { socket } = useSocket();
  const { currentChatUserId } = useMessages();
  const addFriendChat = useStore((state) => state.addFriendChat);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const isTypingRef = useRef(false);
  const timeoutRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!currentChatUserId || !message.trim()) return;

    try {
      const response = await axiosPrivate.post(
        `/message/send/${currentChatUserId}`,
        { message },
        { withCredentials: true },
      );
      // setMessages((prevMessages) => [...prevMessages, response?.data?.data]);
      addFriendChat({
        username: currentChatUserId,
        chat: response?.data?.data,
      });
      setMessage("");
    } catch (error) {
      if (error?.response?.data?.message === "jwt expired") {
        navigate("/signin");
      }
      console.log(error);
    }
  };

  const handleOnChange = (e) => {
    setMessage(e.target.value);
  };

  const handleOnInput = () => {
    clearTimeout(timeoutRef.current);

    if (
      message.length > 0 &&
      currentChatUserId !== null &&
      auth?.user?._id &&
      isTypingRef.current === false
    ) {
      isTypingRef.current = true;
      socket.emit("user-start-typing", {
        sender: auth.user._id,
        receiver: currentChatUserId,
      });
    }

    timeoutRef.current = setTimeout(() => {
      if (
        currentChatUserId !== null &&
        auth?.user?._id &&
        isTypingRef.current === true
      ) {
        isTypingRef.current = false;
        socket.emit("user-stop-typing", {
          sender: auth.user._id,
          receiver: currentChatUserId,
        });
      }
    }, 500);
  };

  return (
    <form
      className="absolute bottom-4 left-4 flex w-[calc(100%-2rem)] items-center justify-between rounded-xl bg-gray-200 p-2 dark:bg-neutral-700 md:px-4"
      onSubmit={handleSubmit}
    >
      <Avatar user={auth?.user} className="size-8 sm:size-9 md:size-10" />
      <input
        type="text"
        placeholder="Say Hi 👋"
        className="flex w-full justify-self-start bg-transparent pl-2 outline-none sm:pl-4"
        value={message}
        onChange={handleOnChange}
        onInput={handleOnInput}
      />
      <button className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 p-2 text-center text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5 sm:size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
          />
        </svg>
        <span className="sr-only">Send</span>
      </button>
    </form>
  );
}
