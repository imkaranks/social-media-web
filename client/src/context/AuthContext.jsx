import PropTypes from "prop-types";
import { createContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
