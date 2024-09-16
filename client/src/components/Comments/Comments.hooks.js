import { useContext } from "react";
import { CommentContext } from ".";

export function useCommentContext() {
  const context = useContext(CommentContext);

  if (!context) {
    throw new Error("useCommentContext must be used within Comments component");
  }

  return context;
}
