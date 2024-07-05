import PropTypes from "prop-types";
import { AuthProvider } from "./AuthContext";
import { SocketProvider } from "./SocketContext";
import { MessageProvider } from "./MessageContext";
import useHealthCheck from "../hooks/useHealthCheck";

export default function AppProvider({ children }) {
  const { error } = useHealthCheck();

  return error ? (
    <h1>{error}</h1>
  ) : (
    <AuthProvider>
      <SocketProvider>
        <MessageProvider>{children}</MessageProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
