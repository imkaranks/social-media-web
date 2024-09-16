import { useContext } from "react";
import { PostContext } from ".";

export const usePostContext = () => {
  const context = useContext(PostContext);

  if (!context) {
    throw new Error("usePostContext must be used within Post component");
  }

  return context;
};
