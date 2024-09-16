import { useState } from "react";
import toast from "react-hot-toast";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useCommentContext } from "./Comments.hooks";

export default function CommentInput({ parentId = null, handleAddComment }) {
  const axiosPrivate = useAxiosPrivate();
  const { postId } = useCommentContext();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const comment = formData.get("comment");
      if (!comment || comment.trim() === "") {
        toast.error("Comment is required");
        return;
      }

      const data = {
        content: comment,
      };

      if (parentId) {
        data.parentId = parentId;
      }

      const response = await axiosPrivate.post(
        `/comment/create/${postId}`,
        data,
      );

      handleAddComment(response?.data?.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Some error occured while posting your comment",
      );
    } finally {
      setIsSubmitting(false);
    }
    e.currentTarget.reset();
  };

  return (
    <div
      className="mb-2 lg:flex-[0.7]"
      style={{
        "--font-size": parentId ? "0.75rem" : "0.875rem",
        "--padding": parentId ? "0.5rem 0.75rem" : "0.75rem 1rem",
      }}
    >
      <CommentInputForm
        parentId={parentId}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

function CommentInputForm({ parentId, handleSubmit, isSubmitting }) {
  return (
    <form onSubmit={handleSubmit} style={{ fontSize: "var(--font-size)" }}>
      <div className="flex rounded-lg shadow-sm">
        <input
          type="text"
          id="comment"
          name="comment"
          className="block w-full rounded-s-lg border-gray-200 p-[--padding] shadow-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          placeholder={parentId ? "Add Reply" : "Add comment"}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-x-2 rounded-e-md border border-transparent bg-blue-600 p-[--padding] font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
        >
          {isSubmitting && (
            <span
              className="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </span>
          )}
          Submit
        </button>
      </div>
    </form>
  );
}
