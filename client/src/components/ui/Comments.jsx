import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Comment from "@/components/ui/Comment";

export default function Comments({ data, level = 0 }) {
  const { postId } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const [comments, setComments] = useState(data);
  const [expanded, setExpanded] = useState(false);

  const removeComment = useCallback(
    async (commentId) => {
      await axiosPrivate.delete(`/comment/${commentId}`);
      setComments((prevComments) =>
        prevComments.filter((prevComment) => prevComment._id !== commentId),
      );
    },
    [axiosPrivate],
  );

  const replyComment = useCallback(
    async (commentId, content) => {
      const response = await axiosPrivate.post(`/comment/create/${postId}`, {
        content,
        parentId: commentId,
      });

      const newComment = comments.find((comment) => comment._id === commentId);

      if (newComment?.children?.length) {
        newComment.children.unshift(response?.data?.data);
      } else {
        newComment.children = [response?.data?.data];
      }

      setComments((prevComments) =>
        prevComments.map((prevComment) =>
          prevComment._id !== commentId ? prevComment : newComment,
        ),
      );
    },
    [comments, axiosPrivate, postId],
  );

  // return (
  //   <div className="overflow-hidden">
  //     {!!comments.length &&
  //       comments.map((comment) => {
  //         const props = { ...comment, removeComment, replyComment };

  //         return (
  //           <div key={comment._id} className="overflow-hidden">
  //             <div
  //               className={`relative ml-[--nest-level] flex items-start gap-2 rounded-lg p-2${
  //                 comment?.children?.length
  //                   ? ' before:absolute before:-bottom-4 before:left-6 before:top-10 before:w-2 before:rounded-bl before:border-b before:border-l before:border-black/30 before:content-[""] dark:before:border-white/30 2xl:before:-bottom-5'
  //                   : ""
  //               }`}
  //               style={{ "--nest-level": `calc(1rem * ${level})` }}
  //             >
  //               <Comment {...props} />
  //             </div>

  //             {!!comment?.children?.length && (
  //               <div
  //                 className="grid grid-rows-[auto_var(--row-2)] transition-all"
  //                 style={{
  //                   "--row-2": expanded ? "1fr" : "0fr",
  //                 }}
  //               >
  //                 <div
  //                   className="ml-[--nest-level] px-4"
  //                   style={{ "--nest-level": `calc(1rem * ${level + 1})` }}
  //                 >
  //                   <button
  //                     className="inline-flex items-center gap-x-1 rounded-full border border-transparent px-2 py-1 text-sm font-medium text-gray-800 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-neutral-700 max-2xl:text-xs"
  //                     onClick={() => setExpanded((prev) => !prev)}
  //                   >
  //                     <svg
  //                       xmlns="http://www.w3.org/2000/svg"
  //                       fill="none"
  //                       viewBox="0 0 24 24"
  //                       strokeWidth={1.5}
  //                       stroke="currentColor"
  //                       className="size-5 2xl:size-6"
  //                     >
  //                       <path
  //                         strokeLinecap="round"
  //                         strokeLinejoin="round"
  //                         d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
  //                       />
  //                     </svg>
  //                     <span>
  //                       {expanded ? "Hide" : "Show"} {comment.children.length}{" "}
  //                       more repl
  //                       {comment.children.length > 1 ? "ies" : "y"}
  //                     </span>
  //                   </button>
  //                 </div>
  //                 <Comments data={comment.children} level={level + 1} />
  //               </div>
  //             )}
  //           </div>
  //         );
  //       })}
  //   </div>
  // );

  return level === 0 ? (
    <div>
      {!!comments.length &&
        comments.map((comment) => {
          const props = {
            ...comment,
            removeComment,
            replyComment,
          };
          return (
            <>
              <div
                className={`relative flex items-start gap-2 rounded-lg p-2${
                  comment?.children?.length
                    ? ' before:absolute before:-bottom-4 before:left-6 before:top-10 before:w-2 before:rounded-bl before:border-b before:border-l before:border-black/30 before:content-[""] dark:before:border-white/30 2xl:before:-bottom-5'
                    : ""
                }`}
              >
                <Comment key={comment._id} {...props} />
              </div>
              {!!comment?.children?.length && (
                <Comments data={comment.children} level={level + 1} />
              )}
            </>
          );
        })}
    </div>
  ) : (
    <div
      className="grid grid-rows-[auto_var(--row-2)] pl-[--nest-level] transition-all"
      style={{
        "--row-2": expanded ? "1fr" : "0fr",
        "--nest-level": `calc(1rem * ${level})`,
      }}
    >
      <div className="pl-4">
        <button
          className="inline-flex items-center gap-x-1 rounded-full border border-transparent px-2 py-1 text-sm font-medium text-gray-800 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-neutral-700 max-2xl:text-xs"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5 2xl:size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <span>
            {expanded ? "Hide" : "Show"} {comments?.length} more repl
            {comments?.length > 1 ? "ies" : "y"}
          </span>
        </button>
      </div>
      <div className="overflow-hidden">
        {!!comments.length &&
          comments.map((comment) => {
            const props = {
              ...comment,
              removeComment,
              replyComment,
            };
            return (
              <div key={comment._id}>
                <div
                  className={`relative flex items-start gap-2 rounded-lg p-2${
                    comment?.children?.length
                      ? ' before:absolute before:-bottom-4 before:left-6 before:top-10 before:w-2 before:rounded-bl before:border-b before:border-l before:border-black/30 before:content-[""] dark:before:border-white/30 2xl:before:-bottom-5'
                      : ""
                  }`}
                >
                  <Comment {...props} />
                </div>
                {!!comment?.children?.length && (
                  <Comments data={comment.children} level={level + 1} />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
