import { useCallback, useEffect, useRef, useState } from "react";
import axios from "@/app/axios";

export default function useHealthCheck(pollingInterval = 5000) {
  const [error, setError] = useState(null);
  const statusRef = useRef("");

  const checkHealth = useCallback(async () => {
    try {
      await axios.get("/health");

      if (statusRef.current !== "") {
        setError(null);
        statusRef.current = "";
      }
    } catch (error) {
      const status =
        error?.response?.data?.message ||
        "Oops! it looks like our server is down. Please have a break while we resolve the issue.";

      if (statusRef.current !== status) {
        setError(status);
        statusRef.current = status;
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      checkHealth();
    }, pollingInterval);

    checkHealth();

    return () => clearInterval(interval);
  }, [checkHealth, pollingInterval]);

  return { error };
}
