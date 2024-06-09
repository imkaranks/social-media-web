import axios from "@/app/axios";
import useAuth from "@/hooks/useAuth";

export default function useRefreshToken() {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/auth/refresh", {
      withCredentials: true,
    });

    setAuth(response?.data?.data);

    return response.data.data.accessToken;
  };

  return refresh;
}
