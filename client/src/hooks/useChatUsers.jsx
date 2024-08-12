import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

export default function useChatUsers() {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getAllUsers() {
      setLoading(true);
      try {
        const response = await axiosPrivate.get("/message/user");

        setUsers(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    if (auth) {
      getAllUsers();
    } else {
      setUsers([]);
    }
  }, [auth, axiosPrivate]);

  return { users, loading };
}
