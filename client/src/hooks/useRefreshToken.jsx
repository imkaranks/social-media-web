import axios from "@/app/axios";
import useAuth from "@/hooks/useAuth";
import { useCallback } from "react";

export default function useRefreshToken() {
  const { setAuth } = useAuth();

  const refresh = useCallback(async () => {
    const response = await axios.get("/auth/refresh", {
      withCredentials: true,
    });

    setAuth(response?.data?.data);

    return response.data.data.accessToken;
  }, [setAuth]);

  return refresh;
}
