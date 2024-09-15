import { useCallback } from "react";
import axios from "@/app/axios";
import useAuth from "@/hooks/useAuth";

export default function useRefreshToken() {
  const { setAuth } = useAuth();

  const refresh = useCallback(async () => {
    try {
      const response = await axios.post("/auth/refresh");

      if (response?.data?.data) {
        setAuth(response.data.data);
        return response.data.data.accessToken;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      throw error;
    }
  }, [setAuth]);

  return refresh;
}
