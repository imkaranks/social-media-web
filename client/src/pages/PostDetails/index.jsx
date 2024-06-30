import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Loader from "@/components/ui/Loader";
import Post from "@/components/ui/Post";
import Comments from "@/components/Comments";

export default function PostWithComments() {
  const { postId } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [postResponse, commentsResponse] = await Promise.all([
          axiosPrivate.get(`/post/${postId}`),
          axiosPrivate.get(`/comment/${postId}`),
        ]);

        setPost(postResponse?.data?.data);
        setComments(commentsResponse?.data?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [postId, axiosPrivate]);

  return (
    <div className="p-4 md:pr-0">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Post {...post} />

          {comments?.length ? (
            <>
              <Comments initialComments={comments} />
            </>
          ) : (
            <p>No comments yet</p>
          )}
        </>
      )}
    </div>
  );
}
