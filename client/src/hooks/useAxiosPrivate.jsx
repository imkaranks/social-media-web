import { useLayoutEffect } from "react";
import useAuth from "@/hooks/useAuth";
import useRefreshToken from "@/hooks/useRefreshToken";
import { axiosPrivate } from "@/app/axios";

export default function useAxiosPrivate() {
  const refresh = useRefreshToken();
  const { auth, setAuth } = useAuth();

  useLayoutEffect(() => {
    let isRefreshing = false;
    let refreshQueue = [];

    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (auth?.accessToken) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          (error.response?.status === 403 || error.response?.status === 401) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          if (!isRefreshing) {
            isRefreshing = true;
            try {
              const newAccessToken = await refresh();
              setAuth((prevAuth) => ({
                ...prevAuth,
                accessToken: newAccessToken,
              }));
              originalRequest.headers["Authorization"] =
                `Bearer ${newAccessToken}`;
              return axiosPrivate(originalRequest);
            } catch (refreshError) {
              console.error("Failed to refresh token:", refreshError);
              // Handle refresh token error
              // Redirect to logout or handle session expiration
            } finally {
              isRefreshing = false;
              // Process the refresh queue
              refreshQueue.forEach((retry) => retry());
              refreshQueue = [];
            }
          } else {
            // Queue the retry request
            const retryPromise = new Promise((resolve, reject) => {
              refreshQueue.push(() => {
                axiosPrivate(originalRequest).then(resolve).catch(reject);
              });
            });
            return retryPromise;
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [auth, refresh, setAuth]);

  return axiosPrivate;
}
