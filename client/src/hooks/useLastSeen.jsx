import { useCallback } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

export default function useLastSeen() {
  const axiosPrivate = useAxiosPrivate();

  const updateLastSeen = useCallback(async () => {
    try {
      const response = await axiosPrivate.post("/user/update-last-seen");
      return response?.data?.data;
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  }, [axiosPrivate]);

  return { updateLastSeen };
}
