import { useParams } from "react-router-dom";
import usePostWithComments from "@/hooks/usePostWithComments";
import Loader from "@/components/ui/Loader";
import Post from "@/components/Post";
import Comments from "@/components/Comments";

export default function PostWithComments() {
  const { postId } = useParams();
  const { post, comments, isLoading, error } = usePostWithComments(postId);

  return (
    <div className="p-4 md:pr-0">
      {isLoading ? (
        <Loader />
      ) : !error ? (
        <>
          <Post {...post} />

          <Comments initialComments={comments} />
        </>
      ) : (
        <p>{error}</p>
      )}
    </div>
  );
}
