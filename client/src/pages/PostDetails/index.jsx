import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/hooks/useAuth";
import Loader from "@/components/ui/Loader";
import Post from "@/components/ui/Post";
import Comments from "@/components/ui/Comments";

export default function PostWithComments() {
  const { postId } = useParams();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addComment = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosPrivate.post(`/comment/create/${postId}`, {
        content: comment,
      });
      setComment("");
      setComments((prevComments) => [response?.data?.data, ...prevComments]);
    } catch (error) {
      console.log(error);
    }
  };

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

          <div className="my-4 flex gap-4">
            {auth?.user?.avatar?.url ? (
              <img
                className="inline-block size-11 rounded-full object-cover"
                src={auth.user.avatar.url}
                alt={auth.user.username}
              />
            ) : (
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-gray-100 text-lg font-semibold leading-none text-gray-800 dark:bg-white/10 dark:text-white">
                {auth?.user?.fullname
                  ?.split(" ")
                  .map((word) => word[0].toUpperCase())}
              </span>
            )}
            <form className="flex-1" onSubmit={addComment}>
              <label htmlFor="comment" className="sr-only">
                Add a Comment
              </label>
              <input
                type="text"
                id="comment"
                className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                placeholder="Add comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button type="submit" className="sr-only">
                Submit
              </button>
            </form>
          </div>

          {comments?.length ? (
            <>
              <Comments data={comments} />
            </>
          ) : (
            <p>No comments yet</p>
          )}
        </>
      )}
    </div>
  );
}
