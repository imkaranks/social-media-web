import { Link } from "react-router-dom";
import useLikeHandler from "@/hooks/useLikeHandler";

export default function Likes({ username }) {
  const { likes } = useLikeHandler({ username });

  return likes.length ? (
    likes.map((like, idx) => (
      <div
        key={idx}
        className="space-y-2 rounded-xl bg-black/5 p-4 dark:bg-white/5"
      >
        {like?.post ? (
          <p>
            from the post:{" "}
            <Link to={`/post/${like.post._id}`}>{like.post.title}</Link>
          </p>
        ) : like?.comment ? (
          <p>from the comment: {like.comment.title}</p>
        ) : null}
      </div>
    ))
  ) : (
    <p>No likes</p>
  );
}
