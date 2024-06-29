import PropTypes from "prop-types";
import { AuthProvider } from "./AuthContext";
import { SocketProvider } from "./SocketContext";
import { MessageProvider } from "./MessageContext";

export default function AppProvider({ children }) {
  return (
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
