import { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Post from "@/components/ui/Post";
import Loader from "@/components/ui/Loader";

export default function Feed() {
  const axiosPrivate = useAxiosPrivate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      try {
        const response = await axiosPrivate.get("/post");
        // console.log(response?.data?.data);
        setPosts(response?.data?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, [axiosPrivate]);

  return isLoading ? (
    <Loader />
  ) : posts.length ? (
    <div className="mx-auto w-[90%]">
      {posts.map((post, idx) => (
        <Post key={idx} {...post} />
      ))}
    </div>
  ) : (
    <div className="mx-auto w-[90%]">
      <h2>No Posts</h2>
    </div>
  );
}
