import { useParams } from "react-router-dom";
import useComments from "@/hooks/useComments";
import Comment from "@/components/ui/Comment";

function CommentSkeleton() {
  return (
    <div className="space-y-3 rounded-xl bg-black/5 p-4 dark:bg-white/5 [&_*]:animate-pulse">
      <div className="h-[1.75ch] w-full max-w-[20ch] bg-black/30 dark:bg-white/30"></div>
      <div className="size-8 rounded-full bg-black/30 dark:bg-white/30"></div>
      <div className="flex items-center gap-6">
        <div className="h-[1.75ch] w-full max-w-[5ch] bg-black/30 dark:bg-white/30"></div>
        <div className="h-[1.75ch] w-full max-w-[7ch] bg-black/30 dark:bg-white/30"></div>
      </div>
      <div className="h-[1.75ch] w-full max-w-[35ch] bg-black/30 dark:bg-white/30"></div>
      <div className="flex items-center gap-2">
        <div className="h-[2.5ch] w-full max-w-[6ch] rounded-lg bg-black/30 dark:bg-white/30"></div>
        <div className="h-[2.5ch] w-full max-w-[6ch] rounded-lg bg-black/30 dark:bg-white/30"></div>
        <div className="h-[2.5ch] w-full max-w-[6ch] rounded-lg bg-black/30 dark:bg-white/30"></div>
      </div>
    </div>
  );
}

export default function Comments() {
  const { username } = useParams();
  const { comments, isLoading, error } = useComments({ username });

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="space-y-2">
          <CommentSkeleton />
          <CommentSkeleton />
          <CommentSkeleton />
        </div>
      ) : !error ? (
        comments.length ? (
          comments.map((comment, idx) => (
            <div
              key={idx}
              className="space-y-2 rounded-xl bg-black/5 p-4 dark:bg-white/5"
            >
              <p className="mb-2">
                From the post: <strong>{comment?.post?.title}</strong>
              </p>
              <Comment {...comment} />
            </div>
          ))
        ) : (
          <p>No Comments</p>
        )
      ) : (
        <p>{error}</p>
      )}
    </div>
  );
}
