import { createContext, useCallback, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "@/app/axios";
import Loader from "@/components/ui/Loader";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location?.state?.from?.pathname || "/") +
    (location?.state?.from?.search ? `${location.state.from.search}` : "");
  const [auth, setAuth] = useState(null);
  const [remember, setRemember] = useState(
    JSON.parse(localStorage.getItem("remember")) || false,
  );
  const [isLoading, setIsLoading] = useState(false);

  const updateRemember = useCallback((val) => {
    setRemember(val);
    localStorage.setItem("remember", JSON.stringify(val));
  }, []);

  useLayoutEffect(() => {
    const persistAuth = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post("/auth/refresh");

        setAuth(response?.data?.data);

        navigate(from);
      } catch (error) {
        console.log(error?.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    };

    !auth && remember && persistAuth();
  }, [auth, remember, navigate, from]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        remember,
        updateRemember,
      }}
    >
      {isLoading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
