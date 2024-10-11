import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import { MessageProvider } from "@/context/MessageContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { CreatePostProvider } from "@/context/CreatePostContext";
import useHealthCheck from "@/hooks/useHealthCheck";

export default function AppProvider({ children }) {
  const { error } = useHealthCheck();

  return error ? (
    <h1>{error}</h1>
  ) : (
    <AuthProvider>
      <SocketProvider>
        <MessageProvider>
          <NotificationProvider>
            <CreatePostProvider>{children}</CreatePostProvider>
          </NotificationProvider>
        </MessageProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
