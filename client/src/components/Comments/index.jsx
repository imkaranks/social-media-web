import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
// import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import CommentInput from "./CommentInput";
import CommentsItem from "./CommentsItem";

export const CommentContext = createContext(null);

const CommentProvider = ({ value, children }) => {
  return (
    <CommentContext.Provider value={value}>{children}</CommentContext.Provider>
  );
};

const CommentComp = ({ initialComments, refetechComments }) => {
  const axiosPrivate = useAxiosPrivate();
  const { postId } = useParams();
  const [comments, setComments] = useState(initialComments);

  const handleAddComment = (comment) => {
    setComments((prevComments) => [comment, ...prevComments]);
  };

  const handleUpdateComments = (index, updatedComments) => {
    const updatedCommentsArray = [...comments];
    updatedCommentsArray[index].children = updatedComments;
    setComments(updatedCommentsArray);
  };

  const handleDeleteComment = async (commentId, lvl = 0) => {
    try {
      await axiosPrivate.delete(`/comment/${commentId}`);

      const removeComment = (commentsArray, id, level) => {
        return commentsArray.reduce((acc, comment) => {
          if (comment._id === id) return acc;
          if (comment.children) {
            comment.children = removeComment(comment.children, id, level + 1);
          }
          acc.push(comment);
          return acc;
        }, []);
      };

      setComments((prevComments) =>
        removeComment(prevComments, commentId, lvl),
      );

      toast.success("Comment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  useEffect(() => {
    const updateComment = async () => {
      try {
        const comments = await refetechComments();
        setComments(comments);
      } catch (error) {
        const errMessage = error?.message || "Failed to refresh comments";
        console.log(errMessage);
        toast.error(errMessage);
      }
    };

    const interval = setInterval(() => {
      updateComment();
    }, 10000);

    return () => clearInterval(interval);
  }, [refetechComments]);

  return (
    <CommentProvider
      value={{
        postId,
        comments,
        handleAddComment,
        handleUpdateComments,
        handleDeleteComment,
      }}
    >
      <main>
        <div>
          <CommentInput handleAddComment={handleAddComment} />

          <div>
            {comments.map((comment, index) => (
              <CommentsItem
                key={index}
                comment={comment}
                onUpdateComments={(updatedComments) =>
                  handleUpdateComments(index, updatedComments)
                }
              />
            ))}
          </div>
        </div>
      </main>
    </CommentProvider>
  );
};

export default CommentComp;
