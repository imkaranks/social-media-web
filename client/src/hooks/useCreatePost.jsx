import { useContext } from "react";
import CreatePostContext from "@/context/CreatePostContext";

export default function useCreatePost() {
  return useContext(CreatePostContext);
}
