import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import { MessageProvider } from "@/context/MessageContext";
import { NotificationProvider } from "@/context/NotificationContext";
import useHealthCheck from "@/hooks/useHealthCheck";

export default function AppProvider({ children }) {
  const { error } = useHealthCheck();

  return error ? (
    <h1>{error}</h1>
  ) : (
    <AuthProvider>
      <SocketProvider>
        <MessageProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </MessageProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
