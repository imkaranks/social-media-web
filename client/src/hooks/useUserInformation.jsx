import { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

export default function useUserInformation(query) {
  const axiosPrivate = useAxiosPrivate();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchParams = new URLSearchParams(query).toString();

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);

      try {
        if (!searchParams?.trim()) {
          throw new Error("Invalid or empty query parameters");
        }

        const response = await axiosPrivate.get(
          `/user/profile/?${searchParams}`,
        );

        setUser(response?.data?.data);
      } catch (error) {
        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to get the user",
        );
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [axiosPrivate, searchParams]);

  return { user, isLoading, error };
}
