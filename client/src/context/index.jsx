import PropTypes from "prop-types";
import { AuthProvider } from "./AuthContext";

export default function AppProvider({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
